export function updateCartQuantity(cart, dishId, change) {
  if (!cart || typeof cart !== 'object' || !Number.isInteger(change) || !dishId) return cart;
  const current = Number.isInteger(cart[dishId]) && cart[dishId] > 0 ? cart[dishId] : 0;
  const next = Math.max(0, current + change);
  const updated = { ...cart };
  if (next === 0) delete updated[dishId];
  else updated[dishId] = next;
  return updated;
}

export function getCartSummary(cart, dishes) {
  const items = dishes
    .filter(dish => Number.isInteger(cart?.[dish.id]) && cart[dish.id] > 0)
    .map(dish => ({
      id: dish.id,
      name: dish.name,
      quantity: cart[dish.id],
      lineTotal: dish.price * cart[dish.id],
    }));
  return {
    items,
    totalQuantity: items.reduce((total, item) => total + item.quantity, 0),
    subtotal: items.reduce((total, item) => total + item.lineTotal, 0),
  };
}
