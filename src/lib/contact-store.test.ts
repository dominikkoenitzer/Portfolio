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
const CAP = "contact/limits/abc.json";

beforeEach(() => {
  blobStore.reset();
  mail.sent = 0;
  vi.spyOn(console, "error").mockImplementation(() => {});
});

afterEach(() => {
  vi.unstubAllEnvs();
  vi.restoreAllMocks();
});

describe("contact store cap", () => {
  it("takes five slots in an hour and refuses the sixth", async () => {
    const taken: boolean[] = [];
    for (let i = 0; i < 6; i += 1) taken.push(await takeSlot("abc", 5));
    expect(taken).toEqual([true, true, true, true, true, false]);
    expect(blobStore.read(CAP).times).toHaveLength(5);
  });

  it("gives out exactly five slots to thirty parallel requests", async () => {
    const taken = await Promise.all(
      Array.from({ length: 30 }, () => takeSlot("abc", 5)),
    );
    expect(taken.filter(Boolean)).toHaveLength(5);
    expect(blobStore.read(CAP).times).toHaveLength(5);
  });

  it("reads again and still takes its slot when another request wrote first", async () => {
    blobStore.instant = true;
    blobStore.write(CAP, JSON.stringify({ times: [Date.now() - 1000] }));
    blobStore.beforePut = () =>
      blobStore.write(
        CAP,
        JSON.stringify({ times: [Date.now() - 1000, Date.now() - 500] }),
      );
    expect(await takeSlot("abc", 5)).toBe(true);
    expect(blobStore.read(CAP).times).toHaveLength(3);
  });

  it("does not take the last slot twice when the document changes under it", async () => {
    blobStore.instant = true;
    const earlier = Date.now() - 1000;
    blobStore.write(CAP, JSON.stringify({ times: [earlier, earlier, earlier, earlier] }));
    blobStore.beforePut = () =>
      blobStore.write(
        CAP,
        JSON.stringify({ times: [earlier, earlier, earlier, earlier, earlier] }),
      );
    expect(await takeSlot("abc", 5)).toBe(false);
    expect(blobStore.read(CAP).times).toHaveLength(5);
  });

  it("retries when two first messages race to create the document", async () => {
    blobStore.instant = true;
    blobStore.beforePut = () => blobStore.write(CAP, JSON.stringify({ times: [Date.now()] }));
    expect(await takeSlot("abc", 5)).toBe(true);
    expect(blobStore.read(CAP).times).toHaveLength(2);
  });

  it("reads past the cache, so a second message is not refused on a stale etag", async () => {
    expect(await takeSlot("abc", 5)).toBe(true);
    expect(await takeSlot("abc", 5)).toBe(true);
    expect(await takeSlot("abc", 5)).toBe(true);
    expect(blobStore.read(CAP).times).toHaveLength(3);
  });

  it("frees a slot once its message is an hour old", async () => {
    const now = Date.now();
    blobStore.write(
      CAP,
      JSON.stringify({ times: [now - HOUR - 1, now - HOUR, now - 10, now - 5, now - 1] }),
    );
    expect(await takeSlot("abc", 5, () => now)).toBe(true);
    expect(blobStore.read(CAP).times).toEqual([now - 10, now - 5, now - 1, now]);
  });

  it("starts over from a document it cannot read", async () => {
    blobStore.write(CAP, "not json");
    expect(await takeSlot("abc", 5)).toBe(true);
    expect(blobStore.read(CAP).times).toHaveLength(1);
  });

  it("gives up after a bounded number of tries when the document never settles", async () => {
    blobStore.instant = true;
    blobStore.write(CAP, JSON.stringify({ times: [] }));
    let tries = 0;
    const fight = () => {
      tries += 1;
      blobStore.write(CAP, JSON.stringify({ times: [] }));
      blobStore.beforePut = fight;
    };
    blobStore.beforePut = fight;
    expect(await takeSlot("abc", 5)).toBe(false);
    expect(tries).toBe(CAP_ATTEMPTS);
    expect(blobStore.ops.advanced).toBe(CAP_ATTEMPTS);
  });

  it("passes a real store failure on instead of retrying it", async () => {
    blobStore.write(CAP, JSON.stringify({ times: [] }));
    blobStore.putError = new Error("store unreachable");
    await expect(takeSlot("abc", 5)).rejects.toThrow("store unreachable");
    expect(blobStore.ops.advanced).toBe(1);
  });

  it("passes on a failed create when no other request made the document", async () => {
    blobStore.putError = new Error("store unreachable");
    await expect(takeSlot("abc", 5)).rejects.toThrow("store unreachable");
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

  it("spends one read and no write on a refused message", async () => {
    for (let i = 0; i < 5; i += 1) await post();
    blobStore.ops = { simple: 0, advanced: 0 };
    expect((await post()).status).toBe(429);
    expect(blobStore.ops).toEqual({ simple: 1, advanced: 0 });
  });

  it("spends nothing on a bot", async () => {
    await post({ website: "https://spam.example" });
    await post({ fillMs: 500 });
    expect(blobStore.ops).toEqual({ simple: 0, advanced: 0 });
  });

  it("stores the address only as a keyed hash", async () => {
    vi.stubEnv("CONTACT_HASH_SECRET", "test-secret");
    await post({}, "198.51.100.23");
    const [pathname] = blobStore.list("contact/messages/");
    const kept = blobStore.read(pathname);
    expect(JSON.stringify(kept)).not.toContain("198.51.100.23");
    expect(kept.ip_hash).toMatch(/^[0-9a-f]{64}$/);
    expect(blobStore.list("contact/limits/")).toEqual([
      `contact/limits/${kept.ip_hash}.json`,
    ]);
  });
});
