import test from 'node:test';
import assert from 'node:assert/strict';
import { galleryImages } from '../src/gallery-data.js';

test('gallery uses unique HTTPS photography with complete source and license records', () => {
  assert.ok(galleryImages.length >= 20);
  const urls = galleryImages.map(image => image.src);
  assert.equal(new Set(urls).size, urls.length);

  for (const image of galleryImages) {
    assert.ok(image.src.startsWith('https://'));
    assert.ok(image.alt.trim().length > 0);
    assert.ok(['Food', 'Drinks', 'Dessert', 'Interior'].includes(image.kind));
    assert.ok(image.credit?.name);
    assert.ok(image.credit.url.startsWith('https://'));
    assert.ok(image.credit.license);
    assert.ok(image.credit.licenseUrl.startsWith('https://'));
  }
});

test('gallery includes strawberry mocktail and Thai basil rice combo photography', () => {
  assert.ok(galleryImages.some(image => /strawberry.*mocktail|mocktail.*strawberry/i.test(image.alt)));
  assert.ok(galleryImages.some(image => /thai basil chicken with rice/i.test(image.alt)));
  assert.ok(galleryImages.some(image => image.kind === 'Drinks'));
  assert.ok(galleryImages.some(image => image.kind === 'Food'));
});
