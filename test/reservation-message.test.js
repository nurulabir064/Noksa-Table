import test from 'node:test';
import assert from 'node:assert/strict';
import { buildReservationMessage } from '../src/lib/reservation-message.js';

test('builds a complete reservation request without claiming confirmation', () => {
  const message = buildReservationMessage({
    name: 'Guest One',
    email: 'guest@example.com',
    phone: '+880 1304 302201',
    date: '2026-12-01',
    time: '19:30',
    guestCount: '4',
    notes: 'Window seat if available',
  });

  assert.match(message, /Name: Guest One/);
  assert.match(message, /Preferred date: 2026-12-01/);
  assert.match(message, /Preferred time: 19:30/);
  assert.match(message, /Guests: 4/);
  assert.match(message, /not a confirmed booking/);
});

test('normalizes control characters and omits an empty optional note', () => {
  const message = buildReservationMessage({
    name: 'Guest\nTwo',
    email: 'guest@example.com',
    phone: '+8801304302201',
    date: '2026-12-02',
    time: '20:00',
    guestCount: '2',
    notes: '',
  });

  assert.match(message, /Name: Guest Two/);
  assert.doesNotMatch(message, /Additional notes:/);
  assert.equal(/[\u0000-\u001f\u007f]/.test(message), false);
});
