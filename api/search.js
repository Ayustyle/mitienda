export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');

  const { q, category, sort, price_min, price_max, shipping_cost } = req.query;
  const SITE_ID = 'MLA';

  let url = `https://api.mercadolibre.com/sites/${SITE_ID}/search?limit=48`;
  if (category)      url += `&category=${category}`;
  else if (q)        url += `&q=${encodeURIComponent(q)}`;
  if (sort)          url += `&sort=${sort}`;
  if (price_min)     url += `&price_min=${price_min}`;
  if (price_max)     url += `&price_max=${price_max}`;
  if (shipping_cost) url += `&shipping_cost=${shipping_cost}`;

  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'application/json',
        'Accept-Language': 'es-AR,es;q=0.9',
        'Referer': 'https://www.mercadolibre.com.ar/',
        'Origin': 'https://www.mercadolibre.com.ar',
      }
    });

    const data = await response.json();

    if (data.status === 403 || data.error === 'forbidden') {
      const res2  = await fetch(url);
      const data2 = await res2.json();
      return res.status(200).json(data2);
    }

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
