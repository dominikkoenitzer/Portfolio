import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

// A mail server that keeps the connection alive but never finishes the send:
// each of nodemailer's timeouts covers one phase or one quiet stretch, so this
// is the case only a deadline over the whole send can end.
vi.mock("nodemailer", () => ({
  default: {
    createTransport: () => ({ sendMail: () => new Promise(() => {}) }),
  },
}));

vi.mock("@vercel/blob", () => import("./fake-blob"));

import handler from "../../api/contact.js";
import { blobStore } from "./fake-blob";

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

beforeEach(() => {
  blobStore.reset();
  vi.stubEnv("GMAIL_USER", "someone@example.com");
  vi.stubEnv("GMAIL_APP_PASSWORD", "app-password");
  vi.stubEnv("CONTACT_MAIL_DEADLINE_MS", "1500");
  vi.spyOn(console, "error").mockImplementation(() => {});
});

afterEach(() => {
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
      const token = await formToken();
      const start = Date.now();
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
      expect(blobStore.read("contact/limits/day.json").messages).toHaveLength(1);
      expect(Date.now() - start).toBeLessThan(5_000);
    },
    10_000,
  );
});
