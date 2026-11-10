import { readFile } from 'node:fs/promises';

const config = JSON.parse(await readFile(new URL('../vercel.json', import.meta.url), 'utf8'));
const notFoundPage = await readFile(new URL('../public/404.html', import.meta.url), 'utf8');
const requiredRoutes = ['/menu', '/menu/:id', '/about', '/gallery', '/reservation', '/contact'];
const rewriteSources = (config.rewrites || []).map(rewrite => rewrite.source);
const missingRoutes = requiredRoutes.filter(route => !rewriteSources.includes(route));
const catchAllRoutes = rewriteSources.filter(route => route === '/(.*)' || route === '/:path*' || route === '/:match*');

if (missingRoutes.length || catchAllRoutes.length) {
  throw new Error([
    missingRoutes.length ? 'Missing explicit route rewrites: ' + missingRoutes.join(', ') : '',
    catchAllRoutes.length ? 'Catch-all rewrites can turn unknown URLs into soft 404s: ' + catchAllRoutes.join(', ') : '',
  ].filter(Boolean).join('\n'));
}

if (!notFoundPage.includes('<title>Page not found | NOKSHA TABLE</title>') ||
    !notFoundPage.includes('name="robots" content="noindex,follow"') ||
    !notFoundPage.includes('href="/menu"')) {
  throw new Error('Custom 404 page is missing its title, noindex directive, or menu recovery link.');
}

console.log('Route handling verified: explicit application routes and custom 404 page are present.');
