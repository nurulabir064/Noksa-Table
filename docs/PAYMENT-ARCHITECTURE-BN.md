# NOKSHA TABLE — Payment Integration Plan

**Status:** Architecture selected; gateway integration is not enabled.  
**Recommended first provider:** SSLCOMMERZ Hosted Checkout, subject to merchant onboarding and Visa/Mastercard acquiring approval.

## 1. Why SSLCOMMERZ is the first choice

The official SSLCOMMERZ developer documentation describes a server-created payment session, a hosted GatewayPageURL, server-to-server IPN notifications, an Order Validation API, transaction query APIs and a Refund API. Its documentation lists Visa and Mastercard channels and provides a sandbox environment. This fits the requirement to keep card handling on the gateway-hosted page and keep credentials on the server.

- Developer portal: https://developer.sslcommerz.com/
- V4 API guide: https://developer.sslcommerz.com/doc/v4/
- Integration overview: https://sslcommerz.com/integration-document/

**Alternatives checked**

- shurjoPay: official REST documentation covers authentication token generation, payment initiation, payment verification and sandbox/live environments. Its status page also describes IPN retry improvements. Docs: https://web2.shurjopay.com.bd/frontend-developers/direct-integration-with-api and https://www.shurjopay.com.bd/systemStatus
- aamarPay: official documentation provides sandbox/live API endpoints and card/wallet channel coverage. Docs: https://aamarpay.readme.io/reference/overview and https://aamarpay.readme.io/reference/initiate-payment-json

**Decision boundary:** SSLCOMMERZ is the recommended first integration because the documented hosted checkout + IPN + validation + transaction query + refund flow aligns with the requested controls. This is not a claim that it has the lowest fees or fastest merchant approval. Compare the written merchant quote, settlement time, refund rules, chargeback handling and Visa/Mastercard approval before signing.

## 2. Required server-side flow

1. The server validates the cart against the server-side menu/catalog. Never trust a browser-supplied price or subtotal.
2. The server creates an order with a unique order ID and an idempotency key. Store the expected amount in BDT and set payment status to pending.
3. The server creates an SSLCOMMERZ session using server-only credentials and the order's immutable amount/currency.
4. The browser is redirected to the gateway-hosted GatewayPageURL. No card number, CVV, store password or signature key is collected by NOKSHA TABLE.
5. The browser success/fail/cancel return URL is informational only. A redirect or frontend success message is never proof of payment.
6. The IPN endpoint receives the gateway notification and calls the official Order Validation API from the server.
7. The server verifies transaction ID, order ID, amount, currency, store identity, gateway status and risk information against the pending database record.
8. Only a validated, amount-matched transaction can move the order to successful. Risk-flagged payments remain on hold for manual review.
9. Duplicate IPNs and repeated callbacks are idempotent: the same transaction must never create a second paid order or double-fulfilment.
10. Refunds are initiated server-side, validated against the original transaction, and recorded in transaction history.

## 3. Required data model

- orders: order ID, customer contact, server-calculated line items, subtotal, delivery fee, total, currency, order status, timestamps.
- payments: internal payment ID, order ID, provider, provider transaction ID, session ID, expected amount, currency, status, idempotency key, verified timestamp, risk flag.
- payment_events: provider event/notification ID, transaction reference, validation result, received timestamp, processing result. Store only the minimum necessary data; never store card credentials or CVV.
- refunds: payment ID, provider refund reference, amount, reason, status, requested/processed timestamps.

Unique constraints are required for order IDs, idempotency keys and provider transaction references.

## 4. Status model

- Payment: pending, successful, failed, cancelled, refund_pending, partially_refunded, refunded.
- Order: draft, awaiting_payment, paid, processing, ready, completed, cancelled, refunded.

A payment status and an order fulfilment status are separate. A successful payment does not mean the restaurant has prepared or delivered the order.

## 5. Security and reliability acceptance

- Store ID/password and all gateway secrets only in Vercel server-side environment variables.
- Use HTTPS/TLS and server-side request validation.
- Verify every IPN with the gateway validation API; do not trust the IPN body alone.
- Compare exact BDT amount and currency against the immutable pending order.
- Enforce idempotency and database transactions for state changes.
- Rate-limit session creation and callback processing.
- Never log credentials, card data, CVV or full sensitive customer details.
- Reconcile pending/uncertain payments with the provider's transaction query API before retrying or fulfilling.
- Keep refund authorization server-side and auditable.
- Keep payment processing disabled if credentials, DB schema, callback URLs or merchant approval are missing.

## 6. Sandbox test matrix

- Valid Visa payment → validated success.
- Valid Mastercard payment → validated success.
- Declined/failed payment.
- Customer cancellation.
- Pending/abandoned session.
- Browser returns success but no validated IPN → must remain pending.
- Duplicate IPN → one successful state transition only.
- Wrong amount/currency/order reference → reject and flag.
- Invalid transaction ID or validation API failure → remain pending; retry/reconcile safely.
- Risk-flagged transaction → hold for manual review.
- Refund success, refund failure and repeated refund request.
- Provider timeout after session creation → query/reconcile; do not create a duplicate charge.

## 7. External launch blockers

The repository cannot manufacture merchant approval or live credentials. Before sandbox/live integration can be fully verified, the restaurant owner must provide, through secure provider/Vercel channels:

- Approved merchant account and sandbox credentials.
- Written confirmation of Visa/Mastercard acceptance and fees.
- Approved business identity, bank settlement account and customer support contact.
- Final menu/prices, delivery fee rules, cancellation/refund policy and privacy notice.
- A verified public HTTPS domain and production callback/IPN URLs.

**Release rule:** No live card transaction until the complete sandbox matrix passes, server-side validation is verified, refunds and duplicate protection are tested, and the owner explicitly approves production release.
