import { BlobPreconditionFailedError, get, put } from "@vercel/blob";

/**
 * Where the contact form keeps its messages and its caps: a private Vercel
 * Blob store. The underscore keeps this file from becoming a route.
 *
 * Every write is a put, which the Hobby plan counts as an advanced operation
 * (2,000 a month), and every read here is a simple one (10,000 a month). An
 * accepted message costs one read and one put: the day's document holds the
 * caps and the day's messages together, so the slot and the message are one
 * write. The first message of a new day adds one put that files the previous
 * day's messages under a name of their own. A refusal the instance already
 * knows of costs nothing, any other refusal the read alone. Bots caught by
 * the honeypot or the form token never reach this file.
 */

const MINUTE_MS = 60 * 1000;

// Each lost write means another request stored a message, and at most
// `perDay` of those can happen in a day, so every request settles within
// perDay + 1 tries.
export const capAttempts = (perDay) => perDay + 1;

// One document holds the day in Zurich: how many messages it stored, how many
// came from each address hash, which form tokens were spent, and the messages
// themselves. The day count and the addresses start over at midnight; spent
// tokens are kept until they would have expired anyway.
export const LIMITS_PATH = "contact/limits/day.json";
export const ARCHIVE_PREFIX = "contact/messages/";

const zurichDay = new Intl.DateTimeFormat("en-CA", {
  timeZone: "Europe/Zurich",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

/**
 * Reads a JSON blob with its etag. The read skips the cache on purpose: a
 * cached copy carries an old etag, every conditional write against it fails,
 * and the visitor would be refused for a message they never sent.
 */
async function readJson(pathname, signal) {
  const found = await get(pathname, {
    access: "private",
    useCache: false,
    abortSignal: signal,
  });
  if (!found || found.statusCode !== 200) return null;
  const text = await new Response(found.stream).text();
  let value = null;
  try {
    value = JSON.parse(text);
  } catch {
    value = null;
  }
  return { etag: found.blob.etag, value };
}

const positive = (n) => (Number.isInteger(n) && n > 0 ? n : 0);

/**
 * The document as it stands at `at`. Messages left from an earlier day come
 * back as `stale`, to be filed before the day is written over.
 */
function settle(value, at, tokenMaxAgeMs) {
  const kept = value && typeof value === "object" ? value : {};
  const day = zurichDay.format(at);
  const today = kept.day === day;
  const addresses = {};
  const seen = today && kept.addresses && typeof kept.addresses === "object" ? kept.addresses : {};
  for (const [hash, sent] of Object.entries(seen)) {
    // Documents written before the daily count kept a list of times instead.
    const n = Array.isArray(sent) ? sent.length : positive(sent);
    if (n) addresses[hash] = n;
  }
  const used = {};
  const spent = kept.used && typeof kept.used === "object" ? kept.used : {};
  for (const [nonce, stamp] of Object.entries(spent)) {
    if (Number.isFinite(stamp) && at - stamp <= tokenMaxAgeMs) used[nonce] = stamp;
  }
  const messages = Array.isArray(kept.messages) ? kept.messages : [];
  const stale =
    !today && messages.length && typeof kept.day === "string"
      ? { day: kept.day, messages }
      : null;
  return {
    day,
    count: today ? positive(kept.count) : 0,
    addresses,
    used,
    messages: today ? messages : [],
    stale,
  };
}

/**
 * Files a finished day's messages. A day can be filed more than once when a
 * late message lands after the first filing; each filing is named by how many
 * messages it holds, so a later one never overwrites an earlier one and the
 * largest is the whole day.
 */
async function archive(stale, signal) {
  const pathname = `${ARCHIVE_PREFIX}${stale.day}-${stale.messages.length}.json`;
  try {
    await put(pathname, JSON.stringify(stale.messages), {
      access: "private",
      contentType: "application/json",
      allowOverwrite: false,
      abortSignal: signal,
    });
  } catch (err) {
    // Another request filed the same messages first.
    if (await readJson(pathname, signal)) return;
    throw err;
  }
}

/**
 * The cap of one function instance: `perDay` messages stored in a Zurich day,
 * `perAddress` per address hash in that day, and at most `readsPerMinute`
 * reads of the store. Returns `store({ ipHash, nonce, stamp, row, signal })`,
 * which resolves "ok" when the message was stored, "sent" when a message with
 * this form token was stored before, "address" or "day" for the cap that is
 * full, and "busy" when the document kept changing under it or the instance
 * has read enough for this minute. It throws when the store itself fails or
 * `signal` aborts.
 *
 * A message without an address counts toward the day only. The document is
 * written only if it still has the etag it was read with, so two instances
 * can never both take the last slot: the slower one fails the condition,
 * reads again and sees the count. A write that landed but whose answer was
 * lost shows up on the next read as its own spent token, so it is never
 * counted twice.
 */
export function createCap({ perAddress, perDay, readsPerMinute, tokenMaxAgeMs }, now = () => Date.now()) {
  // The document as this instance last read or wrote it. Within its day a
  // count only grows and a spent token stays spent, so a refusal taken from
  // it is never wrong and costs no read. A pass is still checked against the
  // store, where other instances write too.
  let known = null;
  const reads = [];
  // One try at a time per instance: parallel requests on the same instance
  // never race each other's writes, and once the day is full the ones still
  // waiting are refused from memory.
  let queue = Promise.resolve();

  const refusal = (state, ipHash, nonce) => {
    if (nonce && Object.hasOwn(state.used, nonce)) return "sent";
    if (state.count >= perDay) return "day";
    if (ipHash && (state.addresses[ipHash] ?? 0) >= perAddress) return "address";
    return null;
  };

  async function take({ ipHash, nonce, stamp, row, signal }) {
    const mine = JSON.stringify(row);
    // Set once this request has sent a write: the client retries a write whose
    // answer was lost, and the retry fails its condition although the first
    // one landed. The message found in the document is then this request's
    // own, so it was stored by this request and still needs its mail.
    let wrote = false;
    const verdict = (state) => {
      const found = refusal(state, ipHash, nonce);
      if (found === "sent" && wrote && state.messages.some((m) => JSON.stringify(m) === mine)) {
        return "ok";
      }
      return found;
    };
    let createError = null;
    for (let attempt = 0; attempt < capAttempts(perDay); attempt += 1) {
      signal?.throwIfAborted();
      if (known) {
        const remembered = verdict(settle(known, now(), tokenMaxAgeMs));
        if (remembered) return remembered;
      }
      const start = now();
      while (reads.length && start - reads[0] >= MINUTE_MS) reads.shift();
      if (reads.length >= readsPerMinute) return "busy";
      reads.push(start);
      const current = await readJson(LIMITS_PATH, signal);
      // A create that failed while nothing exists was not a lost race.
      if (createError && !current) throw createError;
      createError = null;
      const state = settle(current?.value, now(), tokenMaxAgeMs);
      known = state;
      const full = verdict(state);
      if (full) return full;
      if (state.stale) await archive(state.stale, signal);
      const addresses = { ...state.addresses };
      if (ipHash) addresses[ipHash] = (addresses[ipHash] ?? 0) + 1;
      const used = { ...state.used };
      if (nonce) used[nonce] = stamp;
      const next = {
        day: state.day,
        count: state.count + 1,
        addresses,
        used,
        messages: [...state.messages, row],
      };
      const options = {
        access: "private",
        contentType: "application/json",
        cacheControlMaxAge: 60,
        abortSignal: signal,
      };
      wrote = true;
      try {
        if (current) {
          await put(LIMITS_PATH, JSON.stringify(next), { ...options, ifMatch: current.etag });
        } else {
          await put(LIMITS_PATH, JSON.stringify(next), { ...options, allowOverwrite: false });
        }
        known = next;
        return "ok";
      } catch (err) {
        if (err instanceof BlobPreconditionFailedError) continue;
        if (current) throw err;
        // Two first messages both found no document and both tried to create
        // it. The next read tells a lost race from a real error.
        createError = err;
      }
    }
    return "busy";
  }

  return (request) => {
    const turn = queue.then(() => take(request));
    queue = turn.catch(() => {});
    return turn;
  };
}
