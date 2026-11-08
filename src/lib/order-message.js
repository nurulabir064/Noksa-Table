export function buildOrderMessage({ restaurantName, items, subtotal } = {}) {
  if (!Array.isArray(items) || items.length === 0) return '';
  if (!Number.isFinite(subtotal) || subtotal < 0) return '';

  const safeRestaurantName = typeof restaurantName === 'string' && restaurantName.trim()
    ? restaurantName.trim()
    : 'the restaurant';

  const lines = items.map(item => {
    if (!item || typeof item.name !== 'string' || !item.name.trim()) return null;
    if (!Number.isInteger(item.quantity) || item.quantity < 1) return null;
    if (!Number.isFinite(item.lineTotal) || item.lineTotal < 0) return null;
    return `• ${item.name.trim()} × ${item.quantity} — ৳${item.lineTotal}`;
  }).filter(Boolean);

  if (lines.length !== items.length) return '';

  return [
    `Hello ${safeRestaurantName}, I would like to place an order:`,
    '',
    ...lines,
    '',
    `Subtotal: ৳${subtotal}`,
    '',
    'Please confirm item availability, delivery or pickup details, final charges and payment options.'
  ].join('\n');
}
