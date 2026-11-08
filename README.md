# NOKSHA TABLE

A premium multi-cuisine restaurant website concept built with React, Vite, React Router, Tailwind CSS 4, and Lucide icons.

**Live demo:** https://noksa-table.vercel.app  
**Repository:** https://github.com/nurulabir064/Noksa-Table

> **Important:** Noksha Table is a fictional concept project, not a real restaurant. Menu items, prices, venue imagery, and Dhaka references are illustrative. The reservation API is included but disabled by default; no real booking is accepted. The contact form prepares an email draft in the visitor's configured email app; the website cannot confirm that the draft opened or that a message was sent or stored.

## Sales and client delivery documents

All client-facing documents are templates. Fill in the actual scope and have both parties approve them before work starts.

- [Client outreach scripts](docs/CLIENT-OUTREACH-SCRIPTS-BN.md) — respectful first contact, discovery questions, demo walkthrough and objection handling.
- [Client proposal template](docs/CLIENT-PROPOSAL-TEMPLATE-BN.md) — solution, pages, outcomes, exclusions and next steps.
- [Quotation template](docs/QUOTE-TEMPLATE-BN.md) — fixed scope, itemized fees, milestones, revisions and acceptance.
- [Bengali sales kit](docs/SALES-KIT-BN.md) — positioning, starter package, pricing context and honest demo positioning.
- [Client onboarding brief](docs/CLIENT-ONBOARDING-BN.md) — business details, content, goals and booking/order discovery.
- [Client customization workflow](docs/CLIENT-CUSTOMIZATION-WORKFLOW-BN.md) — replace demo branding, configure verified contact links, content, SEO and deployment safely.
- [Service agreement draft](docs/SERVICE-AGREEMENT-DRAFT-BN.md) — plain-language working draft; obtain local legal review before signing.
- [Invoice template](docs/INVOICE-TEMPLATE-BN.md) — BDT invoice layout and payment tracking.
- [QA and handover checklist](docs/DELIVERY-CHECKLIST-BN.md) — functional, responsive, security, privacy, launch and acceptance checks.
- [Maintenance terms](docs/MAINTENANCE-TERMS-BN.md) — optional ongoing support scope and boundaries.

## Features

- Responsive restaurant landing page and mobile navigation
- Multi-cuisine menu with Starters, Chinese, Thai, Indian, Continental, Seafood, Drinks & Mocktails, one Soft Drinks item, Bangladeshi Classics and Combos; includes search and filters
- Individual dish detail routes
- About and illustrative gallery pages
- Reservation form connected to a gated Node.js API; remains disabled until database, privacy and operations configuration is complete
- Verified-format phone, WhatsApp, email and directions links driven by public client configuration
- Homepage presents 12 curated dishes, including pizza and Indian choices, with exactly one Soft Drinks item. The cart supports quantity controls and running subtotals. Guests can add a name, phone, pickup/delivery choice, delivery address and special instructions; WhatsApp is the primary order handoff and a prefilled email is the alternative
- Dish detail pages offer WhatsApp ordering first and email enquiry as an alternative
- Contact form prepares an email draft through the visitor's configured email app; it does not send or store messages
- Accessible skip link, navigation labels, visible focus styles, live result/status announcements, and reduced-motion support
- Route-specific prerendered HTML titles, descriptions, canonical URLs, Open Graph and Twitter metadata for every menu and content route
- Canonical URL, Open Graph and Twitter sharing metadata
- XML sitemap, robots.txt, and custom SVG favicon
- CSS-based interaction and entrance animations
- Baseline security response headers and explicit direct-route rewrites to prerendered HTML
- PostgreSQL schema for reservation requests and request-rate tracking
- Server-side validation, same-origin checks, honeypot, payload limits and database-backed rate limiting
- Privacy consent requirement and disabled-by-default reservation feature flag
- Automated menu-data, contact-link, reservation validation and API guard tests, executed before production build

## Technology

- React 19
- Vite 6
- React Router DOM 7
- Tailwind CSS 4 with the Vite plugin
- Neon PostgreSQL serverless driver
- Lucide React

## Run locally

Requirements: Node.js 24.x and npm.

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
│   ├── components/
│   │   └── ContactActions.jsx
│   ├── config/
│   │   └── site.js
│   ├── lib/
│   │   ├── contact-links.js
│   │   └── order-message.js
│   ├── App.jsx
│   ├── data.js
│   ├── main.jsx
│   └── styles.css
├── test/
│   ├── contact-links.test.js
│   ├── order-message.test.js
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
- Ordering opens a prefilled WhatsApp chat first and offers a prefilled email draft as an alternative. Neither action sends automatically: the guest must review and press Send. The website does not store the entered order details. There is no order database, staff dashboard, automatic order acknowledgement, delivery-fee engine or payment processing yet. The restaurant must confirm availability, final charges and fulfilment directly.
- The contact form prepares an email draft only. It does not automatically send, transmit to a backend, or store the message.
- Sample menu data is stored locally in `src/data.js`.
- No online payment gateway is implemented. Card payments, server-side transaction verification, IPN/webhooks, idempotency, refunds and transaction history must be designed and sandbox-tested before any payment launch.
- Images are remote Unsplash and Pexels assets used for concept presentation. Source-page and creator metadata is currently recorded for 20 of 33 menu images and for the nine newly curated Pexels/Wikimedia gallery images. Remaining images still require source, license, relevance, crop, sharpness and client-approval checks; do not treat the image set as client-delivery-ready until that audit is complete.
- Automated tests cover menu data, cart calculations, contact links, order email construction, reservation input validation and API request guards. They do not replace live database integration, browser end-to-end, accessibility, load, or penetration tests.
- The canonical and sitemap URLs currently point to the public demo domain and must be updated when a client-owned domain is connected.

## Reservation backend setup (keep disabled until launch approval)

1. Create a Neon PostgreSQL project and copy its pooled connection string.
2. Run `db/schema.sql` against the database.
3. Add server-side Vercel environment variables: `DATABASE_URL`, `RATE_LIMIT_SECRET`, `PRIVACY_POLICY_URL`, and `RESERVATIONS_ENABLED=false`. Never prefix database secrets with `VITE_`.
4. Add frontend build variables: `VITE_RESERVATIONS_ENABLED=false` and `VITE_PRIVACY_POLICY_URL=`.
5. Before accepting real requests, publish and review the restaurant privacy notice, retention/deletion process, opening hours and booking rules; implement admin access and notifications; test the live database and recovery process.
6. Only after those checks, set both reservation flags to `true`, set the public privacy URL in both environments, redeploy, and submit a controlled end-to-end test.

The API stores requests as `pending`; it does not confirm tables or send notifications. The database rate limiter stores a keyed hash of the request IP, not the raw address. Old rate-limit hashes are pruned during new requests; define and document the retention and deletion process for reservation records before launch.

## Pre-delivery QA checklist

- [ ] Test every route and refresh each nested route directly on the production domain.
- [ ] Test mobile menu open/close, keyboard navigation, skip link, and focus visibility.
- [ ] Test menu category filters, empty search results, and search by description.
- [ ] Add multiple dishes, change quantities, verify line totals/subtotal, and confirm the email draft contains the correct item names, quantities and subtotal.
- [ ] Test reservation date/time, consent, disabled state, API validation, rate limiting and all error states.
- [ ] Run a controlled database integration test and verify pending records can be securely reviewed and deleted.
- [ ] Verify responsive layout at narrow mobile (320/360/390 px), tablet (768 px), laptop (1366 px), and wide desktop (1440 px) widths.
- [ ] Capture desktop and mobile screenshots for Home, Menu, Our Story, Gallery, Contact and Reservation; review image crop, text wrapping, spacing, overflow, focus and CTA visibility.
- [ ] Check every menu and gallery image for subject relevance, crop, sharpness, duplicates, successful loading, source URL, photographer, license and client approval.
- [ ] Check images, font loading, broken links, console errors, and network failures.
- [ ] Run `npm test` and a production build; verify the deployed commit and domain.
- [ ] Measure real Core Web Vitals and accessibility with browser tooling before claiming performance or accessibility compliance.
- [ ] Obtain client approval for content, images, policies, and legal/privacy text.
- [ ] Keep production reservations disabled until the live database, staff workflow, privacy/retention policy, notification handling and controlled production test are approved.
- [ ] Keep online payments disabled until a Bangladesh gateway merchant account is approved, sandbox credentials are configured server-side, verified webhook/IPN handling and duplicate protection are tested, and refunds/reconciliation are documented.
- [ ] Never treat a frontend redirect or success message as proof of payment; verify the transaction server-side with the gateway.

## Deployment

The project is configured for Vercel's Vite deployment flow. Connect the GitHub repository to Vercel and use the detected Vite defaults:

- Build command: `npm run build`
- Output directory: `dist`

After connecting a custom domain, update the canonical URL, Open Graph URL, sitemap, and robots sitemap reference to the client's final domain.
