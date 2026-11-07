export function buildWhatsAppOrderLink(dish, whatsappNumber) {
  if (!dish || typeof dish.name !== 'string' || !dish.name.trim()) return null
  if (!Number.isInteger(dish.price) || dish.price < 0) return null
  if (typeof whatsappNumber !== 'string') return null

  const digits = whatsappNumber.replace(/\D/g, '')
  if (digits.length < 8 || digits.length > 15) return null

  const message = [
    'Hello NOKSHA TABLE, I would like to enquire about ordering:',
    dish.name.trim(),
    'Sample menu price: ৳' + dish.price,
    'Please confirm availability and the current price.',
  ].join('\n')

  return 'https://wa.me/' + digits + '?text=' + encodeURIComponent(message)
}
