import test from 'node:test'
import assert from 'node:assert/strict'
import { buildContactLinks } from '../src/lib/contact-links.js'

test('builds safe phone, WhatsApp and email links from verified public details', () => {
  const links = buildContactLinks({
    phone: '+880 1712-345678',
    whatsapp: '008801712345678',
    email: 'hello@example.com',
    message: 'Hello from the website',
  })
  assert.equal(links.phone.href, 'tel:+8801712345678')
  assert.match(links.whatsapp.href, /^https:\/\/wa\.me\/8801712345678\?text=/)
  assert.ok(links.whatsapp.href.endsWith('Hello%20from%20the%20website'))
  assert.equal(links.email.href, 'mailto:hello@example.com')
})

test('does not create links for missing or malformed contact data', () => {
  const links = buildContactLinks({ phone: 'abc', whatsapp: '123', email: 'not-an-email' })
  assert.equal(links.phone, null)
  assert.equal(links.whatsapp, null)
  assert.equal(links.email, null)
})

test('encodes user-facing WhatsApp message content', () => {
  const links = buildContactLinks({ whatsapp: '+8801712345678', message: 'Hi & hello?' })
  assert.ok(links.whatsapp.href.includes('text=Hi%20%26%20hello%3F'))
})
