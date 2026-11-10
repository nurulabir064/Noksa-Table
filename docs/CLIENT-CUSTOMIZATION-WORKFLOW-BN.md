# Demo থেকে Client Website — Customization Workflow

এই workflow NOKSHA TABLE demo-কে নতুন restaurant client-এর তথ্য দিয়ে আলাদা project হিসেবে প্রস্তুত করার জন্য। Client-এর লিখিত approval এবং verified content ছাড়া কোনো তথ্য প্রকাশ করবেন না।

## 1. Client discovery ও scope approval

1. docs/CLIENT-ONBOARDING-BN.md পূরণ করুন।
2. Client-এর কাছ থেকে business name, branch, public phone/email, ঠিকানা, opening hours, menu, approved photos, policies ও website goal নিন।
3. Booking/order চাইলে সেটি brochure website-এর scope নয়—আলাদা business rules, database, notification, staff workflow, privacy ও QA scope লিখুন।
4. docs/CLIENT-PROPOSAL-TEMPLATE-BN.md এবং quotation-এ included/excluded features লিখে written approval নিন।
5. Client-এর account password, OTP বা private API key চাইবেন না। Client-কে hosting/domain provider-এ আপনাকে invite করতে বলুন।

## 2. আলাদা client project তৈরি

1. মূল demo repository সরাসরি client-এর নামে চালাবেন না। Client-এর জন্য নতুন repository/branch বা clean copy তৈরি করুন।
2. Demo repository ও production client repository আলাদা রাখুন; client-specific content ভুল করে public demo-তে push করবেন না।
3. Client-এর অনুমোদিত scope, content ও asset inventory লিখে রাখুন।

## 3. Public business configuration

src/config/site.js-এ কেবল public business information বসান:

| Field | কী বসবে |
|---|---|
| brandName | Approved public business name |
| descriptor | Restaurant / Cafe / Bakery ইত্যাদি |
| siteUrl | Client-owned HTTPS domain |
| tagline | Client-approved tagline |
| locationLabel | Verified branch/location label |
| openingHoursLabel | Client-confirmed hours |
| publicPhone | Public phone, country code সহ |

| publicEmail | Public business email |

| mapUrl | Verified Google Maps share/directions HTTPS link |
| instagramUrl | Verified public Instagram URL |

Phone বা email ফাঁকা থাকলে সংশ্লিষ্ট action link render হবে না। Public email-এ contact ও order enquiry draft তৈরি হয়; ব্যবহারকারীকে email app-এ Send চাপতে হয়।

**Security:** এই config browser bundle-এ প্রকাশিত হয়। এখানে কখনো password, database URL, API secret, SMTP credential, private token বা customer data রাখবেন না।

## 4. Menu, copy ও image replace

1. src/data.js-এ প্রতিটি menu item-এর unique id, নাম, category, approved description, current price, availability ও image URL বসান।
2. Allergen/dietary/health claim অনুমান করবেন না; restaurant-এর লিখিত approval নিন।
3. src/App.jsx-এর Home, About, Gallery, Contact ও Reservation copy client-এর বাস্তব তথ্য অনুযায়ী rewrite করুন। Fictional history, sample price, concept label, placeholder hours/location এবং demo wording সরান।
4. Unsplash demo image-কে client-owned/licensed ছবি দিয়ে replace করুন। Commercial use ও photographer/client permission যাচাই করুন; ছবির alt text-ও বাস্তব content অনুযায়ী লিখুন।
5. Logo/favicon public/favicon.svg-এ replace করুন।

## 5. SEO ও domain

1. src/config/site.js-এ siteUrl client-এর canonical HTTPS domain করুন।
2. Vite route metadata plugin vite.config.js-এ page title/description এবং default social image যাচাই করুন।
3. public/sitemap.xml-এ client domain এবং live routes বসান।
4. public/robots.txt-এ sitemap URL update করুন।
5. index.html-এর static fallback metadata, theme colour ও favicon reference যাচাই করুন।
6. প্রতিটি route-এর title, description, canonical, Open Graph ও Twitter metadata production build-এ পরীক্ষা করুন।

## 6. Contact বনাম form — গুরুত্বপূর্ণ পার্থক্য

- Reusable contact actions (src/components/ContactActions.jsx) কেবল verified phone/email/directions link তৈরি করে। Email action একটি draft খোলে; এটি নিজে থেকে message পাঠায় না।
- Contact form একটি prefilled email draft খোলে; ব্যবহারকারী Send না করা পর্যন্ত message যায় না এবং website message সংরক্ষণ করে না।
- Reservation API/schema repository-তে থাকলেও reservation feature default-এ disabled। Database, privacy notice, staff workflow, notifications, availability/capacity rules, access control ও production E2E test ছাড়া enable করবেন না।
- Client-এর যদি message form দরকার হয়, approved delivery channel (secure backend/email provider/CRM) implement করে success, failure, spam, rate limit, privacy ও retention test করুন। Frontend-only success screen-কে “message sent” বলবেন না।

## 7. Environment ও secrets

- Public VITE_* values bundle-এ দেখা যায়; কেবল public config-এর জন্য ব্যবহার করুন।
- DATABASE_URL, RATE_LIMIT_SECRET ও mail/provider secrets Vercel-এর server-side environment variables-এ রাখুন।
- Development, Preview ও Production environment আলাদা করে configure করুন।
- Secret GitHub, README, screenshots, frontend code বা chat-এ commit করবেন না।

## 8. QA ও production release

1. npm test এবং npm run build চালান।
2. Preview deployment-এ mobile (320/375/390px), tablet (768px), laptop (1366px) ও wide desktop (1440px+) দেখুন।
3. Header navigation, mobile menu, keyboard/Escape, menu search/filter/empty state, dish detail, image load, contact links, form disabled/success/error states পরীক্ষা করুন।
4. প্রতিটি route সরাসরি খুলুন এবং refresh দিন; console ও network errors দেখুন।
5. Client-এর লিখিত content, image, price, policy ও feature sign-off নিন।
6. Preview pass হলে production deploy করুন; Vercel deployment READY, alias/domain, HTTPS এবং প্রতিটি route response যাচাই করুন।
7. Handover-এ source, domain/hosting ownership, access, limitations, maintenance ও backup responsibility লিখিতভাবে দিন।

## Client launch acceptance checklist

- [ ] Client-owned domain এবং hosting access verified
- [ ] সব fictional/sample branding ও content সরানো হয়েছে
- [ ] Phone/email/location/hour client-confirmed
- [ ] Images licensed/approved
- [ ] Menu and prices approved
- [ ] Form/booking capability সত্যি implement ও tested, অথবা স্পষ্টভাবে disabled
- [ ] Privacy, retention ও contact workflow approved
- [ ] Mobile/desktop browser QA completed
- [ ] Automated tests and production build pass
- [ ] Final deployment READY এবং client sign-off recorded
