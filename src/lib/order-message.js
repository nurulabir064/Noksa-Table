export function buildOrderMessage({ restaurantName, items, subtotal, customer = {} } = {}) {
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

  const safeCustomer = {
    name: typeof customer.name === 'string' ? customer.name.trim().slice(0, 100) : '',
    phone: typeof customer.phone === 'string' ? customer.phone.trim().slice(0, 30) : '',
    fulfilment: customer.fulfilment === 'delivery' ? 'Delivery' : 'Pickup',
    address: typeof customer.address === 'string' ? customer.address.trim().slice(0, 250) : '',
    notes: typeof customer.notes === 'string' ? customer.notes.trim().slice(0, 250) : '',
  };

  return [
    \`Hello \${safeRestaurantName}, I would like to place an order:\`,
    '',
    ...lines,
    '',
    \`Subtotal: ৳\${subtotal}\`,
    '',
    \`Customer: \${safeCustomer.name || 'To be confirmed'}\`,
    \`Contact number: \${safeCustomer.phone || 'To be shared'}\`,
    \`Order method: \${safeCustomer.fulfilment}\`,
    ...(safeCustomer.fulfilment === 'Delivery' ? [\`Delivery address: \${safeCustomer.address || 'To be provided'}\`] : []),
    ...(safeCustomer.notes ? [\`Special instructions: \${safeCustomer.notes}\`] : []),
    '',
    'Please confirm item availability, delivery or pickup details, final charges and payment options.'
  ].join('\n');
}
