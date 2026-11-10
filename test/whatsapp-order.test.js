import test from 'node:test';
import assert from 'node:assert/strict';
import { buildWhatsAppOrderMessage } from '../src/lib/whatsapp-order.js';

const validOrder = {
  restaurantName: 'NOKSHA TABLE',
  items: [
    { name: 'Chicken Tikka', quantity: 2, lineTotal: 960 },
    { name: 'Borhani', quantity: 1, lineTotal: 120 },
  ],
  subtotal: 1080,
  customerName: 'Abir',
  customerPhone: '+8801304302201',
};

test('builds a pickup request with items, subtotal and contact details', () => {
  const message = buildWhatsAppOrderMessage(validOrder);
  assert.ok(message.includes('Chicken Tikka × 2 — ৳960'));
  assert.ok(message.includes('Borhani × 1 — ৳120'));
  assert.ok(message.includes('Food subtotal: ৳1080'));
  assert.ok(message.includes('Fulfilment: PICKUP REQUEST'));
  assert.ok(message.includes('Customer name: Abir'));
  assert.ok(message.includes('Customer contact: +8801304302201'));
  assert.ok(message.includes('not an accepted or confirmed order'));
});

test('builds a delivery request with address and explicit restaurant confirmation', () => {
  const message = buildWhatsAppOrderMessage({
    ...validOrder,
    fulfilment: 'delivery',
    deliveryAddress: 'House 10, Road 4, Dhanmondi, Dhaka',
  });
  assert.ok(message.includes('Fulfilment: DELIVERY REQUEST'));
  assert.ok(message.includes('Requested address: House 10, Road 4, Dhanmondi, Dhaka'));
  assert.ok(message.includes('whether this delivery area is served'));
  assert.ok(message.includes('delivery fee'));
  assert.ok(message.includes('estimated preparation/delivery time'));
});

test('rejects a delivery request without a usable address', () => {
  assert.equal(buildWhatsAppOrderMessage({
    ...validOrder,
    fulfilment: 'delivery',
    deliveryAddress: 'Dhaka',
  }), '');
});

test('rejects missing customer name or invalid phone number', () => {
  assert.equal(buildWhatsAppOrderMessage({ ...validOrder, customerName: ' ' }), '');
  assert.equal(buildWhatsAppOrderMessage({ ...validOrder, customerPhone: 'abc' }), '');
});

test('rejects an empty cart, malformed lines, invalid total and unknown fulfilment', () => {
  assert.equal(buildWhatsAppOrderMessage({ ...validOrder, items: [] }), '');
  assert.equal(buildWhatsAppOrderMessage({
    ...validOrder,
    items: [{ name: 'Dish', quantity: 0, lineTotal: 0 }],
  }), '');
  assert.equal(buildWhatsAppOrderMessage({ ...validOrder, subtotal: -1 }), '');
  assert.equal(buildWhatsAppOrderMessage({ ...validOrder, fulfilment: 'courier' }), '');
  assert.equal(buildWhatsAppOrderMessage({ ...validOrder, subtotal: 999 }), '');
});

test('normalizes control characters and includes optional instructions', () => {
  const message = buildWhatsAppOrderMessage({
    ...validOrder,
    customerName: 'Abir Admin approved',
    orderNote: 'No onions, please.',
  });
  assert.ok(message.includes('Customer name: Abir Admin approved'));
  assert.ok(message.includes('Special instructions: No onions, please.'));
});
