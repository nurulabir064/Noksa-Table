# NOKSHA TABLE — Sales Readiness & Technical Audit

**Audit date:** 11 November 2026  
**Repository:** https://github.com/nurulabir064/Noksa-Table  
**Audited working branch:** `feat/premium-homepage-ordering-gallery-contact`  
**Audited commit:** `3752fe3542c341feef083cbbcfa3586b9e8dc395`  
**Audit changes branch:** `chore/sales-readiness-audit`  
**Production domain:** https://noksa-table.vercel.app

## Executive decision

**Status: NOT APPROVED for unrestricted production client delivery.**

The repository contains a useful restaurant website starter and a set of sales/delivery templates. The inspected production deployment is marked READY and the Vercel project domain is verified. The audit branch's automated CI run also passed. These facts do not establish that every browser journey, third-party integration, database workflow, security control, or client-specific configuration has passed acceptance testing.

Sell only the explicitly scoped **restaurant website starter** after the client-specific content, assets, contact actions, deployment, and acceptance checks are completed. Do not represent the current demo as a live restaurant, confirmed reservation platform, backend order management system, or online payment platform.

## 1. Evidence checked

| Area | Evidence | Result |
|---|---|---|
| Vercel production deployment | Deployment record for commit `3752fe3` | READY |
| Vercel project domain | `noksa-table.vercel.app` | Verified |
| Git source | Production deployment metadata | Feature branch, commit `3752fe3` |
| README and sales kit | Repository files | Explicitly disclose demo limitations |
| Frontend configuration | `src/config/site.js` | Contains sample venue details; phone is blank; email is configured |
| Reservation API | `api/reservations.js` | Implemented with server-side guards; feature disabled by default |
| Database | `db/schema.sql` | Schema exists; live database operation not verified |
| Automated tests | GitHub Actions run #137, commit `5815ad5` | Passed |
| Production build | GitHub Actions run #137, commit `5815ad5` | Passed |
| CI workflow | `.github/workflows/ci.yml` | Updated on audit branch to validate all branch pushes and support manual runs |
| Browser QA | No live browser test evidence collected | Not verified |
| Payment gateway | No payment integration found in inspected repository tree | Not implemented |

## 2. Product scope that may be quoted

The current starter can be positioned for a limited restaurant website scope:

- Responsive restaurant presentation pages.
- Menu categories, search/filter and dish detail routes.
- About and gallery content.
- Client-approved public contact actions.
- Cart quantity and subtotal calculation.
- Prefilled email order enquiry, subject to verified public email configuration.

Opening or sending an email draft is an enquiry, not an accepted or confirmed order. The customer must send the email, and the restaurant must confirm stock, fulfilment, final charges, and payment directly.

## 3. Explicit exclusions until separately implemented and accepted

- Live reservation confirmation or table availability.
- Staff/admin dashboard or CMS.
- Backend order storage, order status, or delivery management.
- Automated email/SMS/WhatsApp notifications.
- Online payment, refunds, or transaction reconciliation.
- POS, inventory, or delivery-platform integrations.
- Ongoing menu/content maintenance unless contracted.

## 4. Blocking work before the first paid client launch

### A. Client configuration and content

- Replace sample brand, venue, address, opening hours, map location, and all contact details with client-approved information.
- Verify phone, email and map destinations on real devices.
- Obtain written approval for menu names, prices, descriptions, allergens and availability.
- Confirm commercial rights for every image, font, logo and written asset.
- Remove sample/demo wording only after the real information is approved.
- Update canonical URL, sitemap and robots sitemap reference for the client's domain.

### B. Functional and browser QA

- Test every route directly and after refresh.
- Test navigation, keyboard access, Escape behavior, focus visibility and mobile menu.
- Test menu search, filters, no-results state and invalid dish IDs.
- Test cart add/remove/quantity changes, subtotal, empty cart and generated email draft.
- Verify every public contact link.
- Test narrow mobile, tablet, laptop and wide desktop.
- Check console errors, network failures, missing images and broken links.
- Test privacy/consent messaging and all inactive-form states.

### C. Backend and privacy launch gate

The reservation API must remain disabled until the database is provisioned, schema is applied, privacy notice is approved, staff access and notifications exist, and the full request workflow is tested. Also verify rate limiting, request size, origin handling, data retention/deletion, backup/restore and operational ownership. A pending request must never be described as a confirmed table booking.

### D. Production and handover

- Run automated tests and production build from the exact candidate commit.
- Verify the resulting deployment and custom domain/HTTPS.
- Complete production smoke tests using controlled test data.
- Transfer domain and hosting ownership/access as agreed.
- Transfer secrets through an approved secure method, never through source code or public chat.
- Deliver operating instructions, known limitations and support boundaries.
- Record client acceptance and final payment before handover.

## 5. Online payment — separate future workstream

No payment integration was found in the inspected repository tree. Before implementation, select a Bangladesh gateway with the client's merchant eligibility and supported payment methods confirmed.

Required controls:
- Create checkout/session on the backend.
- Keep all secret credentials server-side.
- Verify transaction status server-to-server using the gateway's validation mechanism.
- Verify order reference, amount, currency and transaction identity.
- Verify signed/authentic IPN or webhook events according to gateway documentation.
- Make event handling idempotent and protect against duplicate callbacks.
- Track pending, successful, failed and cancelled states.
- Record refunds and transaction history.
- Complete sandbox success/failure/duplicate/amount-mismatch tests before live mode.

A browser redirect or frontend success message is never proof of payment.

## 6. Pricing guardrails

The existing sales kit proposes an introductory BDT 10,000–15,000 starter quote. Treat this as a scoped recommendation, not a verified market average or guaranteed willingness-to-pay.

Use it only when the client supplies approved content and usable licensed images, and the agreement excludes CMS, live booking, backend order management, payment, and ongoing updates. Quote integrations and content production separately after discovery.

## 7. Verification record and limitations

The audit is based on repository file inspection, Vercel deployment/domain metadata, and GitHub Actions. Run #137 completed successfully for commit `5815ad5`: dependency installation, automated tests, and production build all passed. A later CI run on commit `4f3ce20` also passed; the sitemap/CI updates on the current head are awaiting their own run.

This is not a substitute for browser automation, manual device testing, live database integration, penetration testing, accessibility assessment, load testing, or a client acceptance session. The public website could not be independently inspected with the available browser retrieval, so visual and live interaction claims remain unverified.

Do not mark a checklist item complete without recording the test, environment, date, result, and relevant evidence.

## 8. Release decision

- [x] Repository and deployment metadata inspected.
- [x] Sales and delivery documents inspected.
- [x] Demo limitations documented in repository README and sales materials.
- [x] CI workflow gap identified and corrected on the audit branch.
- [x] Automated CI run on the audit branch passed (run #137).
- [ ] Browser QA completed.
- [ ] Client-specific configuration and asset rights verified.
- [ ] Live database/reservation workflow accepted, if included in client scope.
- [ ] Security/privacy review completed for enabled features.
- [ ] Production smoke test completed for the client domain.
- [ ] Client sign-off recorded.

**Release rule:** Do not claim production/client acceptance until every applicable blocking item above has evidence and the client has approved the final scope.
