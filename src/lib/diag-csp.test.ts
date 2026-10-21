import { describe, expect, it } from "vitest";
import { blockedDiagOrigin, readVercelConfig } from "../../scripts/diag-csp.mjs";

const policy = (connect: string) => ({
  headers: [
    {
      source: "/(.*)",
      headers: [
        {
          key: "Content-Security-Policy",
          value: `default-src 'self'; connect-src ${connect}; object-src 'none'`,
        },
      ],
    },
  ],
});

describe("diagnostic endpoint and the content security policy", () => {
  it("the endpoint this build is made with is allowed by connect-src in vercel.json", () => {
    expect(blockedDiagOrigin(import.meta.env.VITE_DIAG_ENDPOINT)).toBeNull();
  });

  it("an unset endpoint needs nothing", () => {
    expect(blockedDiagOrigin(undefined)).toBeNull();
    expect(blockedDiagOrigin("")).toBeNull();
  });

  it("an endpoint vercel.json does not list is reported with its origin", () => {
    expect(blockedDiagOrigin("https://reports.example.net/v1/report", readVercelConfig())).toBe(
      "https://reports.example.net",
    );
  });

  it("reads the origin, the scheme, the port and wildcard hosts as the browser does", () => {
    const listed = policy("'self' https://reports.example.net");
    expect(blockedDiagOrigin("https://reports.example.net/v1/report", listed)).toBeNull();
    expect(blockedDiagOrigin("http://reports.example.net/v1/report", listed)).toBe(
      "http://reports.example.net",
    );
    expect(blockedDiagOrigin("https://reports.example.net:8443/r", listed)).toBe(
      "https://reports.example.net:8443",
    );
    expect(blockedDiagOrigin("https://a.example.net/r", policy("https://*.example.net"))).toBeNull();
    expect(blockedDiagOrigin("https://example.net/r", policy("https://*.example.net"))).toBe(
      "https://example.net",
    );
    expect(blockedDiagOrigin("https://anything.example/r", policy("https:"))).toBeNull();
  });

  it("falls back to default-src when connect-src is missing", () => {
    const config = {
      headers: [
        {
          source: "/(.*)",
          headers: [{ key: "Content-Security-Policy", value: "default-src 'self'" }],
        },
      ],
    };
    expect(blockedDiagOrigin("https://reports.example.net/r", config)).toBe(
      "https://reports.example.net",
    );
  });
});
