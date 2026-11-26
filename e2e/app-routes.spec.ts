import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { expect, test } from "@playwright/test";

// Installed apps call these routes, so each row pins source, target and a sample path; /get/remnants/latest is tested in src/lib.
const APP_ROUTES: [source: string, target: string, path?: string][] = [
  ["/get/daifuku", "/projects/daifuku"],
  ["/get/daifuku/download/windows", "https://github.com/dominikkoenitzer/Daifuku/releases/latest/download/daifuku.exe"],
  ["/get/daifuku/download/windows-arm64", "https://github.com/dominikkoenitzer/Daifuku/releases/latest/download/daifuku-arm64.exe"],
  ["/get/daifuku/download/windows-arm", "https://github.com/dominikkoenitzer/Daifuku/releases/latest/download/daifuku-arm64.exe"],
  ["/get/daifuku/download/zip", "https://github.com/dominikkoenitzer/Daifuku/releases/latest/download/daifuku-windows-x64.zip"],
  ["/get/daifuku/download/zip-arm64", "https://github.com/dominikkoenitzer/Daifuku/releases/latest/download/daifuku-windows-arm64.zip"],
  ["/get/daifuku/schema.json", "https://raw.githubusercontent.com/dominikkoenitzer/Daifuku/main/schema.json"],
  ["/get/daifuku/download/windows.sha256", "https://github.com/dominikkoenitzer/Daifuku/releases/latest/download/daifuku.exe.sha256"],
  ["/get/daifuku/download/windows-arm64.sha256", "https://github.com/dominikkoenitzer/Daifuku/releases/latest/download/daifuku-arm64.exe.sha256"],
  ["/get/daifuku/download/zip.sha256", "https://github.com/dominikkoenitzer/Daifuku/releases/latest/download/daifuku-windows-x64.zip.sha256"],
  ["/get/daifuku/download/zip-arm64.sha256", "https://github.com/dominikkoenitzer/Daifuku/releases/latest/download/daifuku-windows-arm64.zip.sha256"],
  ["/get/daifuku/llms.txt", "https://raw.githubusercontent.com/dominikkoenitzer/Daifuku/main/site/llms.txt"],
  ["/get/daifuku/skill/daifuku.zip", "https://raw.githubusercontent.com/dominikkoenitzer/Daifuku/main/site/skill/daifuku.zip"],
  ["/get/mochi", "/projects/mochi"],
  ["/get/mochi/install.ps1", "https://github.com/dominikkoenitzer/Mochi/releases/latest/download/install.ps1"],
  ["/get/mochi/latest", "https://api.github.com/repos/dominikkoenitzer/Mochi/releases/latest"],
  ["/get/mochi/download/windows", "https://github.com/dominikkoenitzer/Mochi/releases/latest/download/Mochi-Setup.exe"],
  ["/get/mochi/download/:file", "https://github.com/dominikkoenitzer/Mochi/releases/latest/download/Mochi-Setup.exe.sha256", "/get/mochi/download/Mochi-Setup.exe.sha256"],
  ["/get/mochi/download/:tag/:file", "https://github.com/dominikkoenitzer/Mochi/releases/download/v0.1.32/install.ps1", "/get/mochi/download/v0.1.32/install.ps1"],
  ["/get/mochi/schema.json", "https://raw.githubusercontent.com/dominikkoenitzer/Mochi/main/schema.json"],
  ["/get/mochi/llms.txt", "https://raw.githubusercontent.com/dominikkoenitzer/Mochi/main/site/llms.txt"],
  ["/get/mochi/skill/mochi.zip", "https://raw.githubusercontent.com/dominikkoenitzer/Mochi/main/site/skill/mochi.zip"],
  ["/get/remnants", "/projects/remnants"],
  ["/get/remnants/download/windows", "https://github.com/dominikkoenitzer/Remnants/releases/latest/download/RemnantsUserSetup-x64.exe"],
  ["/get/remnants/download/windows-arm", "https://github.com/dominikkoenitzer/Remnants/releases/latest/download/RemnantsUserSetup-arm64.exe"],
  ["/get/remnants/download/mac", "https://github.com/dominikkoenitzer/Remnants/releases/latest/download/Remnants-darwin-arm64.dmg"],
  ["/get/remnants/download/mac-intel", "https://github.com/dominikkoenitzer/Remnants/releases/latest/download/Remnants-darwin-x64.dmg"],
  ["/get/remnants/download/linux", "https://github.com/dominikkoenitzer/Remnants/releases/latest/download/Remnants-linux-x64.tar.gz"],
  ["/get/remnants/download/deb", "https://github.com/dominikkoenitzer/Remnants/releases/latest/download/remnants-amd64.deb"],
  ["/get/remnants/download/rpm", "https://github.com/dominikkoenitzer/Remnants/releases/latest/download/remnants-x86_64.rpm"],
  ["/get/remnants/download/pkgbuild", "https://github.com/dominikkoenitzer/Remnants/releases/latest/download/PKGBUILD"],
  ["/get/remnants/download/checksums", "https://github.com/dominikkoenitzer/Remnants/releases/latest/download/SHA256SUMS"],
  ["/get/remnants/download/windows-system", "https://github.com/dominikkoenitzer/Remnants/releases/latest/download/RemnantsSetup-x64.exe"],
  ["/get/remnants/download/windows-system-arm", "https://github.com/dominikkoenitzer/Remnants/releases/latest/download/RemnantsSetup-arm64.exe"],
  ["/get/remnants/download/windows-zip", "https://github.com/dominikkoenitzer/Remnants/releases/latest/download/Remnants-win32-x64.zip"],
  ["/get/remnants/download/windows-zip-arm", "https://github.com/dominikkoenitzer/Remnants/releases/latest/download/Remnants-win32-arm64.zip"],
  ["/get/remnants/download/mac-zip", "https://github.com/dominikkoenitzer/Remnants/releases/latest/download/Remnants-darwin-arm64.zip"],
  ["/get/remnants/download/mac-intel-zip", "https://github.com/dominikkoenitzer/Remnants/releases/latest/download/Remnants-darwin-x64.zip"],
  ["/get/remnants/download/linux-arm", "https://github.com/dominikkoenitzer/Remnants/releases/latest/download/Remnants-linux-arm64.tar.gz"],
  ["/get/remnants/download/deb-arm", "https://github.com/dominikkoenitzer/Remnants/releases/latest/download/remnants-arm64.deb"],
  ["/get/remnants/download/rpm-arm", "https://github.com/dominikkoenitzer/Remnants/releases/latest/download/remnants-aarch64.rpm"],
  ["/get/remnants/issues", "https://github.com/dominikkoenitzer/Remnants/issues"],
  ["/get/remnants/issues/new", "https://github.com/dominikkoenitzer/Remnants/issues/new"],
  ["/get/remnants/releases/download/:tag/:file", "https://github.com/dominikkoenitzer/Remnants/releases/download/v1.4.0/Remnants-linux-x64-1.4.0.tar.gz", "/get/remnants/releases/download/v1.4.0/Remnants-linux-x64-1.4.0.tar.gz"],
  ["/get/remnants/llms.txt", "https://raw.githubusercontent.com/dominikkoenitzer/Remnants/main/site/llms.txt"],
  ["/get/remnants/license.txt", "https://raw.githubusercontent.com/dominikkoenitzer/Remnants/main/site/license.txt"],
  ["/get/inkling", "/projects/inkling"],
  ["/get/inkling/download/windows", "https://github.com/dominikkoenitzer/Inkling/releases/latest/download/Inkling-Setup.exe"],
  ["/get/inkling/download/mac", "https://github.com/dominikkoenitzer/Inkling/releases/latest/download/Inkling-mac.dmg"],
  ["/get/inkling/download/linux", "https://github.com/dominikkoenitzer/Inkling/releases/latest/download/Inkling.AppImage"],
  ["/get/inkling/update/latest.yml", "https://github.com/dominikkoenitzer/Inkling/releases/latest/download/latest.yml"],
  ["/get/inkling/update/latest-mac.yml", "https://github.com/dominikkoenitzer/Inkling/releases/latest/download/latest-mac.yml"],
  ["/get/inkling/update/latest-linux.yml", "https://github.com/dominikkoenitzer/Inkling/releases/latest/download/latest-linux.yml"],
  ["/get/inkling/update/:file", "https://github.com/dominikkoenitzer/Inkling/releases/latest/download/Inkling-Setup-0.9.1.exe.blockmap", "/get/inkling/update/Inkling-Setup-0.9.1.exe.blockmap"],
  ["/get/inkling/llms.txt", "https://raw.githubusercontent.com/dominikkoenitzer/Inkling/main/site/llms.txt"],
  ["/get/inkling/skill/inkling.zip", "https://raw.githubusercontent.com/dominikkoenitzer/Inkling/main/site/skill/inkling.zip"],
  ["/get/inkling/install", "https://raw.githubusercontent.com/dominikkoenitzer/Inkling/main/site/install"],
];

const config = JSON.parse(
  readFileSync(fileURLToPath(new URL("../vercel.json", import.meta.url)), "utf8"),
) as { redirects: { source: string }[] };

test.describe("app routes", () => {
  test.skip(({ browserName }) => browserName !== "chromium", "no browser is involved");

  for (const [source, target, path = source] of APP_ROUTES) {
    test(`${path} answers with its target`, async ({ request }) => {
      const response = await request.get(path, { maxRedirects: 0 });
      expect(response.status()).toBe(target.startsWith("/projects/") ? 308 : 307);
      expect(response.headers().location).toBe(target);
    });
  }

  test("every app route in vercel.json is in the table", () => {
    const tested = new Set(APP_ROUTES.map(([source]) => source));
    const listed = config.redirects.map((r) => r.source).filter((s) => s.startsWith("/get/"));
    expect(listed.filter((source) => !tested.has(source))).toEqual([]);
    expect(listed.length).toBe(APP_ROUTES.length);
  });

  test("a path no app serves is not found", async ({ request }) => {
    expect((await request.get("/get/daifuku/nothing", { maxRedirects: 0 })).status()).toBe(404);
  });
});
