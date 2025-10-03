// File: api/subdomains.js

export default async function handler(req, res) {
  const { domain } = req.query;
  if (!domain) return res.status(400).json({ error: "Domain is required" });

  try {
    // --- Try SecurityTrails first ---
    try {
      const stResponse = await fetch(
        `https://api.securitytrails.com/v1/domain/${domain}/subdomains`,
        { headers: { "apikey": process.env.SECURITYTRAILS_API_KEY } }
      );

      if (stResponse.ok) {
        const data = await stResponse.json();
        const subdomains = data.subdomains?.map(s => `${s}.${domain}`) || [];
        if (subdomains.length > 0) {
          return res.status(200).json({ subdomains });
        }
      }
    } catch (err) {
      // Ignore SecurityTrails errors, move to fallback
    }

    // --- Fallback: crt.sh ---
    const crtResponse = await fetch(`https://crt.sh/?q=%25.${domain}&output=json`);

    if (crtResponse.ok) {
      const crtData = await crtResponse.json();

      // Extract and clean subdomains
      const subdomains = [...new Set(
        crtData
          .map(entry => entry.name_value)   // get "name_value" field
          .join("\n")                       // join into one string
          .split("\n")                      // split by newlines
          .map(s => s.trim())               // clean spaces
          .filter(s => s.endsWith(domain))  // only keep valid subdomains
      )];

      if (subdomains.length > 0) {
        return res.status(200).json({ subdomains });
      }
    }

    res.status(404).json({ error: "No subdomains found" });

  } catch (err) {
    res.status(500).json({ error: "Error fetching subdomains", details: err.message });
  }
}
