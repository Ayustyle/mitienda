const SCRAPER_KEY = '5e7ae315f2ae33a27728629506ed5350';
const SITE_ID     = 'MLA';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');

  const { q, category, sort, price_min, price_max, shipping_cost } = req.query;

  let mlUrl = `https://api.mercadolibre.com/sites/${SITE_ID}/search?limit=48`;
  if (category)      mlUrl += `&category=${category}`;
  else if (q)        mlUrl += `&q=${encodeURIComponent(q)}`;
  if (sort)          mlUrl += `&sort=${sort}`;
  if (price_min)     mlUrl += `&price_min=${price_min}`;
  if (price_max)     mlUrl += `&price_max=${price_max}`;
  if (shipping_cost) mlUrl += `&shipping_cost=${shipping_cost}`;

  const scraperUrl = `https://api.scraperapi.com?api_key=${SCRAPER_KEY}&url=${encodeURIComponent(mlUrl)}&render=false`;

  try {
    const response = await fetch(scraperUrl);
    const text = await response.text();

    // Si ScraperAPI devuelve error de texto, lo reportamos
    if (!text.startsWith('{') && !text.startsWith('[')) {
      return res.status(502).json({ error: 'ScraperAPI error', detail: text.slice(0, 200) });
    }

    const data = JSON.parse(text);
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
