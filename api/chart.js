export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Use POST' });
  }

  const apiKey = process.env.FREEASTROAPI_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'Server is missing FREEASTROAPI_KEY — set it in Vercel project settings.' });
  }

  try {
    const upstream = await fetch('https://api.freeastroapi.com/api/v1/natal/calculate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey
      },
      body: JSON.stringify(req.body)
    });

    const data = await upstream.text();
    res.status(upstream.status).send(data);
  } catch (err) {
    res.status(500).json({ error: 'Relay failed', detail: err.message });
  }
}
