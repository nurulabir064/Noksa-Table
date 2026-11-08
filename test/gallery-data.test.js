import test from 'node:test';
import assert from 'node:assert/strict';
import { galleryImages } from '../src/gallery-data.js';

test('gallery contains 25 unique source-backed photographs', () => {
  assert.equal(galleryImages.length, 25);
  assert.equal(new Set(galleryImages.map(image => image.src)).size, 25);

  for (const image of galleryImages) {
    assert.ok(image.src.startsWith('https://'));
    assert.ok(image.alt.length > 10);
    assert.ok(['Food', 'Drinks', 'Dessert', 'Interior'].includes(image.kind));
    assert.ok(image.credit?.name);
    assert.ok(image.credit?.url.startsWith('https://'));
    assert.ok(image.credit?.license);
    assert.ok(image.credit?.licenseUrl.startsWith('https://'));
  }
});

test('gallery includes the requested strawberry mocktail, Thai basil combo and Bangladesh favourites', () => {
  const searchable = galleryImages.map(image => image.alt.toLowerCase()).join(' ');
  assert.match(searchable, /strawberry/);
  assert.match(searchable, /thai basil/);
  assert.match(searchable, /kacchi/);
  assert.match(searchable, /chicken chap/);
  assert.match(searchable, /paratha/);
});

test('gallery includes food, drinks, desserts and restaurant interiors', () => {
  const kinds = new Set(galleryImages.map(image => image.kind));
  for (const kind of ['Food', 'Drinks', 'Dessert', 'Interior']) {
    assert.ok(kinds.has(kind), 'missing gallery category: ' + kind);
  }
});
