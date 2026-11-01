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

// The handler keeps what it learns about the cap in its module, so every test
// loads it afresh, the way a new function instance starts.
let handler: (req: object, res: object) => Promise<unknown>;
let blobStore: (typeof import("./fake-blob"))["blobStore"];

const stored = () => blobStore.list("contact/messages/");

type Reply = { status: number; body: unknown; headers: Record<string, string> };

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

/** Posts the form; a body without a `token` key gets a minute-old one. */
async function post(body: object, ip = "203.0.113.7"): Promise<Reply> {
  const reply: Reply = { body: null, headers: {}, status: 200 };
  const res = {
    json(payload: unknown) {
      reply.body = payload;
      return res;
    },
    setHeader(name: string, value: string) {
      reply.headers[name] = value;
    },
    status(code: number) {
      reply.status = code;
      return res;
    },
  };
  const token = "token" in body ? {} : { token: await formToken() };
  await handler(
    {
      body: { ...token, ...body },
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
  subject: "Role",
  website: "",
  ...extra,
});

beforeEach(async () => {
  vi.resetModules();
  ({ blobStore } = await import("./fake-blob"));
  handler = (await import("../../api/contact.js")).default;
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

describe("contact API form token", () => {
  it("hands out a signed start time that no cache keeps", async () => {
    const reply: Reply = { body: null, headers: {}, status: 0 };
    const res = {
      json(payload: unknown) {
        reply.body = payload;
        return res;
      },
      setHeader(name: string, value: string) {
        reply.headers[name] = value;
      },
      status(code: number) {
        reply.status = code;
        return res;
      },
    };
    await handler({ headers: {}, method: "GET" }, res);
    expect(reply.status).toBe(200);
    expect(reply.headers["Cache-Control"]).toBe("no-store");
    expect(reply.body).toMatchObject({ minAgeMs: 3_000, maxAgeMs: 6 * 60 * 60 * 1000 });
    expect((reply.body as { token: string }).token).toMatch(/^\d+\.[\w-]+$/);
  });

  it("keeps a message sent with a token older than a person needs to type", async () => {
    const reply = await post(message({ token: await formToken(3_000) }));
    expect(reply.status).toBe(200);
    expect(stored()).toHaveLength(1);
  });

  it("drops a message sent faster than a person types", async () => {
    const reply = await post(message({ token: await formToken(2_000) }));
    expect(reply.status).toBe(200);
    expect(stored()).toHaveLength(0);
  });

  it("drops a token stamped in the future", async () => {
    const reply = await post(message({ token: await formToken(-60_000) }));
    expect(reply.status).toBe(200);
    expect(stored()).toHaveLength(0);
  });

  it("refuses a message without a token, whatever fill time the browser reports", async () => {
    // A page loaded before the token existed sends none: the general failure
    // points that visitor to the mail link instead of a "Sent." for nothing.
    const replies = [
      await post(message({ token: undefined })),
      await post(message({ token: "" })),
      await post(message({ token: undefined, fillMs: 60_000 })),
      await post(message({ token: undefined, startedAt: Date.now() - 60_000 })),
    ];
    expect(replies.map((r) => r.status)).toEqual([403, 403, 403, 403]);
    expect(stored()).toHaveLength(0);
    expect(blobStore.ops).toEqual({ simple: 0, advanced: 0 });
  });

  it("refuses a token older than six hours", async () => {
    const reply = await post(message({ token: await formToken(6 * 60 * 60 * 1000 + 1) }));
    expect(reply.status).toBe(403);
    expect(stored()).toHaveLength(0);
  });

  it("refuses a token this server did not sign", async () => {
    const stamp = Date.now() - 60_000;
    const forged = [`${stamp}.${"A".repeat(43)}`, `${stamp}`, "token", `${stamp}.x.y`];
    for (const token of forged) {
      expect((await post(message({ token }))).status).toBe(403);
    }
    vi.stubEnv("CONTACT_HASH_SECRET", "another-secret");
    const other = await formToken();
    vi.stubEnv("CONTACT_HASH_SECRET", "test-secret");
    expect((await post(message({ token: other }))).status).toBe(403);
    // The time is part of what is signed, so it cannot be moved back.
    const [, signature] = (await formToken(0)).split(".");
    expect((await post(message({ token: `${stamp}.${signature}` }))).status).toBe(403);
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
      const reply = await post(message());
      expect(reply.status).toBe(200);
      expect(stored()).toHaveLength(1);
      expect(Date.now() - start).toBeLessThan(15_000);
    },
    20_000,
  );
});
