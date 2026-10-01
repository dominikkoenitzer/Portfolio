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

import handler from "../../api/contact.js";

type Row = {
  id: string;
  ip_hash: string | null;
  created_at: number;
  notified_at?: string;
};

/**
 * Just enough of PostgREST for the handler: a HEAD count filtered by ip_hash
 * and created_at, an insert, a delete and a patch by id, each after a short
 * random delay so parallel requests interleave the way they do in production.
 */
let rows: Row[] = [];
let seq = 0;
const filterValue = (params: URLSearchParams, key: string) =>
  params.get(key)?.replace(/^(eq|gte)\./, "");

async function fakeSupabase(
  input: string | URL | Request,
  init: RequestInit = {},
) {
  const url = new URL(String(input));
  const method = (init.method || "GET").toUpperCase();
  await new Promise((r) => setTimeout(r, 2 + Math.random() * 18));
  const params = url.searchParams;
  if (method === "HEAD") {
    const ip = filterValue(params, "ip_hash");
    const since = Date.parse(filterValue(params, "created_at") ?? "");
    const total = rows.filter(
      (r) => (!ip || r.ip_hash === ip) && r.created_at >= since,
    ).length;
    return new Response(null, {
      headers: { "content-range": `*/${total}` },
      status: 200,
    });
  }
  if (method === "POST") {
    seq += 1;
    const row = {
      ...JSON.parse(String(init.body)),
      created_at: Date.now(),
      id: `id-${seq}`,
    };
    rows.push(row);
    return Response.json([{ id: row.id }], { status: 201 });
  }
  if (method === "DELETE") {
    const id = filterValue(params, "id");
    rows = rows.filter((r) => r.id !== id);
    return new Response(null, { status: 204 });
  }
  if (method === "PATCH") {
    return new Response(null, { status: 204 });
  }
  return new Response(null, { status: 405 });
}

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
  rows = [];
  seq = 0;
  vi.stubGlobal("fetch", fakeSupabase);
  vi.stubEnv("SUPABASE_URL", "https://supabase.test");
  vi.stubEnv("SUPABASE_SERVICE_ROLE_KEY", "test-key");
  vi.stubEnv("GMAIL_USER", "");
  vi.stubEnv("GMAIL_APP_PASSWORD", "");
  vi.spyOn(console, "error").mockImplementation(() => {});
});

afterEach(() => {
  vi.unstubAllGlobals();
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
    expect(rows).toHaveLength(5);
  });

  it("holds for a burst of parallel requests from one address", async () => {
    const replies = await Promise.all(
      Array.from({ length: 30 }, () => post(message())),
    );
    const accepted = replies.filter((r) => r.status === 200).length;
    expect(rows.length).toBeLessThanOrEqual(5);
    expect(accepted).toBe(rows.length);
    expect(replies.every((r) => r.status === 200 || r.status === 429)).toBe(
      true,
    );
  });

  it("does not count other addresses against each other", async () => {
    const replies = await Promise.all(
      Array.from({ length: 10 }, (_, i) => post(message(), `203.0.113.${i}`)),
    );
    expect(replies.every((r) => r.status === 200)).toBe(true);
    expect(rows).toHaveLength(10);
  });
});

describe("contact API fill-time gate", () => {
  it("keeps a real message from a visitor whose clock runs a minute ahead", async () => {
    // 61.5 s of typing on a clock 60 s fast: the absolute timestamp says 1.5 s.
    const reply = await post(
      message({ fillMs: 61_500, startedAt: Date.now() - 1_500 }),
    );
    expect(reply.status).toBe(200);
    expect(rows).toHaveLength(1);
  });

  it("drops a form filled faster than a person types", async () => {
    await post(message({ fillMs: 1_500 }));
    expect(rows).toHaveLength(0);
  });

  it("drops an unreadable fill time", async () => {
    await post(message({ fillMs: "soon" }));
    await post(message({ fillMs: null }));
    expect(rows).toHaveLength(0);
  });

  it("drops a message with no timing at all", async () => {
    await post(message({ startedAt: undefined }));
    expect(rows).toHaveLength(0);
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
      expect(rows).toHaveLength(1);
      expect(Date.now() - start).toBeLessThan(15_000);
    },
    20_000,
  );
});
