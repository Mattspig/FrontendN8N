# FrontendN8N — Vercel + n8n (polling approach)

What this contains
- index.html — static frontend that polls `/api/state` and updates the UI.
- api/update.js — Vercel serverless endpoint that accepts POSTs from n8n and forwards the payload to your Base44 DB.
- api/state.js — Vercel serverless endpoint that reads the latest record from Base44 and returns it to the frontend.

How it works (high level)
1. n8n (Gmail trigger) -> HTTP Request node -> POST JSON to `https://<your-vercel-domain>/api/update`
2. `/api/update` validates a secret header and forwards/stores the data into Base44 (EmailEvent entity).
3. Frontend polls `https://<your-vercel-domain>/api/state` every few seconds and updates the UI when new data is available.

Required Vercel environment variables
- BASE44_API_URL — Base44 REST endpoint base URL (example from user): https://app.base44.com/api/apps/693ef1794da4843a1e615bc2/entities
- BASE44_API_KEY — API key for Base44 (do not hardcode; add in Vercel env vars)
- BASE44_API_KEY_HEADER — name of the header to send the key in (default: api_key)
- N8N_WEBHOOK_SECRET — secret string set in your n8n HTTP Request header (x-n8n-webhook-secret)
- ALLOWED_ORIGIN — optional, allowed origin for requests (e.g., https://your-site.vercel.app)

n8n HTTP Request node example (send from Gmail trigger)
- Method: POST
- URL: https://<your-vercel-domain>/api/update
- Body: JSON
  {
    "event_type": "email_received",
    "thread_id": "{{$json[\"threadId\"]}}",
    "sender_email": "{{$json[\"from\"]}}",
    "subject": "{{$json[\"subject\"]}}",
    "snippet": "{{$json[\"textSnippet\"]}}",
    "intent": "detected intent",
    "action_taken": "...",
    "reply_text": "...",
    "label_applied": "..."
  }
- Headers:
  - Content-Type: application/json
  - x-n8n-webhook-secret: <your N8N_WEBHOOK_SECRET>

Notes
- The Base44 endpoints for this app are:
  - Read records: GET ${BASE44_API_URL}/EmailEvent
  - Write record: POST ${BASE44_API_URL}/EmailEvent
  - Update record: PUT ${BASE44_API_URL}/EmailEvent/<ENTITY_ID>
  - All requests must include header: api_key: ${BASE44_API_KEY}
- Vercel functions are stateless — this implementation relies on Base44 to store and return the latest state. If Base44 changes response shape, adjust api/state.js accordingly.
