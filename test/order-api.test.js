import test from 'node:test';
import assert from 'node:assert/strict';
import handler from '../api/orders/prepare.js';

function createRequest({ method = 'POST', body, headers = {} } = {}) {
  return {
    method,
    body,
    headers: {
      origin: 'https://noksa-table.vercel.app',
      host: 'noksa-table.vercel.app',
      'content-type': 'application/json',
      ...headers,
    },
  };
}

function createResponse() {
  return {
    statusCode: 200,
    headers: {},
    payload: null,
    setHeader(name, value) { this.headers[name] = value; },
    status(code) { this.statusCode = code; return this; },
    json(payload) { this.payload = payload; return this; },
  };
}

const validBody = {
  items: [{ id: 'thai-rice-combo', quantity: 2 }, { id: 'strawberry-mojito', quantity: 1 }],
  customer: {
    name: 'Abir',
    phone: '01304302201',
    fulfilment: 'delivery',
    address: 'Gulshan 2, Dhaka',
    notes: 'Less spicy',
  },
};

async function call(body = validBody, options = {}) {
  const req = createRequest({ body, ...options });
  const res = createResponse();
  await handler(req, res);
  return { req, res };
}

test('prepares a WhatsApp-ready order using server-owned menu prices', async () => {
  const { res } = await call({ ...validBody, subtotal: 1 });
  assert.equal(res.statusCode, 200);
  assert.equal(res.payload.subtotal, 1640);
  assert.match(res.payload.message, /Thai Basil Rice Combo × 2 — ৳1380/);
  assert.match(res.payload.message, /Strawberry Mojito Mocktail × 1 — ৳250/);
  assert.match(res.payload.message, /Subtotal: ৳1630/);
  assert.match(res.payload.message, /Order reference:/);
  assert.equal(res.payload.deliveryStatus, 'not_sent');
  assert.equal(res.headers['Cache-Control'], 'no-store');
});

test('rejects unknown menu items', async () => {
  const { res } = await call({ ...validBody, items: [{ id: 'not-a-real-dish', quantity: 1 }] });
  assert.equal(res.statusCode, 400);
});

test('rejects duplicate item IDs and invalid quantities', async () => {
  const duplicate = await call({ ...validBody, items: [{ id: 'thai-rice-combo', quantity: 1 }, { id: 'thai-rice-combo', quantity: 2 }] });
  const quantity = await call({ ...validBody, items: [{ id: 'thai-rice-combo', quantity: 21 }] });
  assert.equal(duplicate.res.statusCode, 400);
  assert.equal(quantity.res.statusCode, 400);
});

test('requires a valid customer name and contact number', async () => {
  const name = await call({ ...validBody, customer: { ...validBody.customer, name: 'A' } });
  const phone = await call({ ...validBody, customer: { ...validBody.customer, phone: 'abc' } });
  assert.equal(name.res.statusCode, 400);
  assert.equal(phone.res.statusCode, 400);
});

test('requires a delivery address only when delivery is selected', async () => {
  const delivery = await call({ ...validBody, customer: { ...validBody.customer, address: '' } });
  const pickup = await call({ ...validBody, customer: { ...validBody.customer, fulfilment: 'pickup', address: '' } });
  assert.equal(delivery.res.statusCode, 400);
  assert.equal(pickup.res.statusCode, 200);
});

test('rejects unsupported methods and cross-origin requests', async () => {
  const method = await call(validBody, { method: 'GET' });
  const origin = await call(validBody, { headers: { origin: 'https://attacker.example' } });
  assert.equal(method.res.statusCode, 405);
  assert.equal(method.res.headers.Allow, 'POST');
  assert.equal(origin.res.statusCode, 403);
});

test('requires the exact JSON media type', async () => {
  const { res } = await call(validBody, { headers: { 'content-type': 'application/jsonp' } });
  assert.equal(res.statusCode, 415);
});

test('rejects oversized request bodies', async () => {
  const { res } = await call(validBody, { headers: { 'content-length': '9000' } });
  assert.equal(res.statusCode, 413);
});

test('does not claim that the WhatsApp message was sent', async () => {
  const { res } = await call();
  assert.equal(res.payload.deliveryStatus, 'not_sent');
});
