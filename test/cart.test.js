import test from 'node:test';
import assert from 'node:assert/strict';
import { getCartSummary, updateCartQuantity } from '../src/lib/cart.js';

const dishes = [
  { id: 'tea', name: 'Tea', price: 40 },
  { id: 'rice', name: 'Rice', price: 120 },
];

test('adds and removes quantities without mutating the original cart', () => {
  const original = {};
  const added = updateCartQuantity(original, 'tea', 2);
  assert.deepEqual(original, {});
  assert.deepEqual(added, { tea: 2 });
  assert.deepEqual(updateCartQuantity(added, 'tea', -1), { tea: 1 });
  assert.deepEqual(updateCartQuantity(added, 'tea', -2), {});
});

test('caps a dish quantity at 99 and ignores invalid changes', () => {
  assert.deepEqual(updateCartQuantity({ tea: 99 }, 'tea', 1), { tea: 99 });
  assert.deepEqual(updateCartQuantity({ tea: 2 }, 'tea', 0.5), { tea: 2 });
});

test('calculates item totals and subtotal from known dishes only', () => {
  const summary = getCartSummary({ tea: 2, rice: 1, unknown: 5 }, dishes);
  assert.equal(summary.totalQuantity, 3);
  assert.equal(summary.subtotal, 200);
  assert.deepEqual(summary.items.map(item => item.lineTotal), [80, 120]);
});

test('ignores invalid and non-positive cart quantities', () => {
  const summary = getCartSummary({ tea: -1, rice: 1.5 }, dishes);
  assert.equal(summary.totalQuantity, 0);
  assert.equal(summary.subtotal, 0);
  assert.deepEqual(summary.items, []);
});
