import test from 'node:test';
import assert from 'node:assert/strict';
import { buildOrderMessage } from '../src/lib/order-message.js';

const validOrder = {
  restaurantName: 'NOKSHA TABLE',
  items: [
    { name: 'Chicken Tikka', quantity: 2, lineTotal: 960 },
    { name: 'Blueberry Mojito Mocktail', quantity: 1, lineTotal: 120 },
  ],
  subtotal: 1080,
  customerName: 'Abir',
  customerPhone: '+8801304302201',
};

test('builds a pickup request with item quantities and subtotal', () => {
  const message = buildOrderMessage(validOrder);
  assert.ok(message.includes('Chicken Tikka × 2 — ৳960'));
  assert.ok(message.includes('Blueberry Mojito Mocktail × 1 — ৳120'));
  assert.ok(message.includes('Food subtotal: ৳1080'));
  assert.ok(message.includes('Fulfilment: PICKUP REQUEST'));
  assert.ok(message.includes('Customer name: Abir'));
  assert.ok(message.includes('not an accepted or confirmed order'));
});

test('builds a delivery request and requires a complete address', () => {
  const message = buildOrderMessage({
    ...validOrder,
    fulfilment: 'delivery',
    deliveryAddress: 'House 10, Road 4, Dhanmondi, Dhaka',
  });
  assert.ok(message.includes('Fulfilment: DELIVERY REQUEST'));
  assert.ok(message.includes('Requested address: House 10, Road 4, Dhanmondi, Dhaka'));
  assert.ok(message.includes('delivery fee'));
  assert.ok(message.includes('estimated preparation/delivery time'));
  assert.equal(buildOrderMessage({
    ...validOrder,
    fulfilment: 'delivery',
    deliveryAddress: 'Dhaka',
  }), '');
});

test('rejects empty carts, invalid contacts, unsupported fulfilment and mismatched totals', () => {
  assert.equal(buildOrderMessage({ ...validOrder, items: [] }), '');
  assert.equal(buildOrderMessage({ ...validOrder, customerName: ' ' }), '');
  assert.equal(buildOrderMessage({ ...validOrder, customerPhone: 'abc' }), '');
  assert.equal(buildOrderMessage({ ...validOrder, fulfilment: 'courier' }), '');
  assert.equal(buildOrderMessage({ ...validOrder, subtotal: 999 }), '');
  assert.equal(buildOrderMessage({
    ...validOrder,
    items: [{ name: 'Dish', quantity: 0, lineTotal: 0 }],
    subtotal: 0,
  }), '');
});

test('normalizes control characters in customer-provided text', () => {
  const message = buildOrderMessage({
    ...validOrder,
    customerName: 'Abir Admin approved',
    orderNote: 'No onions, please.',
  });
  assert.ok(message.includes('Customer name: Abir Admin approved'));
  assert.ok(message.includes('Special instructions: No onions, please.'));
});

test('does not create an order message for an empty cart', () => {
  assert.equal(buildOrderMessage({ items: [], subtotal: 0 }), '');
});
