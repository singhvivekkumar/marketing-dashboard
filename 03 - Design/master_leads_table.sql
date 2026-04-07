-- =============================================================================
-- MASTER LEADS TABLE — Central tracking record for every opportunity
-- =============================================================================
-- This is the single source of truth for every lead from the moment it enters
-- the system (as EOI or direct RFP) until it closes (won, lost, or dropped).
--
-- Every other table (budgetary_quotations, tenders, bidding_process,
-- prequalification, technical_bids, commercial_bids, evaluation_rounds,
-- results, orders_received) links BACK to this record via lead_id.
--
-- The marketing team sees this table as their pipeline view:
--   "Show me all 42 open leads and which stage each one is in right now."
-- =============================================================================

CREATE TABLE leads (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- ── Lead identity ──────────────────────────────────────────────────────────
  lead_no               VARCHAR(30) UNIQUE NOT NULL,
  -- Auto-generated e.g. LEAD-2026-0001. Format: LEAD-{FY}-{SEQUENCE}

  lead_title            VARCHAR(500) NOT NULL,
  -- Human-readable name e.g. "Army Comms Upgrade – MoD Open Tender FY26"

  -- ── Source: how this lead entered the system ───────────────────────────────
  lead_source           VARCHAR(20) NOT NULL
    CHECK (lead_source IN ('EOI', 'Direct RFP', 'GeM Portal', 'Referral', 'Proactive', 'Other')),
  -- EOI       → Customer sent an Expression of Interest first
  -- Direct RFP→ Tender published directly without prior EOI from us
  -- GeM Portal→ Discovered on Government e-Marketplace
  -- Referral  → Introduced by a partner or associate
  -- Proactive → We approached the customer ourselves

  -- ── Links to source documents ──────────────────────────────────────────────
  eoi_id                UUID REFERENCES expressions_of_interest(id) ON DELETE SET NULL,
  bq_id                 UUID REFERENCES budgetary_quotations(id)    ON DELETE SET NULL,
  tender_id             UUID REFERENCES tenders(id)                 ON DELETE SET NULL,
  customer_id           UUID NOT NULL REFERENCES customers(id)      ON DELETE RESTRICT,

  -- ── Ownership ──────────────────────────────────────────────────────────────
  lead_owner_id         UUID REFERENCES users(id) ON DELETE SET NULL,
  -- Person responsible for this lead end-to-end

  -- ── Classification ─────────────────────────────────────────────────────────
  civil_defence         VARCHAR(10) NOT NULL
    CHECK (civil_defence IN ('Civil', 'Defence')),
  business_domain       VARCHAR(255) NOT NULL,
  lead_subtype          VARCHAR(30) NOT NULL
    CHECK (lead_subtype IN ('Domestic', 'Export', 'Government', 'JV/Consortium', 'Rate Contract', 'Other')),
  strategic_importance  VARCHAR(10) DEFAULT 'Medium'
    CHECK (strategic_importance IN ('Low', 'Medium', 'High', 'Must-Win')),

  -- ── Financial summary (updated as the lead progresses) ─────────────────────
  estimated_value_cr    DECIMAL(10,2),
  -- Rough value at entry — updated when RFP/tender is released

  submitted_value_cr    DECIMAL(10,2),
  -- Our bid price once we submit — updated at Commercial Bid stage

  order_won_value_cr    DECIMAL(10,2),
  -- Actual PO/WO value when won — updated at Result stage

  -- ── Key dates ──────────────────────────────────────────────────────────────
  lead_received_date    DATE NOT NULL DEFAULT CURRENT_DATE,
  tender_published_date DATE,
  submission_deadline   DATE,
  -- Automatically updated when a corrigendum extends the deadline

  result_expected_date  DATE,
  -- When do we expect the customer to announce L1?

  -- ── Internal scoring ───────────────────────────────────────────────────────
  win_probability_pct   INT DEFAULT 50
    CHECK (win_probability_pct BETWEEN 0 AND 100),
  -- Team's gut-feel % of winning — used for weighted pipeline analytics

  -- ═══════════════════════════════════════════════════════════════════════════
  -- CURRENT STAGE — the single field that answers "where is this lead now?"
  -- ═══════════════════════════════════════════════════════════════════════════
  current_stage         VARCHAR(40) NOT NULL DEFAULT 'New Lead'
    CHECK (current_stage IN (
      'New Lead',            -- just entered, not yet assessed
      'BQ Preparation',      -- preparing budgetary quotation
      'BQ Submitted',        -- BQ sent to customer, awaiting RFP
      'RFP Received',        -- formal tender/RFP released by customer
      'Go/No-Go Decision',   -- team deciding whether to bid
      'Pre-Qualification',   -- checking eligibility criteria
      'Technical Bid',       -- preparing technical proposal
      'Commercial Bid',      -- preparing financial proposal
      'Bid Submitted',       -- both bids submitted, awaiting opening
      'Evaluation',          -- customer evaluation & clarification rounds
      'Result Awaited',      -- bids opened, L1 not yet announced
      'Won',                 -- we are L1, PO/WO received
      'Lost',                -- another bidder won
      'Did Not Participate', -- we chose not to bid (reason recorded below)
      'Cancelled'            -- customer withdrew the tender
    )),

  -- ═══════════════════════════════════════════════════════════════════════════
  -- OVERALL STATUS — roll-up for quick filtering
  -- ═══════════════════════════════════════════════════════════════════════════
  lead_status           VARCHAR(20) NOT NULL DEFAULT 'Active'
    CHECK (lead_status IN (
      'Active',        -- in pipeline, progressing through stages
      'Won',           -- order received
      'Lost',          -- competitor won
      'Did Not Participate', -- we dropped it before bidding
      'Cancelled',     -- tender cancelled by customer
      'On Hold'        -- paused, waiting for customer action
    )),

  -- ═══════════════════════════════════════════════════════════════════════════
  -- WHY WE DID NOT PARTICIPATE
  -- Filled when lead_status = 'Did Not Participate'
  -- ═══════════════════════════════════════════════════════════════════════════
  dnp_reason_category   VARCHAR(50)
    CHECK (dnp_reason_category IN (
      -- Internal capacity reasons
      'Resource Constraint',           -- no team available to prepare bid
      'Short Submission Timeline',     -- deadline too close to prepare quality bid
      'Team Already Committed',        -- all SMEs on other bids

      -- Technical eligibility reasons
      'Pre-Qualification Not Met',     -- turnover / experience requirement not met
      'Technical Capability Gap',      -- our product/service doesn't fit the spec
      'Certification Not Available',   -- required ISO / OEM cert we don't hold
      'Spec Tailor-Made for Competitor',-- spec written to favour a specific vendor

      -- Commercial / financial reasons
      'Budget Too Low',                -- customer's indicative budget not viable
      'Margin Not Viable',             -- can't price competitively and stay profitable
      'Risk Too High',                 -- contract terms / liability unacceptable

      -- Consortium / JV reasons
      'Consortium Partner Not Found',  -- tender mandates consortium, no partner available
      'Consortium Terms Not Agreed',   -- partner found but agreement couldn't be finalized
      'JV Not Registered in Time',     -- JV registration deadline missed

      -- External / strategic reasons
      'Strategic Decision',            -- management decided not to pursue
      'Customer Relationship Issue',   -- history of payment defaults / disputes
      'Blacklisted',                   -- we or our partner is on customer's debarred list
      'Conflict of Interest',          -- related party / prior consulting involvement
      'Export / Compliance Barrier',   -- ITAR, FEMA, or other regulatory block

      -- Tender quality reasons
      'Tender Cancelled by Customer',  -- RFP withdrawn after we registered
      'Tender Scope Changed',          -- scope changed so much after corrigendum not worthwhile
      'Single Vendor Situation',       -- strong intel that outcome is predetermined
      'Other'                          -- free text in dnp_reason_detail
    )),

  dnp_reason_detail     TEXT,
  -- Free text — required when dnp_reason_category = 'Other',
  -- optional elaboration for any other reason

  dnp_decided_by        UUID REFERENCES users(id) ON DELETE SET NULL,
  -- Who made the call to not participate?

  dnp_decided_at        TIMESTAMP,
  -- When was the decision made?

  dnp_approved_by       UUID REFERENCES users(id) ON DELETE SET NULL,
  -- Did a manager / head approve the DNP decision?

  -- ═══════════════════════════════════════════════════════════════════════════
  -- WHY WE LOST (filled when lead_status = 'Lost')
  -- ═══════════════════════════════════════════════════════════════════════════
  loss_l_position       VARCHAR(5),
  -- L2, L3, L4 — where we finished

  loss_l1_price_cr      DECIMAL(10,2),
  -- The winner's bid price — for win/loss analysis

  loss_price_diff_cr    DECIMAL(10,2),
  -- Our price minus L1 price — how much we were above

  loss_price_diff_pct   DECIMAL(6,2),
  -- Price difference as a percentage

  loss_reason_category  VARCHAR(50)
    CHECK (loss_reason_category IN (
      'Price Too High',               -- L1 undercut us commercially
      'Technical Non-Compliance',     -- our tech bid had issues
      'Specification Not Met',        -- our product doesn't meet spec fully
      'Insufficient Experience',      -- experience criteria not satisfied
      'Delivery Timeline',            -- our delivery schedule was too long
      'Payment Terms',                -- our commercial terms not acceptable
      'After-Sales / Warranty',       -- warranty / AMC terms inferior
      'Brand / OEM Preference',       -- customer preferred a known OEM
      'Consortium Issue',             -- our consortium was weaker
      'Political / Relationship',     -- non-technical factors
      'Late Submission',              -- missed submission deadline
      'Document Deficiency',          -- missing / incorrect documents
      'Other'
    )),

  loss_reason_detail    TEXT,
  -- Detailed loss analysis notes — filled after post-mortem debrief

  loss_competitor_name  VARCHAR(255),
  -- Name of the L1 winner

  -- ═══════════════════════════════════════════════════════════════════════════
  -- NOTES & METADATA
  -- ═══════════════════════════════════════════════════════════════════════════
  internal_notes        TEXT,
  -- Private notes visible only to manager+ roles

  tags                  TEXT[],
  -- Free tags e.g. {'repeat-customer', 'high-value', 'export', 'defence-psu'}

  -- ── Audit ─────────────────────────────────────────────────────────────────
  created_by            UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at            TIMESTAMP DEFAULT NOW(),
  updated_at            TIMESTAMP DEFAULT NOW(),
  is_deleted            BOOLEAN DEFAULT FALSE
);

-- =============================================================================
-- LEAD STAGE LOG — Full audit trail of every stage change on every lead
-- =============================================================================
-- Every time current_stage or lead_status changes on the leads table,
-- this table records the full before/after with timestamp and who did it.
-- This powers the "time in stage" analytics and the stage history view.
-- =============================================================================

CREATE TABLE lead_stage_log (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id           UUID NOT NULL REFERENCES leads(id) ON DELETE CASCADE,

  from_stage        VARCHAR(40),          -- NULL for the first entry
  to_stage          VARCHAR(40) NOT NULL,

  from_status       VARCHAR(20),
  to_status         VARCHAR(20),

  changed_by        UUID REFERENCES users(id) ON DELETE SET NULL,
  changed_at        TIMESTAMP DEFAULT NOW(),

  days_in_from_stage INT,
  -- How many calendar days was the lead in from_stage before this change?

  was_overdue       BOOLEAN DEFAULT FALSE,
  -- Was the stage deadline passed when this transition happened?

  notes             TEXT,
  -- Why was this transition made? Optional context from the user.

  -- If this was a DNP decision, capture the reason at point of logging
  dnp_reason_category VARCHAR(50),
  dnp_reason_detail   TEXT
);

-- =============================================================================
-- LEAD DOCUMENTS — All documents uploaded against a lead (not just the tender)
-- =============================================================================
-- Tracks every file uploaded at any stage of the lead lifecycle:
-- EOI letter, BQ PDF, RFP document, pre-qual submission, tech bid,
-- commercial bid, corrigendums, result letter, PO/WO, etc.
-- =============================================================================

CREATE TABLE lead_documents (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id           UUID NOT NULL REFERENCES leads(id) ON DELETE CASCADE,

  document_stage    VARCHAR(40) NOT NULL
    CHECK (document_stage IN (
      'EOI', 'BQ', 'RFP', 'Pre-Qualification',
      'Technical Bid', 'Commercial Bid',
      'Corrigendum', 'Evaluation', 'Result',
      'Order', 'Other'
    )),

  document_type     VARCHAR(60) NOT NULL,
  -- e.g. "EOI Letter", "BQ Rev 2", "Technical Proposal", "EMD Receipt",
  --      "Submission Acknowledgement", "L1 Result Letter", "Work Order"

  file_path         TEXT NOT NULL,
  file_name         VARCHAR(255) NOT NULL,
  file_size_kb      INT,

  uploaded_by       UUID REFERENCES users(id) ON DELETE SET NULL,
  uploaded_at       TIMESTAMP DEFAULT NOW(),

  version           INT DEFAULT 1,
  -- Revision number — BQ Rev 1, BQ Rev 2, etc.

  notes             TEXT
);

-- =============================================================================
-- INDEXES
-- =============================================================================

CREATE INDEX idx_leads_source       ON leads(lead_source)      WHERE is_deleted = FALSE;
CREATE INDEX idx_leads_stage        ON leads(current_stage)    WHERE is_deleted = FALSE;
CREATE INDEX idx_leads_status       ON leads(lead_status)      WHERE is_deleted = FALSE;
CREATE INDEX idx_leads_owner        ON leads(lead_owner_id)    WHERE is_deleted = FALSE;
CREATE INDEX idx_leads_customer     ON leads(customer_id)      WHERE is_deleted = FALSE;
CREATE INDEX idx_leads_civil_def    ON leads(civil_defence)    WHERE is_deleted = FALSE;
CREATE INDEX idx_leads_domain       ON leads(business_domain)  WHERE is_deleted = FALSE;
CREATE INDEX idx_leads_importance   ON leads(strategic_importance);
CREATE INDEX idx_leads_deadline     ON leads(submission_deadline);
CREATE INDEX idx_leads_dnp_reason   ON leads(dnp_reason_category) WHERE lead_status = 'Did Not Participate';
CREATE INDEX idx_leads_loss_reason  ON leads(loss_reason_category) WHERE lead_status = 'Lost';
CREATE INDEX idx_leads_tender       ON leads(tender_id);
CREATE INDEX idx_leads_eoi          ON leads(eoi_id);
CREATE INDEX idx_leads_created      ON leads(created_at);

CREATE INDEX idx_lead_stage_log_lead ON lead_stage_log(lead_id);
CREATE INDEX idx_lead_stage_log_at   ON lead_stage_log(changed_at);

CREATE INDEX idx_lead_docs_lead     ON lead_documents(lead_id);
CREATE INDEX idx_lead_docs_stage    ON lead_documents(document_stage);

-- =============================================================================
-- TRIGGER — Auto-insert stage log on every stage/status change
-- =============================================================================

CREATE OR REPLACE FUNCTION log_lead_stage_change()
RETURNS TRIGGER AS $$
DECLARE
  v_days_spent INT;
BEGIN
  IF OLD.current_stage IS DISTINCT FROM NEW.current_stage
  OR OLD.lead_status   IS DISTINCT FROM NEW.lead_status
  THEN
    -- Calculate days spent in the previous stage
    v_days_spent := EXTRACT(
      DAY FROM (NOW() - (
        SELECT COALESCE(MAX(changed_at), OLD.created_at)
        FROM lead_stage_log
        WHERE lead_id = OLD.id
      ))
    )::INT;

    INSERT INTO lead_stage_log (
      lead_id, from_stage, to_stage,
      from_status, to_status,
      days_in_from_stage,
      dnp_reason_category, dnp_reason_detail
    ) VALUES (
      OLD.id,
      OLD.current_stage, NEW.current_stage,
      OLD.lead_status,   NEW.lead_status,
      v_days_spent,
      CASE WHEN NEW.lead_status = 'Did Not Participate'
           THEN NEW.dnp_reason_category END,
      CASE WHEN NEW.lead_status = 'Did Not Participate'
           THEN NEW.dnp_reason_detail END
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_lead_stage_change
  AFTER UPDATE ON leads
  FOR EACH ROW
  EXECUTE FUNCTION log_lead_stage_change();

-- =============================================================================
-- AUTO-GENERATE LEAD NUMBER FUNCTION
-- =============================================================================
-- Generates LEAD-2026-0001, LEAD-2026-0002 etc. (financial year based)

CREATE OR REPLACE FUNCTION generate_lead_no()
RETURNS TRIGGER AS $$
DECLARE
  v_fy    INT;
  v_seq   INT;
BEGIN
  -- Determine financial year (April = start of FY)
  v_fy := CASE
    WHEN EXTRACT(MONTH FROM NOW()) >= 4
    THEN EXTRACT(YEAR FROM NOW())::INT + 1   -- Apr 2025 = FY 2026
    ELSE EXTRACT(YEAR FROM NOW())::INT
  END;

  SELECT COUNT(*) + 1 INTO v_seq
  FROM leads
  WHERE lead_no LIKE 'LEAD-' || v_fy || '-%';

  NEW.lead_no := 'LEAD-' || v_fy || '-' || LPAD(v_seq::TEXT, 4, '0');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_generate_lead_no
  BEFORE INSERT ON leads
  FOR EACH ROW
  WHEN (NEW.lead_no IS NULL OR NEW.lead_no = '')
  EXECUTE FUNCTION generate_lead_no();

-- =============================================================================
-- VIEW: LEAD PIPELINE SUMMARY
-- Used directly by the dashboard pipeline view
-- =============================================================================

CREATE OR REPLACE VIEW v_lead_pipeline AS
SELECT
  l.id,
  l.lead_no,
  l.lead_title,
  l.lead_source,
  l.lead_status,
  l.current_stage,
  l.civil_defence,
  l.business_domain,
  l.strategic_importance,
  l.win_probability_pct,
  l.estimated_value_cr,
  l.submitted_value_cr,
  l.submission_deadline,
  l.result_expected_date,
  l.dnp_reason_category,
  l.loss_reason_category,
  l.loss_l_position,
  l.loss_price_diff_pct,
  l.created_at,
  l.updated_at,

  -- Customer details
  c.company_name                          AS customer_name,
  c.sector                                AS customer_sector,

  -- Owner details
  u.full_name                             AS lead_owner_name,

  -- Days since last stage change (from log)
  EXTRACT(DAY FROM NOW() - (
    SELECT MAX(changed_at) FROM lead_stage_log WHERE lead_id = l.id
  ))::INT                                 AS days_in_current_stage,

  -- Deadline urgency
  CASE
    WHEN l.submission_deadline IS NULL        THEN 'No deadline'
    WHEN l.submission_deadline < CURRENT_DATE THEN 'Overdue'
    WHEN l.submission_deadline <= CURRENT_DATE + 3 THEN 'Critical'
    WHEN l.submission_deadline <= CURRENT_DATE + 7 THEN 'Urgent'
    ELSE 'On track'
  END                                     AS deadline_status,

  -- Weighted pipeline value (value × win probability)
  ROUND(
    COALESCE(l.submitted_value_cr, l.estimated_value_cr, 0)
    * COALESCE(l.win_probability_pct, 50) / 100.0,
  2)                                      AS weighted_value_cr

FROM leads l
JOIN customers c ON c.id = l.customer_id
LEFT JOIN users u ON u.id = l.lead_owner_id
WHERE l.is_deleted = FALSE;

-- =============================================================================
-- VIEW: DNP ANALYSIS (Why We Did Not Participate)
-- Used for the "missed opportunity" analytics panel
-- =============================================================================

CREATE OR REPLACE VIEW v_dnp_analysis AS
SELECT
  l.id,
  l.lead_no,
  l.lead_title,
  l.dnp_reason_category,
  l.dnp_reason_detail,
  l.civil_defence,
  l.business_domain,
  l.estimated_value_cr,
  l.submission_deadline,
  l.dnp_decided_at,
  c.company_name AS customer_name,
  u_owner.full_name  AS lead_owner_name,
  u_decided.full_name AS dnp_decided_by_name,
  u_approved.full_name AS dnp_approved_by_name,
  -- Financial year of the DNP decision
  CASE
    WHEN EXTRACT(MONTH FROM l.dnp_decided_at) >= 4
    THEN EXTRACT(YEAR FROM l.dnp_decided_at)::INT + 1
    ELSE EXTRACT(YEAR FROM l.dnp_decided_at)::INT
  END AS financial_year
FROM leads l
JOIN customers c ON c.id = l.customer_id
LEFT JOIN users u_owner   ON u_owner.id   = l.lead_owner_id
LEFT JOIN users u_decided ON u_decided.id = l.dnp_decided_by
LEFT JOIN users u_approved ON u_approved.id = l.dnp_approved_by
WHERE l.lead_status = 'Did Not Participate'
  AND l.is_deleted  = FALSE;

-- =============================================================================
-- VIEW: LOSS ANALYSIS (Why We Lost)
-- =============================================================================

CREATE OR REPLACE VIEW v_loss_analysis AS
SELECT
  l.id,
  l.lead_no,
  l.lead_title,
  l.loss_reason_category,
  l.loss_reason_detail,
  l.loss_l_position,
  l.loss_l1_price_cr,
  l.submitted_value_cr  AS our_bid_price_cr,
  l.loss_price_diff_cr,
  l.loss_price_diff_pct,
  l.loss_competitor_name,
  l.civil_defence,
  l.business_domain,
  l.estimated_value_cr,
  c.company_name AS customer_name,
  u.full_name    AS lead_owner_name,
  CASE
    WHEN EXTRACT(MONTH FROM l.updated_at) >= 4
    THEN EXTRACT(YEAR FROM l.updated_at)::INT + 1
    ELSE EXTRACT(YEAR FROM l.updated_at)::INT
  END AS financial_year
FROM leads l
JOIN customers c ON c.id = l.customer_id
LEFT JOIN users u ON u.id = l.lead_owner_id
WHERE l.lead_status = 'Lost'
  AND l.is_deleted  = FALSE;
