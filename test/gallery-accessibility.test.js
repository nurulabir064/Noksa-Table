import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const app = await readFile(new URL('../src/App.jsx', import.meta.url), 'utf8');
const styles = await readFile(new URL('../src/styles.css', import.meta.url), 'utf8');

test('gallery has a visible fallback for unavailable thumbnail and lightbox images', () => {
  assert.match(app, /gallery-item.*onError=/s);
  assert.match(app, /gallery-lightbox-panel[\s\S]*?onError=/);
  assert.match(app, /Photo unavailable — replace this demo image before launch/);
  assert.match(styles, /\.gallery-item\.image-missing \.image-fallback/);
  assert.match(styles, /\.gallery-lightbox-panel\.image-missing \.image-fallback/);
});

test('gallery dialog exposes modal semantics and a keyboard close control', () => {
  assert.match(app, /role="dialog" aria-modal="true"/);
  assert.match(app, /aria-label="Close image"/);
  assert.match(app, /event\.key==='Escape'/);
  assert.match(app, /triggerRef\.current\?\.focus\(\)/);
});

test('gallery thumbnails have descriptive alternative text and native button controls', () => {
  assert.match(app, /className="gallery-item"[^>]*aria-label=/);
  assert.match(app, /alt=\{image\.alt\}/);
});
