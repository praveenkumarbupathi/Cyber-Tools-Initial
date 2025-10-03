// api/subdomains.js

export default async function handler(req, res) {
  // Allow all origins (CORS)
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const { domain } = req.query;
  if (!domain) {
    return res.status(400).json({ error: 'No domain provided' });
  }

  try {
    // SecurityTrails API endpoint
    const apiKey = 'CGhKdvKOe0125ifVRcMG7xL3B2iVHBfX'; // replace with Vercel env variable for production!
    const url = `https://api.securitytrails.com/v1/domain/${domain}/subdomains`;

    const response = await fetch(url, {
      headers: {
        'APIKEY': apiKey,
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      const text = await response.text();
      console.error('SecurityTrails fetch error:', text);
      return res.status(500).json({ error: 'Error fetching from SecurityTrails' });
    }

    const data = await response.json();

    // SecurityTrails returns subdomains as array
    const subdomains = (data.subdomains || []).map(sub => `${sub}.${domain}`);

    res.status(200).json(subdomains);

  } catch (err) {
    console.error('Server error:', err);
    res.status(500).json({ error: 'Error fetching' });
  }
}


