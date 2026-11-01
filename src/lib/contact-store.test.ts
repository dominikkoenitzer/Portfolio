// @ts-expect-error -- the app tsconfig carries no Node types; vitest runs this file in Node.
import { createHash } from "node:crypto";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@vercel/blob", () => import("./fake-blob"));

const mail = vi.hoisted(() => ({ sent: 0 }));
vi.mock("nodemailer", () => ({
  default: {
    createTransport: () => ({
      sendMail: async () => {
        mail.sent += 1;
      },
    }),
  },
}));

import { capAttempts } from "../../api/_contact-store.js";
import { BlobPreconditionFailedError } from "./fake-blob";

// The handler keeps what it learns about the cap in its module, so every test
// loads the modules afresh, the way a new function instance starts.
type Fake = typeof import("./fake-blob");
type Request = {
  ipHash: string | null;
  nonce?: string;
  stamp?: number;
  row?: object;
  signal?: AbortSignal;
};
type Take = (request: Request) => Promise<string>;
let blobStore: Fake["blobStore"];
let handler: (req: object, res: object) => Promise<unknown>;
let store: {
  createCap: (caps: object, now?: () => number) => Take;
};

const HOUR = 60 * 60 * 1000;
const MINUTE = 60 * 1000;
const LIMITS = "contact/limits/day.json";
const CAPS = { perAddress: 6, perDay: 31, readsPerMinute: 21, tokenMaxAgeMs: 6 * HOUR };
// A whole day's messages inside one minute would pass the read ceiling, so
// the tests of the other caps lift it; its own test keeps it.
const ROOMY = { ...CAPS, readsPerMinute: 1000 };
// 23:59 and 00:01 in Zurich, in winter (UTC+1) and in summer (UTC+2).
const WINTER_LATE = Date.parse("2026-11-01T22:59:00Z");
const WINTER_EARLY = Date.parse("2026-11-01T23:01:00Z");
const SUMMER_LATE = Date.parse("2026-07-01T21:59:00Z");
const SUMMER_EARLY = Date.parse("2026-07-01T22:01:00Z");

const limits = () => blobStore.read(LIMITS);
const messages = () => (limits()?.messages ?? []) as { subject: string }[];
const hashes = (n: number) =>
  Array.from({ length: n }, (_, i) => i.toString(16).padStart(64, "0"));

let serial = 0;
/** A cap whose `slot(hash)` sends a request with a token of its own. */
function cap(now: () => number = Date.now, caps: object = ROOMY) {
  const take = store.createCap(caps, now);
  const slot = (ipHash: string | null, extra: Partial<Request> = {}) => {
    serial += 1;
    return take({
      ipHash,
      nonce: `nonce-${serial}`,
      stamp: now(),
      row: { subject: `message ${serial}` },
      ...extra,
    });
  };
  return Object.assign(slot, { take });
}

const today = (extra: object) =>
  JSON.stringify({ day: "2026-11-01", count: 0, addresses: {}, used: {}, messages: [], ...extra });

beforeEach(async () => {
  vi.resetModules();
  ({ blobStore } = await import("./fake-blob"));
  store = await import("../../api/_contact-store.js");
  handler = (await import("../../api/contact.js")).default;
  blobStore.reset();
  mail.sent = 0;
  vi.spyOn(console, "error").mockImplementation(() => {});
});

afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllEnvs();
  vi.restoreAllMocks();
});

describe("contact store cap per address", () => {
  it("takes six slots in a day and refuses the seventh", async () => {
    const slot = cap(() => WINTER_LATE);
    const taken: string[] = [];
    for (let i = 0; i < 7; i += 1) taken.push(await slot("abc"));
    expect(taken).toEqual(["ok", "ok", "ok", "ok", "ok", "ok", "address"]);
    expect(limits().addresses.abc).toBe(6);
  });

  it("never gives one address more than six slots under a parallel burst", async () => {
    const slot = cap();
    const taken = await Promise.all(Array.from({ length: 30 }, () => slot("abc")));
    expect(taken.filter((t) => t === "ok")).toHaveLength(6);
    expect(limits().addresses.abc).toBe(6);
    expect(limits().count).toBe(6);
  });

  it("keeps an address full for the rest of the day, not just an hour", async () => {
    let clock = Date.parse("2026-11-01T07:00:00Z");
    const slot = cap(() => clock);
    for (let i = 0; i < 6; i += 1) await slot("abc");
    clock += 15 * HOUR;
    expect(await slot("abc")).toBe("address");
  });

  it("frees an address at midnight in Zurich", async () => {
    let clock = WINTER_LATE;
    const slot = cap(() => clock);
    for (let i = 0; i < 6; i += 1) await slot("abc");
    expect(await slot("abc")).toBe("address");
    clock = WINTER_EARLY;
    expect(await slot("abc")).toBe("ok");
    expect(limits().addresses).toEqual({ abc: 1 });
  });

  it("reads a document written before the daily count, with a list of times per address", async () => {
    blobStore.write(
      LIMITS,
      JSON.stringify({
        day: "2026-11-01",
        count: 6,
        addresses: { abc: [1, 2, 3, 4, 5, 6], def: [1], gone: [] },
      }),
    );
    const slot = cap(() => WINTER_LATE);
    expect(await slot("abc")).toBe("address");
    expect(await slot("def")).toBe("ok");
    expect(limits()).toMatchObject({ count: 7, addresses: { abc: 6, def: 2 } });
  });
});

describe("contact store ceiling per day", () => {
  it("stores 31 messages from different addresses in a day and refuses the 32nd", async () => {
    const slot = cap(() => WINTER_LATE);
    const taken: string[] = [];
    for (const hash of hashes(32)) taken.push(await slot(hash));
    expect(taken.slice(0, 31).every((t) => t === "ok")).toBe(true);
    expect(taken[31]).toBe("day");
    expect(limits()).toMatchObject({ day: "2026-11-01", count: 31 });
    expect(messages()).toHaveLength(31);
  });

  it("counts a message without an address toward the day", async () => {
    const slot = cap(() => WINTER_LATE);
    for (let i = 0; i < 31; i += 1) expect(await slot(null)).toBe("ok");
    expect(await slot(null)).toBe("day");
    expect(limits().addresses).toEqual({});
  });

  it("starts a new day at midnight in Zurich, in winter and in summer", async () => {
    const cases = [
      [WINTER_LATE, WINTER_EARLY, "2026-11-02"],
      [SUMMER_LATE, SUMMER_EARLY, "2026-07-02"],
    ] as const;
    for (const [late, early, day] of cases) {
      blobStore.reset();
      let clock: number = late;
      const slot = cap(() => clock);
      for (const hash of hashes(31)) await slot(hash);
      expect(await slot("late")).toBe("day");
      clock = early;
      expect(await slot("early")).toBe("ok");
      expect(limits()).toMatchObject({ day, count: 1 });
    }
  });

  it("never stores more than 31 in a day under a parallel burst", async () => {
    const slot = cap();
    const taken = await Promise.all(hashes(60).map((hash) => slot(hash)));
    expect(taken.filter((t) => t === "ok")).toHaveLength(31);
    expect(limits().count).toBe(31);
    expect(messages()).toHaveLength(31);
    expect(Object.keys(limits().addresses)).toHaveLength(31);
  });

  it("keeps the whole cap in one document", async () => {
    const slot = cap(() => WINTER_LATE);
    await slot("abc");
    await slot("def");
    expect(blobStore.list("contact/")).toEqual([LIMITS]);
  });
});

describe("contact store single-use tokens", () => {
  it("stores a token's message once and answers a resend as already sent, at no cost", async () => {
    const slot = cap(() => WINTER_LATE);
    expect(await slot("abc", { nonce: "once" })).toBe("ok");
    blobStore.ops = { simple: 0, advanced: 0 };
    expect(await slot("abc", { nonce: "once" })).toBe("sent");
    expect(await slot("def", { nonce: "once" })).toBe("sent");
    expect(blobStore.ops).toEqual({ simple: 0, advanced: 0 });
    expect(limits().count).toBe(1);
    expect(messages()).toHaveLength(1);
  });

  it("refuses a spent token on another instance after one read", async () => {
    await cap(() => WINTER_LATE)("abc", { nonce: "once" });
    blobStore.ops = { simple: 0, advanced: 0 };
    expect(await cap(() => WINTER_LATE)("def", { nonce: "once" })).toBe("sent");
    expect(blobStore.ops).toEqual({ simple: 1, advanced: 0 });
    expect(messages()).toHaveLength(1);
  });

  it("stores a burst of one token at most once", async () => {
    const slot = cap();
    const taken = await Promise.all(
      Array.from({ length: 20 }, (_, i) => slot(`addr${i}`, { nonce: "once" })),
    );
    expect(taken.filter((t) => t === "ok")).toHaveLength(1);
    expect(taken.filter((t) => t === "sent")).toHaveLength(19);
    expect(limits().count).toBe(1);
  });

  it("counts a write whose answer was lost once, as this request's own", async () => {
    blobStore.instant = true;
    blobStore.afterPutError = new BlobPreconditionFailedError();
    const slot = cap(() => WINTER_LATE);
    expect(await slot("abc", { nonce: "once" })).toBe("ok");
    expect(limits()).toMatchObject({ count: 1, addresses: { abc: 1 } });
    expect(messages()).toHaveLength(1);
  });

  it("forgets a spent token once it would have expired anyway", async () => {
    let clock = Date.parse("2026-11-01T07:00:00Z");
    const slot = cap(() => clock);
    await slot("abc", { nonce: "old" });
    clock += 6 * HOUR + 1;
    await slot("abc");
    expect(Object.keys(limits().used)).not.toContain("old");
    expect(Object.keys(limits().used)).toHaveLength(1);
  });
});

describe("contact store reads", () => {
  it("refuses an address it knows is full without reading the store", async () => {
    const slot = cap();
    for (let i = 0; i < 6; i += 1) await slot("abc");
    blobStore.ops = { simple: 0, advanced: 0 };
    expect(await slot("abc")).toBe("address");
    expect(await slot("abc")).toBe("address");
    expect(blobStore.ops).toEqual({ simple: 0, advanced: 0 });
  });

  it("refuses a day it knows is full without reading the store", async () => {
    const slot = cap(() => WINTER_LATE);
    for (const hash of hashes(31)) await slot(hash);
    blobStore.ops = { simple: 0, advanced: 0 };
    for (const hash of hashes(20)) expect(await slot(`x${hash}`)).toBe("day");
    expect(blobStore.ops).toEqual({ simple: 0, advanced: 0 });
  });

  it("reads once on an instance that has not seen the full day, then refuses from memory", async () => {
    const first = cap(() => WINTER_LATE);
    for (const hash of hashes(31)) await first(hash);
    const second = cap(() => WINTER_LATE);
    blobStore.ops = { simple: 0, advanced: 0 };
    expect(await second("late")).toBe("day");
    expect(blobStore.ops).toEqual({ simple: 1, advanced: 0 });
    expect(await second("later")).toBe("day");
    expect(blobStore.ops).toEqual({ simple: 1, advanced: 0 });
  });

  it("forgets a full day at midnight in Zurich", async () => {
    let clock: number = WINTER_LATE;
    const slot = cap(() => clock);
    for (const hash of hashes(31)) await slot(hash);
    expect(await slot("late")).toBe("day");
    clock = WINTER_EARLY;
    expect(await slot("early")).toBe("ok");
  });

  it("reads the store no more than 21 times a minute", async () => {
    let clock = WINTER_LATE - 5 * MINUTE;
    const slot = cap(() => clock, { ...CAPS, perDay: 1000 });
    const taken: string[] = [];
    for (const hash of hashes(23)) taken.push(await slot(hash));
    expect(taken.slice(0, 21).every((t) => t === "ok")).toBe(true);
    expect(taken.slice(21)).toEqual(["busy", "busy"]);
    expect(blobStore.ops.simple).toBe(21);
    clock += MINUTE - 1;
    expect(await slot("waits")).toBe("busy");
    clock += 1;
    expect(await slot("passes")).toBe("ok");
    expect(blobStore.ops.simple).toBe(22);
  });

  it("loses no conditional write to requests on the same instance", async () => {
    const slot = cap();
    const taken = await Promise.all(hashes(60).map((hash) => slot(hash)));
    expect(taken.filter((t) => t === "ok")).toHaveLength(31);
    expect(blobStore.ops).toEqual({ simple: 31, advanced: 31 });
  });

  it("loses at most 31 conditional writes a day to a second instance", async () => {
    const one = cap();
    const two = cap();
    const taken = await Promise.all(hashes(60).map((hash, i) => (i % 2 ? one : two)(hash)));
    expect(taken.filter((t) => t === "ok")).toHaveLength(31);
    expect(limits().count).toBe(31);
    expect(blobStore.ops.advanced - 31).toBeLessThanOrEqual(31);
  });
});

describe("contact store writes", () => {
  it("reads again and still takes its slot when another request wrote first", async () => {
    blobStore.instant = true;
    blobStore.write(LIMITS, today({ count: 1, addresses: { abc: 1 }, messages: [{ subject: "a" }] }));
    blobStore.beforePut = () =>
      blobStore.write(
        LIMITS,
        today({ count: 2, addresses: { abc: 2 }, messages: [{ subject: "a" }, { subject: "b" }] }),
      );
    expect(await cap(() => WINTER_LATE)("abc")).toBe("ok");
    expect(limits().addresses.abc).toBe(3);
    expect(messages().map((m) => m.subject)).toEqual(["a", "b", `message ${serial}`]);
  });

  it("does not take the last slot twice when the document changes under it", async () => {
    blobStore.instant = true;
    blobStore.write(LIMITS, today({ count: 5, addresses: { abc: 5 } }));
    blobStore.beforePut = () => blobStore.write(LIMITS, today({ count: 6, addresses: { abc: 6 } }));
    expect(await cap(() => WINTER_LATE)("abc")).toBe("address");
    expect(limits().addresses.abc).toBe(6);
  });

  it("retries when two first messages race to create the document", async () => {
    blobStore.instant = true;
    blobStore.beforePut = () =>
      blobStore.write(LIMITS, today({ count: 1, addresses: { def: 1 }, messages: [{ subject: "d" }] }));
    expect(await cap(() => WINTER_LATE)("abc")).toBe("ok");
    expect(Object.keys(limits().addresses).sort()).toEqual(["abc", "def"]);
    expect(messages()).toHaveLength(2);
  });

  it("reads past the cache, so a second message is not refused on a stale etag", async () => {
    const slot = cap();
    expect(await slot("abc")).toBe("ok");
    expect(await slot("abc")).toBe("ok");
    expect(await slot("abc")).toBe("ok");
    expect(limits().addresses.abc).toBe(3);
  });

  it("starts over from a document it cannot read", async () => {
    blobStore.write(LIMITS, "not json");
    expect(await cap()("abc")).toBe("ok");
    expect(limits().addresses.abc).toBe(1);
  });

  it("gives up after a bounded number of tries when the document never settles", async () => {
    blobStore.instant = true;
    blobStore.write(LIMITS, today({}));
    let tries = 0;
    const fight = () => {
      tries += 1;
      blobStore.write(LIMITS, today({}));
      blobStore.beforePut = fight;
    };
    blobStore.beforePut = fight;
    expect(await cap(() => WINTER_LATE)("abc")).toBe("busy");
    expect(tries).toBe(capAttempts(CAPS.perDay));
    expect(blobStore.ops.advanced).toBe(capAttempts(CAPS.perDay));
  });

  it("tries no more often than the day has slots, plus one", () => {
    expect(capAttempts(CAPS.perDay)).toBe(CAPS.perDay + 1);
  });

  it("passes a real store failure on instead of retrying it", async () => {
    blobStore.write(LIMITS, today({}));
    blobStore.putError = new Error("store unreachable");
    await expect(cap(() => WINTER_LATE)("abc")).rejects.toThrow("store unreachable");
    expect(blobStore.ops.advanced).toBe(1);
  });

  it("passes on a failed create when no other request made the document", async () => {
    blobStore.putError = new Error("store unreachable");
    await expect(cap()("abc")).rejects.toThrow("store unreachable");
  });

  it("serves the next request in line after one that failed", async () => {
    const slot = cap();
    blobStore.getError = new Error("store unreachable");
    const failed = slot("abc");
    const next = slot("def");
    await expect(failed).rejects.toThrow("store unreachable");
    blobStore.getError = null;
    expect(await next).toBe("ok");
  });

  it("gives up when its deadline passes, and serves the next request in line", async () => {
    const slot = cap();
    blobStore.delayMs = 400;
    const start = Date.now();
    const slow = slot("abc", { signal: AbortSignal.timeout(50) });
    const next = slot("def");
    await expect(slow).rejects.toThrow();
    expect(Date.now() - start).toBeLessThan(300);
    blobStore.delayMs = 0;
    expect(await next).toBe("ok");
    expect(Object.keys(limits().addresses)).toEqual(["def"]);
  });

  it("does not start on a request whose deadline passed while it waited in line", async () => {
    const slot = cap();
    blobStore.delayMs = 200;
    const first = slot("abc");
    const late = slot("def", { signal: AbortSignal.timeout(50) });
    expect(await first).toBe("ok");
    blobStore.ops = { simple: 0, advanced: 0 };
    await expect(late).rejects.toThrow();
    expect(blobStore.ops).toEqual({ simple: 0, advanced: 0 });
  });
});

describe("contact store messages", () => {
  it("stores the message with its slot in one private write", async () => {
    const slot = cap(() => WINTER_LATE);
    await slot("abc");
    blobStore.ops = { simple: 0, advanced: 0 };
    expect(await slot("def", { row: { subject: "Role" } })).toBe("ok");
    expect(blobStore.ops).toEqual({ simple: 1, advanced: 1 });
    expect(messages().slice(-1)).toEqual([{ subject: "Role" }]);
    expect(blobStore.entries.get(LIMITS)?.access).toBe("private");
  });

  it("files the day's messages under a name of their own when the next day starts", async () => {
    let clock = WINTER_LATE;
    const slot = cap(() => clock);
    await slot("abc", { row: { subject: "late one" } });
    await slot("def", { row: { subject: "late two" } });
    clock = WINTER_EARLY;
    blobStore.ops = { simple: 0, advanced: 0 };
    expect(await slot("ghi", { row: { subject: "early" } })).toBe("ok");
    expect(blobStore.ops).toEqual({ simple: 1, advanced: 2 });
    expect(blobStore.read("contact/messages/2026-11-01-2.json")).toEqual([
      { subject: "late one" },
      { subject: "late two" },
    ]);
    expect(blobStore.entries.get("contact/messages/2026-11-01-2.json")?.access).toBe("private");
    expect(limits()).toMatchObject({ day: "2026-11-02", messages: [{ subject: "early" }] });
  });

  it("carries on when another request filed the day first", async () => {
    blobStore.write(LIMITS, JSON.stringify({ day: "2026-11-01", count: 1, messages: [{ subject: "a" }] }));
    blobStore.write("contact/messages/2026-11-01-1.json", JSON.stringify([{ subject: "a" }]));
    expect(await cap(() => WINTER_EARLY)("abc")).toBe("ok");
    expect(blobStore.read("contact/messages/2026-11-01-1.json")).toEqual([{ subject: "a" }]);
    expect(limits()).toMatchObject({ day: "2026-11-02", count: 1 });
  });

  it("keeps the old day when it cannot be filed", async () => {
    const old = JSON.stringify({ day: "2026-11-01", count: 1, messages: [{ subject: "a" }] });
    blobStore.write(LIMITS, old);
    blobStore.putError = new Error("store unreachable");
    await expect(cap(() => WINTER_EARLY)("abc")).rejects.toThrow("store unreachable");
    expect(blobStore.entries.get(LIMITS)?.body).toBe(old);
  });

  it("files nothing for a day without messages", async () => {
    blobStore.write(LIMITS, JSON.stringify({ day: "2026-10-31", count: 0, addresses: {} }));
    expect(await cap(() => WINTER_LATE)("abc")).toBe("ok");
    expect(blobStore.list("contact/messages/")).toEqual([]);
  });
});

type Reply = { status: number; body: unknown };

/**
 * A form token as the GET hands it out `ageMs` ago, on the server's clock.
 * The GET answers before its first await, so the clock is only moved for it.
 */
async function formToken(ageMs = 60_000): Promise<string> {
  const reply = { body: null as unknown };
  const res = {
    json(payload: unknown) {
      reply.body = payload;
      return res;
    },
    setHeader() {},
    status() {
      return res;
    },
  };
  const at = Date.now() - ageMs;
  const clock = vi.spyOn(Date, "now").mockReturnValue(at);
  await handler({ headers: {}, method: "GET" }, res);
  clock.mockRestore();
  return (reply.body as { token: string }).token;
}

async function post(extra: object = {}, ip = "203.0.113.7"): Promise<Reply> {
  const reply: Reply = { body: null, status: 0 };
  const res = {
    json(payload: unknown) {
      reply.body = payload;
      return res;
    },
    setHeader() {},
    status(code: number) {
      reply.status = code;
      return res;
    },
  };
  const token = await formToken();
  await handler(
    {
      body: {
        email: "ann@example.com",
        intent: "job",
        language: "en",
        message: "Hello, a real message.",
        name: "Ann",
        token,
        subject: "Role",
        website: "",
        ...extra,
      },
      headers: {
        "content-type": "application/json",
        host: "dk.punds.ch",
        origin: "https://dk.punds.ch",
        "x-forwarded-for": ip,
      },
      method: "POST",
    },
    res,
  );
  return reply;
}

describe("contact store operations per request", () => {
  // The read ceiling allows 21 a minute, so a run of posts moves the clock
  // three seconds each, about as fast as people could send.
  const later = () => vi.setSystemTime(Date.now() + 3000);

  beforeEach(() => {
    vi.useFakeTimers({ toFake: ["Date"] });
    vi.setSystemTime(Date.parse("2026-11-01T09:00:00Z"));
    vi.stubEnv("CONTACT_HASH_SECRET", "test-secret");
    vi.stubEnv("GMAIL_USER", "someone@example.com");
    vi.stubEnv("GMAIL_APP_PASSWORD", "app-password");
  });

  it("spends one read and one write on a message that is mailed", async () => {
    expect((await post()).status).toBe(200);
    expect(mail.sent).toBe(1);
    expect(blobStore.ops).toEqual({ simple: 1, advanced: 1 });
    expect(messages()).toHaveLength(1);
  });

  it("spends the same when no mail goes out, and says why in the log", async () => {
    vi.stubEnv("GMAIL_USER", "");
    expect((await post()).status).toBe(200);
    expect(blobStore.ops).toEqual({ simple: 1, advanced: 1 });
    expect(console.error).toHaveBeenCalledWith(expect.stringContaining("GMAIL_USER"));
  });

  it("spends nothing on a message refused for an address the instance knows is full", async () => {
    for (let i = 0; i < 6; i += 1) await post();
    blobStore.ops = { simple: 0, advanced: 0 };
    const reply = await post();
    expect(reply).toEqual({ status: 429, body: { error: "Full for today", reason: "address" } });
    expect(blobStore.ops).toEqual({ simple: 0, advanced: 0 });
  });

  it("answers the 32nd message of the day as full for today, at no cost", async () => {
    for (let i = 0; i < 31; i += 1) {
      expect((await post({}, `198.51.100.${i}`)).status).toBe(200);
      later();
    }
    blobStore.ops = { simple: 0, advanced: 0 };
    const reply = await post({}, "198.51.100.99");
    expect(reply).toEqual({ status: 429, body: { error: "Full for today", reason: "day" } });
    expect(blobStore.ops).toEqual({ simple: 0, advanced: 0 });
    expect(messages()).toHaveLength(31);
  });

  it("holds the day ceiling for requests that carry no address", async () => {
    const statuses: number[] = [];
    for (let i = 0; i < 32; i += 1) {
      statuses.push((await post({}, "")).status);
      later();
    }
    expect(statuses.slice(0, 31).every((s) => s === 200)).toBe(true);
    expect(statuses[31]).toBe(429);
    expect(messages()).toHaveLength(31);
  });

  it("spends nothing on a bot", async () => {
    await post({ website: "https://spam.example" });
    await post({ token: undefined });
    await post({ token: await formToken(500) });
    expect(blobStore.ops).toEqual({ simple: 0, advanced: 0 });
  });

  it("stores and mails a token's message once, however often it is sent", async () => {
    const token = await formToken();
    const replies: Reply[] = [];
    for (let i = 0; i < 4; i += 1) replies.push(await post({ token }, `198.51.100.${i}`));
    expect(replies.map((r) => r.status)).toEqual([200, 200, 200, 200]);
    expect(messages()).toHaveLength(1);
    expect(mail.sent).toBe(1);
    expect(limits().count).toBe(1);
  });

  it("keeps no address, hashed or plain, with the message", async () => {
    await post({}, "198.51.100.23");
    const [kept] = messages();
    expect(JSON.stringify(kept)).not.toContain("198.51.100.23");
    expect(kept).not.toHaveProperty("ip_hash");
    expect(Object.keys(limits().addresses)).toHaveLength(1);
    expect(JSON.stringify(kept)).not.toContain(Object.keys(limits().addresses)[0]);
    expect(JSON.stringify(limits())).not.toContain("198.51.100.23");
  });

  it("still caps the address without the secret, with a key no one can reverse", async () => {
    vi.stubEnv("CONTACT_HASH_SECRET", "");
    const statuses: number[] = [];
    for (let i = 0; i < 7; i += 1) statuses.push((await post({}, "198.51.100.23")).status);
    expect(statuses).toEqual([200, 200, 200, 200, 200, 200, 429]);
    const plain = createHash("sha256").update("198.51.100.23").digest("hex");
    expect(Object.keys(limits().addresses)).toHaveLength(1);
    expect(Object.keys(limits().addresses)).not.toContain(plain);
  });

  it("says once in the production log that the secret is missing", async () => {
    vi.stubEnv("CONTACT_HASH_SECRET", "");
    vi.stubEnv("VERCEL_ENV", "production");
    await post();
    await post();
    const warned = vi
      .mocked(console.error)
      .mock.calls.filter(([text]) => String(text).includes("CONTACT_HASH_SECRET"));
    expect(warned).toHaveLength(1);
  });

  it("answers with the general failure when the store is too slow", async () => {
    vi.stubEnv("CONTACT_STORE_DEADLINE_MS", "100");
    blobStore.delayMs = 1000;
    const start = Date.now();
    const reply = await post();
    expect(reply.status).toBe(503);
    expect(Date.now() - start).toBeLessThan(700);
    expect(mail.sent).toBe(0);
  });
});
