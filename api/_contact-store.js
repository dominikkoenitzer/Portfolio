import { randomUUID } from "node:crypto";
import { BlobPreconditionFailedError, get, put } from "@vercel/blob";

/**
 * Where the contact form keeps its messages and its caps: a private Vercel
 * Blob store. The underscore keeps this file from becoming a route.
 *
 * Every write is a put, which the Hobby plan counts as an advanced operation
 * (2,000 a month), and every read here is a simple one (10,000 a month). An
 * accepted message costs one read and two or three puts: the cap, the message
 * and, once the mail is out, the message again with `notified_at`. A refusal
 * the instance already knows of costs nothing, any other refusal the read
 * alone. Bots caught by the honeypot or the form token never reach this file.
 */

const HOUR_MS = 60 * 60 * 1000;
const MINUTE_MS = 60 * 1000;

// Each lost write means another request took a slot, and at most `perDay` of
// those can happen in a day, so every request settles within perDay + 1 tries.
export const CAP_ATTEMPTS = 12;

// One document holds both caps: the count of stored messages for the current
// day in Zurich, and for each address hash the times it sent in the last hour.
// Every write keeps only what is still inside its window, so nothing expired
// is left behind to delete, and the hour of an address runs on across
// midnight while the day count starts over.
const LIMITS_PATH = "contact/limits/day.json";

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
async function readJson(pathname) {
  const found = await get(pathname, { access: "private", useCache: false });
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

/** The cap document as it stands at `at`: today's count and the last hour. */
function settle(value, at) {
  const kept = value && typeof value === "object" ? value : {};
  const day = zurichDay.format(at);
  const count =
    kept.day === day && Number.isInteger(kept.count) && kept.count > 0 ? kept.count : 0;
  const addresses = {};
  const seen = kept.addresses && typeof kept.addresses === "object" ? kept.addresses : {};
  for (const [hash, list] of Object.entries(seen)) {
    const times = (Array.isArray(list) ? list : []).filter(
      (t) => Number.isFinite(t) && t <= at && at - t < HOUR_MS,
    );
    if (times.length) addresses[hash] = times;
  }
  return { day, count, addresses };
}

/**
 * The cap of one function instance: `perDay` messages stored in a Zurich day,
 * `perAddress` per address hash in an hour, and at most `readsPerMinute`
 * reads of the store. Returns `takeSlot(ipHash)`, which resolves "ok" when a
 * slot was taken, "address" or "day" for the cap that is full, and "busy"
 * when the document kept changing under it or the instance has read enough
 * for this minute. It throws when the store itself fails.
 *
 * A message without an address counts toward the day only. The document is
 * written only if it still has the etag it was read with, so two instances
 * can never both take the last slot: the slower one fails the condition,
 * reads again and sees the count.
 */
export function createCap({ perAddress, perDay, readsPerMinute }, now = Date.now) {
  // The document as this instance last read or wrote it. Within its day a
  // count only grows, and a time only leaves the hour as the clock moves, so
  // a refusal taken from it is never wrong and costs no read. A pass is still
  // checked against the store, where other instances write too.
  let known = null;
  const reads = [];
  // One try at a time per instance: parallel requests on the same instance
  // never race each other's writes, and once the day is full the ones still
  // waiting are refused from memory.
  let queue = Promise.resolve();

  const refusal = (state, ipHash) => {
    if (state.count >= perDay) return "day";
    if (ipHash && (state.addresses[ipHash]?.length ?? 0) >= perAddress) return "address";
    return null;
  };

  async function take(ipHash) {
    let createError = null;
    for (let attempt = 0; attempt < CAP_ATTEMPTS; attempt += 1) {
      if (known) {
        const remembered = refusal(settle(known, now()), ipHash);
        if (remembered) return remembered;
      }
      const start = now();
      while (reads.length && start - reads[0] >= MINUTE_MS) reads.shift();
      if (reads.length >= readsPerMinute) return "busy";
      reads.push(start);
      const current = await readJson(LIMITS_PATH);
      // A create that failed while nothing exists was not a lost race.
      if (createError && !current) throw createError;
      createError = null;
      const at = now();
      const state = settle(current?.value, at);
      known = state;
      const full = refusal(state, ipHash);
      if (full) return full;
      const addresses = { ...state.addresses };
      if (ipHash) addresses[ipHash] = [...(addresses[ipHash] ?? []), at];
      const next = { day: state.day, count: state.count + 1, addresses };
      const options = {
        access: "private",
        contentType: "application/json",
        cacheControlMaxAge: 60,
      };
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

  return (ipHash) => {
    const turn = queue.then(() => take(ipHash));
    queue = turn.catch(() => {});
    return turn;
  };
}

/** Stores one message under a name of its own and returns that name. */
export async function saveMessage(record) {
  const stamp = record.created_at.replace(/[:.]/g, "-");
  const pathname = `contact/messages/${stamp}-${randomUUID().slice(0, 8)}.json`;
  await put(pathname, JSON.stringify(record), {
    access: "private",
    contentType: "application/json",
    allowOverwrite: false,
  });
  return pathname;
}

/** Writes the stored message again with the time its mail went out. */
export async function markNotified(pathname, record) {
  await put(
    pathname,
    JSON.stringify({ ...record, notified_at: new Date().toISOString() }),
    { access: "private", contentType: "application/json", allowOverwrite: true },
  );
}
