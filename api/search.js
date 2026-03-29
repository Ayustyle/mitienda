export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');

  const { q, category, sort, price_min, price_max, shipping_cost } = req.query;
  const SITE_ID = 'MLA'; // MLA=Argentina | MLM=México | MLC=Chile | MLB=Brasil

  let url = `https://api.mercadolibre.com/sites/${SITE_ID}/search?limit=48`;
  if (category)      url += `&category=${category}`;
  else if (q)        url += `&q=${encodeURIComponent(q)}`;
  if (sort)          url += `&sort=${sort}`;
  if (price_min)     url += `&price_min=${price_min}`;
  if (price_max)     url += `&price_max=${price_max}`;
  if (shipping_cost) url += `&shipping_cost=${shipping_cost}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: 'Error al conectar con Mercado Libre' });
  }
}
