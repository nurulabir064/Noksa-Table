import { createHash, randomUUID } from 'node:crypto';
import { neon } from '@neondatabase/serverless';
import { validateReservation } from './_lib/reservation-validation.js';

const MAX_BODY_BYTES = 8 * 1024;
const RATE_LIMIT_MAX_REQUESTS = 5;

function respond(res, status, body) {
  res.status(status);
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  if (status === 405) res.setHeader('Allow', 'POST');
  return res.json(body);
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return respond(res, 405, { error: 'Method not allowed.' });
  }

  const origin = req.headers.origin;
  const requestOrigin = `${req.headers['x-forwarded-proto'] || 'https'}://${req.headers.host}`;
  if (!origin || origin !== requestOrigin) {
    return respond(res, 403, { error: 'Request origin is not allowed.' });
  }

  const contentType = req.headers['content-type']?.split(';', 1)[0].trim().toLowerCase();
  if (contentType !== 'application/json') {
    return respond(res, 415, { error: 'Content-Type must be application/json.' });
  }

  const declaredLength = Number(req.headers['content-length'] || 0);
  if (declaredLength > MAX_BODY_BYTES) {
    return respond(res, 413, { error: 'Request body is too large.' });
  }

  let input;
  try {
    input = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    const bodySize = Buffer.byteLength(JSON.stringify(input ?? null));
    if (bodySize > MAX_BODY_BYTES) {
      return respond(res, 413, { error: 'Request body is too large.' });
    }
  } catch {
    return respond(res, 400, { error: 'Request body must be valid JSON.' });
  }

  if (!input || typeof input !== 'object' || Array.isArray(input)) {
    return respond(res, 400, { error: 'Request body must be a JSON object.' });
  }

  if (input.consent !== true) {
    return respond(res, 422, { error: 'Please confirm the privacy notice before submitting.' });
  }

  const validation = validateReservation(input);
  if (!validation.success) {
    return respond(res, 422, {
      error: 'Please check the reservation details.',
      fields: validation.errors,
    });
  }

  if (process.env.RESERVATIONS_ENABLED !== 'true') {
    return respond(res, 503, { error: 'Online reservation requests are not enabled yet.' });
  }

  const databaseUrl = process.env.DATABASE_URL;
  const rateLimitSecret = process.env.RATE_LIMIT_SECRET;
  const privacyPolicyUrl = process.env.PRIVACY_POLICY_URL;
  const privacyPolicyVersion = process.env.PRIVACY_POLICY_VERSION;
  let hasApprovedPrivacyPolicy = false;

  try {
    hasApprovedPrivacyPolicy = new URL(privacyPolicyUrl).protocol === 'https:';
  } catch {
    hasApprovedPrivacyPolicy = false;
  }

  if (!databaseUrl || !rateLimitSecret || !hasApprovedPrivacyPolicy || !/^[A-Za-z0-9._-]{1,40}$/.test(privacyPolicyVersion || '')) {
    return respond(res, 503, { error: 'Reservation service is not configured.' });
  }

  const clientIp = req.headers['x-real-ip'];
  if (typeof clientIp !== 'string' || !clientIp.trim()) {
    return respond(res, 400, { error: 'Unable to verify this request. Please try again.' });
  }

  const ipHash = createHash('sha256')
    .update(`${rateLimitSecret}:${clientIp.trim()}`)
    .digest('hex');

  try {
    const sql = neon(databaseUrl);
    await sql`DELETE FROM reservation_rate_limits WHERE window_started_at < NOW() - INTERVAL '1 day'`;

    const [rate] = await sql`
      INSERT INTO reservation_rate_limits (ip_hash, window_started_at, request_count)
      VALUES (${ipHash}, NOW(), 1)
      ON CONFLICT (ip_hash) DO UPDATE SET
        window_started_at = CASE
          WHEN reservation_rate_limits.window_started_at < NOW() - INTERVAL '15 minutes'
          THEN NOW()
          ELSE reservation_rate_limits.window_started_at
        END,
        request_count = CASE
          WHEN reservation_rate_limits.window_started_at < NOW() - INTERVAL '15 minutes'
          THEN 1
          ELSE reservation_rate_limits.request_count + 1
        END
      RETURNING request_count
    `;

    if (rate.request_count > RATE_LIMIT_MAX_REQUESTS) {
      return respond(res, 429, { error: 'Too many requests. Please try again in 15 minutes.' });
    }

    const requestCode = randomUUID();
    const result = await sql`
      INSERT INTO reservations (
        request_code, idempotency_key, customer_name, customer_email, customer_phone,
        reservation_date, reservation_time, guest_count, customer_message,
        consent_at, privacy_policy_version
      ) VALUES (
        ${requestCode}, ${validation.data.idempotencyKey}, ${validation.data.name}, ${validation.data.email},
        ${validation.data.phone}, ${validation.data.date}, ${validation.data.time},
        ${validation.data.guestCount}, ${validation.data.message}, NOW(), ${privacyPolicyVersion}
      )
      ON CONFLICT (idempotency_key) DO UPDATE
        SET idempotency_key = EXCLUDED.idempotency_key
      RETURNING request_code
    `;
    const savedRequestCode = result[0]?.request_code;

    return respond(res, 201, {
      message: 'Your reservation request was received. It is not confirmed until the restaurant contacts you.',
      reference: savedRequestCode,
      status: 'pending',
    });
  } catch {
    console.error('Reservation request could not be saved.');
    return respond(res, 500, { error: 'We could not process your request right now. Please try again later.' });
  }
}
