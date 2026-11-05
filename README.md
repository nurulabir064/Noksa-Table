# NOKSHA TABLE

A premium Bengali dining-house website concept built with React, Vite, React Router, Tailwind CSS 4, and Lucide icons.

**Live demo:** https://noksa-table.vercel.app  
**Repository:** https://github.com/nurulabir064/Noksa-Table

> **Important:** Noksha Table is a fictional concept project, not a real restaurant. Menu items, prices, venue imagery, and Dhaka references are illustrative. The reservation API is included but disabled by default; no real booking is accepted. The contact form is a frontend-only preview and does not send or store messages.

## Features

- Responsive restaurant landing page and mobile navigation
- Menu listing with category filters and search across dish names, categories, and descriptions
- Individual dish detail routes
- About and illustrative gallery pages
- Reservation form connected to a gated Node.js API; remains disabled until database, privacy and operations configuration is complete
- Contact form preview state with native browser validation
- Accessible skip link, navigation labels, visible focus styles, live result/status announcements, and reduced-motion support
- Route-aware document titles and meta descriptions
- Canonical URL, Open Graph and Twitter sharing metadata
- XML sitemap, robots.txt, and custom SVG favicon
- CSS-based interaction and entrance animations
- Baseline security response headers and direct-route fallback
- PostgreSQL schema for reservation requests and request-rate tracking
- Server-side validation, same-origin checks, honeypot, payload limits and database-backed rate limiting
- Privacy consent requirement and disabled-by-default reservation feature flag
- Automated menu-data, reservation validation and API guard tests, executed before production build

## Technology

- React 19
- Vite 6
- React Router DOM 7
- Tailwind CSS 4 with the Vite plugin
- Neon PostgreSQL serverless driver
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
npm test
npm run build
npm run preview
```

The production output is generated in `dist/`.

## Project structure

```text
.
├── api/
│   ├── _lib/
│   │   └── reservation-validation.js
│   └── reservations.js
├── db/
│   └── schema.sql
├── public/
│   ├── favicon.svg
│   ├── robots.txt
│   └── sitemap.xml
├── src/
│   ├── App.jsx
│   ├── data.js
│   ├── main.jsx
│   └── styles.css
├── test/
│   ├── data.test.js
│   ├── reservation-api.test.js
│   └── reservation-validation.test.js
├── package.json
├── vercel.json
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

- The reservation API and PostgreSQL schema are included, but the live reservation feature is deliberately disabled by default.
- The API has not been connected to a provisioned database in this project session; no customer data has been stored.
- No admin dashboard, reservation notifications, table-capacity/availability engine, or confirmed-booking workflow exists yet. Do not enable reservation submissions until those operational pieces and the privacy/retention policy are ready.
- The contact form remains a frontend-only preview and does not transmit or store data.
- There is no admin dashboard, customer account, order processing, payment, table availability, or automatic booking confirmation.
- Sample menu data is stored locally in `src/data.js`.
- Images are remote Unsplash URLs used for concept presentation; obtain appropriate commercial licenses or replace them with client-approved assets before paid delivery.
- Automated tests cover menu data, reservation input validation, and API request guards. They do not replace live database integration, browser end-to-end, accessibility, load, or penetration tests.
- The canonical and sitemap URLs currently point to the public demo domain and must be updated when a client-owned domain is connected.

## Reservation backend setup (keep disabled until launch approval)\n\n1. Create a Neon PostgreSQL project and copy its pooled connection string.\n2. Run `db/schema.sql` against the database.\n3. Add server-side Vercel environment variables: `DATABASE_URL`, `RATE_LIMIT_SECRET`, `PRIVACY_POLICY_URL`, and `RESERVATIONS_ENABLED=false`. Never prefix database secrets with `VITE_`.\n4. Add frontend build variables: `VITE_RESERVATIONS_ENABLED=false` and `VITE_PRIVACY_POLICY_URL=`.\n5. Before accepting real requests, publish and review the restaurant privacy notice, retention/deletion process, opening hours and booking rules; implement admin access and notifications; test the live database and recovery process.\n6. Only after those checks, set both reservation flags to `true`, set the public privacy URL in both environments, redeploy, and submit a controlled end-to-end test.\n\nThe API stores requests as `pending`; it does not confirm tables or send notifications. The database rate limiter stores a keyed hash of the request IP, not the raw address. Old rate-limit hashes are pruned during new requests; define and document the retention and deletion process for reservation records before launch.\n\n## Pre-delivery QA checklist

- [ ] Test every route and refresh each nested route directly on the production domain.
- [ ] Test mobile menu open/close, keyboard navigation, skip link, and focus visibility.
- [ ] Test menu category filters, empty search results, and search by description.
- [ ] Test reservation date/time, consent, disabled state, API validation, rate limiting and all error states.\n- [ ] Run a controlled database integration test and verify pending records can be securely reviewed and deleted.
- [ ] Verify responsive layout at narrow mobile, tablet, laptop, and wide desktop widths.
- [ ] Check images, font loading, broken links, console errors, and network failures.
- [ ] Run `npm test` and a production build; verify the deployed commit and domain.
- [ ] Measure real Core Web Vitals and accessibility with browser tooling before claiming performance or accessibility compliance.
- [ ] Obtain client approval for content, images, policies, and legal/privacy text.

## Deployment

The project is configured for Vercel's Vite deployment flow. Connect the GitHub repository to Vercel and use the detected Vite defaults:

- Build command: `npm run build`
- Output directory: `dist`

After connecting a custom domain, update the canonical URL, Open Graph URL, sitemap, and robots sitemap reference to the client's final domain.
