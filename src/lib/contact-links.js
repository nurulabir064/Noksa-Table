function getDigits(value) {
  if (typeof value !== 'string') return ''
  let digits = value.replace(/\D/g, '')
  if (digits.startsWith('00')) digits = digits.slice(2)
  return digits
}

function normalizePhoneDigits(value) {
  let digits = getDigits(value)
  if (digits.length === 11 && digits.startsWith('0')) digits = '880' + digits.slice(1)
  if (digits.length === 10 && digits.startsWith('1')) digits = '880' + digits
  return digits
}

export function buildWhatsAppLink({ phone = '', message = '' } = {}) {
  const digits = normalizePhoneDigits(phone)
  if (!/^[1-9]\d{7,14}$/.test(digits)) return null

  const text = typeof message === 'string' ? message.trim() : ''
  return {
    href: 'https://wa.me/' + digits + (text ? '?text=' + encodeURIComponent(text) : ''),
    label: 'WhatsApp',
  }
}

export function buildContactLinks({ phone = '', email = '' } = {}) {
  const phoneDigits = normalizePhoneDigits(phone)
  const normalizedEmail = typeof email === 'string' ? email.trim() : ''
  const validPhone = phoneDigits.length >= 7 && phoneDigits.length <= 15
  const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail) && normalizedEmail.length <= 254

  return {
    phone: validPhone ? { href: 'tel:+' + phoneDigits, label: phone.trim() } : null,
    email: validEmail ? { href: 'mailto:' + normalizedEmail, label: normalizedEmail } : null,
    whatsapp: buildWhatsAppLink({ phone }),
  }
}

export function buildEmailLink({ email = '', subject = '', body = '' } = {}) {
  const normalizedEmail = typeof email === 'string' ? email.trim() : '';
  const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail) && normalizedEmail.length <= 254;
  if (!validEmail) return null;
  const params = new URLSearchParams();
  if (subject) params.set('subject', subject);
  if (body) params.set('body', body);
  const query = params.toString();
  return { href: 'mailto:' + normalizedEmail + (query ? '?' + query : ''), label: normalizedEmail };
}
