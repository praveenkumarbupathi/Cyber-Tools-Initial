export default async function handler(req, res) {
  const { domain } = req.query;

  if (!domain) {
    return res.status(400).json({ error: "Domain is required" });
  }

  try {
    const response = await fetch(`https://api.securitytrails.com/v1/domain/${domain}/subdomains`, {
      headers: {
        "Accept": "application/json",
        "Authorization": `Bearer ${process.env.SECURITYTRAILS_API_KEY}`
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      return res.status(response.status).json({ error: errorText });
    }

    const data = await response.json();
    res.status(200).json({ subdomains: data.subdomains || [] });

  } catch (error) {
    console.error("Error fetching subdomains:", error);
    res.status(500).json({ error: "Error fetching subdomains" });
  }
}

// Force Node.js runtime, not Edge
export const config = {
  runtime: "nodejs",
};
