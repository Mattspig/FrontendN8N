// /api/thread.js
export default async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });

  const threadId = req.query.id || req.query.thread_id;
if (!threadId) {
  return res.status(400).json({ error: "thread_id is required" });
}
  const baseUrl = process.env.BASE44_API_URL; // .../entities
  const key = process.env.BASE44_API_KEY;
  const keyHeader = process.env.BASE44_API_KEY_HEADER || "api_key";

  if (!baseUrl) return res.status(500).json({ error: "BASE44_API_URL not configured" });

  try {
    // Try server-side filtering first (Base44 docs say thread_id is filterable)
    const url = `${baseUrl}/EmailEvent?thread_id=${encodeURIComponent(threadId)}`;

    const r = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        ...(key ? { [keyHeader]: key } : {}),
      },
      cache: "no-store",
    });

    if (!r.ok) {
      const text = await r.text();
      return res.status(r.status).send(text);
    }

    const json = await r.json();

    // normalize to array
    let items = [];
    if (Array.isArray(json)) items = json;
    else if (Array.isArray(json.items)) items = json.items;
    else if (Array.isArray(json.data)) items = json.data;
    else if (json) items = [json];

    // If Base44 ignored the filter param, fallback: filter locally
    items = items.filter((x) => String(x.thread_id) === String(threadId));

    // sort oldest -> newest
    items.sort((a, b) => {
      const ta = new Date(a.created_date || a.updated_at || 0).getTime();
      const tb = new Date(b.created_date || b.updated_at || 0).getTime();
      return ta - tb;
    });

    return res.status(200).json({ events: items });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
}
