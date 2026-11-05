import test from 'node:test';
import assert from 'node:assert/strict';
import { getDhakaToday, validateReservation } from '../api/_lib/reservation-validation.js';

const validReservation = {
  name: 'Abir Islam',
  email: 'abir@example.com',
  phone: '+880 1712-345678',
  date: '2027-01-15',
  time: '19:30',
  guestCount: '2',
  message: 'Window-side table if available.',
};

test('accepts valid reservation details and normalizes values', () => {
  const result = validateReservation(validReservation, '2027-01-01');
  assert.equal(result.success, true);
  assert.equal(result.data.email, 'abir@example.com');
  assert.equal(result.data.guestCount, 2);
  assert.equal(result.data.name, 'Abir Islam');
});

test('rejects missing and malformed customer details', () => {
  const result = validateReservation({}, '2027-01-01');
  assert.equal(result.success, false);
  for (const field of ['name', 'email', 'phone', 'date', 'time', 'guestCount']) {
    assert.ok(result.errors[field], `expected an error for ${field}`);
  }
});

test('rejects impossible dates and dates before today', () => {
  assert.ok(validateReservation({ ...validReservation, date: '2027-02-30' }, '2027-01-01').errors.date);
  assert.ok(validateReservation({ ...validReservation, date: '2026-12-31' }, '2027-01-01').errors.date);
});

test('rejects invalid time and guest counts', () => {
  assert.ok(validateReservation({ ...validReservation, time: '25:90' }, '2027-01-01').errors.time);
  assert.ok(validateReservation({ ...validReservation, guestCount: 7 }, '2027-01-01').errors.guestCount);
});

test('rejects overlong messages and filled honeypot fields', () => {
  assert.ok(validateReservation({ ...validReservation, message: 'x'.repeat(1001) }, '2027-01-01').errors.message);
  assert.ok(validateReservation({ ...validReservation, website: 'spam' }, '2027-01-01').errors.website);
});

test('uses the Dhaka calendar date rather than the server timezone', () => {
  const instant = new Date('2027-01-01T19:00:00.000Z');
  assert.equal(getDhakaToday(instant), '2027-01-02');
});

test('rejects a time that has already passed today in Dhaka', () => {
  const past = validateReservation({ ...validReservation, date: '2027-01-01', time: '17:59' }, '2027-01-01', '18:00');
  const current = validateReservation({ ...validReservation, date: '2027-01-01', time: '18:00' }, '2027-01-01', '18:00');
  assert.ok(past.errors.time);
  assert.equal(current.success, true);
});
