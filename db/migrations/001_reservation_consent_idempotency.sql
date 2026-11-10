-- Add durable retry protection and auditable consent evidence to an existing reservations table.
-- Historical rows are intentionally left NULL: do not invent consent timestamps or policy versions.
ALTER TABLE reservations
  ADD COLUMN IF NOT EXISTS idempotency_key UUID,
  ADD COLUMN IF NOT EXISTS request_fingerprint CHAR(64),
  ADD COLUMN IF NOT EXISTS consent_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS privacy_policy_version VARCHAR(40);

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'reservations_idempotency_key_unique'
      AND conrelid = 'reservations'::regclass
  ) THEN
    ALTER TABLE reservations
      ADD CONSTRAINT reservations_idempotency_key_unique UNIQUE (idempotency_key);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'reservations_consent_evidence_required'
      AND conrelid = 'reservations'::regclass
  ) THEN
    ALTER TABLE reservations
      ADD CONSTRAINT reservations_consent_evidence_required
      CHECK (
        idempotency_key IS NOT NULL
        AND request_fingerprint IS NOT NULL
        AND consent_at IS NOT NULL
        AND privacy_policy_version IS NOT NULL
      ) NOT VALID;
  END IF;
END $$;
