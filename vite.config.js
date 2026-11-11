import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { dishes } from './src/data.js'
import { siteConfig } from './src/config/site.js'

const siteUrl = siteConfig.siteUrl.replace(/\/+$/, '')
const defaultImage = 'https://images.pexels.com/photos/29819295/pexels-photo-29819295.jpeg?auto=compress&cs=tinysrgb&w=2000'

const pages = [
  {
    route: '/',
    title: siteConfig.brandName + ' | ' + siteConfig.descriptor,
    description: siteConfig.tagline,
    image: defaultImage,
  },
  {
    route: '/menu',
    title: 'Menu | ' + siteConfig.brandName,
    description: 'Explore Continental, Italian, Thai, Chinese, Japanese, Indian and Bangladeshi classics, seafood, desserts and non-alcoholic drinks at ' + siteConfig.brandName + '.',
    image: defaultImage,
  },
  {
    route: '/about',
    title: 'Our Story | ' + siteConfig.brandName,
    description: 'Learn about ' + siteConfig.brandName + ' and its approach to food and hospitality.',
    image: defaultImage,
  },
  {
    route: '/gallery',
    title: 'Gallery | ' + siteConfig.brandName,
    description: 'Explore the gallery for ' + siteConfig.brandName + '.',
    image: defaultImage,
  },
  {
    route: '/reservation',
    title: 'Reservation | ' + siteConfig.brandName,
    description: 'Send a WhatsApp reservation request to ' + siteConfig.brandName + '. Restaurant confirmation is required.',
    image: defaultImage,
  },
  {
    route: '/contact',
    title: 'Contact | ' + siteConfig.brandName,
    description: 'Contact information for ' + siteConfig.brandName + '.',
    image: defaultImage,
  },
  ...dishes.map(dish => ({
    route: '/menu/' + dish.id,
    title: dish.name + ' | ' + siteConfig.brandName,
    description: dish.description + ' Illustrative menu item and price.',
    image: dish.image,
  })),
]

function escapeAttribute(value) {
  return String(value).replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;')
}

function withPageMetadata(html, page) {
  const canonical = siteUrl + (page.route === '/' ? '/' : page.route)
  const meta = (pattern, replacement) => {
    html = html.replace(pattern, replacement)
  }

  meta(/<title>[^<]*<\/title>/, '<title>' + escapeAttribute(page.title) + '</title>')
  meta(/<meta name="description" content="[^"]*" \/>/, '<meta name="description" content="' + escapeAttribute(page.description) + '" />')
  meta(/<link rel="canonical" href="[^"]*" \/>/, '<link rel="canonical" href="' + escapeAttribute(canonical) + '" />')
  meta(/<meta property="og:site_name" content="[^"]*" \/>/, '<meta property="og:site_name" content="' + escapeAttribute(siteConfig.brandName) + '" />')
  meta(/<meta property="og:title" content="[^"]*" \/>/, '<meta property="og:title" content="' + escapeAttribute(page.title) + '" />')
  meta(/<meta property="og:description" content="[^"]*" \/>/, '<meta property="og:description" content="' + escapeAttribute(page.description) + '" />')
  meta(/<meta property="og:url" content="[^"]*" \/>/, '<meta property="og:url" content="' + escapeAttribute(canonical) + '" />')
  meta(/<meta property="og:image" content="[^"]*" \/>/, '<meta property="og:image" content="' + escapeAttribute(page.image) + '" />')
  meta(/<meta name="twitter:title" content="[^"]*" \/>/, '<meta name="twitter:title" content="' + escapeAttribute(page.title) + '" />')
  meta(/<meta name="twitter:description" content="[^"]*" \/>/, '<meta name="twitter:description" content="' + escapeAttribute(page.description) + '" />')
  meta(/<meta name="twitter:image" content="[^"]*" \/>/, '<meta name="twitter:image" content="' + escapeAttribute(page.image) + '" />')

  return html
}

function routeMetadataPages() {
  return {
    name: 'client-route-metadata',
    generateBundle: {
      order: 'post',
      handler(_, bundle) {
        const entry = bundle['index.html']
        if (!entry || entry.type !== 'asset') {
          this.error('Expected Vite to emit index.html before generating route metadata.')
        }

        const baseHtml = String(entry.source)
        entry.source = withPageMetadata(baseHtml, pages.find(page => page.route === '/'))

        for (const page of pages) {
          if (page.route === '/') continue
          const fileName = page.route.slice(1) + '/index.html'
          this.emitFile({
            type: 'asset',
            fileName,
            source: withPageMetadata(baseHtml, page),
          })
        }

        const sitemap = [
          '<?xml version="1.0" encoding="UTF-8"?>',
          '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
          ...pages.map(page => '  <url><loc>' + siteUrl + (page.route === '/' ? '/' : page.route) + '</loc></url>'),
          '</urlset>',
          '',
        ].join('\n')
        this.emitFile({ type: 'asset', fileName: 'sitemap.xml', source: sitemap })
      },
    },
  }
}

export default defineConfig({
  plugins: [react(), tailwindcss(), routeMetadataPages()],
})
