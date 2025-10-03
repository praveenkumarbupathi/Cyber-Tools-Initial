// File: api/subdomains.js

export default async function handler(req, res) {
  const { domain } = req.query;

  if (!domain) {
    return res.status(400).json({ error: "Domain is required" });
  }

  // Hardcoded API key (for testing only)
  const SECURITYTRAILS_API_KEY = "CGhKdvKOe0125ifVRcMG7xL3B2iVHBfX";

  try {
    const response = await fetch(
      `https://api.securitytrails.com/v1/domain/${domain}/subdomains`,
      {
        headers: {
          "Accept": "application/json",
          "apikey": SECURITYTRAILS_API_KEY,
        },
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      return res
        .status(response.status)
        .json({ error: `SecurityTrails API error: ${errorText}` });
    }

    const data = await response.json();

    // SecurityTrails returns { subdomains: [ ... ] }
    const subdomains = data.subdomains?.map((sub) => `${sub}.${domain}`) || [];

    res.status(200).json({ subdomains });
  } catch (error) {
    res.status(500).json({ error: "Error fetching subdomains", details: error.message });
  }
}
