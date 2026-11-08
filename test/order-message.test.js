import test from 'node:test';
import assert from 'node:assert/strict';
import { buildOrderMessage } from '../src/lib/order-message.js';

test('builds an email order message with item quantities and subtotal', () => {
  const message = buildOrderMessage({
    restaurantName: 'NOKSHA TABLE',
    items: [
      { name: 'Chicken Tikka', quantity: 2, lineTotal: 960 },
      { name: 'Blueberry Mojito Mocktail', quantity: 1, lineTotal: 120 },
    ],
    subtotal: 1080,
  });

  assert.match(message, /Chicken Tikka × 2 — ৳960/);
  assert.match(message, /Blueberry Mojito Mocktail × 1 — ৳120/);
  assert.match(message, /Estimated subtotal: ৳1080/);
  assert.match(message, /confirm item availability/);
});

test('does not create an order message for an empty cart', () => {
  assert.equal(buildOrderMessage({ items: [], subtotal: 0 }), '');
});

test('rejects malformed cart lines and invalid totals', () => {
  assert.equal(buildOrderMessage({
    items: [{ name: 'Dish', quantity: 0, lineTotal: 0 }],
    subtotal: 0,
  }), '');
  assert.equal(buildOrderMessage({
    items: [{ name: 'Dish', quantity: 1, lineTotal: 100 }],
    subtotal: -1,
  }), '');
});


test('includes customer contact, delivery address and special instructions in the order message', () => {
  const message = buildOrderMessage({
    restaurantName: 'NOKSHA TABLE',
    items: [{ name: 'Thai Basil Rice Combo', quantity: 2, lineTotal: 1380 }],
    subtotal: 1380,
    customer: {
      name: 'Abir',
      phone: '01304302201',
      fulfilment: 'delivery',
      address: 'Gulshan 2, Dhaka',
      notes: 'Less spicy, please',
    },
  });
  assert.match(message, /Customer: Abir/);
  assert.match(message, /Contact number: 01304302201/);
  assert.match(message, /Order method: Delivery/);
  assert.match(message, /Delivery address: Gulshan 2, Dhaka/);
  assert.match(message, /Special instructions: Less spicy, please/);
});

test('limits optional customer details and does not include a delivery address for pickup', () => {
  const message = buildOrderMessage({
    restaurantName: 'NOKSHA TABLE',
    items: [{ name: 'Chicken Pizza', quantity: 1, lineTotal: 550 }],
    subtotal: 550,
    customer: { name: 'A'.repeat(150), phone: '1'.repeat(60), fulfilment: 'pickup', address: 'Private address' },
  });
  assert.ok(message.includes('Customer: ' + 'A'.repeat(100)));
  assert.ok(message.includes('Contact number: ' + '1'.repeat(30)));
  assert.ok(message.includes('Order method: Pickup'));
  assert.ok(!message.includes('Delivery address:'));
});
