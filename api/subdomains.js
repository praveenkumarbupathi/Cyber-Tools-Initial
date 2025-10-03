export default async function handler(req, res) {
  const { domain } = req.query;
  const apiKey = process.env.SECURITYTRAILS_API_KEY;

  if (!domain) return res.status(400).json({ error: "Domain required" });

  try {
    const response = await fetch(
      `https://api.securitytrails.com/v1/domain/${domain}/subdomains?children_only=false`,
      {
        headers: { "APIKEY": apiKey }
      }
    );
    if (!response.ok) throw new Error(`API error ${response.status}`);
    const data = await response.json();
    res.status(200).json(data.subdomains || []);
  } catch (err) {
    console.error("Subdomain error:", err);
    res.status(500).json({ error: "Error fetching subdomains" });
  }
}
