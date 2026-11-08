import test from 'node:test';
import assert from 'node:assert/strict';
import { buildReservationMessage } from '../src/lib/reservation-message.js';

test('builds a complete reservation request message with customer and booking details', () => {
  const message = buildReservationMessage({
    restaurantName: 'NOKSHA TABLE',
    name: 'Abir',
    phone: '01304302201',
    email: '',
    date: '2026-12-12',
    time: '19:30',
    guestCount: '4',
    notes: 'Window seat if available',
  });

  assert.match(message, /NOKSHA TABLE/);
  assert.match(message, /Name: Abir/);
  assert.match(message, /Phone: 01304302201/);
  assert.doesNotMatch(message, /Email:/);
  assert.match(message, /Date: 2026-12-12/);
  assert.match(message, /Preferred time: 19:30/);
  assert.match(message, /Guests: 4/);
  assert.match(message, /Notes: Window seat if available/);
  assert.match(message, /not a confirmed booking/);
});

test('trims and limits user-provided reservation fields', () => {
  const message = buildReservationMessage({
    restaurantName: 'N'.repeat(120),
    name: 'A'.repeat(150),
    phone: '1'.repeat(40),
    email: 'a'.repeat(300),
    date: '2026-12-12',
    time: '19:30',
    guestCount: '12',
    notes: 'x'.repeat(1200),
  });

  assert.ok(message.includes('N'.repeat(100)));
  assert.ok(message.includes('A'.repeat(80)));
  assert.ok(message.includes('1'.repeat(25)));
  assert.ok(message.includes('x'.repeat(1000)));
});
