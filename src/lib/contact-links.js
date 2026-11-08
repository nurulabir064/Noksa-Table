function getDigits(value) {
  if (typeof value !== 'string') return ''
  let digits = value.replace(/\D/g, '')
  if (digits.startsWith('00')) digits = digits.slice(2)
  return digits
}

export function buildContactLinks({ phone = '', email = '' } = {}) {
  const phoneDigits = getDigits(phone)
  const normalizedEmail = typeof email === 'string' ? email.trim() : ''
  const validPhone = phoneDigits.length >= 7 && phoneDigits.length <= 15
  const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail) && normalizedEmail.length <= 254

  return {
    phone: validPhone ? { href: 'tel:+' + phoneDigits, label: phone.trim() } : null,
    email: validEmail ? { href: 'mailto:' + normalizedEmail, label: normalizedEmail } : null,
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
