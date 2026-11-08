import test from 'node:test';
import assert from 'node:assert/strict';
import { dishes, categories, featuredDishIds } from '../src/data.js';

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
  const cart = updateCartQuantity(updateCartQuantity({}, 'chicken-fried-rice', 1), 'chicken-fried-rice', 1);
  const summary = getCartSummary(cart, dishes);
  assert.equal(summary.totalQuantity, 2);
  assert.equal(summary.items[0].lineTotal, 900);
  assert.equal(summary.subtotal, 900);
});

test('cart combines different dishes and calculates the correct grand subtotal', () => {
  const cart = { 'chicken-fried-rice': 2, 'blueberry-mojito': 2 };
  const summary = getCartSummary(cart, dishes);
  assert.equal(summary.totalQuantity, 4);
  assert.equal(summary.subtotal, 1420);
});

test('cart never allows negative or zero quantities to remain', () => {
  const once = updateCartQuantity({ 'chicken-fried-rice': 1 }, 'chicken-fried-rice', -1);
  const twice = updateCartQuantity(once, 'chicken-fried-rice', -1);
  assert.deepEqual(once, {});
  assert.deepEqual(twice, {});
});

test('cart ignores unknown dish IDs and invalid quantity changes in the summary', () => {
  const summary = getCartSummary({ unknown: 4, 'chicken-fried-rice': -2 }, dishes);
  assert.equal(summary.totalQuantity, 0);
  assert.equal(summary.subtotal, 0);
});


test('each sample dish has its own image assignment', () => {
  const imageUrls = dishes.map(({ image }) => image);
  assert.equal(new Set(imageUrls).size, imageUrls.length, 'dish images should not be accidentally reused across menu items');
});

test('menu includes Bangladesh favourites alongside international and Indian categories', () => {
  assert.ok(categories.includes('Chinese'));
  assert.ok(categories.includes('Indian'));
  assert.ok(categories.includes('Bangladeshi Classics'));
  assert.ok(categories.includes('Continental'));
  assert.ok(categories.includes('Drinks & Mocktails'));
  assert.ok(categories.includes('Soft Drinks'));
  assert.ok(categories.includes('Desserts'));
  assert.ok(categories.includes('Combos'));
  for (const id of ['basmati-kacchi','plain-paratha','chicken-chap','strawberry-mojito','thai-soup','bbq-chicken-pizza','chicken-fried-rice']) {
    assert.ok(dishes.some(dish => dish.id === id), 'missing requested menu item: ' + id);
  }
});

test('homepage featured selection references exactly twelve existing dishes', () => {
  assert.equal(featuredDishIds.length, 12);
  assert.equal(new Set(featuredDishIds).size, featuredDishIds.length);
  const dishIds = new Set(dishes.map(dish => dish.id));
  for (const id of featuredDishIds) {
    assert.ok(dishIds.has(id), 'homepage featured dish is missing from menu data: ' + id);
  }
});

test('homepage featured labels do not claim unverified popularity or rankings', () => {
  const featured = dishes.filter(dish => featuredDishIds.includes(dish.id));
  for (const dish of featured) {
    assert.doesNotMatch(dish.tag || '', /popular|best seller|top rated|guest favourite/i);
  }
});

test('homepage features pizza, Indian dishes, Thai combo, strawberry mocktail and exactly one soft drink', () => {
  const featured = dishes.filter(dish => featuredDishIds.includes(dish.id));
  const ids = new Set(featured.map(dish => dish.id));
  assert.ok(ids.has('basmati-kacchi'));
  assert.ok(ids.has('plain-paratha'));
  assert.ok(ids.has('chicken-chap'));
  assert.ok(ids.has('bbq-chicken-pizza'));
  assert.ok(ids.has('butter-chicken'));
  assert.ok(ids.has('chicken-tikka'));
  assert.ok(ids.has('thai-rice-combo'));
  assert.ok(ids.has('strawberry-mojito'));
  assert.equal(featured.filter(dish => dish.category === 'Soft Drinks').length, 1);
  assert.ok(featured.some(dish => dish.category === 'Bangladeshi Classics'));
  assert.ok(featured.some(dish => dish.category === 'Chinese'));
  for (const dish of featured) {
    assert.ok(dish.imageCredit, 'featured dish needs a source and creator record: ' + dish.name);
  }
});
