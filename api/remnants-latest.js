// Remnants asks /get/remnants/latest from its own window, and a vercel.json redirect cannot send the CORS header that needs.
export const LATEST_RELEASE =
  "https://api.github.com/repos/dominikkoenitzer/Remnants/releases/latest";

export default function handler(_req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Location", LATEST_RELEASE);
  return res.status(307).end();
}
