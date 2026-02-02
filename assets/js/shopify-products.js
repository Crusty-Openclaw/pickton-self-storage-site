async function fetchJson(url) {
  const res = await fetch(url, { cache: 'no-store' });
  if (!res.ok) throw new Error(`Fetch failed ${res.status}: ${url}`);
  return await res.json();
}

function moneyFromCents(cents) {
  if (typeof cents !== 'number') return '';
  return `$${(cents / 100).toFixed(2)}`;
}

function el(tag, attrs = {}, children = []) {
  const n = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (k === 'class') n.className = v;
    else if (k === 'text') n.textContent = v;
    else n.setAttribute(k, v);
  }
  for (const c of children) n.appendChild(c);
  return n;
}

function productCard(p) {
  const v = (p.variants && p.variants[0]) || {};
  const price = v.price ? `$${v.price}` : '';
  const img = (p.images && p.images[0] && p.images[0].src) || '';
  const href = `https://pickton-storage.myshopify.com/products/${p.handle}`;

  return el('a', { class: 'prodCard', href, target: '_blank', rel: 'noopener' }, [
    el('div', { class: 'prodImgWrap' }, [
      img ? el('img', { class: 'prodImg', src: img, alt: p.title || 'Product', loading: 'lazy' }) : el('div', { class: 'prodImgPh', text: 'Product' })
    ]),
    el('div', { class: 'prodMeta' }, [
      el('div', { class: 'prodTitle', text: p.title || 'Product' }),
      el('div', { class: 'prodPrice', text: price })
    ])
  ]);
}

async function renderCollection(sectionId, collectionHandle) {
  const root = document.getElementById(sectionId);
  if (!root) return;

  const grid = root.querySelector('[data-grid]');
  const status = root.querySelector('[data-status]');
  if (!grid || !status) return;

  status.textContent = 'Loading…';
  try {
    const url = `https://pickton-storage.myshopify.com/collections/${collectionHandle}/products.json?limit=8`;
    const data = await fetchJson(url);
    const products = (data && data.products) || [];

    grid.innerHTML = '';
    if (products.length === 0) {
      status.textContent = 'No products yet.';
      return;
    }

    for (const p of products) grid.appendChild(productCard(p));
    status.textContent = '';
  } catch (e) {
    status.textContent = 'Could not load products.';
  }
}

document.addEventListener('DOMContentLoaded', () => {
  // These are Shopify collection handles you gave.
  renderCollection('shop-stickers', 'stickers');
  renderCollection('shop-drinkware', 'liquid-containers');
  renderCollection('shop-shirts', 'shirts-for-your-back');
  // Hats currently using frontpage.
  renderCollection('shop-hats', 'frontpage');
});
