import test from 'node:test';
import assert from 'node:assert/strict';
import { buildContactLinks, buildEmailLink, buildWhatsAppLink } from '../src/lib/contact-links.js';

test('builds safe phone and email links from public contact details', () => {
  const links = buildContactLinks({
    phone: '+880 1712-345678',
    email: 'hello@example.com',
  });
  assert.equal(links.phone.href, 'tel:+8801712345678');
  assert.equal(links.email.href, 'mailto:hello@example.com');
});

test('does not create links for missing or malformed contact data', () => {
  const links = buildContactLinks({ phone: 'abc', email: 'not-an-email' });
  assert.equal(links.phone, null);
  assert.equal(links.email, null);
});

test('builds an encoded email draft and rejects invalid addresses', () => {
  const link = buildEmailLink({ email: 'nurulabir064@gmail.com', subject: 'Order enquiry', body: 'Chicken fried rice & Thai soup' });
  assert.ok(link.href.startsWith('mailto:nurulabir064@gmail.com?'));
  assert.ok(link.href.includes('subject=Order+enquiry'));
  assert.ok(link.href.includes('body=Chicken+fried+rice+%26+Thai+soup'));
  assert.equal(buildEmailLink({ email: 'not-an-email' }), null);
});


test('builds a Bangladesh WhatsApp click-to-chat link with a prefilled message', () => {
  const link = buildWhatsAppLink({
    phone: '01304302201',
    message: 'Order: Chicken Pizza × 1 & Thai Basil Rice × 2',
  });
  assert.ok(link);
  assert.ok(link.href.startsWith('https://wa.me/8801304302201?text='));
  assert.ok(decodeURIComponent(link.href.split('?text=')[1]).includes('Thai Basil Rice × 2'));
});

test('normalizes an international WhatsApp number and rejects missing or invalid numbers', () => {
  assert.equal(buildWhatsAppLink({ phone: '+880 1304-302201' }).href, 'https://wa.me/8801304302201');
  assert.equal(buildWhatsAppLink({ phone: '' }), null);
  assert.equal(buildWhatsAppLink({ phone: 'not a number' }), null);
});


test('normalizes a Bangladesh local phone number for direct calling', () => {
  const links = buildContactLinks({ phone: '01304302201' });
  assert.equal(links.phone.href, 'tel:+8801304302201');
  assert.equal(links.whatsapp.href, 'https://wa.me/8801304302201');
});
