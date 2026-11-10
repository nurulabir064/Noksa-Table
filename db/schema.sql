CREATE TABLE IF NOT EXISTS reservations (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  request_code UUID NOT NULL UNIQUE,
  idempotency_key UUID NOT NULL UNIQUE,
  request_fingerprint CHAR(64) NOT NULL,
  customer_name VARCHAR(80) NOT NULL,
  customer_email VARCHAR(254) NOT NULL,
  customer_phone VARCHAR(25) NOT NULL,
  reservation_date DATE NOT NULL,
  reservation_time TIME NOT NULL,
  guest_count SMALLINT NOT NULL CHECK (guest_count BETWEEN 1 AND 6),
  customer_message VARCHAR(1000) NOT NULL DEFAULT '',
  consent_at TIMESTAMPTZ NOT NULL,
  privacy_policy_version VARCHAR(40) NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'confirmed', 'cancelled')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS reservations_date_status_idx
  ON reservations (reservation_date, status);

CREATE INDEX IF NOT EXISTS reservations_created_at_idx
  ON reservations (created_at DESC);

CREATE TABLE IF NOT EXISTS reservation_rate_limits (
  ip_hash CHAR(64) PRIMARY KEY,
  window_started_at TIMESTAMPTZ NOT NULL,
  request_count INTEGER NOT NULL CHECK (request_count > 0)
);
