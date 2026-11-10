# NOKSHA TABLE — Verified Product Blueprint & Delivery Roadmap

> **Document status:** Verified working blueprint, not a claim that every feature is complete.  
> **Last reviewed:** 11 November 2026  
> **Repository:** https://github.com/nurulabir064/Noksa-Table  
> **Production demo:** https://noksa-table.vercel.app  
> **Working baseline:** `docs/verified-product-blueprint` at commit `8733c723f562ac12f36914090608622ef541e3d8`  
> **Product status:** Fictional restaurant concept/demo. It is not a real restaurant or a live booking/payment service.

---

## 1. Executive summary

NOKSHA TABLE is currently a React/Vite restaurant website concept with menu browsing, dish details, gallery, contact actions, an email-draft flow, and a reservation request API/schema that is disabled by default.

The current priority is **not** to turn on every feature at once. First reconcile the product documentation with the deployed code, protect personal contact information, verify the database connection, and decide the real email workflow. Then implement and test customer-facing workflows behind explicit launch gates.

### What is verified in the repository

- React 19, Vite 6, React Router 7, Tailwind CSS 4 and Lucide React are declared in `package.json`.
- The repository contains a reservation API at `api/reservations.js`, validation helpers, PostgreSQL schema at `db/schema.sql`, and automated Node tests.
- Reservation handling requires same-origin POST, JSON, valid input, privacy consent, an enabled server flag, database configuration and an HTTPS privacy-policy URL. Successful requests are stored as **pending**, not confirmed.
- The reservation feature is disabled unless the frontend and backend flags are explicitly enabled.
- The Contact page uses a `mailto:` link. It opens the visitor's email app; the visitor must review and press Send. The website does not send that message through a server.
- Menu order and dish enquiry actions also currently build `mailto:` drafts from `siteConfig.publicEmail`. They do not create a backend order or send a message automatically.
- The Production baseline commit `3752fe3` contained a personal Gmail address in public source configuration. The current documentation PR branch clears `publicEmail` to an empty value; it does not establish a new official NOKSHA TABLE business inbox. Do not treat the personal address as a business identity or expose it in a client demo.
- The app has no configured transactional email provider, email API endpoint, SMTP credentials, email delivery logs, or notification workflow.
- The codebase has a PostgreSQL reservation schema and uses `@neondatabase/serverless`; code presence alone does not prove that the live database is reachable or correctly migrated.

### Current deployment / hosting evidence

- Vercel project: `noksa-table`.
- Latest production deployment checked: **READY**, from branch `feat/premium-homepage-ordering-gallery-contact`, commit `3752fe3542c341feef083cbbcfa3586b9e8dc395`.
- Preview deployment checked: **READY**, from branch `docs/verified-product-blueprint`, commit `8733c723f562ac12f36914090608622ef541e3d8`; the Preview is protected by Vercel SSO, so automated visual/browser QA was not completed.
- Vercel environment-variable metadata shows a `DATABASE_URL` entry scoped to Production, Preview and Development. The secret value was not read. This confirms only that a variable entry exists; it does **not** prove that the value is correct, that it points to the intended Neon database, that the schema has been applied, or that a live query succeeds.
- No email-provider environment variable was present in the Vercel variable metadata returned during this review.
- The baseline CI workflow only triggered on `main`; it did not validate pushes/PRs targeting the active feature/documentation branches. A release-readiness change now broadens CI to all branches and adds concurrency cancellation and a job timeout.
- The committed `public/sitemap.xml` contains old dish slugs that do not match the current menu data. A release-readiness change generates the sitemap from the same route catalogue used by the build and removes the stale static file.
- No `package-lock.json` is committed. `npm install` currently works in the recorded Vercel build, but a clean `npm ci` cannot be used until a lockfile is generated and committed; dependency reproducibility remains open.
- Do not copy, print, commit, screenshot or send any secret value.

---

## 2. Email section — complete requirements and correct address roles

### 2.1 Do not invent real addresses; configure per client

NOKSHA TABLE is a fictional demo and no verified business-owned domain or official restaurant mailbox has been established. Therefore, this document deliberately does **not** invent addresses such as `info@nokshatable.com` or claim that they exist.

The Production baseline reviewed for this blueprint contained a personal Gmail address in public source configuration. The documentation PR branch clears `publicEmail` to an empty value. This is a demo-safe default, not an official NOKSHA TABLE mailbox.

For each real restaurant client, configure only the client-approved, client-owned public address during onboarding and handover. The default recommendation is one monitored shared inbox, with provider-side aliases/forwarding if the client needs separate operational destinations. Use separate mailboxes only when the restaurant's workflow and ownership justify them. Record who owns the domain/mailbox, who controls admin and recovery access, who monitors incoming mail, and who handles delivery failures. Never make a developer's personal mailbox the reusable product default.

### 2.2 Recommended mailbox structure

Prefer **one monitored primary mailbox plus aliases/forwarding**, rather than paying for many separate inboxes at the beginning. Create only the addresses needed by the agreed workflow.

| Role | Address pattern (not an existing address) | Purpose | Who should receive it? | Current status |
|---|---|---|---|---|
| General contact | `hello@<approved-domain>` or `info@<approved-domain>` | Public website enquiries | Owner/manager or assigned inbox | Not provided / not verified |
| Orders | `orders@<approved-domain>` | Order enquiries, only if email ordering is retained | Staff member responsible for orders | Not provided / not verified |
| Reservations | `reservations@<approved-domain>` | Reservation request notifications | Staff member responsible for bookings | Not provided / not verified |
| Customer support | `support@<approved-domain>` | Post-visit or service support, if needed | Assigned support contact | Optional; not required for demo |
| Privacy requests | `privacy@<approved-domain>` | Access/deletion/privacy requests where applicable | Data controller or designated privacy contact | Required only when a real customer-data workflow is launched; owner to define |
| Automated sender | `notifications@<verified-domain>` or `no-reply@<verified-domain>` | System-generated confirmations/status messages | Outbound sender identity; replies must have a monitored Reply-To | Not configured |
| Technical/admin owner | Private owner-controlled account; never shown publicly | Vercel, GitHub, Neon, email provider administration and recovery | Project owner only | Keep private; do not publish |

**Current implementation boundary:** the current frontend config supports one `publicEmail` recipient. Contact and menu order actions use that recipient to open a visitor-side `mailto:` draft. Separate `ordersEmail`/`reservationsEmail` routing is not implemented. Reservation notifications are also not implemented. Do not document or sell separate routing or automatic server email as available until the backend, tests and delivery monitoring are built.

**Important distinctions**

- A public contact address is where customers can write.
- A recipient address is where a form/order/reservation notification is delivered internally. It may be the same mailbox or an alias, but this must be intentionally configured.
- A sender address is the verified identity used by the email provider to send system messages.
- A Reply-To address is where a human reply should go. For customer-submitted forms, use the validated customer address as Reply-To only after safe validation; never place arbitrary user input in the From header.
- An admin/recovery email is private and must not be displayed on the website.
- A `no-reply` sender must not be used if customers are expected to reply without a monitored Reply-To.

### 2.3 Minimum practical setup for the current demo

1. Keep the demo `publicEmail` unset. For a client deployment, add only the client's approved public recipient during the client-specific customization step.
2. Do not reuse the developer's personal email as the product default or client recipient.
3. If the demo only needs a click-to-email action, keep the `mailto:` behaviour and label it accurately: it opens a draft; the user must press Send. It may fail if the visitor has no configured mail app.
4. If the website must reliably receive messages without depending on the visitor's email app, implement a server-side email API workflow. A `mailto:` link is not a substitute for a backend email service.
5. For production, verify ownership of the sending domain and configure the provider's required DNS authentication (SPF, DKIM and an appropriate DMARC policy). Start with a monitored test inbox and verify delivery, spam placement, bounces and provider logs.

### 2.4 Email workflows that must be specified separately

| Workflow | Trigger | Recipient | Customer response | Current implementation |
|---|---|---|---|---|
| General contact enquiry | Visitor submits Contact form | Approved general-contact inbox | Optional acknowledgement; only after server accepts the message | Opens a local email draft via `mailto:`; not server-delivered |
| Menu/order enquiry | Visitor selects menu items and chooses email action | Approved orders/general inbox | Staff confirms availability, fulfilment and final total manually | Builds a `mailto:` draft; no order record or automatic delivery |
| Dish enquiry | Visitor clicks enquiry on a dish | Approved orders/general inbox | Staff replies manually | Builds a `mailto:` draft |
| Reservation request | Valid request accepted by API and stored | Staff reservation inbox | Staff must confirm availability manually | API stores pending request; no email notification exists |
| Reservation status update | Staff changes pending request to confirmed/cancelled | Customer email | Status and any policy details | Not implemented |
| Payment status | Verified gateway callback/webhook changes payment state | Customer + internal finance/ops inbox | Receipt/status message | Not implemented; payment API/schema absent |

Do not show “Email sent”, “Order received”, “Reservation confirmed” or “Payment successful” unless the corresponding server-side operation and its result actually support that statement.

### 2.5 Transactional email architecture — when approved

For reliable server-side email, use this flow:

1. Browser submits a small JSON request to a same-origin backend endpoint.
2. Backend validates input, limits payload size, checks origin where applicable, applies rate limiting and spam controls, and normalizes data.
3. Backend reads the recipient, verified sender and provider API key from server-side environment variables.
4. Backend sends a template with a fixed verified From address, an approved recipient, a safe Reply-To, and a unique request/reference ID.
5. Backend records only the minimum delivery metadata needed for operations (provider message ID, event type, timestamp and status); avoid storing unnecessary message contents or secrets in logs.
6. UI reports “request accepted for processing” only after the backend returns success. A provider API acceptance is not proof that the recipient read the message or that it reached the inbox.
7. Handle provider errors, retries, duplicate submissions, bounce/complaint events and delivery webhooks without sending duplicate customer messages.

**Suggested server-only configuration names (names only; no values are set here):**

- `EMAIL_API_KEY` — private provider API credential.
- `EMAIL_FROM` — sender identity on a verified domain.
- `CONTACT_EMAIL_TO` — approved general enquiry recipient.
- `ORDERS_EMAIL_TO` — approved order enquiry recipient, if needed.
- `RESERVATIONS_EMAIL_TO` — approved reservation operations recipient.
- `EMAIL_REPLY_TO` — monitored reply address, if the workflow needs a fixed one.
- `EMAIL_PROVIDER_WEBHOOK_SECRET` — private signature-verification secret, only if provider webhooks are used.

These are design names, not existing Vercel variables. Keep them out of `VITE_*`, browser code, Git history and public documentation. Use separate Preview and Production values and redeploy after changing Vercel environment variables.

### 2.6 Email security and quality acceptance checks

- [ ] Owner approves each public/recipient/sender address and confirms mailbox access.
- [ ] Sending domain is owned/controlled by the responsible business.
- [ ] SPF, DKIM and DMARC are configured and checked with the selected provider.
- [ ] API key is server-only and is not present in the browser bundle or repository.
- [ ] Form fields are validated on the server; length limits and content type are enforced.
- [ ] Customer input cannot control the From header or arbitrary recipients.
- [ ] Rate limiting, honeypot or equivalent abuse controls are tested.
- [ ] Email HTML is escaped/sanitized and has a plain-text alternative.
- [ ] Reply-To is safe and expected; no private mailbox is exposed accidentally.
- [ ] Duplicate submission and retry behaviour is tested.
- [ ] Success, provider failure, invalid input, rate-limit, timeout and network states are tested.
- [ ] Delivery events/bounces/complaints are monitored without logging secrets or unnecessary personal data.
- [ ] Privacy notice, retention period, access controls and deletion process are approved before collecting real customer messages.

---

## 3. Current feature status — do not overstate completion

| Area | Repository evidence | Verified status | Remaining work |
|---|---|---|---|
| Public website | React/Vite pages and route metadata | Implemented in code; production deployment READY | Browser/mobile QA and content review still required |
| Menu and dish pages | Local data and routes | Implemented as demo content | Verify every item, price, image licence and final client content |
| Email contact action | `mailto:` helper and Contact form | Draft-opening only; no server email | Approve recipient; decide mailto vs server email |
| Email order enquiry | `mailto:` built from selected items | Draft-opening only; no backend order | Keep the email-draft limitation explicit; WhatsApp ordering is not implemented |
| WhatsApp contact/order | No WhatsApp number/config/helper is present in the reviewed `siteConfig`, `ContactActions` or `App.jsx` | Not implemented in this baseline | Treat as a separate feature; implement and test before quoting it as included |
| Reservation API | `api/reservations.js` | Implemented but gated; stores pending requests only when fully configured | Verify DB, migrate schema, staff workflow, notifications, availability rules and privacy |
| Reservation notification | No provider integration or notification code found in reviewed files | Not implemented | Implement after mailbox/provider and staff owner are approved |
| Database | Neon driver + schema; Vercel `DATABASE_URL` entry exists | Connection and schema state not proven | Safe connection test, migration check, backup/restore test |
| Admin/staff dashboard | Not found in reviewed product structure | Not implemented | Define staff roles and workflow before building |
| Online payment | No payment API or order/payment schema found in reviewed files | Not implemented | Design order/payment state machine; choose provider; sandbox only |
| Authentication/authorization | No admin workflow verified | Not implemented for staff operations | Add role-based server-side access before exposing customer records |
| Automated tests | Node test suite exists | Unit/API guard tests exist | Run in current branch; add integration and browser E2E coverage |
| Production monitoring | Vercel deployment metadata available | Deployment state READY | Logs, alerting, error tracking, DB health, backups and runbook remain |
| Real restaurant launch | Demo data and sample location/hours remain | Not production-ready for a real restaurant | Client verification, assets, policies, domain and sign-off required |

### Documentation mismatch to correct

The repository README and the reviewed `src/App.jsx` confirm that menu-cart and dish-detail enquiry actions construct `mailto:` drafts; they do not create backend orders or send WhatsApp messages. This PR also corrects the stale WhatsApp-order claims in the README, sales kit and proposal template. WhatsApp click-to-chat remains a possible separately scoped feature, not a verified feature of this baseline.

---

### Security-first review findings — must resolve before enabling customer-data workflows

The following are code/configuration review findings, not a penetration-test result or a claim of exploitability. Resolve and test them before reservations, staff access, automated email, or payment are enabled.

1. **Public contact privacy:** the deployed Production baseline contains a personal email in public frontend configuration. The PR branch clears it, but Production is unchanged until merge and deployment. Verify the production bundle and rendered Contact page after release.
2. **Origin validation:** the reservation handler constructs the expected origin from forwarded protocol and host headers. Before enabling it, confirm the trusted-proxy/header contract for the deployment platform and prefer a strict canonical-origin allowlist. Add tests for spoofed/missing/malformed forwarded headers and unexpected hosts.
3. **Rate-limit identity:** the handler uses `x-real-ip` as the client identity. Confirm the platform overwrites this header and clients cannot supply an arbitrary value through the edge. Retain application-level limits and consider edge/WAF rate limiting; test bypass attempts.
4. **Duplicate submissions:** there is no idempotency key or duplicate-request constraint in the reviewed reservation flow. A retry/double-click may create more than one pending request. Define a safe idempotency strategy and test retries before real booking launch.
5. **Consent evidence:** the API requires `consent: true`, but the reviewed schema does not store the privacy-notice version or consent timestamp. Decide what evidence and retention are appropriate with the business owner before collecting real customer data.
6. **Rate-limit table maintenance:** expired rate-limit rows are deleted during each accepted API execution. Evaluate the write overhead and move cleanup to a bounded/scheduled process if volume makes this expensive.
7. **Database verification:** a `DATABASE_URL` variable entry exists in Vercel metadata, but its value, target Neon branch/role, schema migration and successful live query remain unverified. Never print or expose the connection string.
8. **Staff access:** no staff/admin authentication, authorization or secure request-review interface was verified. Keep reservation records inaccessible to the public; do not enable real reservations until least-privilege staff access and auditability exist.
9. **Security headers:** `vercel.json` defines CSP, frame denial, nosniff, referrer and permissions headers. Verify the actual production response headers and test every external image/font/resource against CSP. The current CSP permits inline styles; tighten only after confirming the app still renders correctly.
10. **Test coverage:** current automated tests cover menu data/cart, contact links, reservation validation and API guards. They do not prove live DB connectivity, browser E2E, staff authorization, load resilience, or penetration-test readiness.

**Release gate:** keep reservations disabled, do not collect real customer data, and do not enable live payments until the applicable findings are resolved, tested and documented. No raw secrets, customer details, session tokens or payment-card data should be written to logs.

## 4. Ordered implementation roadmap

Each phase has a gate. Do not skip a gate merely to make the checklist appear complete.

### Phase 0 — Freeze the verified baseline

**Tasks**
1. Keep the current production deployment unchanged while auditing.
2. Work on a separate branch and use a pull request for review; do not make unreviewed direct production changes.
3. Record the deployed commit, repository branch and Vercel deployment.
4. Run the existing test suite and production build on the working branch.
5. Reconcile README and sales documents with the actual application behaviour.

**Exit criteria**
- [ ] Baseline commit and deployment recorded.
- [ ] Tests/build result recorded.
- [ ] Documentation does not claim unimplemented email, WhatsApp, booking or payment features.

### Phase 1 — Confirm business identity and contact ownership

**Tasks**
1. Confirm whether NOKSHA TABLE remains only a portfolio demo or is being turned into a real restaurant/client site.
2. Confirm the business/domain owner. Do not assume the Vercel demo domain is a business-owned email domain.
3. Approve the public email, order recipient and reservation recipient, or explicitly decide to use one shared monitored inbox with aliases.
4. Confirm the public WhatsApp number and who controls it.
5. Remove any personal address from public demo configuration unless its owner explicitly approves publication for this exact purpose.
6. Confirm the exact location, opening hours, menu, prices and photo rights before removing demo labels.

**Exit criteria**
- [ ] Every public contact detail has an owner-approved source.
- [ ] No personal/admin/recovery address is accidentally public.
- [ ] Demo vs real-business status is explicit.

### Phase 2 — Decide and implement the customer contact journey

**Decision required**
Choose one of these per action; do not mix the labels:

- **Email draft (smallest implementation):** visitor's email app opens with a prefilled message; visitor presses Send. No server receipt or delivery tracking.
- **Server-delivered contact form:** browser submits to backend; backend validates and sends via a transactional email provider; server returns a truthful accepted/error response.
- **WhatsApp click-to-chat:** opens WhatsApp with a prefilled draft; visitor reviews and presses Send. It is not an order record or automatic send.

**Tasks**
1. Choose the required behaviour for Contact, Order and Dish Enquiry separately.
2. Approve the recipient address and sender domain.
3. If server-delivered email is required, select a provider only after checking domain verification, pricing/limits, regional availability, webhook support and operational ownership.
4. Implement the backend endpoint and email templates; keep credentials server-side.
5. Add anti-spam, rate limiting, safe Reply-To, duplicate handling and delivery/error states.
6. Update app copy, tests, README and client-facing documents to match actual behaviour.

**Exit criteria**
- [ ] Each button has one accurate, tested action.
- [ ] No UI claims an email was sent when it only opened a draft.
- [ ] Provider delivery and failure paths are tested, if server email is implemented.

### Phase 3 — Verify Neon PostgreSQL connection and schema

**Tasks**
1. In Neon, verify the intended project, branch, database and role. Never paste the connection string into chat or source code.
2. For Vercel serverless application traffic, verify that `DATABASE_URL` uses the Neon pooled endpoint. Use a direct connection only for migrations or tools that need session-level behaviour.
3. Verify Vercel Production/Preview/Development variable targets without revealing the secret value.
4. Run a server-side connection check that returns only a safe pass/fail and database identity (never the full URL or credentials).
5. Apply `db/schema.sql` to the intended database and verify tables/indexes exist.
6. Test a controlled insert/read/delete in a non-production or clearly marked test environment.
7. Document backup, restore, retention and deletion.

**Exit criteria**
- [ ] A real server-side query succeeds.
- [ ] Schema version/tables are verified.
- [ ] Test data is removed.
- [ ] Backup and restore procedure is documented and tested.

### Phase 4 — Complete reservation operations before enabling booking

**Tasks**
1. Define opening hours, slot length, party-size limits, lead time, maximum advance window, blackout dates and cancellation policy with the restaurant owner.
2. Decide whether the website only records requests or truly confirms availability. Current API semantics are request-only.
3. Define a staff owner and secure admin workflow to view, process and delete requests.
4. Add reservation notification email and staff failure handling.
5. Add duplicate/conflict protection and a real availability/capacity model if instant confirmation is required.
6. Finalize privacy notice, lawful basis/consent wording, data minimization, retention and deletion.
7. Add authorization for staff data access; never expose reservation records publicly.
8. Test pending, confirmed, cancelled, duplicate, conflict, expired slot, notification failure and database failure cases.

**Launch gate**
- [ ] All reservation QA and privacy items pass.
- [ ] Only then may the frontend and backend reservation flags be enabled together.
- [ ] The UI must say “request received” unless the system truly confirms a table.

### Phase 5 — Design order management before payment

**Tasks**
1. Define an order model: customer, line items, item price snapshot, quantity, subtotal, delivery/pickup, fees, total, status and timestamps.
2. Define order statuses and allowed transitions; never trust a client-submitted total.
3. Define who accepts/rejects orders and how unavailable items or price changes are handled.
4. Add staff access, audit trail, idempotency and notification workflow.
5. Define cancellation, refund, reconciliation and customer support processes.
6. Test the order lifecycle without real money.

**Exit criteria**
- [ ] A complete order can be created, reviewed, accepted/rejected and traced.
- [ ] Server recalculates totals from trusted menu data.
- [ ] Duplicate requests cannot create duplicate orders.

### Phase 6 — Payment gateway (sandbox first; no live merchant activation)

**Tasks**
1. Confirm business/legal eligibility and the account owner for the selected Bangladesh payment provider.
2. Compare supported methods, fees, settlement, refunds, sandbox, webhook/IPN documentation and support before selecting a provider.
3. Add Order and Payment database tables with explicit state transitions.
4. Create payment sessions only on the server using the trusted order total.
5. Verify callbacks/IPN server-to-server using the provider's documented validation method. Never trust a browser redirect as proof of payment.
6. Verify amount, currency, merchant/order reference and transaction identity.
7. Make webhook processing idempotent and safe against replay/duplicate delivery.
8. Store provider references and minimal audit metadata; never store raw card data.
9. Test sandbox success, failure, cancellation, pending, timeout, invalid signature, duplicate callback, wrong amount/currency and refund scenarios.

**Current constraint**
- No live merchant account or live payment activation is assumed or authorized in this blueprint.
- Do not add live credentials or switch to production payment processing without explicit owner approval and successful sandbox reconciliation.

### Phase 7 — Staff authentication and authorization

**Tasks**
1. Select a maintained authentication approach suitable for the deployed stack.
2. Require secure sessions/cookies, CSRF protection where relevant, password reset and strong account recovery.
3. Define least-privilege roles (e.g. owner, manager, reservations staff, order staff).
4. Enforce authorization on every server endpoint; hiding UI controls is not security.
5. Add audit logs for status changes and sensitive admin actions.
6. Test unauthorized, unauthenticated, cross-role and session-expiry cases.

### Phase 8 — Full QA and release readiness

**Automated**
- [ ] Unit tests for validation, price calculation, status transitions and email content.
- [ ] API tests for method, origin, content type, payload size, validation, rate limit, authorization and error handling.
- [ ] Database integration tests for constraints, transactions, duplicates and rollback.
- [ ] Email provider tests/mocks for success, failure, retry, duplicate and webhook signature.
- [ ] Payment sandbox tests for every state and idempotency.
- [ ] Browser E2E tests for mobile/desktop customer and staff workflows.

**Manual**
- [ ] Test current Android/mobile and desktop browsers.
- [ ] Test keyboard-only use, visible focus, labels, contrast, zoom/reflow and reduced motion.
- [ ] Test all routes directly and on refresh.
- [ ] Check console/network errors, images, broken links and slow/offline conditions.
- [ ] Verify content, prices, contact details, opening hours and policies with the owner.
- [ ] Run security review and dependency audit.
- [ ] Measure real performance and accessibility; do not claim a score without measurement.

### Phase 9 — Production domain, deployment and handover

**Tasks**
1. Use a client/owner-controlled domain and hosting accounts.
2. Configure DNS and HTTPS; verify ownership.
3. Set separate Preview and Production environment variables.
4. Deploy from the reviewed production branch after tests pass.
5. Verify deployment READY, domain aliases, TLS, direct routes and server functions.
6. Configure logs, alerts, database monitoring, backup schedule and restore runbook.
7. Deliver source access, operational documentation, account ownership and maintenance boundaries.
8. Obtain written acceptance and record the deployed commit.

**Exit criteria**
- [ ] Production domain and HTTPS work.
- [ ] All production workflows have passed end-to-end tests.
- [ ] Client owns the critical accounts and receives handover.
- [ ] Known limitations and support terms are documented.

---

## 5. Immediate next actions — exact order

1. **Client-specific email setup:** keep demo `publicEmail` blank; during each client onboarding, record the approved client-owned public email, shared inbox vs alias/mailbox routing, mailbox owner and required workflow. Current code uses one `publicEmail` for contact/order drafts; distinct order/reservation routing and server-delivered email are future implementation work.
2. **Privacy correction:** <strong>PR branch completed</strong> — public email is blank pending approval; a neutral example address is used in tests. This takes effect on the production site only after the PR is reviewed, merged and deployed.
3. **Behaviour/documentation consistency:** PR branch updates README, sales kit and proposal to describe the implemented email-draft journey accurately; WhatsApp click-to-chat remains unimplemented and must be separately scoped.
4. **Database verification:** check the existing Vercel `DATABASE_URL` entry safely, verify its intended Neon target and run a server-side connection/schema test. Do not expose the secret.
5. **Reservation operations:** keep reservations disabled until staff workflow, notifications, capacity rules, privacy and tests are complete.
6. **Order model:** design and test order records and server-calculated totals before considering online payment.
7. **Payment:** sandbox-only design and tests after order workflow; no live merchant activation.
8. **Final QA and release:** automated, browser, security, accessibility, performance, backup and deployment checks.
9. **Handover:** documentation, account ownership, maintenance and written acceptance.

### Items that must be supplied/approved by the business owner

- Approved public email address or domain mailbox.
- Order recipient and reservation recipient (or approval to use one shared monitored inbox).
- Whether email should open a visitor draft or be sent by the website backend.
- Domain ownership and approved sender domain for transactional email.
- Verified business phone/WhatsApp ownership.
- Real restaurant identity, exact address, opening hours, menu and photo permissions.
- Staff member responsible for contact, order and reservation follow-up.
- Privacy notice owner, retention period and deletion contact.

Until these are approved, keep the corresponding settings blank or features disabled. Do not substitute a personal email or sample business detail.

---

## 6. Official technical references

These references support implementation constraints; they do not imply that an integration has already been completed.

- Vite environment variables: https://vite.dev/guide/env-and-mode — values prefixed with `VITE_` are exposed to client-side code; never put API keys or database credentials there.
- Vercel environment variables: https://vercel.com/docs/environment-variables — variables are configured per environment; changes apply to new deployments, so redeploy after changes.
- Vercel environment management: https://vercel.com/docs/environment-variables/managing-environment-variables
- Neon connection pooling: https://neon.com/docs/connect/connection-pooling — use the pooled endpoint for serverless application traffic; use direct connections for migration/admin operations that require session behaviour.
- Neon connection guide: https://neon.com/docs/get-started/connect-neon
- Resend official Node SDK: https://github.com/resend/resend-node — one possible provider implementation reference; a provider must still be selected and its domain verified before use.

---

## 7. Change log

- 2026-11-09: Created this blueprint from the current production deployment commit and reviewed repository source, contact-link helpers, reservation API/validation, SQL schema, tests, README, sales/onboarding/delivery documents and Vercel environment-variable metadata.
- 2026-11-09: In this PR branch, cleared the unapproved personal public email, replaced the personal email in the unit-test fixture with a neutral example address, corrected the missing-recipient UI error text, aligned README descriptions with the current email-draft flow, and documented client-owned email setup/shared-inbox vs separate-routing decisions in onboarding, customization and handover checklists.
- 2026-11-11: Rechecked production and Preview deployment metadata, identified the stale sitemap and branch-limited CI triggers, and prepared fixes on a branch based on this verified blueprint. The Preview still requires an authorized browser/device acceptance pass; the lockfile/reproducible-install gap remains open.
- No database schema, environment-variable value, email account, payment credential or production setting was changed. Production remains unchanged until the PR is reviewed, merged and deployed.
