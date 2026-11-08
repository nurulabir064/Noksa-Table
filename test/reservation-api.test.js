import test from 'node:test';
import assert from 'node:assert/strict';
import handler from '../api/reservations.js';

function createResponse() {
  return {
    statusCode: 200,
    headers: {},
    body: undefined,
    status(code) {
      this.statusCode = code;
      return this;
    },
    setHeader(name, value) {
      this.headers[name] = value;
    },
    json(value) {
      this.body = value;
      return this;
    },
  };
}

async function callHandler(overrides = {}) {
  const req = {
    method: 'POST',
    headers: {
      origin: 'https://noksa-table.example',
      host: 'noksa-table.example',
      'x-forwarded-proto': 'https',
      'content-type': 'application/json',
      'x-real-ip': '203.0.113.10',
    },
    body: {},
    ...overrides,
  };
  const res = createResponse();
  await handler(req, res);
  return res;
}

const validBody = {
  name: 'Test Customer',
  email: 'test@example.com',
  phone: '+8801712345678',
  date: '2099-01-01',
  time: '19:00',
  guestCount: 2,
  message: '',
  website: '',
  consent: true,
};

test('rejects unsupported HTTP methods', async () => {
  const response = await callHandler({ method: 'GET' });
  assert.equal(response.statusCode, 405);
  assert.equal(response.headers.Allow, 'POST');
});

test('rejects requests without a same-origin browser origin', async () => {
  const response = await callHandler({ headers: { 'content-type': 'application/json' } });
  assert.equal(response.statusCode, 403);
});

test('rejects cross-origin reservation requests', async () => {
  const response = await callHandler({
    headers: {
      origin: 'https://attacker.example',
      host: 'noksa-table.example',
      'x-forwarded-proto': 'https',
      'content-type': 'application/json',
    },
  });
  assert.equal(response.statusCode, 403);
});

test('requires JSON content type', async () => {
  const response = await callHandler({
    headers: {
      origin: 'https://noksa-table.example',
      host: 'noksa-table.example',
      'x-forwarded-proto': 'https',
      'content-type': 'text/plain',
    },
  });
  assert.equal(response.statusCode, 415);
});

test('rejects media types that only contain the words application/json', async () => {
  const response = await callHandler({
    headers: {
      origin: 'https://noksa-table.example',
      host: 'noksa-table.example',
      'x-forwarded-proto': 'https',
      'content-type': 'application/jsonp',
    },
  });
  assert.equal(response.statusCode, 415);
});

test('accepts JSON with a charset parameter', async () => {
  const response = await callHandler({
    headers: {
      origin: 'https://noksa-table.example',
      host: 'noksa-table.example',
      'x-forwarded-proto': 'https',
      'content-type': 'application/json; charset=utf-8',
    },
    body: { ...validBody, consent: false },
  });
  assert.equal(response.statusCode, 422);
});

test('rejects malformed JSON', async () => {
  const response = await callHandler({ body: '{invalid' });
  assert.equal(response.statusCode, 400);
});

test('requires privacy consent before reservation processing', async () => {
  const response = await callHandler({ body: { ...validBody, consent: false } });
  assert.equal(response.statusCode, 422);
});

test('keeps reservation processing disabled without explicit launch approval', async () => {
  const previous = process.env.RESERVATIONS_ENABLED;
  process.env.RESERVATIONS_ENABLED = 'false';
  try {
    const response = await callHandler({ body: validBody });
    assert.equal(response.statusCode, 503);
  } finally {
    if (previous === undefined) delete process.env.RESERVATIONS_ENABLED;
    else process.env.RESERVATIONS_ENABLED = previous;
  }
});

test('rejects oversized request bodies before field validation', async () => {
  const response = await callHandler({
    body: { ...validBody, message: 'x'.repeat(9 * 1024) },
  });
  assert.equal(response.statusCode, 413);
});

test('rejects arrays instead of JSON objects', async () => {
  const response = await callHandler({ body: [validBody] });
  assert.equal(response.statusCode, 400);
});

test('keeps reservation processing disabled when server configuration is incomplete', async () => {
  const keys = ['RESERVATIONS_ENABLED', 'DATABASE_URL', 'RATE_LIMIT_SECRET', 'PRIVACY_POLICY_URL'];
  const previous = Object.fromEntries(keys.map(key => [key, process.env[key]]));
  try {
    process.env.RESERVATIONS_ENABLED = 'true';
    delete process.env.DATABASE_URL;
    delete process.env.RATE_LIMIT_SECRET;
    delete process.env.PRIVACY_POLICY_URL;
    const response = await callHandler({ body: validBody });
    assert.equal(response.statusCode, 503);
  } finally {
    for (const key of keys) {
      if (previous[key] === undefined) delete process.env[key];
      else process.env[key] = previous[key];
    }
  }
});

test('requires a trusted client IP before accessing the database', async () => {
  const keys = ['RESERVATIONS_ENABLED', 'DATABASE_URL', 'RATE_LIMIT_SECRET', 'PRIVACY_POLICY_URL'];
  const previous = Object.fromEntries(keys.map(key => [key, process.env[key]]));
  try {
    process.env.RESERVATIONS_ENABLED = 'true';
    process.env.DATABASE_URL = 'postgres://placeholder.invalid/db';
    process.env.RATE_LIMIT_SECRET = 'test-secret';
    process.env.PRIVACY_POLICY_URL = 'https://example.com/privacy';
    const response = await callHandler({
      headers: {
        origin: 'https://noksa-table.example',
        host: 'noksa-table.example',
        'x-forwarded-proto': 'https',
        'content-type': 'application/json',
      },
      body: validBody,
    });
    assert.equal(response.statusCode, 400);
  } finally {
    for (const key of keys) {
      if (previous[key] === undefined) delete process.env[key];
      else process.env[key] = previous[key];
    }
  }
});
