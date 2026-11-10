import { dishes } from '../src/data.js';

const app = await (await import('node:fs/promises')).readFile(new URL('../src/App.jsx', import.meta.url), 'utf8');
const gallerySection = app.slice(app.indexOf('function Gallery()'), app.indexOf('function getLocalDateValue()'));
const galleryIds = [...gallerySection.matchAll(/id:'(photo-[^']+)'/g)].map(([, id]) => id);
const imageUrls = [
  ...dishes.map(({ image }) => image),
  ...galleryIds.map(id => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=800&q=70`),
  'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=70',
  'https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=900&q=70',
  'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=900&q=70',
];
const uniqueUrls = [...new Set(imageUrls)];
const failures = [];
let nextIndex = 0;

async function checkImage(url) {
  let lastError;
  for (let attempt = 1; attempt <= 3; attempt += 1) {
    try {
      const response = await fetch(url, {
        method: 'HEAD',
        signal: AbortSignal.timeout(12000),
        headers: { 'User-Agent': 'NOKSHA-TABLE-image-audit/1.0' },
      });
      const contentType = response.headers.get('content-type') || '';
      if (!response.ok || !contentType.toLowerCase().startsWith('image/')) {
        throw new Error(`HTTP ${response.status}; content-type: ${contentType || 'missing'}`);
      }
      return;
    } catch (error) {
      lastError = error;
    }
  }
  failures.push({ url, reason: lastError instanceof Error ? lastError.message : String(lastError) });
}

async function worker() {
  while (nextIndex < uniqueUrls.length) {
    const url = uniqueUrls[nextIndex++];
    await checkImage(url);
  }
}

await Promise.all(Array.from({ length: 4 }, () => worker()));
console.log(`Checked ${uniqueUrls.length} unique remote image URLs.`);

if (failures.length) {
  for (const failure of failures) console.error(`FAILED ${failure.url}: ${failure.reason}`);
  process.exitCode = 1;
} else {
  console.log('All remote image URLs returned an image content type.');
}
