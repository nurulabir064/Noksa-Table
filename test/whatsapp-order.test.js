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
  assert.match(message, /Chicken Tikka × 2 — ৳960/);
  assert.match(message, /Borhani × 1 — ৳120/);
  assert.match(message, /Food subtotal: ৳1080/);
  assert.match(message, /Fulfilment: PICKUP REQUEST/);
  assert.match(message, /Customer name: Abir/);
  assert.match(message, /Customer contact: \\+8801304302201/);
  assert.match(message, /not an accepted or confirmed order/);
});

test('builds a delivery request with address and explicit restaurant confirmation', () => {
  const message = buildWhatsAppOrderMessage({
    ...validOrder,
    fulfilment: 'delivery',
    deliveryAddress: 'House 10, Road 4, Dhanmondi, Dhaka',
  });
  assert.match(message, /Fulfilment: DELIVERY REQUEST/);
  assert.match(message, /Requested address: House 10, Road 4, Dhanmondi, Dhaka/);
  assert.match(message, /whether this delivery area is served/);
  assert.match(message, /delivery fee/);
  assert.match(message, /estimated preparation\\/delivery time/);
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
});

test('includes optional special instructions safely', () => {
  const message = buildWhatsAppOrderMessage({ ...validOrder, orderNote: 'No onions, please.' });
  assert.match(message, /Special instructions: No onions, please\\./);
});
