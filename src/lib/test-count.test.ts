import { describe, expect, it } from "vitest";
import { countInTarball } from "../../api/test-count.js";

// Built with web APIs only: this file is checked against the app's browser
// types, which have no Node globals.
const encoder = new TextEncoder();

/** One 512-byte ustar header plus the body padded to a block. */
const entry = (name: string, body: string, type = "0") => {
  const data = encoder.encode(body);
  const block = new Uint8Array(512 + Math.ceil(data.length / 512) * 512);
  block.set(encoder.encode(name.slice(0, 100)), 0);
  block.set(encoder.encode(`${data.length.toString(8).padStart(11, "0")}\0`), 124);
  block.set(encoder.encode(type), 156);
  block.set(data, 512);
  return block;
};

const pax = (path: string) => {
  const record = ` path=${path}\n`;
  // The length prefix counts itself.
  let length = record.length + 2;
  if (`${length}${record}`.length !== length) length += 1;
  return entry("pax", `${length}${record}`, "x");
};

const archive = async (...parts: Uint8Array[]) => {
  const blob = new Blob([...parts, new Uint8Array(1024)] as BlobPart[]);
  const gzipped = blob.stream().pipeThrough(new CompressionStream("gzip"));
  return new Uint8Array(await new Response(gzipped).arrayBuffer());
};

const rust = (path: string) =>
  path.includes("/crates/") && path.endsWith(".rs");

describe("countInTarball", () => {
  it("counts markers in the files it is told to include", async () => {
    const tar = await archive(
      entry("repo-abc/crates/a/src/lib.rs", "#[test]\nfn a() {}\n#[test]\nfn b() {}"),
      entry("repo-abc/crates/b/src/lib.rs", "#[test]\nfn c() {}"),
      entry("repo-abc/README.md", "#[test] in prose does not count"),
    );
    expect(countInTarball(tar, rust, /#\[test\]/g)).toEqual({ count: 3, files: 2 });
  });

  // GitHub's tarballs open with a pax global header and use a pax extended
  // header for long paths. Taking either for a file would misread the next one.
  it("reads pax headers instead of counting them as files", async () => {
    const long = `repo-abc/crates/${"deep/".repeat(25)}tests.rs`;
    const tar = await archive(
      entry("pax_global_header", "52 comment=0123456789abcdef0123456789abcdef01234567\n", "g"),
      pax(long),
      entry(long.slice(0, 100), "#[test]\n#[test]"),
    );
    expect(countInTarball(tar, rust, /#\[test\]/g)).toEqual({ count: 2, files: 1 });
  });
});
