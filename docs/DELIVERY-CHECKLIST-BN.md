# Restaurant Website — QA, Launch & Handover Checklist

## 1. Scope and content

- [ ] Signed/approved scope matches delivered pages and features
- [ ] Business name, address, phone, email and hours verified by client
- [ ] Menu names, descriptions, prices and availability approved
- [ ] Allergen/dietary statements approved by restaurant
- [ ] Images are client-owned, licensed or otherwise cleared for commercial use
- [ ] All 33 menu and 25 gallery images have a checked source page, creator and license record
- [ ] Rendered image match, sharpness, crop and mobile framing are checked in browser QA
- [ ] Strawberry Mojito and Thai Basil Rice Combo photographs match the actual displayed dish/drink
- [ ] Basmati Kacchi, Paratha and Chicken Chap photos match their labels and retain the required Creative Commons/Pexels attribution
- [ ] No invented awards, reviews, history, certifications or claims
- [ ] Sample/demo labels removed only after real content is approved

## 2. Functional QA

- [ ] Every navigation link works
- [ ] Every route loads directly and survives browser refresh
- [ ] Mobile menu opens, closes and supports Escape
- [ ] Menu search works for names, categories and descriptions
- [ ] Category filters and empty state work
- [ ] Dish detail routes show correct content and handle unknown IDs
- [ ] Phone, WhatsApp and email links use client-approved contact details
- [ ] WhatsApp number is active, uses the correct Bangladesh international format, and opens the intended business chat
- [ ] Add/remove quantities, line totals and subtotal are correct for several dishes
- [ ] WhatsApp order message contains correct dish names, quantities, subtotal, customer contact, pickup/delivery choice, delivery address when applicable and special instructions
- [ ] Order details remain only in the guest's message draft until the guest sends them; the demo does not silently store customer details
- [ ] Email alternative opens with the correct recipient, subject and order details
- [ ] Order buttons do not claim that an order was received or confirmed before the restaurant responds
- [ ] Map/directions link points to the verified location
- [ ] Forms have labels, required-field validation and understandable error states
- [ ] No form is described as working unless its actual delivery/storage path was tested
- [ ] No console errors or broken network assets

## 3. Responsive and accessibility basics

- [ ] Narrow mobile viewport checked
- [ ] Tablet viewport checked
- [ ] Laptop and wide desktop checked
- [ ] Keyboard-only navigation checked
- [ ] Visible focus indicator checked
- [ ] Images have meaningful alt text (decorative images use empty alt)
- [ ] Heading hierarchy and page titles checked
- [ ] Reduced-motion preference respected
- [ ] Text contrast and zoom/reflow checked

## 4. Security and privacy

- [ ] No secrets or private API keys in frontend bundle/repository
- [ ] Production environment variables configured server-side
- [ ] Admin accounts use unique credentials and least privilege
- [ ] No customer data in test fixtures, screenshots or public logs
- [ ] Privacy notice and consent wording reviewed by client
- [ ] Data retention and deletion procedure documented
- [ ] Spam/rate limits and server-side validation tested for active forms
- [ ] Third-party embeds, analytics and cookies reviewed
- [ ] Backup and restore process tested if database is used

## 5. Reservation-specific launch gate

When the live API is disabled, the demo reservation form prepares a WhatsApp request with an email alternative; it does not create or confirm a booking.
- [ ] WhatsApp reservation message includes the correct name, phone, date, time, guest count and notes
- [ ] Guest must press Send; restaurant must reply before any booking is described as confirmed
- [ ] Demo reservation details are not silently stored by the website

Do not enable reservations until every item below is true.

- [ ] Production database provisioned and schema applied
- [ ] Server-side secrets configured and checked
- [ ] Real privacy notice URL published and approved
- [ ] Request workflow and staff owner defined
- [ ] Staff can securely view, process and delete requests
- [ ] Notifications delivered and failure handling tested
- [ ] Table capacity, opening hours, lead time and blackout rules implemented
- [ ] Duplicate/conflicting requests handled according to agreed policy
- [ ] End-to-end test completed in production with controlled test data
- [ ] Customer-facing language says request received, not booking confirmed, unless confirmation is truly automated and operationally correct

## 6. Build and deployment

- [ ] `npm test` passes
- [ ] `npm run build` passes
- [ ] Production deployment is READY
- [ ] Custom domain and HTTPS verified
- [ ] Direct nested routes verified
- [ ] Canonical URL, sitemap and robots.txt use client domain
- [ ] Browser cache / CDN behavior checked after launch
- [ ] Final production commit recorded
- [ ] Latest preview deployment commit matches the intended branch head
- [ ] Build logs have no fatal errors; npm test and npm run build are both green
- [ ] Production alias still points to the approved production deployment until explicit release approval

## 7. Handover

- [ ] Client owns domain and hosting accounts
- [ ] Client has been invited to required provider accounts
- [ ] Source repository access transferred as agreed
- [ ] Environment variables transferred securely (never in public README/chat)
- [ ] Content editing/update instructions delivered
- [ ] Known limitations and third-party dependencies disclosed
- [ ] Maintenance contact and support window agreed
- [ ] Final invoice paid
- [ ] Client sign-off recorded

## 8. Handover acceptance

Client confirms:
- Delivered pages/features match the approved scope.
- Content and business details have been reviewed.
- Known exclusions and limitations have been explained.
- Account ownership and access have been handed over as agreed.

Client approver:
Date:
Approval reference:
