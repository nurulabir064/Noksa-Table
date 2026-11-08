import { randomUUID } from 'node:crypto';
import { dishes } from '../../src/data.js';
import { buildOrderMessage } from '../../src/lib/order-message.js';

const MAX_BODY_BYTES = 8 * 1024;
const MAX_ITEMS = 15;
const MAX_QUANTITY = 20;
const dishesById = new Map(dishes.map(dish => [dish.id, dish]));

function respond(res, status, payload) {
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  return res.status(status).json(payload);
}

function isSameOrigin(req) {
  const origin = req.headers?.origin;
  const host = (req.headers?.['x-forwarded-host'] || req.headers?.host || '').split(',')[0].trim();
  if (!origin || !host) return false;

  try {
    const parsed = new URL(origin);
    return parsed.host.toLowerCase() === host.toLowerCase()
      && ['http:', 'https:'].includes(parsed.protocol);
  } catch {
    return false;
  }
}

async function readJsonBody(req) {
  if (req.body && typeof req.body === 'object' && !Array.isArray(req.body)) {
    return req.body;
  }

  if (typeof req.body === 'string') {
    if (Buffer.byteLength(req.body, 'utf8') > MAX_BODY_BYTES) {
      throw Object.assign(new Error('The order request is too large.'), { status: 413 });
    }
    return JSON.parse(req.body);
  }

  let raw = '';
  for await (const chunk of req) {
    raw += chunk.toString();
    if (Buffer.byteLength(raw, 'utf8') > MAX_BODY_BYTES) {
      throw Object.assign(new Error('The order request is too large.'), { status: 413 });
    }
  }
  return JSON.parse(raw);
}

function normalizeCustomer(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return { error: 'Please provide your order contact details.' };
  }

  const name = typeof value.name === 'string' ? value.name.trim() : '';
  const phone = typeof value.phone === 'string' ? value.phone.trim() : '';
  const fulfilment = value.fulfilment === 'delivery' ? 'delivery' : value.fulfilment === 'pickup' ? 'pickup' : '';
  const address = typeof value.address === 'string' ? value.address.trim() : '';
  const notes = typeof value.notes === 'string' ? value.notes.trim() : '';
  const phoneDigits = phone.replace(/\D/g, '');

  if (name.length < 2 || name.length > 100) {
    return { error: 'Enter your name (2–100 characters).' };
  }
  if (phone.length < 7 || phone.length > 25 || phoneDigits.length < 7 || phoneDigits.length > 15) {
    return { error: 'Enter a valid contact number.' };
  }
  if (!fulfilment) {
    return { error: 'Choose pickup or delivery.' };
  }
  if (fulfilment === 'delivery' && (address.length < 8 || address.length > 250)) {
    return { error: 'Enter a complete delivery address (8–250 characters).' };
  }
  if (notes.length > 250) {
    return { error: 'Special instructions must be 250 characters or fewer.' };
  }

  return {
    value: {
      name,
      phone,
      fulfilment,
      address: fulfilment === 'delivery' ? address : '',
      notes,
    },
  };
}

function normalizeItems(value) {
  if (!Array.isArray(value) || value.length < 1 || value.length > MAX_ITEMS) {
    return { error: 'Choose between 1 and 15 menu items.' };
  }

  const seen = new Set();
  const items = [];

  for (const line of value) {
    if (!line || typeof line !== 'object' || Array.isArray(line)) {
      return { error: 'The order contains an invalid item.' };
    }

    const { id, quantity } = line;
    if (typeof id !== 'string' || seen.has(id)) {
      return { error: 'The order contains a duplicate or invalid menu item.' };
    }
    if (!Number.isInteger(quantity) || quantity < 1 || quantity > MAX_QUANTITY) {
      return { error: 'Each item quantity must be between 1 and 20.' };
    }

    const dish = dishesById.get(id);
    if (!dish) return { error: 'One of the selected menu items is unavailable.' };

    seen.add(id);
    items.push({
      id: dish.id,
      name: dish.name,
      quantity,
      lineTotal: dish.price * quantity,
    });
  }

  return { value: items };
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return respond(res, 405, { error: 'Method not allowed.' });
  }

  if (!isSameOrigin(req)) {
    return respond(res, 403, { error: 'This order request is not allowed.' });
  }

  const contentType = req.headers?.['content-type']?.split(';', 1)[0].trim().toLowerCase();
  if (contentType !== 'application/json') {
    return respond(res, 415, { error: 'Send the order as JSON.' });
  }

  const contentLength = Number(req.headers?.['content-length'] || 0);
  if (contentLength > MAX_BODY_BYTES) {
    return respond(res, 413, { error: 'The order request is too large.' });
  }

  let body;
  try {
    body = await readJsonBody(req);
  } catch (error) {
    return respond(res, error.status || 400, {
      error: error.status === 413 ? error.message : 'The order request contains invalid JSON.',
    });
  }

  const itemResult = normalizeItems(body.items);
  if (itemResult.error) return respond(res, 400, { error: itemResult.error });

  const customerResult = normalizeCustomer(body.customer);
  if (customerResult.error) return respond(res, 400, { error: customerResult.error });

  const items = itemResult.value;
  const subtotal = items.reduce((sum, item) => sum + item.lineTotal, 0);
  const orderReference = randomUUID().replaceAll('-', '').slice(0, 10).toUpperCase();
  const message = buildOrderMessage({
    restaurantName: 'NOKSHA TABLE',
    items,
    subtotal,
    customer: customerResult.value,
  }) + '\nOrder reference: ' + orderReference;

  return respond(res, 200, {
    orderReference,
    subtotal,
    items: items.map(({ id, name, quantity, lineTotal }) => ({ id, name, quantity, lineTotal })),
    message,
    deliveryStatus: 'not_sent',
  });
}
