import { createHash, randomUUID } from 'node:crypto';
import { neon } from '@neondatabase/serverless';
import { validateReservation } from './_lib/reservation-validation.js';

const MAX_BODY_BYTES = 8 * 1024;
const RATE_LIMIT_MAX_REQUESTS = 5;

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store',
      'X-Content-Type-Options': 'nosniff',
    },
  });
}

export async function POST(request) {
  const origin = request.headers.get('origin');
  const requestOrigin = new URL(request.url).origin;

  if (!origin || origin !== requestOrigin) {
    return json({ error: 'Request origin is not allowed.' }, 403);
  }

  if (!request.headers.get('content-type')?.toLowerCase().includes('application/json')) {
    return json({ error: 'Content-Type must be application/json.' }, 415);
  }

  const declaredLength = Number(request.headers.get('content-length') || 0);
  if (declaredLength > MAX_BODY_BYTES) {
    return json({ error: 'Request body is too large.' }, 413);
  }

  let rawBody;
  let input;
  try {
    rawBody = await request.text();
    if (new TextEncoder().encode(rawBody).byteLength > MAX_BODY_BYTES) {
      return json({ error: 'Request body is too large.' }, 413);
    }
    input = JSON.parse(rawBody);
  } catch {
    return json({ error: 'Request body must be valid JSON.' }, 400);
  }

  const validation = validateReservation(input);
  if (input?.consent !== true) {
    return json({ error: 'Please confirm the privacy notice before submitting.' }, 422);
  }
  if (!validation.success) {
    return json({ error: 'Please check the highlighted reservation details.', fields: validation.errors }, 422);
  }

  if (process.env.RESERVATIONS_ENABLED !== 'true') {
    return json({ error: 'Online reservation requests are not enabled yet.' }, 503);
  }

  const databaseUrl = process.env.DATABASE_URL;
  const rateLimitSecret = process.env.RATE_LIMIT_SECRET;
  const privacyPolicyUrl = process.env.PRIVACY_POLICY_URL;
  let hasApprovedPrivacyPolicy = false;
  try {
    hasApprovedPrivacyPolicy = new URL(privacyPolicyUrl).protocol === 'https:';
  } catch {
    hasApprovedPrivacyPolicy = false;
  }

  if (!databaseUrl || !rateLimitSecret || !hasApprovedPrivacyPolicy) {
    return json({ error: 'Reservation service is not configured.' }, 503);
  }

  const forwardedIp = request.headers.get('x-real-ip')
    || request.headers.get('x-forwarded-for')?.split(',').at(-1)?.trim();

  if (!forwardedIp) {
    return json({ error: 'Unable to verify this request. Please try again.' }, 400);
  }

  const ipHash = createHash('sha256')
    .update(`${rateLimitSecret}:${forwardedIp}`)
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
      return json({ error: 'Too many requests. Please try again in 15 minutes.' }, 429);
    }

    const requestCode = randomUUID();
    await sql`
      INSERT INTO reservations (
        request_code, customer_name, customer_email, customer_phone,
        reservation_date, reservation_time, guest_count, customer_message
      ) VALUES (
        ${requestCode}, ${validation.data.name}, ${validation.data.email},
        ${validation.data.phone}, ${validation.data.date}, ${validation.data.time},
        ${validation.data.guestCount}, ${validation.data.message}
      )
    `;

    return json({
      message: 'Your reservation request was received. It is not confirmed until the restaurant contacts you.',
      reference: requestCode,
      status: 'pending',
    }, 201);
  } catch {
    console.error('Reservation request could not be saved.');
    return json({ error: 'We could not process your request right now. Please try again later.' }, 500);
  }
}

export default {
  fetch(request) {
    if (request.method === 'POST') return POST(request);
    return Promise.resolve(json({ error: 'Method not allowed.' }, 405));
  },
};
