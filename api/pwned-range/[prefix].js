export default async function handler(req, res) {
  const { prefix } = req.query;
  if (!prefix || prefix.length !== 5) return res.status(400).send("Invalid prefix");
  try {
    const r = await fetch(`https://api.pwnedpasswords.com/range/${prefix}`);
    const text = await r.text();
    res.setHeader("Access-Control-Allow-Origin","*");
    res.status(200).send(text);
  } catch(e) {
    res.status(500).send("Error fetching");
  }
}
