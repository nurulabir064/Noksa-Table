import test from 'node:test';
import assert from 'node:assert/strict';
import handler from '../api/reservations.js';

const endpoint = 'https://noksa-table.example/api/reservations';

test('rejects unsupported HTTP methods', async () => {
  const response = await handler.fetch(new Request(endpoint, { method: 'GET' }));
  assert.equal(response.status, 405);
});

test('rejects requests without a same-origin browser origin', async () => {
  const response = await handler.fetch(new Request(endpoint, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({}),
  }));
  assert.equal(response.status, 403);
});

test('rejects cross-origin reservation requests', async () => {
  const response = await handler.fetch(new Request(endpoint, {
    method: 'POST',
    headers: {
      origin: 'https://attacker.example',
      'content-type': 'application/json',
    },
    body: JSON.stringify({}),
  }));
  assert.equal(response.status, 403);
});

test('requires JSON content type', async () => {
  const response = await handler.fetch(new Request(endpoint, {
    method: 'POST',
    headers: { origin: 'https://noksa-table.example', 'content-type': 'text/plain' },
    body: 'not json',
  }));
  assert.equal(response.status, 415);
});

test('rejects malformed JSON', async () => {
  const response = await handler.fetch(new Request(endpoint, {
    method: 'POST',
    headers: { origin: 'https://noksa-table.example', 'content-type': 'application/json' },
    body: '{invalid',
  }));
  assert.equal(response.status, 400);
});

test('requires privacy consent before reservation processing', async () => {
  const response = await handler.fetch(new Request(endpoint, {
    method: 'POST',
    headers: { origin: 'https://noksa-table.example', 'content-type': 'application/json' },
    body: JSON.stringify({}),
  }));
  assert.equal(response.status, 422);
});
