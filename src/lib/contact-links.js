function getDigits(value) {
  if (typeof value !== 'string') return ''
  let digits = value.replace(/\\D/g, '')
  if (digits.startsWith('00')) digits = digits.slice(2)
  return digits
}

export function buildContactLinks({ phone = '', whatsapp = '', email = '', message = '' } = {}) {
  const phoneDigits = getDigits(phone)
  const whatsappDigits = getDigits(whatsapp)
  const normalizedEmail = typeof email === 'string' ? email.trim() : ''
  const validPhone = phoneDigits.length >= 7 && phoneDigits.length <= 15
  const validWhatsApp = whatsappDigits.length >= 8 && whatsappDigits.length <= 15
  const validEmail = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(normalizedEmail) && normalizedEmail.length <= 254

  return {
    phone: validPhone ? { href: `tel:+${phoneDigits}`, label: phone.trim() } : null,
    whatsapp: validWhatsApp
      ? { href: `https://wa.me/${whatsappDigits}?text=${encodeURIComponent(message)}`, label: 'WhatsApp' }
      : null,
    email: validEmail ? { href: `mailto:${normalizedEmail}`, label: normalizedEmail } : null,
  }
}
