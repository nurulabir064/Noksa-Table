import test from 'node:test';
import assert from 'node:assert/strict';
import { buildWhatsAppOrderMessage } from '../src/lib/whatsapp-order.js';

test('builds a WhatsApp order message with item quantities and subtotal', () => {
  const message = buildWhatsAppOrderMessage({
    restaurantName: 'NOKSHA TABLE',
    items: [
      { name: 'Chicken Tikka', quantity: 2, lineTotal: 960 },
      { name: 'Borhani', quantity: 1, lineTotal: 120 },
    ],
    subtotal: 1080,
  });

  assert.match(message, /Chicken Tikka × 2 — ৳960/);
  assert.match(message, /Borhani × 1 — ৳120/);
  assert.match(message, /Subtotal: ৳1080/);
  assert.match(message, /confirm item availability/);
});

test('does not create an order message for an empty cart', () => {
  assert.equal(buildWhatsAppOrderMessage({ items: [], subtotal: 0 }), '');
});

test('rejects malformed cart lines and invalid totals', () => {
  assert.equal(buildWhatsAppOrderMessage({
    items: [{ name: 'Dish', quantity: 0, lineTotal: 0 }],
    subtotal: 0,
  }), '');
  assert.equal(buildWhatsAppOrderMessage({
    items: [{ name: 'Dish', quantity: 1, lineTotal: 100 }],
    subtotal: -1,
  }), '');
});
