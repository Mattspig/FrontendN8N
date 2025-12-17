export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const threadId = String(req.query.thread_id || '').trim();
  if (!threadId) return res.status(400).json({ error: 'thread_id is required' });

  const baseUrl = process.env.BASE44_API_URL;
  const key = process.env.BASE44_API_KEY;
  const keyHeader = process.env.BASE44_API_KEY_HEADER || 'api_key';

  try {
    const url = `${baseUrl}/EmailEvent?thread_id=${encodeURIComponent(threadId)}`;

    const r = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...(key ? { [keyHeader]: key } : {}),
      },
      cache: 'no-store',
    });

    if (!r.ok) return res.status(r.status).send(await r.text());

    const json = await r.json();

    // normalize to array
    let events = Array.isArray(json) ? json : (json.items ?? json.data ?? [json]);

    // sort oldest -> newest
    events = events
      .filter(Boolean)
      .sort((a, b) => new Date(a.updated_at || a.created_date || 0) - new Date(b.updated_at || b.created_date || 0));

    return res.status(200).json({ events });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
