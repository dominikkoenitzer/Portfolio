import { describe, expect, it } from "vitest";

import handler from "../../api/remnants-latest.js";
import { readVercelConfig } from "../../scripts/diag-csp.mjs";

const config = readVercelConfig() as { rewrites?: { source: string; destination: string }[] };

function answer() {
  const sent = { status: 0, headers: {} as Record<string, string>, ended: false };
  const res = {
    setHeader(key: string, value: string) {
      sent.headers[key] = value;
    },
    status(code: number) {
      sent.status = code;
      return res;
    },
    end() {
      sent.ended = true;
    },
  };
  handler({ method: "GET", headers: {} }, res);
  return sent;
}

describe("the Remnants release route", () => {
  it("is the one app route served by a function", () => {
    expect(config.rewrites?.filter((r) => r.source.startsWith("/get/"))).toEqual([
      { source: "/get/remnants/latest", destination: "/api/remnants-latest" },
    ]);
  });

  it("redirects to the latest release and lets any origin read it", () => {
    const sent = answer();
    expect(sent.status).toBe(307);
    expect(sent.headers.Location).toBe(
      "https://api.github.com/repos/dominikkoenitzer/Remnants/releases/latest",
    );
    expect(sent.headers["Access-Control-Allow-Origin"]).toBe("*");
    expect(sent.ended).toBe(true);
  });
});
