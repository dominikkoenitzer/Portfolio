import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

// A mail server that keeps the connection alive but never finishes the send:
// each of nodemailer's timeouts covers one phase or one quiet stretch, so this
// is the case only a deadline over the whole send can end.
vi.mock("nodemailer", () => ({
  default: {
    createTransport: () => ({ sendMail: () => new Promise(() => {}) }),
  },
}));

import handler from "../../api/contact.js";

const stored: unknown[] = [];

async function fakeSupabase(input: string | URL | Request, init: RequestInit = {}) {
  const method = (init.method || "GET").toUpperCase();
  if (method === "HEAD") {
    return new Response(null, { headers: { "content-range": "*/0" }, status: 200 });
  }
  if (method === "POST") {
    stored.push(JSON.parse(String(init.body)));
    return Response.json([{ id: `id-${stored.length}` }], { status: 201 });
  }
  void input;
  return new Response(null, { status: 204 });
}

beforeEach(() => {
  stored.length = 0;
  vi.stubGlobal("fetch", fakeSupabase);
  vi.stubEnv("SUPABASE_URL", "https://supabase.test");
  vi.stubEnv("SUPABASE_SERVICE_ROLE_KEY", "test-key");
  vi.stubEnv("GMAIL_USER", "someone@example.com");
  vi.stubEnv("GMAIL_APP_PASSWORD", "app-password");
  vi.stubEnv("CONTACT_MAIL_DEADLINE_MS", "1500");
  vi.spyOn(console, "error").mockImplementation(() => {});
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.unstubAllEnvs();
  vi.restoreAllMocks();
});

describe("contact API with a mail send that never finishes", () => {
  it(
    "answers 200 for the stored message once the mail deadline passes",
    async () => {
      const reply = { status: 0, body: null as unknown };
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
      const start = Date.now();
      await handler(
        {
          body: {
            email: "ann@example.com",
            intent: "job",
            language: "en",
            message: "Hello, a real message.",
            name: "Ann",
            fillMs: 60_000,
            startedAt: Date.now() - 60_000,
            subject: "Role",
            website: "",
          },
          headers: {
            "content-type": "application/json",
            host: "dk.punds.ch",
            origin: "https://dk.punds.ch",
            "x-forwarded-for": "203.0.113.9",
          },
          method: "POST",
        },
        res,
      );
      expect(reply.status).toBe(200);
      expect(stored).toHaveLength(1);
      expect(Date.now() - start).toBeLessThan(5_000);
    },
    10_000,
  );
});
