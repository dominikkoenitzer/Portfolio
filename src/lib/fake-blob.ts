/**
 * A stand-in for `@vercel/blob` in the contact tests: the few calls the store
 * layer makes, with the rules the real store enforces. Puts and reads wait a
 * short random time before they act, so parallel requests interleave the way
 * they do in production. A read that does not skip the cache gets the copy
 * from the first time it was read, which is what a stale CDN copy looks like.
 */

export class BlobError extends Error {}
export class BlobPreconditionFailedError extends BlobError {
  constructor() {
    super("Precondition failed: ETag mismatch.");
  }
}

type Entry = { body: string; etag: string; access: string };

type PutOptions = {
  access?: string;
  allowOverwrite?: boolean;
  ifMatch?: string;
  contentType?: string;
  cacheControlMaxAge?: number;
  abortSignal?: AbortSignal;
};

type GetOptions = { access?: string; useCache?: boolean; abortSignal?: AbortSignal };

const created = {
  entries: new Map<string, Entry>(),
  cached: new Map<string, Entry>(),
  ops: { simple: 0, advanced: 0 },
  version: 0,
  /** Throws this error from every put while set. */
  putError: null as Error | null,
  /** Throws this error from every read while set. */
  getError: null as Error | null,
  /** Thrown once, right after the next put commits: an answer that got lost. */
  afterPutError: null as Error | null,
  /** Runs once, right before the next put commits. */
  beforePut: null as null | ((pathname: string) => void),
  /** When set, waits are skipped so a test controls the order itself. */
  instant: false,
  /** When set, every call waits this long, the way a slow store answers. */
  delayMs: 0,
  reset() {
    this.entries.clear();
    this.cached.clear();
    this.ops = { simple: 0, advanced: 0 };
    this.version = 0;
    this.putError = null;
    this.getError = null;
    this.beforePut = null;
    this.afterPutError = null;
    this.instant = false;
    this.delayMs = 0;
  },
  /** Writes a document directly, the way another request would. */
  write(pathname: string, body: string) {
    this.version += 1;
    this.entries.set(pathname, { body, etag: `"v${this.version}"`, access: "private" });
  },
  read(pathname: string) {
    const entry = this.entries.get(pathname);
    return entry ? JSON.parse(entry.body) : null;
  },
  list(prefix: string) {
    return [...this.entries.keys()].filter((k) => k.startsWith(prefix));
  },
};

// One store per test file, kept when vi.resetModules() loads this module
// again: the handler tests do that to start each test as a new instance, and
// the store layer and the test must still see the same blobs.
const shared = globalThis as { contactFakeBlob?: typeof created };
export const blobStore = (shared.contactFakeBlob ??= created);

// Like the real client, an aborted signal ends the call with its reason.
const pause = (signal?: AbortSignal) => {
  signal?.throwIfAborted();
  const ms = blobStore.delayMs || (blobStore.instant ? 0 : 2 + Math.random() * 18);
  if (!ms) return Promise.resolve();
  return new Promise<void>((resolve, reject) => {
    const timer = setTimeout(() => {
      signal?.removeEventListener("abort", stop);
      resolve();
    }, ms);
    const stop = () => {
      clearTimeout(timer);
      reject(signal?.reason);
    };
    signal?.addEventListener("abort", stop, { once: true });
  });
};

export async function put(pathname: string, body: string, options: PutOptions) {
  blobStore.ops.advanced += 1;
  if (options?.access !== "private") {
    throw new BlobError("The contact store only takes private blobs.");
  }
  if (options.ifMatch !== undefined && options.allowOverwrite === false) {
    throw new BlobError("ifMatch and allowOverwrite: false are contradictory.");
  }
  await pause(options.abortSignal);
  if (blobStore.putError) throw blobStore.putError;
  const hook = blobStore.beforePut;
  if (hook) {
    blobStore.beforePut = null;
    hook(pathname);
  }
  const existing = blobStore.entries.get(pathname);
  if (options.ifMatch !== undefined) {
    if (!existing || existing.etag !== options.ifMatch) {
      throw new BlobPreconditionFailedError();
    }
  } else if (existing && !options.allowOverwrite) {
    throw new BlobError(
      "This blob already exists, use `allowOverwrite: true` if you want to overwrite it.",
    );
  }
  blobStore.version += 1;
  const etag = `"v${blobStore.version}"`;
  blobStore.entries.set(pathname, { body, etag, access: options.access });
  const lost = blobStore.afterPutError;
  if (lost) {
    blobStore.afterPutError = null;
    throw lost;
  }
  return { pathname, etag, url: `https://blob.test/${pathname}` };
}

export async function get(pathname: string, options: GetOptions) {
  blobStore.ops.simple += 1;
  if (options?.access !== "private") {
    throw new BlobError("The contact store only holds private blobs.");
  }
  await pause(options.abortSignal);
  if (blobStore.getError) throw blobStore.getError;
  let entry = blobStore.entries.get(pathname);
  if (options.useCache !== false) {
    const cached = blobStore.cached.get(pathname);
    if (cached) entry = cached;
    else if (entry) blobStore.cached.set(pathname, entry);
  }
  if (!entry) return null;
  return {
    statusCode: 200 as const,
    stream: new Response(entry.body).body,
    headers: new Headers(),
    blob: { pathname, etag: entry.etag, contentType: "application/json" },
  };
}
