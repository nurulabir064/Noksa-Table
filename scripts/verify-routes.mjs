import { access, readFile } from 'node:fs/promises';
import { dishes } from '../src/data.js';

const routes = [
  '/',
  '/menu',
  '/about',
  '/gallery',
  '/reservation',
  '/contact',
  ...dishes.map(dish => '/menu/' + dish.id),
];

for (const route of routes) {
  const file = route === '/' ? 'dist/index.html' : 'dist' + route + '/index.html';
  await access(file);
  const html = await readFile(file, 'utf8');
  if (!html.includes('<title>')) throw new Error('Missing title in ' + file);
  if (!html.includes('name="description"')) throw new Error('Missing description in ' + file);
}

await access('dist/404.html');
console.log('Verified ' + routes.length + ' prerendered routes and custom 404 page.');
