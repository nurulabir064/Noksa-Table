export function buildWhatsAppOrderLink(dish, whatsappNumber, quantity = 1) {
  if (!dish || typeof dish.name !== 'string' || !dish.name.trim()) return null
  if (!Number.isInteger(dish.price) || dish.price < 0) return null
  if (!Number.isInteger(quantity) || quantity < 1 || quantity > 99) return null
  if (typeof whatsappNumber !== 'string') return null

  const digits = whatsappNumber.replace(/\D/g, '')
  if (digits.length < 8 || digits.length > 15) return null

  const total = dish.price * quantity
  const message = [
    'Hello NOKSHA TABLE, I would like to enquire about this order:',
    'Item: ' + dish.name.trim(),
    'Unit sample price: ৳' + dish.price,
    'Quantity: ' + quantity,
    'Estimated item total: ৳' + total,
    'Please confirm availability and the current price.',
  ].join('\n')

  return 'https://wa.me/' + digits + '?text=' + encodeURIComponent(message)
}
