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
  const cleanText = value => typeof value === 'string'
    ? value.replace(/[\u0000-\u001f\u007f]/g, ' ').replace(/\s+/g, ' ').trim()
    : '';
  const safeName = cleanText(customerName);
  const safePhone = cleanText(customerPhone);
  const safeAddress = cleanText(deliveryAddress);
  const safeNote = cleanText(orderNote).slice(0, 500);

  if (safeName.length < 2 || safeName.length > 80) return '';
  const phoneDigits = safePhone.replace(/\D/g, '');
  if (!/^[+0-9()\s-]{7,20}$/.test(safePhone) || phoneDigits.length < 7 || phoneDigits.length > 15) return '';
  if (fulfilment === 'delivery' && (safeAddress.length < 8 || safeAddress.length > 300)) return '';

  const lines = items.map(item => {
    if (!item || typeof item.name !== 'string' || !item.name.trim()) return null;
    if (!Number.isSafeInteger(item.quantity) || item.quantity < 1 || item.quantity > 99) return null;
    if (!Number.isSafeInteger(item.lineTotal) || item.lineTotal < 0) return null;
    return '• ' + safeItemName + ' × ' + item.quantity + ' — ৳' + item.lineTotal;
  }).filter(Boolean);

  if (lines.length !== items.length) return '';
  if (items.reduce((total, item) => total + item.lineTotal, 0) !== subtotal) return '';

  const fulfilmentLine = fulfilment === 'delivery'
    ? ['Fulfilment: DELIVERY REQUEST (not confirmed)', 'Requested address: ' + safeAddress]
    : ['Fulfilment: PICKUP REQUEST (not confirmed)'];

  return [
    'Hello ' + safeRestaurantName + ', I would like to request the following order:',
    '',
    ...lines,
    '',
    'Food subtotal: ৳' + subtotal,
    ...fulfilmentLine,
    'Customer name: ' + safeName,
    'Customer contact: ' + safePhone,
    ...(safeNote ? ['Special instructions: ' + safeNote] : []),
    '',
    'Please confirm item availability, whether this delivery area is served or pickup arrangements, any delivery fee, estimated preparation/delivery time, final total and payment options. This message is a request, not an accepted or confirmed order.',
  ].join('\n');
}
