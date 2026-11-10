# NOKSHA TABLE — Sales Readiness & Technical Audit

**Audit date:** 11 November 2026  
**Repository:** https://github.com/nurulabir064/Noksa-Table  
**Production domain:** https://noksa-table.vercel.app  
**Production deployment:** READY — `feat/premium-homepage-ordering-gallery-contact` / `3752fe3542c341feef083cbbcfa3586b9e8dc395`  
**Reviewed working baseline:** `docs/verified-product-blueprint` / `8733c723f562ac12f36914090608622ef541e3d8`  
**Audit branch:** `chore/sales-readiness-release-gates`

## 1. Release decision

**Decision: sellable as a clearly scoped restaurant website starter; not approved for direct, unconfigured client production handover.**

The demo is fictional. It can be used to demonstrate the website experience and quote a limited starter scope. Every client deployment still needs client-owned content, verified contact details, licensed assets, domain/SEO configuration, device QA, production smoke tests and written acceptance.

Do not describe the current demo as a live restaurant, instant reservation system, backend order-management system, CMS/admin platform or online-payment product.

## 2. Verified product scope

The reviewed baseline contains:

- Responsive restaurant homepage and mobile navigation.
- Multi-cuisine menu with category filters, search and dish detail routes.
- About/story and image gallery pages.
- Public phone, email and directions actions only when approved client details are configured.
- Menu cart with quantity controls and subtotal calculation.
- Contact, dish and menu-order email drafts. These use the visitor's email application; the visitor must review and press Send. The website does not deliver or store those messages.
- Route-specific metadata, canonical URLs, Open Graph/Twitter metadata, robots.txt and a sitemap.
- Baseline security response headers and Vercel route rewrites.

**Not implemented / not included in the starter baseline:**

- WhatsApp click-to-chat or WhatsApp order handoff.
- Backend order creation, order persistence, staff order dashboard or fulfilment tracking.
- Server-delivered contact/order email or delivery notifications.
- Live reservation availability, table-capacity rules, staff confirmation dashboard or reservation notifications.
- CMS/admin roles, POS/inventory integrations or delivery-platform integrations.
- Online card payment, refunds or transaction reconciliation.

The demo's `publicEmail` and `publicPhone` defaults are blank. Configure only a client-approved, client-owned public contact address/number for a real client. Never restore a developer's personal email as the reusable public default.

## 3. Deployment and build evidence

| Area | Evidence | Status |
|---|---|---|
| Production deployment | Vercel deployment for commit `3752fe3` | READY; production unchanged |
| Product blueprint Preview | Vercel Preview for commit `8733c72` | READY; protected by Vercel SSO |
| Sales-readiness branch Preview | Vercel deployment `dpl_Farh8gSSharZzGhopLCCxGGoBy3V`, commit `f57f6c4` | READY; separate Preview deployment, no Production alias assigned |
| HTTP route/header smoke checks | Preview `/`, `/menu`, `/about`, `/gallery`, `/reservation`, `/contact`, `/menu/thai-soup`, `/sitemap.xml`, `/robots.txt`, `/favicon.svg` | All returned HTTP 200; key security headers present; interactive browser/device QA still not completed |
| Unknown-route handling | Preview `/not-a-real-page` | HTTP 404 with custom `Page not found | NOKSHA TABLE` response; verified after removing catch-all rewrite and adding `public/404.html` |
| Baseline automated tests | PR #7 validation record, 9 Nov 2026 | 31/31 passed |
| Baseline production build | PR #7 validation record | Passed |
| Current audit branch CI | GitHub Actions run #245 on head `f57f6c4` | Passed: locked install (`npm ci`), production and full-tree high-severity dependency audits, automated tests, production build, sitemap verification and explicit-route/custom-404 verification |
| Dependency reproducibility | `package-lock.json` is committed; GitHub Actions uses `npm ci` | Locked install passed in run #231; `vercel.json` now explicitly sets `installCommand: npm ci` to align Vercel Preview/Production builds with CI; latest Preview build confirmed `npm ci` |
| Sitemap | Old static file contained menu slugs not present in current data | Replaced with build-generated route sitemap and post-build verifier; run #245 passed |

The latest audit-branch Preview is READY and was fetched successfully through Vercel's protected-preview access. Route-level HTTP checks and response-header checks passed for the paths listed above. This is not a substitute for a real browser session: visual layout, React hydration, keyboard interaction, screen-reader behavior, mobile breakpoints, form behavior and browser console/network errors remain unverified. The Preview is protected by Vercel SSO; use the temporary share URL only with intended reviewers.

## 4. Backend, database and privacy review

### Reservation API

The repository contains `api/reservations.js`, validation helpers and `db/schema.sql`.

Verified code-level controls include POST-only handling, same-origin checks, JSON request handling, payload limits, field validation, a honeypot field, a consent requirement, a disabled-by-default feature flag, server-side database configuration checks, rate limiting and pending-only request semantics.

A successful API response means **request received / pending**, not a confirmed table booking. The API must remain disabled until the client has an approved privacy notice, database migration, staff workflow, notification process, retention/deletion policy, backup/recovery procedure and production end-to-end tests.

### Security findings that remain release gates

- The content-type guard has been tightened to accept `application/json` (including parameters such as charset) and reject lookalike media types such as `application/jsonp`; a regression test was added.
- Vercel's official Request Headers documentation says `host` is the domain used by the visitor, `x-forwarded-host` mirrors it, and `x-forwarded-proto` carries the forwarded protocol. The API's origin comparison is consistent with these documented headers. If a separate proxy/CDN is placed in front of Vercel, re-check the full trusted-proxy chain and canonical host policy before enabling reservations.
- Rate limiting uses `x-real-ip`. Vercel documents this as identical to its `x-forwarded-for` value and says it overwrites `x-forwarded-for` to prevent IP spoofing. This supports the current use on a direct Vercel deployment; an external proxy may cause Vercel to see the proxy IP unless a supported Trusted Proxy configuration is used.
- The API requires `consent: true`, but the reviewed schema does not persist the privacy-notice version or consent timestamp.
- Duplicate submissions are not protected by a durable idempotency key. A user retry or double submission could create more than one pending request.
- There is no staff/admin interface, notification delivery, availability engine or operational review workflow.
- The live database connection and schema migration have not been tested. Vercel metadata showed a `DATABASE_URL` variable entry, but its value was not read and no live query was performed.
- The repository declares CSP, frame, content-type, referrer and permissions headers. Vercel's Response Headers documentation says the platform automatically returns HSTS with a default `max-age=63072000`. Confirm the effective response headers on every client domain, especially if another proxy/CDN is introduced.
- No penetration test, load test, accessibility audit or live data-retention test has been completed.
- Preview build log reports Vercel ran `npm install` (not `npm ci`) and emitted npm configuration/install-script warnings, including an `esbuild` postinstall approval warning; the Vite production build nevertheless completed and deployment reached READY. Review Vercel project install settings and align them with the committed lockfile before relying on Vercel's own clean-build reproducibility. The audit branch explicitly sets `installCommand: npm ci` in `vercel.json`, and the latest Preview build confirmed it. The `esbuild` install-script approval and unknown `cache-dir` configuration warnings remain visible, although the Vite build succeeded.

## 5. CI, SEO and maintainability changes in this audit branch

- CI now validates pushes and pull requests on all branches, supports manual dispatch, cancels superseded runs and has a 15-minute job timeout.
- CI runs `npm audit --omit=dev` after the locked install to check production dependencies; run #245 passed this gate.
- CI also runs `npm audit --audit-level=high` against the full dependency tree, so high/critical advisories in development dependencies fail the workflow. Moderate advisories remain visible for follow-up; run #245 passed the full-tree high-severity gate.
- Production build is a separate CI step after automated tests.
- The static sitemap with stale dish URLs is removed. Vite now generates `dist/sitemap.xml` from the current page and dish route catalogue.
- A post-build verifier checks that every expected route appears exactly once and that stale or unexpected URLs are absent.
- The reservation API now checks the exact JSON media type, with a regression test for charset and JSONP cases.
- Removed the catch-all SPA rewrite that caused unknown paths to return HTTP 200; added an accessible static `public/404.html` and a CI verifier for explicit application rewrites/custom 404 presence. Run #245 passed the new verifier. Latest Preview HTTP check confirmed unknown paths return 404 with the custom page.

These changes are on the audit branch only. They are not in Production until reviewed, merged and deployed through an approved release.

## 6. Client-specific delivery requirements

Before launching a real restaurant site, obtain written approval for:

1. Public business name, logo, branch address, map pin, opening hours and contact details.
2. Client-owned public email and phone number; confirm who monitors incoming enquiries.
3. Menu item names, prices, descriptions, availability, allergens and dietary notes.
4. Rights/permission for every logo, photograph, font and written asset.
5. Reservation/order policy and clear wording for any disabled or enquiry-only workflow.
6. Client-owned domain, DNS, Vercel project access and account ownership.
7. Privacy notice, data controller, retention/deletion policy and operational contacts if customer data is collected.
8. Final mobile/tablet/desktop QA, direct-route refresh tests, console/network checks and production smoke tests.
9. Handover documentation, support boundaries, source/access transfer and written client acceptance.

## 7. Payment — separate future implementation

No online payment integration is present in the reviewed baseline. The product blueprint documents a future Bangladesh gateway evaluation, with SSLCOMMERZ Hosted Checkout as the first candidate subject to merchant onboarding and Visa/Mastercard approval.

Before any payment release, implement and test backend session creation, server-side amount/currency/order validation, verified IPN/webhooks, idempotent state transitions, pending/successful/failed/cancelled states, refunds and transaction history. Complete the gateway sandbox matrix before live mode. A browser redirect or frontend success message must never be treated as proof of payment.

## 8. Pricing guardrail

The sales kit's introductory BDT 10,000–15,000 range is a scoped quotation recommendation, not a verified market average or guaranteed willingness-to-pay. Use it only for the limited starter scope with client-supplied approved content/assets. Quote CMS, live reservations, backend order management, server-delivered email, payment and ongoing maintenance separately after discovery.

## 9. Technical references

- Vercel Request Headers: https://vercel.com/docs/headers/request-headers
- Vercel Response Headers: https://vercel.com/docs/headers/response-headers
- MDN X-Forwarded-For security guidance: https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/X-Forwarded-For

## 10. Release checklist

- [x] Production and Preview deployment metadata inspected.
- [x] Product blueprint and client sales/delivery documents reviewed.
- [x] Personal public email removed from the reviewed blueprint branch; public contact defaults are blank.
- [x] Reservation feature remains disabled by default.
- [x] Stale sitemap identified and replaced with route-generated output on the audit branch.
- [x] Reservation content-type validation tightened and regression test added on the audit branch.
- [x] Audit-branch CI checkpoint (run #215, commit `1f9aa06`) passed locked install, production dependency audit, tests, build and sitemap verification.
- [x] Repository lockfile committed; clean-install reproducibility and production dependency audit verified in run #215.
- [ ] Authorized Preview browser/mobile/tablet QA completed (HTTP smoke checks alone are insufficient).
- [ ] Gallery lightbox keyboard/screen-reader QA completed (initial focus, focus containment, Escape close, focus restoration).
- [x] Removed the catch-all rewrite, added a custom 404 page and added CI route-verification (run #245).
- [x] Latest Preview confirms unknown routes return HTTP 404 with the custom 404 page.
- [x] Vercel build uses `npm ci` via the committed `vercel.json` install command (confirmed in latest Preview logs).
- [ ] Trusted proxy/IP identity, consent evidence and duplicate-submission controls reviewed before enabling reservations.
- [ ] Live database migration, connectivity, backup and restore verified if reservations are in client scope.
- [ ] Client content, asset rights, domain and contact details approved.
- [ ] Production smoke test and client acceptance recorded.

**Final rule:** Do not mark NOKSHA TABLE fully production/client-ready until every applicable item has evidence. The current work prepares a safer, more verifiable starter; it does not authorize Production deployment or enable reservations/payments.

### Additional UI review finding
- Fixed the sticky order bar's `Review` anchor by adding the missing `id="order-summary"` to its target section. CI run #212 passed for checkpoint `8223765`; browser/device verification remains outstanding.
- Improved gallery lightbox keyboard accessibility: focus moves to Close on open, Tab/Shift+Tab remain within the dialog, Escape closes it, and focus returns to the image trigger. This is code-level work only; manual keyboard/screen-reader verification remains outstanding.
