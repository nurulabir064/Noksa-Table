# NOKSHA TABLE

A premium Bengali dining-house website concept built with React, Vite, React Router, Tailwind CSS 4, and Lucide icons.

**Live demo:** https://noksa-table.vercel.app  
**Repository:** https://github.com/nurulabir064/Noksa-Table

> **Important:** Noksha Table is a fictional concept project, not a real restaurant. Menu items, prices, venue imagery, and Dhaka references are illustrative. The reservation and contact forms are frontend-only previews. They do not submit, email, or persist personal information. No real booking is created.

## Features

- Responsive restaurant landing page and mobile navigation
- Menu listing with category filters and search across dish names, categories, and descriptions
- Individual dish detail routes
- About and illustrative gallery pages
- Reservation-request and contact form preview states with native browser validation
- Accessible skip link, navigation labels, visible focus styles, live result/status announcements, and reduced-motion support
- Route-aware document titles and meta descriptions
- Canonical URL, Open Graph and Twitter sharing metadata
- XML sitemap, robots.txt, and custom SVG favicon
- CSS-based interaction and entrance animations

## Technology

- React 19
- Vite 6
- React Router DOM 7
- Tailwind CSS 4 with the Vite plugin
- Lucide React

## Run locally

Requirements: Node.js 20 or newer and npm.

```bash
git clone https://github.com/nurulabir064/Noksa-Table.git
cd Noksa-Table
npm install
npm run dev
```

Open the local URL printed by Vite.

## Production build

```bash
npm run build
npm run preview
```

The production output is generated in `dist/`.

## Project structure

```text
.
├── index.html
├── public/
│   └── favicon.svg
├── robots.txt
├── sitemap.xml
├── src/
│   ├── App.jsx
│   ├── data.js
│   ├── main.jsx
│   └── styles.css
├── package.json
└── vite.config.js
```

## Before using this as a real restaurant website

Replace all fictional/sample content with client-approved assets and information:

1. Restaurant name, logo, address, map location, phone, email, opening hours, and social links.
2. Menu names, descriptions, allergens, dietary notes, availability, and approved prices.
3. Licensed restaurant photography and written permission for all supplied assets.
4. Actual reservation policy, operating hours, table capacity, lead time, blackout dates, and cancellation rules.
5. Real contact and reservation delivery endpoints, database, server-side validation, spam controls, and notification workflow.
6. Privacy notice, consent wording where needed, data-retention policy, and secure access controls.
7. Domain ownership, DNS, hosting, analytics/consent decisions, backups, monitoring, and handover contacts.

## Current limitations

- No backend API or database is included.
- Forms only demonstrate browser-side validation and a local confirmation preview; they do not transmit or store data.
- There is no admin dashboard, customer account, order processing, payment, table availability, or booking confirmation.
- Sample menu data is stored locally in `src/data.js`.
- Images are remote Unsplash URLs and must be replaced or explicitly licensed/approved for a commercial client.
- The canonical and sitemap URLs currently point to the public demo domain and must be updated when a client-owned domain is connected.

## Pre-delivery QA checklist

- [ ] Test every route and refresh each nested route directly on the production domain.
- [ ] Test mobile menu open/close, keyboard navigation, skip link, and focus visibility.
- [ ] Test menu category filters, empty search results, and search by description.
- [ ] Test reservation date/time and all form validation states.
- [ ] Verify responsive layout at narrow mobile, tablet, laptop, and wide desktop widths.
- [ ] Check images, font loading, broken links, console errors, and network failures.
- [ ] Run a production build and verify the deployed commit and domain.
- [ ] Measure real Core Web Vitals and accessibility with browser tooling before claiming performance or accessibility compliance.
- [ ] Obtain client approval for content, images, policies, and legal/privacy text.

## Deployment

The project is configured for Vercel's Vite deployment flow. Connect the GitHub repository to Vercel and use the detected Vite defaults:

- Build command: `npm run build`
- Output directory: `dist`

After connecting a custom domain, update the canonical URL, Open Graph URL, sitemap, and robots sitemap reference to the client's final domain.
