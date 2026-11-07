import test from 'node:test';
import assert from 'node:assert/strict';
import { dishes, categories } from '../src/data.js';

test('menu contains dishes with complete required fields', () => {
  assert.ok(dishes.length > 0, 'menu should not be empty');
  for (const dish of dishes) {
    assert.equal(typeof dish.id, 'string');
    assert.ok(dish.id.trim().length > 0);
    assert.equal(typeof dish.name, 'string');
    assert.ok(dish.name.trim().length > 0);
    assert.equal(typeof dish.category, 'string');
    assert.ok(dish.category.trim().length > 0);
    assert.ok(Number.isInteger(dish.price) && dish.price > 0);
    assert.equal(typeof dish.description, 'string');
    assert.ok(dish.description.trim().length > 0);
    assert.ok(dish.image.startsWith('https://'), 'dish image must use HTTPS');
    if (dish.imageCredit) {
      assert.ok(dish.imageCredit.url.startsWith('https://'));
      assert.ok(dish.imageCredit.licenseUrl.startsWith('https://'));
    }
  }
});

test('menu dish IDs are unique', () => {
  const ids = dishes.map(({ id }) => id);
  assert.equal(new Set(ids).size, ids.length);
});

test('every dish category is available in the filter list', () => {
  assert.ok(categories.includes('All'));
  const filterCategories = new Set(categories.filter(category => category !== 'All'));
  for (const dish of dishes) {
    assert.ok(filterCategories.has(dish.category), `missing filter category: ${dish.category}`);
  }
});

test('menu filter categories are unique', () => {
  assert.equal(new Set(categories).size, categories.length);
});

import { getCartSummary, updateCartQuantity } from '../src/lib/cart.js';

test('cart adds quantities and calculates line totals and subtotal', () => {
  const cart = updateCartQuantity(updateCartQuantity({}, 'dhaka-kacchi', 1), 'dhaka-kacchi', 1);
  const summary = getCartSummary(cart, dishes);
  assert.equal(summary.totalQuantity, 2);
  assert.equal(summary.items[0].lineTotal, 1180);
  assert.equal(summary.subtotal, 1180);
});

test('cart combines different dishes and calculates the correct grand subtotal', () => {
  const cart = { 'dhaka-kacchi': 2, 'borhani': 2 };
  const summary = getCartSummary(cart, dishes);
  assert.equal(summary.totalQuantity, 4);
  assert.equal(summary.subtotal, 1420);
});

test('cart never allows negative or zero quantities to remain', () => {
  const once = updateCartQuantity({ 'dhaka-kacchi': 1 }, 'dhaka-kacchi', -1);
  const twice = updateCartQuantity(once, 'dhaka-kacchi', -1);
  assert.deepEqual(once, {});
  assert.deepEqual(twice, {});
});

test('cart ignores unknown dish IDs and invalid quantity changes in the summary', () => {
  const summary = getCartSummary({ unknown: 4, 'dhaka-kacchi': -2 }, dishes);
  assert.equal(summary.totalQuantity, 0);
  assert.equal(summary.subtotal, 0);
});


test('each sample dish has its own image assignment', () => {
  const imageUrls = dishes.map(({ image }) => image);
  assert.equal(new Set(imageUrls).size, imageUrls.length, 'dish images should not be accidentally reused across menu items');
});
