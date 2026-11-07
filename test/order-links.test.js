import test from 'node:test'
import assert from 'node:assert/strict'
import { buildWhatsAppOrderLink } from '../src/lib/order-links.js'

test('creates a WhatsApp order enquiry with the dish name and price', () => {
  const url = buildWhatsAppOrderLink({ name: 'Chicken Tikka', price: 480 }, '+8801304302201')
  const parsed = new URL(url)
  assert.equal(parsed.origin + parsed.pathname, 'https://wa.me/8801304302201')
  assert.match(decodeURIComponent(parsed.searchParams.get('text')), /Chicken Tikka/)
  assert.match(decodeURIComponent(parsed.searchParams.get('text')), /৳480/)
})

test('rejects missing dish details and malformed phone numbers', () => {
  assert.equal(buildWhatsAppOrderLink(null, '+8801304302201'), null)
  assert.equal(buildWhatsAppOrderLink({ name: 'Dish', price: -1 }, '+8801304302201'), null)
  assert.equal(buildWhatsAppOrderLink({ name: 'Dish', price: 10 }, 'not-a-number'), null)
})
