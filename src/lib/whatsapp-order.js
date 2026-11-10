export function buildWhatsAppOrderMessage({
  restaurantName,
  items,
  subtotal,
  fulfilment = 'pickup',
  customerName = '',
  customerPhone = '',
  deliveryAddress = '',
  orderNote = '',
} = {}) {
  if (!Array.isArray(items) || items.length === 0) return '';
  if (!Number.isSafeInteger(subtotal) || subtotal < 0) return '';
  if (!['pickup', 'delivery'].includes(fulfilment)) return '';

  const safeRestaurantName = typeof restaurantName === 'string' && restaurantName.trim()
    ? restaurantName.trim().slice(0, 100)
    : 'the restaurant';
  const safeName = typeof customerName === 'string' ? customerName.trim() : '';
  const safePhone = typeof customerPhone === 'string' ? customerPhone.trim() : '';
  const safeAddress = typeof deliveryAddress === 'string' ? deliveryAddress.trim() : '';
  const safeNote = typeof orderNote === 'string' ? orderNote.trim().slice(0, 500) : '';

  if (safeName.length < 2 || safeName.length > 80) return '';
  if (!/^[+0-9()\\s-]{7,20}$/.test(safePhone)) return '';
  if (fulfilment === 'delivery' && (safeAddress.length < 8 || safeAddress.length > 300)) return '';

  const lines = items.map(item => {
    if (!item || typeof item.name !== 'string' || !item.name.trim()) return null;
    if (!Number.isSafeInteger(item.quantity) || item.quantity < 1 || item.quantity > 99) return null;
    if (!Number.isSafeInteger(item.lineTotal) || item.lineTotal < 0) return null;
    return `• ${item.name.trim().slice(0, 120)} × ${item.quantity} — ৳${item.lineTotal}`;
  }).filter(Boolean);

  if (lines.length !== items.length) return '';

  const fulfilmentLine = fulfilment === 'delivery'
    ? ['Fulfilment: DELIVERY REQUEST (not confirmed)', `Requested address: ${safeAddress}`]
    : ['Fulfilment: PICKUP REQUEST (not confirmed)'];

  return [
    `Hello ${safeRestaurantName}, I would like to request the following order:`,
    '',
    ...lines,
    '',
    `Food subtotal: ৳${subtotal}`,
    ...fulfilmentLine,
    `Customer name: ${safeName}`,
    `Customer contact: ${safePhone}`,
    ...(safeNote ? [`Special instructions: ${safeNote}`] : []),
    '',
    'Please confirm item availability, whether this delivery area is served or pickup arrangements, any delivery fee, estimated preparation/delivery time, final total and payment options. This message is a request, not an accepted or confirmed order.',
  ].join('\\n');
}
