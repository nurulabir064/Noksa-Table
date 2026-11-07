import test from 'node:test'
import assert from 'node:assert/strict'
import { buildWhatsAppOrderLink } from '../src/lib/order-links.js'

test('creates an order enquiry with quantity and calculated total', () => {
  const url = buildWhatsAppOrderLink({ name: 'Chicken Tikka', price: 480 }, '+8801304302201', 3)
  const parsed = new URL(url)
  const message = parsed.searchParams.get('text')
  assert.equal(parsed.origin + parsed.pathname, 'https://wa.me/8801304302201')
  assert.match(message, /Chicken Tikka/)
  assert.match(message, /Quantity: 3/)
  assert.match(message, /Estimated item total: ৳1440/)
})

test('rejects missing dish details, invalid quantities and malformed phone numbers', () => {
  assert.equal(buildWhatsAppOrderLink(null, '+8801304302201'), null)
  assert.equal(buildWhatsAppOrderLink({ name: 'Dish', price: -1 }, '+8801304302201'), null)
  assert.equal(buildWhatsAppOrderLink({ name: 'Dish', price: 10 }, '+8801304302201', 0), null)
  assert.equal(buildWhatsAppOrderLink({ name: 'Dish', price: 10 }, '+8801304302201', 100), null)
  assert.equal(buildWhatsAppOrderLink({ name: 'Dish', price: 10 }, 'not-a-number'), null)
})
