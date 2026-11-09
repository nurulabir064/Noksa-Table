# Restaurant Website — Client Onboarding Brief

এই brief পূরণ না হওয়া পর্যন্ত final content, quote বা launch date নিশ্চিত করবেন না। Client-এর কাছ থেকে কেবল প্রয়োজনীয় business information নিন।

## A. Business identity

- Public business name:
- Business type (restaurant / cafe / bakery / other):
- Branch count:
- Primary audience:
- Preferred website language(s):
- Existing website/social pages:

## B. Contact and location

- Public phone:
- WhatsApp number (if different):
- Public website/contact email (client-owned and approved):
- Order email: একই monitored inbox/alias, নাকি আলাদা mailbox?
- Reservation email: একই monitored inbox/alias, নাকি আলাদা mailbox?
- Email workflow: visitor-এর email app-এ draft খুলবে, নাকি website backend থেকে server-delivered email যাবে?
- প্রতিটি mailbox/domain-এর owner এবং admin/recovery access কার নিয়ন্ত্রণে থাকবে?
- Full address:
- Google Maps pin/link:
- Opening hours by day:
- Weekly closing day:

## C. Website goals

Client-এর প্রধান লক্ষ্য (একটি বা একাধিক):
- [ ] Brand and restaurant information
- [ ] Menu discovery
- [ ] Calls / WhatsApp enquiries
- [ ] Directions / visits
- [ ] Reservation requests
- [ ] Online ordering
- [ ] Other:

প্রতিটি selected goal-এর success কীভাবে বোঝা যাবে?

## D. Pages and content

- [ ] Home
- [ ] Menu
- [ ] Dish detail
- [ ] About / Story
- [ ] Gallery
- [ ] Contact
- [ ] Reservation information
- [ ] Other:

Menu data file/link:
Logo file:
Brand guide / colours:
Approved photos:
Written brand story:
Special notices / offers:

## E. Menu data requirements

প্রতি item-এর জন্য:
- Dish name
- Category
- Description
- Current price and currency
- Available / unavailable status
- Allergen and dietary notes (client-verified)
- Image and usage permission

কোনো খাদ্য, অ্যালার্জেন, স্বাস্থ্য বা dietary claim developer নিজে অনুমান করে লিখবেন না; restaurant কর্তৃপক্ষের লিখিত অনুমোদন নিতে হবে।

## F. Reservation / ordering discovery

এই প্রশ্নগুলোর উত্তর না পাওয়া পর্যন্ত booking/order feature quote বা promise করবেন না।

- Request নাকি instant confirmation?
- Table capacity and party-size rules:
- Opening hours and booking slots:
- Minimum lead time / maximum advance days:
- Blackout dates:
- Cancellation / no-show policy:
- কে request দেখবে এবং কত দ্রুত response দেবে?
- Notification channel and account owner:
- Customer data access কারা পাবে?
- Retention and deletion policy:
- Payment লাগবে কি? কোন provider? Refund process কী?

### Email ownership ও routing approval

- Client কি একটি shared monitored inbox ব্যবহার করবে, নাকি contact/orders/reservations-এর জন্য আলাদা address/alias চাইবে?
- Alias/forwarding কে configure ও monitor করবে?
- Public contact address প্রকাশের লিখিত অনুমোদন:
- Server-delivered email লাগলে verified sending domain এবং provider account-এর owner:
- Bounce, spam/complaint ও delivery failure কে monitor করবে?

বর্তমান demo-তে contact ও menu order email action visitor-এর device-এ `mailto:` draft খোলে। এটি server থেকে email পাঠায় না। বর্তমান code-এ `publicEmail`-ই email draft recipient; আলাদা order/reservation routing এখনো implement করা হয়নি। আলাদা routing দরকার হলে scope, backend delivery এবং tests আলাদাভাবে approve করতে হবে।

## G. Technical ownership

- Domain owner/account:
- Hosting owner/account:
- Existing email provider:
- Analytics account owner (if any):
- Who will approve production launch?
- Who will maintain content after handover?

Password বা OTP chat/document-এ চাইবেন না। Client-কে নিজে provider account-এ invite/access দিতে বলুন; প্রয়োজন শেষে access revoke করুন।

## H. Approval

- Approved scope/version:
- Approved quotation:
- Advance received:
- Content received date:
- Target review date:
- Client approver name/role:
- Written approval reference:

## Privacy note

শুধু project-এর জন্য প্রয়োজনীয় তথ্য সংগ্রহ করুন। ব্যক্তিগত customer data demo/testing-এ ব্যবহার করবেন না। Production-এ যাওয়ার আগে privacy notice, lawful basis/consent requirements, access control, retention এবং deletion process client-এর সঙ্গে নির্ধারণ করুন।
