function getDigits(value) {
  if (typeof value !== 'string') return '';
  let digits = value.replace(/\D/g, '');
  if (digits.startsWith('00')) digits = digits.slice(2);
  return digits;
}

function getWhatsAppDigits(value) {
  const digits = getDigits(value);
  if (digits.length === 11 && digits.startsWith('0')) return '880' + digits.slice(1);
  if (digits.length === 13 && digits.startsWith('880')) return digits;
  if (digits.length >= 10 && digits.length <= 15) return digits;
  return '';
}

export function buildContactLinks({ phone = '', email = '', whatsapp = '' } = {}) {
  const rawPhoneDigits = getDigits(phone);
  const phoneDigits = rawPhoneDigits.length === 11 && rawPhoneDigits.startsWith('0')
    ? '88' + rawPhoneDigits.slice(1)
    : rawPhoneDigits;
  const normalizedEmail = typeof email === 'string' ? email.trim() : '';
  const whatsappDigits = getWhatsAppDigits(whatsapp);
  const validPhone = phoneDigits.length >= 7 && phoneDigits.length <= 15;
  const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail) && normalizedEmail.length <= 254;

  return {
    phone: validPhone ? { href: 'tel:+' + phoneDigits, label: phone.trim() } : null,
    email: validEmail ? { href: 'mailto:' + normalizedEmail, label: normalizedEmail } : null,
    whatsapp: whatsappDigits ? { href: 'https://wa.me/' + whatsappDigits, label: whatsapp.trim() } : null,
  };
}

export function buildWhatsAppLink({ phone = '', message = '' } = {}) {
  const digits = getWhatsAppDigits(phone);
  if (!digits || typeof message !== 'string' || !message.trim() || message.length > 4096) return null;
  return { href: 'https://wa.me/' + digits + '?text=' + encodeURIComponent(message), label: phone.trim() };
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
