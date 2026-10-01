import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

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
