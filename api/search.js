const APP_ID      = '7610211804320767';
const APP_SECRET  = 'dqgkV6MohBNr5a2JMrYyvT6bR98qXSMf';
const SITE_ID     = 'MLA'; // MLA=Argentina | MLM=México | MLC=Chile | MLB=Brasil

let cachedToken = null;
let tokenExpiry  = 0;

async function getToken() {
  if (cachedToken && Date.now() < tokenExpiry) return cachedToken;

  const res = await fetch('https://api.mercadolibre.com/oauth/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type:    'client_credentials',
      client_id:     APP_ID,
      client_secret: APP_SECRET,
    }),
  });

  const data = await res.json();
  cachedToken = data.access_token;
  tokenExpiry  = Date.now() + (data.expires_in - 60) * 1000;
  return cachedToken;
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');

  const { q, category, sort, price_min, price_max, shipping_cost } = req.query;

  let url = `https://api.mercadolibre.com/sites/${SITE_ID}/search?limit=48`;
  if (category)      url += `&category=${category}`;
  else if (q)        url += `&q=${encodeURIComponent(q)}`;
  if (sort)          url += `&sort=${sort}`;
  if (price_min)     url += `&price_min=${price_min}`;
  if (price_max)     url += `&price_max=${price_max}`;
  if (shipping_cost) url += `&shipping_cost=${shipping_cost}`;

  try {
    const token    = await getToken();
    const response = await fetch(url, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: 'Error al conectar con Mercado Libre', detail: error.message });
  }
}
