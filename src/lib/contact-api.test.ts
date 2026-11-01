// @ts-expect-error -- the app tsconfig carries no Node types; vitest runs this file in Node.
import { createServer } from "node:net";
import {
  afterAll,
  afterEach,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";

// The mail goes to a local socket that accepts and then never answers, the way
// a stalled SMTP server behaves. Every option the handler passes is kept; only
// the address changes.
const smtp = vi.hoisted(() => ({ port: 0 }));
vi.mock("nodemailer", async (importOriginal) => {
  const real = ((await importOriginal()) as {
    default: { createTransport: (options: object) => unknown };
  }).default;
  return {
    default: {
      createTransport: (options: object) =>
        real.createTransport({ ...options, host: "127.0.0.1", port: smtp.port }),
    },
  };
});

vi.mock("@vercel/blob", () => import("./fake-blob"));

import handler from "../../api/contact.js";
import { blobStore } from "./fake-blob";

const stored = () => blobStore.list("contact/messages/");

type Reply = { status: number; body: unknown };

async function post(body: object, ip = "203.0.113.7"): Promise<Reply> {
  const reply: Reply = { body: null, status: 200 };
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
      body,
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

const message = (extra: object = {}) => ({
  email: "ann@example.com",
  intent: "job",
  language: "en",
  message: "Hello, a real message.",
  name: "Ann",
  startedAt: Date.now() - 60_000,
  subject: "Role",
  website: "",
  ...extra,
});

beforeEach(() => {
  blobStore.reset();
  vi.stubEnv("CONTACT_HASH_SECRET", "test-secret");
  vi.stubEnv("GMAIL_USER", "");
  vi.stubEnv("GMAIL_APP_PASSWORD", "");
  vi.spyOn(console, "error").mockImplementation(() => {});
});

afterEach(() => {
  vi.unstubAllEnvs();
  vi.restoreAllMocks();
});

describe("contact API hourly cap", () => {
  it("stores five messages from one address and refuses the sixth and seventh", async () => {
    const statuses: number[] = [];
    for (let i = 0; i < 7; i += 1) {
      statuses.push((await post(message())).status);
    }
    expect(statuses).toEqual([200, 200, 200, 200, 200, 429, 429]);
    expect(stored()).toHaveLength(5);
  });

  it("holds for a burst of parallel requests from one address", async () => {
    const replies = await Promise.all(
      Array.from({ length: 30 }, () => post(message())),
    );
    const accepted = replies.filter((r) => r.status === 200).length;
    expect(stored().length).toBeLessThanOrEqual(5);
    expect(accepted).toBe(stored().length);
    expect(replies.every((r) => r.status === 200 || r.status === 429)).toBe(
      true,
    );
  });

  it("does not count other addresses against each other", async () => {
    const replies = await Promise.all(
      Array.from({ length: 10 }, (_, i) => post(message(), `203.0.113.${i}`)),
    );
    expect(replies.every((r) => r.status === 200)).toBe(true);
    expect(stored()).toHaveLength(10);
  });
});

describe("contact API cap for IPv6", () => {
  it("counts every address in one /64 as one sender", async () => {
    const statuses: number[] = [];
    for (let i = 1; i <= 5; i += 1) {
      statuses.push((await post(message(), `2001:db8:a:b::${i}`)).status);
    }
    statuses.push((await post(message(), "2001:db8:a:b:ffff:1:2:3")).status);
    statuses.push((await post(message(), "2001:0db8:000a:000b::9")).status);
    statuses.push((await post(message(), "[2001:DB8:A:B::10]")).status);
    expect(statuses).toEqual([200, 200, 200, 200, 200, 429, 429, 429]);
    expect((await post(message(), "2001:db8:a:c::1")).status).toBe(200);
    expect(stored()).toHaveLength(6);
  });

  it("counts an IPv4 address the same when it arrives in IPv6 form", async () => {
    for (let i = 0; i < 5; i += 1) await post(message(), "203.0.113.50");
    expect((await post(message(), "::ffff:203.0.113.50")).status).toBe(429);
  });
});

describe("contact API when the store fails", () => {
  it("refuses the message with the general failure when the cap cannot be read", async () => {
    blobStore.getError = new Error("store unreachable");
    const reply = await post(message());
    // Not 429 and not 400, so the form shows the toast that points to the
    // mail link.
    expect(reply.status).toBe(503);
    expect(stored()).toHaveLength(0);
    expect(blobStore.ops.advanced).toBe(0);
  });

  it("refuses the message when the cap cannot be written", async () => {
    blobStore.write("contact/limits/day.json", JSON.stringify({ count: 0, addresses: {} }));
    blobStore.putError = new Error("store unreachable");
    const reply = await post(message());
    expect(reply.status).toBe(503);
    expect(stored()).toHaveLength(0);
  });

  it("answers 502 when the message cannot be stored", async () => {
    // The cap write goes through; every write after it fails.
    blobStore.beforePut = () => {
      blobStore.putError = new Error("store unreachable");
    };
    const reply = await post(message());
    expect(reply.status).toBe(502);
    expect(reply.body).toEqual({ error: "Could not store the message" });
  });
});

describe("contact API fill-time gate", () => {
  it("keeps a real message from a visitor whose clock runs a minute ahead", async () => {
    // 61.5 s of typing on a clock 60 s fast: the absolute timestamp says 1.5 s.
    const reply = await post(
      message({ fillMs: 61_500, startedAt: Date.now() - 1_500 }),
    );
    expect(reply.status).toBe(200);
    expect(stored()).toHaveLength(1);
  });

  it("drops a form filled faster than a person types", async () => {
    await post(message({ fillMs: 1_500 }));
    expect(stored()).toHaveLength(0);
  });

  it("drops an unreadable fill time", async () => {
    await post(message({ fillMs: "soon" }));
    await post(message({ fillMs: null }));
    expect(stored()).toHaveLength(0);
  });

  it("drops a message with no timing at all", async () => {
    await post(message({ startedAt: undefined }));
    expect(stored()).toHaveLength(0);
  });
});

/** The little of `net.Server` and `net.Socket` this file touches. */
type StalledSocket = { destroy(): void; on(event: string, fn: () => void): void };
type StalledServer = {
  address(): { port: number };
  close(done: () => void): void;
  listen(port: number, host: string, done: () => void): void;
};

describe("contact API with a stalled mail server", () => {
  let server: StalledServer;
  const sockets = new Set<StalledSocket>();

  beforeAll(async () => {
    server = createServer((socket: StalledSocket) => {
      sockets.add(socket);
      socket.on("error", () => {});
    });
    await new Promise<void>((resolve) => server.listen(0, "127.0.0.1", resolve));
    smtp.port = server.address().port;
  });

  afterAll(async () => {
    for (const socket of sockets) socket.destroy();
    await new Promise<void>((resolve) => server.close(resolve));
  });

  it(
    "answers a stored message well inside the browser's 20 s deadline",
    async () => {
      vi.stubEnv("GMAIL_USER", "someone@example.com");
      vi.stubEnv("GMAIL_APP_PASSWORD", "app-password");
      const start = Date.now();
      const reply = await post(message({ fillMs: 60_000 }));
      expect(reply.status).toBe(200);
      expect(stored()).toHaveLength(1);
      expect(Date.now() - start).toBeLessThan(15_000);
    },
    20_000,
  );
});
