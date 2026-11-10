import { readFile } from 'node:fs/promises';
import { dishes } from '../src/data.js';
import { siteConfig } from '../src/config/site.js';

const xml = await readFile('dist/sitemap.xml', 'utf8');
const baseUrl = siteConfig.siteUrl.endsWith('/')
  ? siteConfig.siteUrl.slice(0, -1)
  : siteConfig.siteUrl;
const expected = [
  '/',
  '/menu',
  '/about',
  '/gallery',
  '/reservation',
  '/contact',
  ...dishes.map(dish => '/menu/' + dish.id),
].map(route => baseUrl + (route === '/' ? '/' : route));
const locations = xml.split('<loc>').slice(1).map(part => part.split('</loc>')[0]);

if (locations.length !== expected.length) {
  throw new Error('Sitemap URL count mismatch: expected ' + expected.length + ', found ' + locations.length);
}
if (new Set(locations).size !== locations.length) throw new Error('Sitemap contains duplicate URLs.');
for (const url of expected) {
  if (!locations.includes(url)) throw new Error('Sitemap is missing ' + url);
}
for (const url of locations) {
  if (!expected.includes(url)) throw new Error('Sitemap contains stale URL ' + url);
}
console.log('Verified sitemap: ' + locations.length + ' current routes, no stale or duplicate URLs.');
