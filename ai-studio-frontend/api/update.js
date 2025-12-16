// Vercel serverless function: receives POSTs from n8n and forwards to Base44 (EmailEvent entity)
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  // Validate secret header
  const expected = process.env.N8N_WEBHOOK_SECRET;
  const provided = req.headers['x-n8n-webhook-secret'];
  if (expected && provided !== expected) {
    res.status(403).json({ error: 'Invalid secret' });
    return;
  }

  // Optional origin check
  const allowedOrigin = process.env.ALLOWED_ORIGIN;
  if (allowedOrigin && req.headers.origin && req.headers.origin !== allowedOrigin) {
    res.status(403).json({ error: 'Origin not allowed' });
    return;
  }

  const payload = req.body;

  const baseUrl = process.env.BASE44_API_URL; // expected like https://app.base44.com/api/apps/{appId}/entities
  const key = process.env.BASE44_API_KEY;
  const keyHeader = process.env.BASE44_API_KEY_HEADER || 'api_key';

  if (!baseUrl) {
    res.status(500).json({ error: 'BASE44_API_URL not configured' });
    return;
  }

  try {
    const target = `${baseUrl}/EmailEvent`;

    const forwardResp = await fetch(target, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(key ? { [keyHeader]: key } : {})
      },
      body: JSON.stringify(payload)
    });

    const text = await forwardResp.text();
    if (!forwardResp.ok) {
      res.status(forwardResp.status).send(text);
      return;
    }

    res.status(200).json({ success: true, result: JSON.parse(text || '{}') });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
}
