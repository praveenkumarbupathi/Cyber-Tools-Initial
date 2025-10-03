export default async function handler(req, res) {
  const { domain } = req.query;
  if (!domain) return res.status(400).json({error:"Domain required"});
  try {
    const r = await fetch(`https://crt.sh/?q=%25.${domain}&output=json`);
    const data = await r.json();
    const subs = [...new Set(data.flatMap(d => (d.name_value||"").split("\n").map(s=>s.trim())).filter(Boolean))];
    res.setHeader("Access-Control-Allow-Origin","*");
    res.status(200).json(subs);
  } catch(e) {
    res.status(500).json({error:"Error fetching"});
  }
}
