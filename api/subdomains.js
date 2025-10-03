// File: api/subdomains.js

export default async function handler(req, res) {
  const { domain } = req.query;
  if (!domain) return res.status(400).json({ error: "Domain is required" });

  try {
    // Try SecurityTrails first
    const stResponse = await fetch(
      `https://api.securitytrails.com/v1/domain/${domain}/subdomains`,
      { headers: { "apikey": process.env.SECURITYTRAILS_API_KEY } }
    );

    if (stResponse.ok) {
      const data = await stResponse.json();
      const subdomains = data.subdomains?.map(s => `${s}.${domain}`) || [];
      return res.status(200).json({ subdomains });
    }

    // 🔄 Fallback: crt.sh (certificate transparency logs)
    const crtResponse = await fetch(
      `https://crt.sh/?q=%25.${domain}&output=json`
    );
    if (crtResponse.ok) {
      const crtData = await crtResponse.json();
      const subdomains = [...new Set(
        crtData.map(entry => entry.name_value)
          .join("\n")
          .split("\n")
          .filter(name => name.includes(domain))
      )];
      return res.status(200).json({ subdomains });
    }

    res.status(500).json({ error: "No subdomains found" });

  } catch (err) {
    res.status(500).json({ error: "Error fetching subdomains", details: err.message });
  }
}
