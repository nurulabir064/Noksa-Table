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
