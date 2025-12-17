// Vercel serverless function: returns the latest EmailEvent record from Base44 for the frontend to poll
export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const baseUrl = process.env.BASE44_API_URL; // e.g. https://app.base44.com/api/apps/.../entities
  const key = process.env.BASE44_API_KEY;
  const keyHeader = process.env.BASE44_API_KEY_HEADER || 'api_key';

  if (!baseUrl) {
    res.status(500).json({ error: 'BASE44_API_URL not configured' });
    return;
  }

  try {
    const url = `${baseUrl}/EmailEvent`;

    const r = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...(key ? { [keyHeader]: key } : {})
      }
    });

    if (r.status === 404) {
      res.status(404).json({ error: 'No data' });
      return;
    }

    if (!r.ok) {
      const text = await r.text();
      res.status(r.status).send(text);
      return;
    }

    const json = await r.json();
    console.log('Base44 raw response:', json);

    // Adapt to Base44 response shape: pick the most recent item.
   // Normalize Base44 response to an array
let events = [];

if (Array.isArray(json)) {
  events = json;
} else if (json.items && Array.isArray(json.items)) {
  events = json.items;
} else if (json.data && Array.isArray(json.data)) {
  events = json.data;
} else if (json[0]) {
  events = json;
} else if (typeof json === 'object') {
  events = [json];
}

// Sort newest first (optional but recommended)
events.sort((a, b) => {
  const ta = new Date(a.updated_date || a.created_date || 0).getTime();
  const tb = new Date(b.updated_date || b.created_date || 0).getTime();
  return tb - ta;
});

// Limit to last 50 to keep frontend fast
events = events.slice(0, 50);

// ✅ Return ALL events
res.status(200).json({ events });
    item.sender_email = (item.sender_email || '').trim();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
}
