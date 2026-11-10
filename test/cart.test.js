import test from 'node:test';
import assert from 'node:assert/strict';
import { getCartSummary, updateCartQuantity } from '../src/lib/cart.js';

const dishes = [
  { id: 'tea', name: 'Tea', price: 40 },
  { id: 'rice', name: 'Rice', price: 120 },
];

test('caps per-dish quantity at 99', () => {
  assert.deepEqual(updateCartQuantity({ tea: 99 }, 'tea', 1), { tea: 99 });
});

test('calculates totals from known dishes and valid quantities', () => {
  const summary = getCartSummary({ tea: 2, rice: 1, unknown: 4 }, dishes);
  assert.equal(summary.totalQuantity, 3);
  assert.equal(summary.subtotal, 200);
  assert.deepEqual(summary.items.map(item => item.lineTotal), [80, 120]);
});
