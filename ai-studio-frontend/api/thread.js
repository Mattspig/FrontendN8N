// ai-studio-frontend/api/thread.js

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const threadId = String(req.query.thread_id || '').trim();
  if (!threadId) {
    return res.status(400).json({ error: 'thread_id is required' });
  }

  const baseUrl = process.env.BASE44_API_URL;
  const key = process.env.BASE44_API_KEY;
  const keyHeader = process.env.BASE44_API_KEY_HEADER || 'api_key';

  if (!baseUrl) {
    return res.status(500).json({ error: 'BASE44_API_URL not configured' });
  }

  try {
    const url = `${baseUrl}/EmailEvent?thread_id=${encodeURIComponent(threadId)}`;

    const r = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...(key ? { [keyHeader]: key } : {}),
      },
      cache: 'no-store',
    });

    if (!r.ok) {
      return res.status(r.status).send(await r.text());
    }

    const json = await r.json();

    // Normalize to array
    let events = Array.isArray(json) ? json : (json.items ?? json.data ?? [json]);

    // Optional cleanup: trim sender_email
    events = events.map((item) => ({
      ...item,
      sender_email: (item.sender_email || '').trim(),
    }));

    // Sort oldest -> newest (thread order)
    events = events
      .filter(Boolean)
      .sort(
        (a, b) =>
          new Date(a.updated_date || a.created_date || 0).getTime() -
          new Date(b.updated_date || b.created_date || 0).getTime()
      );

    return res.status(200).json({ events });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
