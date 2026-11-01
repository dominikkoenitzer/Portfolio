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

import handler from "../../api/contact.js";
import {
  CAP_ATTEMPTS,
  markNotified,
  saveMessage,
  takeSlot,
} from "../../api/_contact-store.js";
import { blobStore } from "./fake-blob";

const HOUR = 60 * 60 * 1000;
const LIMITS = "contact/limits/day.json";
const CAPS = { perAddress: 5, perDay: 11 };
// 23:59 and 00:01 in Zurich, in winter (UTC+1) and in summer (UTC+2).
const WINTER_LATE = Date.parse("2026-11-01T22:59:00Z");
const WINTER_EARLY = Date.parse("2026-11-01T23:01:00Z");
const SUMMER_LATE = Date.parse("2026-07-01T21:59:00Z");
const SUMMER_EARLY = Date.parse("2026-07-01T22:01:00Z");

const limits = () => blobStore.read(LIMITS);
const hashes = (n: number) =>
  Array.from({ length: n }, (_, i) => i.toString(16).padStart(64, "0"));
const doc = (count: number, times: number[]) =>
  JSON.stringify({ day: "2026-11-01", count, addresses: { abc: times } });

beforeEach(() => {
  blobStore.reset();
  mail.sent = 0;
  vi.spyOn(console, "error").mockImplementation(() => {});
});

afterEach(() => {
  vi.unstubAllEnvs();
  vi.restoreAllMocks();
});

describe("contact store cap per address", () => {
  it("takes five slots in an hour and refuses the sixth", async () => {
    const taken: string[] = [];
    for (let i = 0; i < 6; i += 1) taken.push(await takeSlot("abc", CAPS));
    expect(taken).toEqual(["ok", "ok", "ok", "ok", "ok", "address"]);
    expect(limits().addresses.abc).toHaveLength(5);
  });

  it("never gives one address more than five slots under a parallel burst", async () => {
    const taken = await Promise.all(
      Array.from({ length: 30 }, () => takeSlot("abc", CAPS)),
    );
    const ok = taken.filter((t) => t === "ok").length;
    expect(ok).toBe(5);
    expect(limits().addresses.abc).toHaveLength(5);
    expect(limits().count).toBe(5);
  });

  it("frees a slot once its message is an hour old", async () => {
    const now = WINTER_LATE;
    blobStore.write(
      LIMITS,
      doc(5, [now - HOUR - 1, now - HOUR, now - 10, now - 5, now - 1]),
    );
    expect(await takeSlot("abc", CAPS, () => now)).toBe("ok");
    expect(limits().addresses.abc).toEqual([now - 10, now - 5, now - 1, now]);
  });

  it("keeps an address's hour across midnight in Zurich", async () => {
    const before = WINTER_LATE - 20 * 60 * 1000;
    blobStore.write(LIMITS, doc(5, Array(5).fill(before)));
    expect(await takeSlot("abc", CAPS, () => WINTER_EARLY)).toBe("address");
    expect(await takeSlot("def", CAPS, () => WINTER_EARLY)).toBe("ok");
    expect(limits().addresses.abc).toHaveLength(5);
  });
});

describe("contact store ceiling per day", () => {
  it("stores eleven messages from different addresses in a day and refuses the twelfth", async () => {
    const taken: string[] = [];
    for (const hash of hashes(12)) {
      taken.push(await takeSlot(hash, CAPS, () => WINTER_LATE));
    }
    expect(taken.slice(0, 11).every((t) => t === "ok")).toBe(true);
    expect(taken[11]).toBe("day");
    expect(limits()).toMatchObject({ day: "2026-11-01", count: 11 });
  });

  it("counts a message without an address toward the day", async () => {
    for (let i = 0; i < 11; i += 1) {
      expect(await takeSlot(null, CAPS, () => WINTER_LATE)).toBe("ok");
    }
    expect(await takeSlot(null, CAPS, () => WINTER_LATE)).toBe("day");
    expect(limits().addresses).toEqual({});
  });

  it("starts a new day at midnight in Zurich, in winter and in summer", async () => {
    const cases = [
      [WINTER_LATE, WINTER_EARLY, "2026-11-02"],
      [SUMMER_LATE, SUMMER_EARLY, "2026-07-02"],
    ] as const;
    for (const [late, early, day] of cases) {
      blobStore.reset();
      for (const hash of hashes(11)) await takeSlot(hash, CAPS, () => late);
      expect(await takeSlot("late", CAPS, () => late)).toBe("day");
      expect(await takeSlot("early", CAPS, () => early)).toBe("ok");
      expect(limits()).toMatchObject({ day, count: 1 });
    }
  });

  it("never stores more than eleven in a day under a parallel burst", async () => {
    const taken = await Promise.all(hashes(40).map((hash) => takeSlot(hash, CAPS)));
    const ok = taken.filter((t) => t === "ok").length;
    expect(ok).toBe(11);
    expect(limits().count).toBe(11);
    expect(Object.keys(limits().addresses)).toHaveLength(11);
  });

  it("keeps the whole cap in one document and drops what is past its hour", async () => {
    const now = WINTER_LATE;
    blobStore.write(
      LIMITS,
      JSON.stringify({
        day: "2026-11-01",
        count: 3,
        addresses: {
          old: [now - 2 * HOUR],
          mixed: [now - HOUR - 5, now - 60_000],
          gone: [],
        },
      }),
    );
    expect(await takeSlot("abc", CAPS, () => now)).toBe("ok");
    expect(limits().addresses).toEqual({ mixed: [now - 60_000], abc: [now] });
    expect(limits().count).toBe(4);
    expect(blobStore.list("contact/limits/")).toEqual([LIMITS]);
  });
});

describe("contact store cap writes", () => {
  it("reads again and still takes its slot when another request wrote first", async () => {
    blobStore.instant = true;
    const earlier = Date.now() - 1000;
    blobStore.write(LIMITS, doc(1, [earlier]));
    blobStore.beforePut = () => blobStore.write(LIMITS, doc(2, [earlier, earlier]));
    expect(await takeSlot("abc", CAPS)).toBe("ok");
    expect(limits().addresses.abc).toHaveLength(3);
  });

  it("does not take the last slot twice when the document changes under it", async () => {
    blobStore.instant = true;
    const earlier = Date.now() - 1000;
    blobStore.write(LIMITS, doc(4, Array(4).fill(earlier)));
    blobStore.beforePut = () => blobStore.write(LIMITS, doc(5, Array(5).fill(earlier)));
    expect(await takeSlot("abc", CAPS)).toBe("address");
    expect(limits().addresses.abc).toHaveLength(5);
  });

  it("retries when two first messages race to create the document", async () => {
    blobStore.instant = true;
    blobStore.beforePut = () =>
      blobStore.write(
        LIMITS,
        JSON.stringify({ count: 0, addresses: { def: [Date.now()] } }),
      );
    expect(await takeSlot("abc", CAPS)).toBe("ok");
    expect(Object.keys(limits().addresses).sort()).toEqual(["abc", "def"]);
  });

  it("reads past the cache, so a second message is not refused on a stale etag", async () => {
    expect(await takeSlot("abc", CAPS)).toBe("ok");
    expect(await takeSlot("abc", CAPS)).toBe("ok");
    expect(await takeSlot("abc", CAPS)).toBe("ok");
    expect(limits().addresses.abc).toHaveLength(3);
  });

  it("starts over from a document it cannot read", async () => {
    blobStore.write(LIMITS, "not json");
    expect(await takeSlot("abc", CAPS)).toBe("ok");
    expect(limits().addresses.abc).toHaveLength(1);
  });

  it("gives up after a bounded number of tries when the document never settles", async () => {
    blobStore.instant = true;
    const empty = JSON.stringify({ count: 0, addresses: {} });
    blobStore.write(LIMITS, empty);
    let tries = 0;
    const fight = () => {
      tries += 1;
      blobStore.write(LIMITS, empty);
      blobStore.beforePut = fight;
    };
    blobStore.beforePut = fight;
    expect(await takeSlot("abc", CAPS)).toBe("busy");
    expect(tries).toBe(CAP_ATTEMPTS);
    expect(blobStore.ops.advanced).toBe(CAP_ATTEMPTS);
  });

  it("tries no more often than the day has slots, plus one", () => {
    expect(CAP_ATTEMPTS).toBe(CAPS.perDay + 1);
  });

  it("passes a real store failure on instead of retrying it", async () => {
    blobStore.write(LIMITS, JSON.stringify({ count: 0, addresses: {} }));
    blobStore.putError = new Error("store unreachable");
    await expect(takeSlot("abc", CAPS)).rejects.toThrow("store unreachable");
    expect(blobStore.ops.advanced).toBe(1);
  });

  it("passes on a failed create when no other request made the document", async () => {
    blobStore.putError = new Error("store unreachable");
    await expect(takeSlot("abc", CAPS)).rejects.toThrow("store unreachable");
  });
});

describe("contact store messages", () => {
  const record = {
    name: "Ann",
    email: "ann@example.com",
    subject: "Role",
    message: "Hello.",
    created_at: "2026-11-01T10:00:00.000Z",
  };

  it("keeps every message under a name of its own, privately", async () => {
    const first = await saveMessage(record);
    const second = await saveMessage(record);
    expect(first).not.toBe(second);
    expect(first.startsWith("contact/messages/2026-11-01T10-00-00-000Z-")).toBe(true);
    expect(blobStore.read(first)).toEqual(record);
    expect(blobStore.entries.get(first)?.access).toBe("private");
  });

  it("adds the mail time to the stored message", async () => {
    const pathname = await saveMessage(record);
    await markNotified(pathname, record);
    const kept = blobStore.read(pathname);
    expect(kept.name).toBe("Ann");
    expect(Number.isFinite(Date.parse(kept.notified_at))).toBe(true);
  });
});

type Reply = { status: number; body: unknown };

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
  await handler(
    {
      body: {
        email: "ann@example.com",
        intent: "job",
        language: "en",
        message: "Hello, a real message.",
        name: "Ann",
        fillMs: 60_000,
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
  beforeEach(() => {
    vi.stubEnv("CONTACT_HASH_SECRET", "test-secret");
    vi.stubEnv("GMAIL_USER", "someone@example.com");
    vi.stubEnv("GMAIL_APP_PASSWORD", "app-password");
  });

  it("spends one read and three writes on a message that is mailed", async () => {
    expect((await post()).status).toBe(200);
    expect(mail.sent).toBe(1);
    expect(blobStore.ops).toEqual({ simple: 1, advanced: 3 });
    const [pathname] = blobStore.list("contact/messages/");
    expect(blobStore.read(pathname).notified_at).toBeTruthy();
  });

  it("spends one read and two writes when no mail goes out", async () => {
    vi.stubEnv("GMAIL_USER", "");
    expect((await post()).status).toBe(200);
    expect(blobStore.ops).toEqual({ simple: 1, advanced: 2 });
    const [pathname] = blobStore.list("contact/messages/");
    expect(blobStore.read(pathname).notified_at).toBeUndefined();
  });

  it("spends one read and no write on a message refused for its address", async () => {
    for (let i = 0; i < 5; i += 1) await post();
    blobStore.ops = { simple: 0, advanced: 0 };
    expect((await post()).status).toBe(429);
    expect(blobStore.ops).toEqual({ simple: 1, advanced: 0 });
  });

  it("refuses the twelfth message of the day with the general failure, for one read and no write", async () => {
    for (let i = 0; i < 11; i += 1) {
      expect((await post({}, `198.51.100.${i}`)).status).toBe(200);
    }
    blobStore.ops = { simple: 0, advanced: 0 };
    const reply = await post({}, "198.51.100.99");
    // Not 429, which the form words as "too many from your connection", and
    // not 400, which marks fields: any other failure shows the toast that
    // points to the mail link.
    expect(reply.status).toBe(503);
    expect(blobStore.ops).toEqual({ simple: 1, advanced: 0 });
    expect(blobStore.list("contact/messages/")).toHaveLength(11);
  });

  it("holds the day ceiling for requests that carry no address", async () => {
    const statuses: number[] = [];
    for (let i = 0; i < 12; i += 1) statuses.push((await post({}, "")).status);
    expect(statuses.slice(0, 11).every((s) => s === 200)).toBe(true);
    expect(statuses[11]).toBe(503);
    expect(blobStore.list("contact/messages/")).toHaveLength(11);
  });

  it("spends nothing on a bot", async () => {
    await post({ website: "https://spam.example" });
    await post({ fillMs: 500 });
    expect(blobStore.ops).toEqual({ simple: 0, advanced: 0 });
  });

  it("stores the address only as a keyed hash", async () => {
    await post({}, "198.51.100.23");
    const [pathname] = blobStore.list("contact/messages/");
    const kept = blobStore.read(pathname);
    expect(JSON.stringify(kept)).not.toContain("198.51.100.23");
    expect(kept.ip_hash).toMatch(/^[0-9a-f]{64}$/);
    expect(JSON.stringify(limits())).not.toContain("198.51.100.23");
    expect(Object.keys(limits().addresses)).toEqual([kept.ip_hash]);
  });

  it("keeps no address hash with the message without the secret, and still caps the address", async () => {
    vi.stubEnv("CONTACT_HASH_SECRET", "");
    const statuses: number[] = [];
    for (let i = 0; i < 6; i += 1) statuses.push((await post({}, "198.51.100.23")).status);
    expect(statuses).toEqual([200, 200, 200, 200, 200, 429]);
    for (const pathname of blobStore.list("contact/messages/")) {
      expect(blobStore.read(pathname).ip_hash).toBeNull();
    }
    // The cap keys the address with a key that lives only in this process,
    // never with a plain hash anyone could reverse.
    const plain = createHash("sha256").update("198.51.100.23").digest("hex");
    expect(Object.keys(limits().addresses)).toHaveLength(1);
    expect(Object.keys(limits().addresses)).not.toContain(plain);
  });
});
