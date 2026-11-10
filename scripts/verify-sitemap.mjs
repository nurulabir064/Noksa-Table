import { readFile } from 'node:fs/promises';
import { dishes } from '../src/data.js';
import { siteConfig } from '../src/config/site.js';

const sitemapPath = new URL('../dist/sitemap.xml', import.meta.url);
const sitemap = await readFile(sitemapPath, 'utf8');
const baseUrl = siteConfig.siteUrl.replace(/\\/+$/, '');
const routes = [
  '/',
  '/menu',
  '/about',
  '/gallery',
  '/reservation',
  '/contact',
  ...dishes.map(dish => '/menu/' + dish.id),
];
const expectedUrls = routes.map(route => baseUrl + (route === '/' ? '/' : route));
const actualUrls = [...sitemap.matchAll(/<loc>([^<]+)<\\/loc>/g)].map(([, url]) => url);
const uniqueUrls = new Set(actualUrls);
const missingUrls = expectedUrls.filter(url => !uniqueUrls.has(url));
const unexpectedUrls = actualUrls.filter(url => !expectedUrls.includes(url));

if (!sitemap.includes('<urlset ') || actualUrls.length !== expectedUrls.length || uniqueUrls.size !== actualUrls.length || missingUrls.length || unexpectedUrls.length) {
  throw new Error([
    'Generated sitemap does not match the current application routes.',
    missingUrls.length ? 'Missing: ' + missingUrls.join(', ') : '',
    unexpectedUrls.length ? 'Unexpected: ' + unexpectedUrls.join(', ') : '',
    actualUrls.length !== expectedUrls.length ? 'Expected ' + expectedUrls.length + ' URLs, found ' + actualUrls.length + '.' : '',
    uniqueUrls.size !== actualUrls.length ? 'Duplicate sitemap URLs were found.' : '',
  ].filter(Boolean).join('\\n'));
}

console.log('Sitemap verified: ' + actualUrls.length + ' unique application routes.');
