# NOKSHA TABLE — Sales Readiness & Technical Audit

**Audit date:** 11 November 2026  
**Repository:** https://github.com/nurulabir064/Noksa-Table  
**Production domain:** https://noksa-table.vercel.app  
**Production deployment:** READY — `chore/sales-readiness-release-gates` / `79c51071377506280fbe4cd5002d05ae00c513db` · `dpl_5m4wxZCSCiTfygocEddFWmL2mkPD`  
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
| Production deployment | Vercel deployment `dpl_5m4wxZCSCiTfygocEddFWmL2mkPD` for commit `79c5107` on `chore/sales-readiness-release-gates` | READY; deployed directly to Production |
| Product blueprint Preview | Vercel Preview for commit `8733c72` | READY; protected by Vercel SSO |
| Sales-readiness branch Preview | Vercel deployment `dpl_4QcX4ZWWRbd9MMbYt95i9K5Y2dBJ`, commit `f7c5156` | READY; separate Preview deployment, no Production alias assigned |
| HTTP route/header smoke checks | Preview `/`, `/menu`, `/about`, `/gallery`, `/reservation`, `/contact`, `/menu/thai-soup`, `/sitemap.xml`, `/robots.txt`, `/favicon.svg` | All returned HTTP 200; key security headers present; interactive browser/device QA still not completed |
| Unknown-route handling | Preview `/not-a-real-page` | HTTP 404 with custom `Page not found | NOKSHA TABLE` response; verified after removing catch-all rewrite and adding `public/404.html` |
| Baseline automated tests | PR #7 validation record, 9 Nov 2026 | 31/31 passed |
| Baseline production build | PR #7 validation record | Passed |
| Current CI evidence | GitHub Actions run #301 checked PR #9 merge commit `f2e5cb3` (the merge of head `79c5107` into base `8733c72`) | Passed: 36/36 automated tests, locked install, production/full-tree high-severity audits, build, sitemap, route/404 and 48 remote image URL checks. This is a PR merge-ref run, not a standalone status check on the Production SHA. |
| Dependency reproducibility | `package-lock.json` is committed; GitHub Actions uses `npm ci` | Locked install passed in run #301; `vercel.json` now explicitly sets `installCommand: npm ci` to align Vercel Preview/Production builds with CI; latest Preview build confirmed `npm ci` |
| Sitemap | Old static file contained menu slugs not present in current data | Replaced with build-generated route sitemap and post-build verifier; run #296 passed |

The latest previously confirmed audit-branch Preview for code commit `f7c5156` is READY; the later `79c5107` commit was deployed directly to Production. The preceding Preview's HTTP smoke checks returned 200 for `/`, `/menu`, `/gallery`, `/reservation` and dish pages; `/not-a-real-page` returned 404; GET `/api/reservations` returned 405. The Vercel fetch connector could not resolve the newest Preview URL during the final HTTP check, so the latest code's route-level HTTP smoke checks remain pending. This verifies route reachability only, not reservation POST/database behavior. The user-provided desktop screenshot visually confirms the homepage hero restaurant photograph loads and the desktop composition is intact. The narrow-window screenshot was captured while the page was scrolled; it does not prove a header/hero overlap defect, so no speculative CSS change was made. The homepage HTML and Vite-generated route metadata previously described the demo as a Bengali dining house and used a soup photo for social previews; these were corrected to the current multi-cuisine concept and restaurant-interior hero image. Latest Preview HTML checks confirm consistent titles, descriptions, canonical URLs and Open Graph images on home, menu, story, gallery and dish-detail routes. Route-level HTTP checks and response-header checks passed for the paths listed above. This is not a substitute for a real browser session: visual layout, React hydration, keyboard interaction, screen-reader behavior, mobile breakpoints, form behavior and browser console/network errors remain unverified. The Preview is protected by Vercel SSO; use the temporary share URL only with intended reviewers.

## 4. Backend, database and privacy review

### Reservation API

The repository contains `api/reservations.js`, validation helpers and `db/schema.sql`.

Verified code-level controls include POST-only handling, same-origin checks, JSON request handling, payload limits, field validation, a honeypot field, a consent requirement, a disabled-by-default feature flag, server-side database configuration checks, rate limiting and pending-only request semantics.

A successful API response means **request received / pending**, not a confirmed table booking. The API must remain disabled until the client has an approved privacy notice, database migration, staff workflow, notification process, retention/deletion policy, backup/recovery procedure and production end-to-end tests.

### Security findings that remain release gates

- The content-type guard has been tightened to accept `application/json` (including parameters such as charset) and reject lookalike media types such as `application/jsonp`; a regression test was added.
- Vercel's official Request Headers documentation says `host` is the domain used by the visitor, `x-forwarded-host` mirrors it, and `x-forwarded-proto` carries the forwarded protocol. The API's origin comparison is consistent with these documented headers. If a separate proxy/CDN is placed in front of Vercel, re-check the full trusted-proxy chain and canonical host policy before enabling reservations.
- Rate limiting uses `x-real-ip`. Vercel documents this as identical to its `x-forwarded-for` value and says it overwrites `x-forwarded-for` to prevent IP spoofing. This supports the current use on a direct Vercel deployment; an external proxy may cause Vercel to see the proxy IP unless a supported Trusted Proxy configuration is used.
- The audit branch now persists consent timestamp and `PRIVACY_POLICY_VERSION` on new reservation rows. Historical rows remain NULL after migration rather than receiving fabricated consent evidence; database migration/integration verification remains pending.
- The audit branch implements a durable UUID v4 idempotency key and request fingerprint. Identical retries return the original reference; reusing a key with changed data returns 409. The migration and concurrent database integration tests remain pending.
- There is no staff/admin interface, notification delivery, availability engine or operational review workflow.
- The live database connection and schema migration have not been tested. Vercel metadata showed a `DATABASE_URL` variable entry, but its value was not read and no live query was performed.
- The repository declares CSP, frame, content-type, referrer and permissions headers. Vercel's Response Headers documentation says the platform automatically returns HSTS with a default `max-age=63072000`. Confirm the effective response headers on every client domain, especially if another proxy/CDN is introduced.
- No penetration test, load test, accessibility audit or live data-retention test has been completed.
- The audit branch explicitly sets `installCommand: npm ci` in `vercel.json`, and the latest Preview build confirmed it. npm still emits an unknown `cache-dir` configuration warning and an `esbuild` install-script approval warning, although the Vite build succeeded.

## 5. CI, SEO and maintainability changes in this audit branch

- CI now validates pushes and pull requests on all branches, supports manual dispatch, cancels superseded runs and has a 15-minute job timeout.
- CI runs `npm audit --omit=dev` after the locked install to check production dependencies; run #296 passed this gate.
- CI also runs `npm audit --audit-level=high` against the full dependency tree, so high/critical advisories in development dependencies fail the workflow. Moderate advisories remain visible for follow-up; run #296 passed the full-tree high-severity gate.
- Production build is a separate CI step after automated tests.
- The static sitemap with stale dish URLs is removed. Vite now generates `dist/sitemap.xml` from the current page and dish route catalogue.
- A post-build verifier checks that every expected route appears exactly once and that stale or unexpected URLs are absent.
- The reservation API now checks the exact JSON media type, with a regression test for charset and JSONP cases.
- Reservation submissions now require a UUID v4 idempotency key. The browser reuses the key from session storage after network retries; the API stores a request fingerprint and returns the original reference for an identical retry, while rejecting changed payloads that reuse the key.
- Reservation consent evidence is now persisted as server timestamp plus `PRIVACY_POLICY_VERSION`. Both frontend and backend require an HTTPS privacy notice and a configured policy version before enabling the form.
- Added `db/migrations/001_reservation_consent_idempotency.sql`. It deliberately leaves historical consent evidence NULL rather than fabricating past consent; a NOT VALID check enforces evidence on new writes. Apply and verify this migration on the client-owned database before reservation activation.
- Gallery thumbnails and lightbox images now show an explicit fallback when a remote photo fails to load. Added source-level regression tests for fallback markup and dialog keyboard semantics.
- Removed the catch-all SPA rewrite that caused unknown paths to return HTTP 200; added an accessible static `public/404.html` and a CI verifier for explicit application rewrites/custom 404 presence. Run #245 passed the new verifier. Latest Preview HTTP check confirmed unknown paths return 404 with the custom page.

Release-state correction (11 Nov 2026): Vercel currently has a READY Production deployment created directly from `chore/sales-readiness-release-gates` at `79c5107`. That release branch is not the repository default branch; GitHub `main` remains at `34f16da`. PR #7 and PR #9 have no submitted approving reviews in the inspected review records. Therefore Production is live, but the repository's default-branch/release governance is not reconciled. Do not merge automatically: first review the stacked PR bases, required checks and exact merge result, then make the release branch the reviewed source of truth.

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
- [x] Audit-branch CI run #296 (code commit `f7c5156`) passed locked install, dependency audits, tests, build, sitemap, routes/404 and 48 image URL checks.
- [x] Repository lockfile committed; clean-install reproducibility and production dependency audit verified in run #215.
- [x] Preview HTTP smoke checks: home/menu/gallery/reservation/dish pages 200, custom 404 404, reservation API GET 405.
- [ ] Real-browser desktop/tablet/mobile QA completed (HTTP smoke checks alone are insufficient).
- [x] CI verified 48 unique remote image URLs return image content types (run #296).
- [x] Replaced broken assets and corrected identified dish-photo mismatches; source/license links added for confirmed credits.
- [ ] Visually inspect all menu/gallery crops and the remaining dish subjects in a real browser.
- [x] Added gallery image-load fallback and source-level dialog accessibility regression tests (CI #301).
- [ ] Gallery lightbox keyboard/screen-reader QA completed in a real browser (initial focus, focus containment, Escape close, focus restoration).
- [x] Removed the catch-all rewrite, added a custom 404 page and added CI route-verification (run #296).
- [x] Preceding Preview confirms unknown routes return HTTP 404 with the custom 404 page.
- [ ] Re-run route-level HTTP smoke checks against latest Preview commit `f7c5156`.
- [x] Homepage and route SEO/social metadata corrected to multi-cuisine restaurant positioning; Preview HTML verified for home, menu, story, gallery and dish detail.
- [x] Vercel build uses `npm ci` via the committed `vercel.json` install command (confirmed in latest Preview logs).
- [x] Implemented consent timestamp/version persistence and durable idempotency-key/fingerprint logic in code; CI #296 passed.
- [ ] Apply the new reservation migration to a non-production database and verify concurrent duplicate requests, payload mismatch (409), and consent audit fields with integration tests.
- [ ] Trusted proxy/IP identity and production data-retention/backup controls reviewed before enabling reservations.
- [ ] Live database migration, connectivity, backup and restore verified if reservations are in client scope.
- [ ] Client content, asset rights, domain and contact details approved.
- [ ] Production smoke test and client acceptance recorded.

**Final rule:** The demo is deployed to Vercel Production, but this is not equivalent to client acceptance or a fully verified production product. Do not claim client-ready until applicable browser/device, integration, security and client-content gates have evidence. Reservation and payment remain disabled/not implemented.

### Additional UI review finding
- Fixed the sticky order bar's `Review` anchor by adding the missing `id="order-summary"` to its target section. CI run #212 passed for checkpoint `8223765`; browser/device verification remains outstanding.
- Improved gallery lightbox keyboard accessibility: focus moves to Close on open, Tab/Shift+Tab remain within the dialog, Escape closes it, and focus returns to the image trigger. This is code-level work only; manual keyboard/screen-reader verification remains outstanding.


## 11. Latest deployment and repository consistency correction

- Vercel project metadata confirms the latest Production deployment is `dpl_5m4wxZCSCiTfygocEddFWmL2mkPD`, READY, from commit `79c51071377506280fbe4cd5002d05ae00c513db` on `chore/sales-readiness-release-gates`.
- The deployment record exposes a generated branch alias. The project domain `noksa-table.vercel.app` is verified and attached to the project, but direct HTTP checks from the current audit environment could not resolve the domain; do not report live route smoke checks as freshly re-performed here.
- The repository default branch `main` is `34f16da6ece588a2c672f4bf0284106318809ade`; the Production commit is 151 commits ahead of that base and includes the release-gate changes. Production source is therefore not yet the default branch's checked-out source.
- GitHub Actions run #301 passed on PR #9's synthetic merge ref `f2e5cb3`, not as a standalone commit status for `79c5107`. The log shows 36/36 tests passed, both npm audits reported zero vulnerabilities, the build and sitemap/route checks passed, and 48 unique remote image URLs returned image content types.
- Runtime error aggregation returned no error clusters for the last 24 hours. Individual runtime-log query for 24 hours was unavailable on the current Hobby retention; a 45-minute error/fatal query returned no logs. This is limited observability evidence, not proof that no user-facing errors occurred.
- The latest run emitted a GitHub Actions warning because `actions/checkout@v4` and `actions/setup-node@v4` still target Node 20, which runners now force to Node 24. A follow-up branch pins Node-24-compatible immutable v7 releases; its CI result is pending.
- README setup instructions now need `PRIVACY_POLICY_VERSION` and `VITE_PRIVACY_POLICY_VERSION` in addition to the existing URL and enable flags. This follow-up branch corrects those instructions; the currently deployed commit's README still omits them.
