# Restaurant profile configuration (Bangla)

এই project-টি **একটি codebase, এক restaurant per deployment** মডেলে তৈরি করা হচ্ছে। একই reusable template থেকে প্রতিটি client-এর জন্য আলাদা Vercel project/deployment ও domain থাকবে। এটি shared multi-tenant database বা এক URL-এ বহু restaurant account system নয়।

## 1. Restaurant profile নির্বাচন

Restaurant-এর public details `src/config/site.js`-এর `restaurantProfiles` object-এ থাকে। প্রতিটি profile-এর unique ID থাকতে হবে।

Vercel project-এর Build Environment Variables-এ সেট করুন:

```env
VITE_RESTAURANT_ID=client-restaurant-id
```

Local development-এ `.env.local` তৈরি করে একই variable দিন। `.env.example` reference হিসেবে ব্যবহার করুন। Unknown ID হলে স্পষ্ট error হবে; নীরবে ভুল restaurant দেখাবে না।

## 2. Client profile-এ যা বদলাবেন

- `brandName`, `brandMark`, `descriptor`, `tagline`
- `siteUrl` — client-এর final HTTPS domain
- `locationLabel`, `openingHoursLabel`
- `publicPhone`, `whatsappNumber`, `publicEmail`
- `whatsappMessage`, `mapUrl`, `instagramUrl`
- `contentMode`: `demo` অথবা `live`
- `features`: WhatsApp order enquiry, WhatsApp contact action, reservation request

Public Vite variables browser bundle-এ দেখা যায়। তাই এখানে API key, database password, secret token, private customer data রাখা যাবে না।

## 3. Menu ও content

বর্তমান menu data `src/data.js`-এ centralised, কিন্তু এখনও NOKSHA TABLE-এর sample menu। নতুন client-এর জন্য client-approved menu items, category, price, description, image URL এবং image usage rights দিয়ে এই dataset replace/extend করুন। Dish ID unique হতে হবে; category অবশ্যই category list-এ থাকতে হবে। `npm test` এই invariants যাচাই করে।

Home, story, gallery ও category copy-তে client-এর অনুমোদিত লেখা/ছবি বসান। শুধু profile-এর brand name বদলালেই সব editorial copy বা photo automatically client-specific হয়ে যায় না।

## 4. Demo বনাম live

- `demo`: sample price/disclaimer দেখায়। NOKSHA TABLE এই mode-এ থাকে।
- `live`: menu price label থেকে SAMPLE সরায় এবং sample disclaimer লুকায়। এটি content সত্য বা client-approved—এমন নিশ্চয়তা দেয় না। Launch-এর আগে owner-এর লিখিত approval নিতে হবে।

WhatsApp order enquiry `features.whatsappOrdering` এবং contact-page WhatsApp action `features.whatsappContact` দিয়ে চালু/বন্ধ হয়। নম্বরটি international format-এ দিন, যেমন `+8801XXXXXXXXX`; তারপর বাস্তব ফোনে link খুলে সঠিক business chat ও prefilled message যাচাই করুন।

## 5. Feature scope

| Feature | Base template | Launch condition |
|---|---|---|
| Restaurant pages + menu | Included | Approved content |
| WhatsApp order enquiry | Optional | Verified number and wording |
| Reservation request | Not active by default | Database, privacy notice, admin review, notification and operational tests |
| Online payment | Not included | Separate payment integration and reconciliation |
| Owner dashboard | Not included | Separate authenticated backend and role/access design |
| Live table availability | Not included | Capacity, slot, blackout and concurrency rules |

Reservation চালু করতে profile-এ `reservationRequests: true`, Vercel-এ server-side `RESERVATIONS_ENABLED=true`, এবং frontend `VITE_RESERVATIONS_ENABLED=true` ও valid `VITE_PRIVACY_POLICY_URL` লাগবে। এগুলো set করার আগে README-এর reservation backend setup ও QA checklist সম্পন্ন করুন। বর্তমান API request গ্রহণ করলেও booking confirm করে না।

## 6. প্রতিটি client-এর deployment checklist

1. Client-owned domain/Vercel account বা লিখিতভাবে agreed ownership model নিশ্চিত করুন।
2. আলাদা Vercel project তৈরি করে repository connect করুন।
3. `VITE_RESTAURANT_ID` ঠিক profile ID-তে সেট করুন।
4. Client-এর final domain অনুযায়ী canonical, sitemap ও robots references যাচাই করুন।
5. Real menu/contact/WhatsApp/photos/legal text approve করান।
6. `npm test`, `npm run build`, nested route refresh, mobile/desktop, keyboard, broken links ও WhatsApp draft test করুন।
7. Client acceptance, repo access, domain renewal, support scope এবং change request process hand over করুন।

**Important:** আলাদা deployment client content একে অন্যের থেকে আলাদা রাখে, কিন্তু repository-তে profile/menu code থাকলে client-দের source-code access automatically আলাদা হয় না। Source access contract অনুযায়ী দিন; secret কখনো repository-তে commit করবেন না।