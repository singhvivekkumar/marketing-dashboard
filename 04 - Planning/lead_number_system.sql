-- =============================================================================
-- LEAD NUMBER GENERATION & LOOKUP SYSTEM
-- =============================================================================

-- =============================================================================
-- 1. LEAD NUMBER FORMAT
-- LEAD-{FY}-{SECTOR}-{SEQUENCE}
-- Examples:
--   LEAD-2026-DEF-0047  → Defence lead, FY 2025-26, 47th in that FY
--   LEAD-2026-CIV-0012  → Civil lead, FY 2025-26, 12th in that FY
--   LEAD-2026-EXP-0003  → Export lead, FY 2025-26, 3rd in that FY
--
-- Sector codes:
--   DEF → Defence
--   CIV → Civil
--   EXP → Export
--   JV  → JV / Consortium
--   GOV → Government (generic)
--   OTH → Other
--
-- Sequence resets to 0001 at start of every financial year (April 1).
-- Sequence is per-sector per-FY (DEF and CIV have independent counters).
-- =============================================================================

-- ── Sequence table (tracks per-sector per-FY counters) ─────────────────────
CREATE TABLE IF NOT EXISTS lead_number_sequences (
  id           SERIAL PRIMARY KEY,
  financial_year INT NOT NULL,     -- e.g. 2026 for FY 2025-26
  sector_code    VARCHAR(5) NOT NULL, -- DEF, CIV, EXP, JV, GOV, OTH
  last_sequence  INT NOT NULL DEFAULT 0,
  updated_at     TIMESTAMP DEFAULT NOW(),
  UNIQUE (financial_year, sector_code)
);

-- ── Function to derive sector code from civil_defence / lead_subtype ────────
CREATE OR REPLACE FUNCTION get_sector_code(
  p_civil_defence VARCHAR,
  p_lead_subtype  VARCHAR
) RETURNS VARCHAR(5) AS $$
BEGIN
  IF p_lead_subtype = 'Export' THEN RETURN 'EXP'; END IF;
  IF p_lead_subtype IN ('JV/Consortium') THEN RETURN 'JV'; END IF;
  IF p_civil_defence = 'Defence' THEN RETURN 'DEF'; END IF;
  IF p_civil_defence = 'Civil'   THEN RETURN 'CIV'; END IF;
  RETURN 'OTH';
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- ── Main function: generate next lead number ─────────────────────────────────
CREATE OR REPLACE FUNCTION generate_lead_number(
  p_civil_defence VARCHAR,
  p_lead_subtype  VARCHAR
) RETURNS VARCHAR(30) AS $$
DECLARE
  v_fy          INT;
  v_sector_code VARCHAR(5);
  v_sequence    INT;
  v_lead_no     VARCHAR(30);
BEGIN
  -- Financial year: April = start
  v_fy := CASE
    WHEN EXTRACT(MONTH FROM NOW()) >= 4
    THEN EXTRACT(YEAR FROM NOW())::INT + 1
    ELSE EXTRACT(YEAR FROM NOW())::INT
  END;

  v_sector_code := get_sector_code(p_civil_defence, p_lead_subtype);

  -- Atomically get the next sequence number (prevents race conditions)
  INSERT INTO lead_number_sequences (financial_year, sector_code, last_sequence)
  VALUES (v_fy, v_sector_code, 1)
  ON CONFLICT (financial_year, sector_code)
  DO UPDATE SET
    last_sequence = lead_number_sequences.last_sequence + 1,
    updated_at    = NOW()
  RETURNING last_sequence INTO v_sequence;

  v_lead_no := 'LEAD-' || v_fy
            || '-' || v_sector_code
            || '-' || LPAD(v_sequence::TEXT, 4, '0');

  RETURN v_lead_no;
END;
$$ LANGUAGE plpgsql;

-- ── Trigger: auto-assign lead_no on INSERT if not provided ──────────────────
CREATE OR REPLACE FUNCTION trg_assign_lead_no()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.lead_no IS NULL OR NEW.lead_no = '' THEN
    NEW.lead_no := generate_lead_number(NEW.civil_defence, NEW.lead_subtype);
  ELSE
    -- Validate format if manually provided
    IF NEW.lead_no !~ '^LEAD-[0-9]{4}-(DEF|CIV|EXP|JV|GOV|OTH)-[0-9]{4}$' THEN
      RAISE EXCEPTION 'Invalid lead_no format. Must match LEAD-YYYY-XXX-NNNN. Got: %', NEW.lead_no;
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_leads_assign_no
  BEFORE INSERT ON leads
  FOR EACH ROW
  EXECUTE FUNCTION trg_assign_lead_no();

-- ── Full-text search index on leads for lookup ──────────────────────────────
-- Enables fast search by lead_no, tender_name, customer_name
ALTER TABLE leads ADD COLUMN IF NOT EXISTS search_vector TSVECTOR;

CREATE OR REPLACE FUNCTION update_leads_search_vector()
RETURNS TRIGGER AS $$
BEGIN
  NEW.search_vector :=
    setweight(to_tsvector('english', COALESCE(NEW.lead_no, '')),         'A') ||
    setweight(to_tsvector('english', COALESCE(NEW.lead_title, '')),      'A') ||
    setweight(to_tsvector('english', COALESCE(NEW.business_domain, '')), 'B');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_leads_search_vector
  BEFORE INSERT OR UPDATE ON leads
  FOR EACH ROW
  EXECUTE FUNCTION update_leads_search_vector();

-- GIN index for full-text search
CREATE INDEX IF NOT EXISTS idx_leads_search ON leads USING GIN(search_vector);

-- Also index lead_no directly for exact lookup
CREATE UNIQUE INDEX IF NOT EXISTS idx_leads_lead_no ON leads(lead_no) WHERE is_deleted = FALSE;

-- =============================================================================
-- 2. LOOKUP VIEW — what the API returns for any lookup
-- =============================================================================
CREATE OR REPLACE VIEW v_lead_lookup AS
SELECT
  l.id,
  l.lead_no,
  l.lead_title,
  l.lead_source,
  l.lead_status,
  l.current_stage,
  l.civil_defence,
  l.business_domain,
  l.lead_subtype,
  l.strategic_importance,
  l.win_probability_pct,
  l.estimated_value_cr,
  l.submitted_value_cr,
  l.submission_deadline,
  l.result_expected_date,
  l.eoi_id,
  l.bq_id,
  l.tender_id,
  l.customer_id,

  -- Customer details (auto-fill targets)
  c.company_name       AS customer_name,
  c.contact_person     AS customer_contact,
  c.email              AS customer_email,
  c.phone              AS customer_phone,
  c.address            AS customer_address,
  c.sector             AS customer_sector,

  -- Owner details
  u.full_name          AS lead_owner_name,
  u.email              AS lead_owner_email,

  -- Linked record IDs (for form pre-population)
  t.tender_reference_no,
  t.portal_name,
  t.portal_tender_id,
  t.tender_type,
  t.last_submission_date AS tender_submission_date,
  t.emd_value,
  t.emd_exempted,

  -- Days urgency
  CASE
    WHEN l.submission_deadline IS NULL        THEN NULL
    WHEN l.submission_deadline < CURRENT_DATE THEN -1
    ELSE (l.submission_deadline - CURRENT_DATE)::INT
  END                  AS days_to_deadline,

  -- Health
  CASE
    WHEN l.submission_deadline IS NULL                       THEN 'green'
    WHEN l.submission_deadline < CURRENT_DATE               THEN 'red'
    WHEN l.submission_deadline <= CURRENT_DATE + 3          THEN 'red'
    WHEN l.submission_deadline <= CURRENT_DATE + 7          THEN 'amber'
    ELSE 'green'
  END                  AS deadline_health

FROM leads l
JOIN customers c ON c.id = l.customer_id
LEFT JOIN users u ON u.id = l.lead_owner_id
LEFT JOIN tenders t ON t.id = l.tender_id
WHERE l.is_deleted = FALSE;
