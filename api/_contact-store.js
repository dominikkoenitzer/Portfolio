import { randomUUID } from "node:crypto";
import { BlobPreconditionFailedError, get, put } from "@vercel/blob";

/**
 * Where the contact form keeps its messages and its per-address cap: a private
 * Vercel Blob store. The underscore keeps this file from becoming a route.
 *
 * Every write is a put, which the Hobby plan counts as an advanced operation
 * (2,000 a month), and every read here is a simple one (10,000 a month). An
 * accepted message costs one read and two or three puts: the cap, the message
 * and, once the mail is out, the message again with `notified_at`. A refused
 * one costs the read alone. Bots caught by the honeypot or the fill time never
 * reach this file.
 */

const HOUR_MS = 60 * 60 * 1000;

// Each lost write means another request took a slot, and at most `max` of
// those can happen inside one hour, so a request that is fair to everyone
// settles in max + 1 tries. Eight leaves room without letting a stuck read
// loop for long.
export const CAP_ATTEMPTS = 8;

const capPath = (ipHash) => `contact/limits/${ipHash}.json`;

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

/**
 * Takes one of the `max` slots an address has per hour. The slots live in one
 * small document per address hash, holding the times of the messages it sent
 * in the last hour. The new list is written only if the document still has
 * the etag it was read with, so two requests can never both take the last
 * slot: the slower one fails the condition, reads again and sees the count.
 *
 * Resolves true when a slot was taken and false when the hour is full. Throws
 * when the store itself fails, which the caller lets through on purpose.
 */
export async function takeSlot(ipHash, max, now = Date.now) {
  const pathname = capPath(ipHash);
  let createError = null;
  for (let attempt = 0; attempt < CAP_ATTEMPTS; attempt += 1) {
    const current = await readJson(pathname);
    // A create that failed while nothing exists was not a lost race.
    if (createError && !current) throw createError;
    createError = null;
    const at = now();
    const times = (Array.isArray(current?.value?.times) ? current.value.times : []).filter(
      (t) => Number.isFinite(t) && t <= at && at - t < HOUR_MS,
    );
    if (times.length >= max) return false;
    const body = JSON.stringify({ times: [...times, at] });
    const options = {
      access: "private",
      contentType: "application/json",
      cacheControlMaxAge: 60,
    };
    try {
      if (current) {
        await put(pathname, body, { ...options, ifMatch: current.etag });
      } else {
        await put(pathname, body, { ...options, allowOverwrite: false });
      }
      return true;
    } catch (err) {
      if (err instanceof BlobPreconditionFailedError) continue;
      if (current) throw err;
      // Two first messages from one address both found no document and both
      // tried to create it. The next read tells a lost race from a real error.
      createError = err;
    }
  }
  // Only a flood from one address keeps changing the document this often.
  return false;
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
