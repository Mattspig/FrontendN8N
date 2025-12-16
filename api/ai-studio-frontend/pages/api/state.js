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

    // Adapt to Base44 response shape: pick the most recent item.
    let item = null;
    if (Array.isArray(json)) {
      // assume API returns array of items
      item = json[0] || null;
    } else if (json.items && Array.isArray(json.items)) {
      item = json.items[0] || null;
    } else if (json.data && Array.isArray(json.data)) {
      item = json.data[0] || null;
    } else if (json[0]) {
      item = json[0];
    } else if (typeof json === 'object') {
      // if the API returns a single object, use it
      item = json;
    }

    if (!item) {
      res.status(404).json({ error: 'No data' });
      return;
    }

    if (!item.updated_at && !item.created_at) {
      item.updated_at = new Date().toISOString();
    }

    res.status(200).json(item);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
}
