-- =============================================================================
-- LEAD MANAGEMENT SYSTEM — Redesigned Architecture
-- Complete PostgreSQL Schema
-- Based on the real procurement lifecycle:
--   Customer → EOI → Budgetary Quotation → Tender (RFP) →
--   Bidding Process → Pre-Qual → Tech Bid → Commercial Bid →
--   Evaluation Rounds → Result → Order Received
-- =============================================================================

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =============================================================================
-- 1. USERS
-- Central reference table — all FK to this table
-- =============================================================================
CREATE TABLE users (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username      VARCHAR(100) UNIQUE NOT NULL,
  email         VARCHAR(200) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  full_name     VARCHAR(200) NOT NULL,
  role          VARCHAR(20)  NOT NULL
    CHECK (role IN ('executive','manager','head','admin')),
  is_active     BOOLEAN DEFAULT TRUE,
  created_at    TIMESTAMP DEFAULT NOW(),
  updated_at    TIMESTAMP DEFAULT NOW()
);

-- =============================================================================
-- 2. CUSTOMERS
-- The organisation that sends EOIs and eventually places orders.
-- Previously buried as text fields in the leads table.
-- Now a proper master entity with its own record.
-- =============================================================================
CREATE TABLE customers (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_name    VARCHAR(255) NOT NULL,
  company_code    VARCHAR(50)  UNIQUE,          -- internal shortcode
  contact_person  VARCHAR(200),
  designation     VARCHAR(150),
  email           VARCHAR(200),
  phone           VARCHAR(40),
  address         TEXT,
  city            VARCHAR(100),
  state           VARCHAR(100),
  pincode         VARCHAR(20),
  country         VARCHAR(100) DEFAULT 'India',

  -- Classification
  sector          VARCHAR(20)
    CHECK (sector IN ('Civil','Defence','Both')),
  customer_type   VARCHAR(30)
    CHECK (customer_type IN (
      'Government – Central','Government – State',
      'PSU','Private','MNC','JV','Other'
    )),
  business_domains TEXT[],                      -- array of domains

  -- Relationship tracking
  is_active       BOOLEAN DEFAULT TRUE,
  relationship_manager_id UUID REFERENCES users(id) ON DELETE SET NULL,

  notes           TEXT,
  created_by      UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at      TIMESTAMP DEFAULT NOW(),
  updated_at      TIMESTAMP DEFAULT NOW(),
  is_deleted      BOOLEAN DEFAULT FALSE
);

-- =============================================================================
-- 3. EXPRESSIONS OF INTEREST (EOI)
-- Stage 1: Customer sends an informal requirement.
-- We study it and decide whether to pursue it.
-- =============================================================================
CREATE TABLE expressions_of_interest (
  id                   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id          UUID NOT NULL REFERENCES customers(id) ON DELETE RESTRICT,
  assigned_to          UUID REFERENCES users(id) ON DELETE SET NULL,

  eoi_reference_no     VARCHAR(150),            -- customer's reference
  eoi_title            VARCHAR(500) NOT NULL,
  requirement_description TEXT,
  eoi_received_date    DATE NOT NULL,
  response_due_date    DATE,

  -- Classification (mirroring the RFP fields for early tagging)
  civil_defence        VARCHAR(10)
    CHECK (civil_defence IN ('Civil','Defence')),
  business_domain      VARCHAR(255),
  estimated_value_cr   DECIMAL(10,2),           -- rough ballpark from EOI

  -- Decision
  status               VARCHAR(30) DEFAULT 'Received'
    CHECK (status IN (
      'Received','Under Study','BQ Prepared',
      'Converted to RFP','Dropped','On Hold'
    )),
  no_pursue_reason     TEXT,

  documents_path       TEXT[],                   -- array of uploaded files
  internal_notes       TEXT,

  created_by           UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at           TIMESTAMP DEFAULT NOW(),
  updated_at           TIMESTAMP DEFAULT NOW(),
  is_deleted           BOOLEAN DEFAULT FALSE
);

-- =============================================================================
-- 4. BUDGETARY QUOTATIONS (BQ)
-- Stage 2: We prepare a non-binding price estimate in response to the EOI.
-- One EOI can produce one or more BQs (e.g., revised after discussion).
-- =============================================================================
CREATE TABLE budgetary_quotations (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  eoi_id                UUID REFERENCES expressions_of_interest(id) ON DELETE SET NULL,
  customer_id           UUID NOT NULL REFERENCES customers(id) ON DELETE RESTRICT,
  prepared_by           UUID REFERENCES users(id) ON DELETE SET NULL,

  bq_reference_no       VARCHAR(150),
  bq_title              VARCHAR(500) NOT NULL,
  revision_no           INT DEFAULT 1,          -- BQ Rev 1, Rev 2...

  -- Scope described in the BQ
  scope_summary         TEXT,
  key_deliverables      TEXT,

  -- Values
  estimated_value_cr    DECIMAL(10,2) NOT NULL, -- our cost estimate
  submitted_value_cr    DECIMAL(10,2) NOT NULL, -- price we quoted
  gst_applicable_pct    DECIMAL(5,2)  DEFAULT 18.00,
  submitted_value_incl_gst_cr DECIMAL(10,2),

  submission_date       DATE NOT NULL,
  valid_until           DATE,                   -- BQ validity

  -- Outcome
  present_status        VARCHAR(50) DEFAULT 'Submitted'
    CHECK (present_status IN (
      'Submitted','Under Discussion','Revised','Accepted',
      'Converted to RFP','Dropped','Not-Responded'
    )),
  converted_to_rfp      BOOLEAN DEFAULT FALSE,  -- true when RFP is issued
  conversion_date       DATE,

  -- Competitors mentioned
  competitors_info      TEXT,

  document_path         TEXT,                   -- uploaded BQ PDF
  document_name         VARCHAR(255),

  created_by            UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at            TIMESTAMP DEFAULT NOW(),
  updated_at            TIMESTAMP DEFAULT NOW(),
  is_deleted            BOOLEAN DEFAULT FALSE
);

-- =============================================================================
-- 5. TENDERS  (previously: leads table)
-- Stage 3: Customer formally releases a Request for Proposal (RFP/NIT/EOI tender).
-- This is the single most important entity — all bidding flows from here.
-- Contains all 22+ original fields PLUS new fields from the architecture redesign.
-- =============================================================================
CREATE TABLE tenders (
  id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Source linkage (either comes from an EOI/BQ chain, or is a fresh tender)
  eoi_id                  UUID REFERENCES expressions_of_interest(id) ON DELETE SET NULL,
  bq_id                   UUID REFERENCES budgetary_quotations(id) ON DELETE SET NULL,
  customer_id             UUID NOT NULL REFERENCES customers(id) ON DELETE RESTRICT,
  lead_owner_id           UUID REFERENCES users(id) ON DELETE SET NULL,

  -- ── Tender identity ──────────────────────────────────────────────────────
  tender_name             VARCHAR(500) NOT NULL,
  tender_reference_no     VARCHAR(150),         -- NIT / RFP number
  tender_type             VARCHAR(100) NOT NULL
    CHECK (tender_type IN (
      'Open','Limited','Single Source','Nomination',
      'Rate Contract','Global Tender','Empanelment','Other'
    )),
  document_type           VARCHAR(100) NOT NULL
    CHECK (document_type IN ('EOI','RFQ','RFP','NIT','Corrigendum','GeM Bid','Other')),

  -- ── Portal / publication ─────────────────────────────────────────────────
  portal_name             VARCHAR(100)
    CHECK (portal_name IN (
      'GeM','CPPP','eProcurement','Defence Portal',
      'DRDO','HAL','BEL','BHEL','Direct','Other'
    )),
  portal_tender_id        VARCHAR(150),
  publishing_authority    VARCHAR(255),

  -- ── Classification ───────────────────────────────────────────────────────
  civil_defence           VARCHAR(10) NOT NULL
    CHECK (civil_defence IN ('Civil','Defence')),
  business_domain         VARCHAR(255) NOT NULL,
  lead_subtype            VARCHAR(20) NOT NULL
    CHECK (lead_subtype IN ('Domestic','Export','CRM','Government','JV','Other')),

  -- ── Consortium ───────────────────────────────────────────────────────────
  sole_consortium         VARCHAR(15) NOT NULL
    CHECK (sole_consortium IN ('Sole','Consortium')),

  -- ── EMD (Earnest Money Deposit) ──────────────────────────────────────────
  emd_value               DECIMAL(14,2),
  emd_exempted            BOOLEAN DEFAULT FALSE,
  emd_mode                VARCHAR(30)
    CHECK (emd_mode IN ('DD','BG','Online/NEFT','Cash','Exempted','Not Applicable')),

  -- ── Key dates ────────────────────────────────────────────────────────────
  tender_dated            DATE NOT NULL,
  last_submission_date    DATE NOT NULL
    CHECK (last_submission_date >= tender_dated),
  prebid_datetime         TIMESTAMP,

  -- ── Submission parameters ────────────────────────────────────────────────
  submission_mode         VARCHAR(20)
    CHECK (submission_mode IN ('Online','Physical','Hybrid')),
  bid_validity_days       INT DEFAULT 90,

  -- ── Eligibility criteria ─────────────────────────────────────────────────
  turnover_requirement_cr DECIMAL(10,2),
  experience_requirement  TEXT,
  msme_applicable         BOOLEAN DEFAULT FALSE,
  startup_applicable      BOOLEAN DEFAULT FALSE,

  -- ── Financial estimate ───────────────────────────────────────────────────
  estimated_value_cr      DECIMAL(10,2) NOT NULL,
  submitted_value_cr      DECIMAL(10,2),

  -- ── Internal scoring ─────────────────────────────────────────────────────
  win_probability_pct     INT DEFAULT 50
    CHECK (win_probability_pct BETWEEN 0 AND 100),
  strategic_importance    VARCHAR(10) DEFAULT 'Medium'
    CHECK (strategic_importance IN ('Low','Medium','High','Must-Win')),
  internal_notes          TEXT,

  -- ── Final outcome ─────────────────────────────────────────────────────────
  -- (Set after result is announced)
  outcome                 VARCHAR(25) DEFAULT 'Pending'
    CHECK (outcome IN (
      'Won','Lost','Participated','Not-Participated',
      'Withdrawn','Cancelled','Pending'
    )),
  open_closed             VARCHAR(10) DEFAULT 'Open'
    CHECK (open_closed IN ('Open','Closed')),
  order_won_value_cr      DECIMAL(10,2),        -- mandatory if outcome = Won
  reason_for_losing       TEXT,                 -- mandatory if Lost or Not-Participated

  -- ── Competitors (free-text summary — full detail in tender_competitors) ──
  competitors_info        TEXT,

  created_by              UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at              TIMESTAMP DEFAULT NOW(),
  updated_at              TIMESTAMP DEFAULT NOW(),
  is_deleted              BOOLEAN DEFAULT FALSE,

  -- Conditional constraints
  CONSTRAINT chk_won_value    CHECK (outcome != 'Won' OR order_won_value_cr IS NOT NULL),
  CONSTRAINT chk_loss_reason  CHECK (outcome NOT IN ('Lost','Not-Participated') OR reason_for_losing IS NOT NULL)
);

-- =============================================================================
-- 6. BIDDING PROCESS
-- The lifecycle engine that tracks which stage the bidding is at.
-- One Bidding Process per Tender (1:1).
-- Orchestrates Pre-qual → Tech Bid → Commercial Bid → Evaluation → Result.
-- =============================================================================
CREATE TABLE bidding_process (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tender_id             UUID NOT NULL UNIQUE REFERENCES tenders(id) ON DELETE CASCADE,

  -- ── Current stage ──────────────────────────────────────────────────────
  current_stage         VARCHAR(40) NOT NULL DEFAULT 'Pre-Qualification'
    CHECK (current_stage IN (
      'Pre-Qualification',
      'Technical Qualification',
      'Commercial Qualification',
      'Evaluation',
      'Result',
      'Closed'
    )),
  stage_entered_at      TIMESTAMP DEFAULT NOW(),
  stage_due_date        DATE,
  stage_owner_id        UUID REFERENCES users(id) ON DELETE SET NULL,
  stage_notes           TEXT,

  -- ── Go / No-Go decision (set at entry) ───────────────────────────────
  go_no_go_decision     VARCHAR(10) DEFAULT 'Pending'
    CHECK (go_no_go_decision IN ('Go','No-Go','Pending')),
  go_no_go_reason       TEXT,
  go_no_go_decided_by   UUID REFERENCES users(id) ON DELETE SET NULL,
  go_no_go_decided_at   TIMESTAMP,

  -- ── Health & priority ─────────────────────────────────────────────────
  priority              VARCHAR(10) DEFAULT 'Normal'
    CHECK (priority IN ('Low','Normal','High','Critical')),
  health_status         VARCHAR(10) DEFAULT 'Green'
    CHECK (health_status IN ('Green','Amber','Red')),
  is_overdue            BOOLEAN DEFAULT FALSE,
  days_in_current_stage INT DEFAULT 0,
  total_days_elapsed    INT DEFAULT 0,

  created_by            UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at            TIMESTAMP DEFAULT NOW(),
  updated_at            TIMESTAMP DEFAULT NOW(),
  is_deleted            BOOLEAN DEFAULT FALSE
);

-- =============================================================================
-- 7. PRE-QUALIFICATION
-- Stage 4a: Customer checks if we meet basic eligibility before opening bids.
-- Tracks turnover, experience, MSME status, and the formal result.
-- =============================================================================
CREATE TABLE prequalification (
  id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  bidding_process_id      UUID NOT NULL REFERENCES bidding_process(id) ON DELETE CASCADE,
  tender_id               UUID NOT NULL REFERENCES tenders(id),

  -- ── Eligibility checks ───────────────────────────────────────────────
  turnover_met            BOOLEAN,
  turnover_evidence_doc   TEXT,             -- path to turnover certificate
  experience_met          BOOLEAN,
  experience_evidence_doc TEXT,             -- path to experience certificate
  msme_status             VARCHAR(30),      -- Micro / Small / Medium / Not Applicable
  msme_certificate_path   TEXT,
  startup_status          BOOLEAN DEFAULT FALSE,

  -- ── Additional criteria ───────────────────────────────────────────────
  manpower_criteria_met   BOOLEAN,
  technical_criteria_notes TEXT,
  other_criteria_notes    TEXT,

  -- ── Submission ────────────────────────────────────────────────────────
  submitted_on            DATE,
  document_path           TEXT,             -- PQ submission package

  -- ── Result ────────────────────────────────────────────────────────────
  qualification_result    VARCHAR(20)
    CHECK (qualification_result IN (
      'Qualified','Not Qualified','Awaiting','Not Applicable'
    )),
  result_received_on      DATE,
  disqualification_reason TEXT,

  created_by              UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at              TIMESTAMP DEFAULT NOW(),
  updated_at              TIMESTAMP DEFAULT NOW()
);

-- =============================================================================
-- 8. TECHNICAL BID
-- Stage 4b: Technical proposal submitted and evaluated.
-- Tracks compliance, deviations, and formal technical evaluation outcome.
-- =============================================================================
CREATE TABLE technical_bids (
  id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  bidding_process_id      UUID NOT NULL REFERENCES bidding_process(id) ON DELETE CASCADE,
  tender_id               UUID NOT NULL REFERENCES tenders(id),

  -- ── Preparation ──────────────────────────────────────────────────────
  prepared_by             UUID REFERENCES users(id) ON DELETE SET NULL,
  reviewed_by             UUID REFERENCES users(id) ON DELETE SET NULL,
  approved_by             UUID REFERENCES users(id) ON DELETE SET NULL,
  approved_at             TIMESTAMP,

  -- ── Submission ────────────────────────────────────────────────────────
  submission_date         DATE,
  submission_mode         VARCHAR(20),
  submission_receipt_no   VARCHAR(150),
  document_path           TEXT,

  -- ── Technical opening ─────────────────────────────────────────────────
  tech_opening_date       DATE,
  attended_opening        BOOLEAN DEFAULT FALSE,

  -- ── Evaluation result ─────────────────────────────────────────────────
  compliant               BOOLEAN,          -- did we pass technical eval?
  compliance_score        DECIMAL(5,2),     -- if scored
  compliance_remarks      TEXT,
  deviations_noted        TEXT,
  customer_tech_queries   TEXT,             -- clarifications asked by customer
  our_tech_response       TEXT,
  response_submitted_date DATE,

  technical_eval_result   VARCHAR(20)
    CHECK (technical_eval_result IN (
      'Qualified','Conditionally Qualified','Not Qualified','Awaiting'
    )),
  eval_result_date        DATE,

  created_by              UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at              TIMESTAMP DEFAULT NOW(),
  updated_at              TIMESTAMP DEFAULT NOW()
);

-- =============================================================================
-- 9. COMMERCIAL BID  (Financial Bid)
-- Stage 4c: Our commercial/financial proposal.
-- All monetary fields: bid price, EMD paid, PBG details.
-- =============================================================================
CREATE TABLE commercial_bids (
  id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  bidding_process_id      UUID NOT NULL REFERENCES bidding_process(id) ON DELETE CASCADE,
  tender_id               UUID NOT NULL REFERENCES tenders(id),

  -- ── Internal cost & pricing ──────────────────────────────────────────
  estimated_cost_cr       DECIMAL(10,2),    -- our internal delivery cost
  bid_price_cr            DECIMAL(10,2),    -- price we quoted (excl. GST)
  bid_price_incl_gst_cr   DECIMAL(10,2),
  gst_pct                 DECIMAL(5,2) DEFAULT 18.00,
  bid_margin_pct          DECIMAL(5,2),     -- (bid - cost) / cost × 100

  -- ── Approval chain ────────────────────────────────────────────────────
  prepared_by             UUID REFERENCES users(id) ON DELETE SET NULL,
  approved_by             UUID REFERENCES users(id) ON DELETE SET NULL,
  approved_at             TIMESTAMP,
  approval_notes          TEXT,

  -- ── EMD (Earnest Money Deposit) ──────────────────────────────────────
  emd_amount              DECIMAL(14,2),
  emd_paid_date           DATE,
  emd_payment_mode        VARCHAR(30),
  emd_receipt_no          VARCHAR(100),
  emd_bank                VARCHAR(150),
  emd_refund_status       VARCHAR(20) DEFAULT 'Pending'
    CHECK (emd_refund_status IN ('Not Applicable','Pending','Received','Forfeited')),
  emd_refund_date         DATE,

  -- ── Performance Bank Guarantee (PBG) ────────────────────────────────
  pbg_required            BOOLEAN DEFAULT FALSE,
  pbg_amount              DECIMAL(12,2),
  pbg_bank                VARCHAR(150),
  pbg_issued_date         DATE,
  pbg_expiry_date         DATE,
  pbg_document_path       TEXT,

  -- ── Submission ────────────────────────────────────────────────────────
  submission_date         DATE,
  submission_mode         VARCHAR(20),
  submission_receipt_no   VARCHAR(200),
  document_path           TEXT,

  -- ── Financial opening ─────────────────────────────────────────────────
  financial_opening_date  DATE,
  attended_opening        BOOLEAN DEFAULT FALSE,

  created_by              UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at              TIMESTAMP DEFAULT NOW(),
  updated_at              TIMESTAMP DEFAULT NOW()
);

-- =============================================================================
-- 10. EVALUATION ROUNDS
-- Stage 5: After bids are opened, customer conducts evaluation.
-- Multiple rounds of clarification may happen — both technical and financial.
-- Each round is one exchange: customer raises queries, we respond.
-- =============================================================================
CREATE TABLE evaluation_rounds (
  id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  bidding_process_id      UUID NOT NULL REFERENCES bidding_process(id) ON DELETE CASCADE,
  tender_id               UUID NOT NULL REFERENCES tenders(id),

  round_number            INT NOT NULL,     -- 1, 2, 3 in sequence
  round_type              VARCHAR(30) NOT NULL
    CHECK (round_type IN (
      'Technical Clarification',
      'Financial Clarification',
      'Technical + Financial',
      'Reverse Auction',
      'Negotiation',
      'Presentation / Demo',
      'Site Visit',
      'Other'
    )),

  -- ── Customer's queries ────────────────────────────────────────────────
  eval_date               DATE,
  customer_queries        TEXT NOT NULL,    -- what the customer asked
  query_document_path     TEXT,             -- official query letter PDF

  -- ── Our response ─────────────────────────────────────────────────────
  our_response            TEXT,
  response_submitted_date DATE,
  response_document_path  TEXT,

  -- ── Additional clarification points ──────────────────────────────────
  clarification_points    TEXT,             -- internal notes
  internal_discussion     TEXT,

  -- ── Status ────────────────────────────────────────────────────────────
  status                  VARCHAR(20) DEFAULT 'Pending'
    CHECK (status IN ('Pending','Response Submitted','Closed','Pending Follow-Up')),
  outcome_notes           TEXT,

  created_by              UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at              TIMESTAMP DEFAULT NOW(),
  updated_at              TIMESTAMP DEFAULT NOW(),

  UNIQUE (bidding_process_id, round_number)
);

-- =============================================================================
-- 11. RESULTS
-- Stage 6: Customer announces L1, L2, L3 bidders.
-- This is the culmination of the entire procurement cycle.
-- =============================================================================
CREATE TABLE results (
  id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  bidding_process_id      UUID NOT NULL UNIQUE REFERENCES bidding_process(id) ON DELETE CASCADE,
  tender_id               UUID NOT NULL REFERENCES tenders(id),

  -- ── Our position ──────────────────────────────────────────────────────
  l_position              VARCHAR(5),       -- L1 / L2 / L3 / L4 etc.
  our_bid_price_cr        DECIMAL(10,2),

  -- ── L1 details (competitor who won, or us if we are L1) ──────────────
  l1_bidder_name          VARCHAR(255),
  l1_price_cr             DECIMAL(10,2),

  -- ── Price comparison ──────────────────────────────────────────────────
  price_diff_cr           DECIMAL(10,2),    -- our price - L1 price
  price_diff_pct          DECIMAL(6,2),     -- % above L1
  result_announced_date   DATE,

  -- ── Negotiation ───────────────────────────────────────────────────────
  negotiation_done        BOOLEAN DEFAULT FALSE,
  negotiation_price_cr    DECIMAL(10,2),    -- revised price after negotiation
  negotiation_notes       TEXT,
  negotiation_date        DATE,

  -- ── Final outcome ─────────────────────────────────────────────────────
  final_outcome           VARCHAR(30) NOT NULL
    CHECK (final_outcome IN (
      'Won','Lost-L2','Lost-L3','Lost-Technical',
      'Lost-Financial','Withdrawn',
      'Cancelled-by-Customer','Not-Participated','Pending'
    )),
  loss_reason_category    VARCHAR(60)
    CHECK (loss_reason_category IN (
      'Price Too High','Technical Non-Compliance',
      'Insufficient Experience','Blacklisted',
      'Consortium Issue','Late Submission',
      'Not Interested','Resource Constraint',
      'Strategic Decision','Other'
    )),
  detailed_loss_reason    TEXT,

  -- ── If Won ────────────────────────────────────────────────────────────
  order_value_cr          DECIMAL(10,2),    -- PO/WO value confirmed
  order_received_id       UUID,             -- FK set after PO arrives

  created_by              UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at              TIMESTAMP DEFAULT NOW(),
  updated_at              TIMESTAMP DEFAULT NOW()
);

-- =============================================================================
-- 12. ORDERS RECEIVED
-- Final outcome when we win.
-- Now properly linked back through result_id and tender_id.
-- =============================================================================
CREATE TABLE orders_received (
  id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tender_id               UUID REFERENCES tenders(id) ON DELETE SET NULL,
  result_id               UUID REFERENCES results(id) ON DELETE SET NULL,
  customer_id             UUID NOT NULL REFERENCES customers(id) ON DELETE RESTRICT,

  -- ── Order details ─────────────────────────────────────────────────────
  po_wo_number            VARCHAR(100) UNIQUE NOT NULL,
  order_received_date     DATE NOT NULL,
  order_type              VARCHAR(30) DEFAULT 'Work Order'
    CHECK (order_type IN ('Purchase Order','Work Order','LOI','Contract','Rate Contract','Other')),

  -- ── Values ────────────────────────────────────────────────────────────
  value_excl_gst_cr       DECIMAL(10,2) NOT NULL CHECK (value_excl_gst_cr >= 0),
  value_incl_gst_cr       DECIMAL(10,2) NOT NULL
    CHECK (value_incl_gst_cr >= value_excl_gst_cr),
  gst_pct                 DECIMAL(5,2),
  currency                VARCHAR(10) DEFAULT 'INR',

  -- ── Delivery ──────────────────────────────────────────────────────────
  delivery_period_days    INT,
  delivery_deadline       DATE,
  delivery_location       TEXT,

  -- ── Documents ─────────────────────────────────────────────────────────
  contract_doc_path       TEXT,
  contract_doc_name       VARCHAR(255),
  work_order_path         TEXT,
  work_order_name         VARCHAR(255),

  -- ── Tracking ──────────────────────────────────────────────────────────
  remarks                 TEXT,
  competitors             TEXT,

  created_by              UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at              TIMESTAMP DEFAULT NOW(),
  updated_at              TIMESTAMP DEFAULT NOW(),
  is_deleted              BOOLEAN DEFAULT FALSE
);

-- Wire up FK from results → orders_received (added after both tables exist)
ALTER TABLE results
  ADD CONSTRAINT fk_result_order
  FOREIGN KEY (order_received_id) REFERENCES orders_received(id) ON DELETE SET NULL;

-- =============================================================================
-- 13. CORRIGENDUMS
-- Amendments issued by the customer on an active tender.
-- Updates the last_submission_date on the parent tender automatically.
-- =============================================================================
CREATE TABLE corrigendums (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tender_id         UUID NOT NULL REFERENCES tenders(id) ON DELETE CASCADE,
  bidding_process_id UUID REFERENCES bidding_process(id) ON DELETE SET NULL,

  corrigendum_no    INT NOT NULL,           -- sequential: 1, 2, 3...
  issued_date       DATE NOT NULL,
  title             VARCHAR(255),
  description       TEXT NOT NULL,

  impact            VARCHAR(40) NOT NULL
    CHECK (impact IN (
      'Deadline Extended','Spec Changed','Value Changed',
      'EMD Changed','Scope Changed','Pre-bid Rescheduled',
      'Qualification Criteria Changed','Cancelled','Revived','Other'
    )),

  -- If deadline extended
  new_deadline      DATE,
  extension_days    INT,                    -- calculated from issued_date to new_deadline

  -- Other impacts
  new_emd_amount    DECIMAL(14,2),
  scope_change_notes TEXT,

  file_path         TEXT,
  file_name         VARCHAR(255),
  uploaded_by       UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at        TIMESTAMP DEFAULT NOW(),

  UNIQUE (tender_id, corrigendum_no)
);

-- =============================================================================
-- 14. COMPETITORS
-- Structured competitor intelligence per tender.
-- Updated when result is announced (L-position, actual bid price).
-- =============================================================================
CREATE TABLE tender_competitors (
  id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tender_id               UUID NOT NULL REFERENCES tenders(id) ON DELETE CASCADE,

  competitor_name         VARCHAR(255) NOT NULL,
  company_type            VARCHAR(30)
    CHECK (company_type IN ('PSU','Private','MNC','MSME','Startup','JV','Other')),
  is_consortium           BOOLEAN DEFAULT FALSE,
  consortium_partners     TEXT,

  -- Intelligence (before result)
  known_strength          TEXT,
  known_weakness          TEXT,
  previous_win_rate_pct   INT,
  last_known_bid_cr       DECIMAL(10,2),
  threat_level            VARCHAR(10) DEFAULT 'Medium'
    CHECK (threat_level IN ('Low','Medium','High','Very High')),

  -- Result data (filled after announcement)
  won_this_tender         BOOLEAN DEFAULT FALSE,
  l_position_at_result    VARCHAR(5),       -- L1/L2/L3
  bid_price_at_result_cr  DECIMAL(10,2),

  created_at              TIMESTAMP DEFAULT NOW(),
  updated_at              TIMESTAMP DEFAULT NOW()
);

-- =============================================================================
-- 15. CONSORTIUM MEMBERS
-- When sole_consortium = 'Consortium', track each partner.
-- =============================================================================
CREATE TABLE consortium_members (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tender_id         UUID NOT NULL REFERENCES tenders(id) ON DELETE CASCADE,

  partner_name      VARCHAR(255) NOT NULL,
  partner_type      VARCHAR(30)
    CHECK (partner_type IN (
      'Prime','Sub-Contractor','Technology Partner',
      'Financial Partner','OEM','Other'
    )),
  role_description  TEXT,
  scope_of_work     TEXT,
  value_share_cr    DECIMAL(10,2),
  share_pct         DECIMAL(5,2),

  mou_signed        BOOLEAN DEFAULT FALSE,
  mou_date          DATE,
  mou_file_path     TEXT,

  contact_person    VARCHAR(200),
  contact_email     VARCHAR(200),
  contact_phone     VARCHAR(40),

  created_at        TIMESTAMP DEFAULT NOW(),
  updated_at        TIMESTAMP DEFAULT NOW()
);

-- =============================================================================
-- 16. STAGE HISTORY  (Audit trail for Bidding Process stages)
-- Every stage transition is recorded.
-- =============================================================================
CREATE TABLE stage_history (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  bidding_process_id  UUID NOT NULL REFERENCES bidding_process(id) ON DELETE CASCADE,
  tender_id           UUID NOT NULL REFERENCES tenders(id),

  from_stage          VARCHAR(40),          -- NULL for first entry
  to_stage            VARCHAR(40) NOT NULL,
  transitioned_at     TIMESTAMP DEFAULT NOW(),
  transitioned_by     UUID REFERENCES users(id) ON DELETE SET NULL,
  days_spent          INT,                  -- days spent in from_stage
  was_overdue         BOOLEAN DEFAULT FALSE,
  original_due_date   DATE,
  notes               TEXT
);

-- =============================================================================
-- 17. STAGE ACTIONS  (Checklist per stage)
-- Auto-generated when stage changes; manually completed.
-- =============================================================================
CREATE TABLE stage_actions (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  bidding_process_id  UUID NOT NULL REFERENCES bidding_process(id) ON DELETE CASCADE,
  stage               VARCHAR(40) NOT NULL,

  action_title        VARCHAR(255) NOT NULL,
  action_type         VARCHAR(20) NOT NULL
    CHECK (action_type IN ('Task','Document','Approval','Verification','Alert')),
  is_mandatory        BOOLEAN DEFAULT TRUE,
  is_completed        BOOLEAN DEFAULT FALSE,
  completed_by        UUID REFERENCES users(id) ON DELETE SET NULL,
  completed_at        TIMESTAMP,
  due_date            DATE,
  assigned_to         UUID REFERENCES users(id) ON DELETE SET NULL,
  notes               TEXT,
  document_path       TEXT,
  document_name       VARCHAR(255),
  sort_order          INT DEFAULT 0,

  created_at          TIMESTAMP DEFAULT NOW(),
  updated_at          TIMESTAMP DEFAULT NOW()
);

-- =============================================================================
-- 18. ALERTS
-- Auto-generated reminders: submission deadlines, pre-bid meetings, overdue stages.
-- =============================================================================
CREATE TABLE alerts (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  bidding_process_id  UUID REFERENCES bidding_process(id) ON DELETE CASCADE,
  tender_id           UUID REFERENCES tenders(id) ON DELETE CASCADE,
  assigned_to         UUID REFERENCES users(id) ON DELETE CASCADE,

  alert_type          VARCHAR(40) NOT NULL
    CHECK (alert_type IN (
      'Submission Deadline','Pre-Bid Meeting','EMD Expiry','PBG Expiry',
      'Corrigendum Issued','Stage Overdue','Action Pending',
      'Result Expected','Go-No-Go Due','Bid Validity Expiry',
      'Evaluation Round Due','Custom'
    )),
  title               VARCHAR(255) NOT NULL,
  message             TEXT,
  due_date            DATE NOT NULL,
  severity            VARCHAR(10) DEFAULT 'Normal'
    CHECK (severity IN ('Info','Normal','Warning','Critical')),
  is_read             BOOLEAN DEFAULT FALSE,
  is_dismissed        BOOLEAN DEFAULT FALSE,

  created_at          TIMESTAMP DEFAULT NOW()
);

-- =============================================================================
-- INDEXES
-- =============================================================================
-- Customers
CREATE INDEX idx_customers_sector   ON customers(sector)      WHERE is_deleted = FALSE;
CREATE INDEX idx_customers_type     ON customers(customer_type) WHERE is_deleted = FALSE;

-- EOI
CREATE INDEX idx_eoi_customer       ON expressions_of_interest(customer_id);
CREATE INDEX idx_eoi_status         ON expressions_of_interest(status)   WHERE is_deleted = FALSE;
CREATE INDEX idx_eoi_assigned       ON expressions_of_interest(assigned_to);

-- BQ
CREATE INDEX idx_bq_eoi             ON budgetary_quotations(eoi_id);
CREATE INDEX idx_bq_customer        ON budgetary_quotations(customer_id);
CREATE INDEX idx_bq_status          ON budgetary_quotations(present_status) WHERE is_deleted = FALSE;

-- Tenders (largest table)
CREATE INDEX idx_tenders_customer    ON tenders(customer_id)                WHERE is_deleted = FALSE;
CREATE INDEX idx_tenders_owner       ON tenders(lead_owner_id)              WHERE is_deleted = FALSE;
CREATE INDEX idx_tenders_civil_def   ON tenders(civil_defence)              WHERE is_deleted = FALSE;
CREATE INDEX idx_tenders_subtype     ON tenders(lead_subtype)               WHERE is_deleted = FALSE;
CREATE INDEX idx_tenders_outcome     ON tenders(outcome)                    WHERE is_deleted = FALSE;
CREATE INDEX idx_tenders_open_closed ON tenders(open_closed)                WHERE is_deleted = FALSE;
CREATE INDEX idx_tenders_dated       ON tenders(tender_dated);
CREATE INDEX idx_tenders_deadline    ON tenders(last_submission_date);
CREATE INDEX idx_tenders_domain      ON tenders(business_domain)            WHERE is_deleted = FALSE;
CREATE INDEX idx_tenders_eoi         ON tenders(eoi_id);
CREATE INDEX idx_tenders_bq          ON tenders(bq_id);

-- Bidding Process
CREATE INDEX idx_bp_tender          ON bidding_process(tender_id);
CREATE INDEX idx_bp_stage           ON bidding_process(current_stage) WHERE is_deleted = FALSE;
CREATE INDEX idx_bp_health          ON bidding_process(health_status) WHERE is_deleted = FALSE;
CREATE INDEX idx_bp_overdue         ON bidding_process(is_overdue)    WHERE is_deleted = FALSE;
CREATE INDEX idx_bp_owner           ON bidding_process(stage_owner_id);

-- Qualification tables
CREATE INDEX idx_prequal_bp         ON prequalification(bidding_process_id);
CREATE INDEX idx_techbid_bp         ON technical_bids(bidding_process_id);
CREATE INDEX idx_commbid_bp         ON commercial_bids(bidding_process_id);

-- Evaluation Rounds
CREATE INDEX idx_eval_bp            ON evaluation_rounds(bidding_process_id);
CREATE INDEX idx_eval_status        ON evaluation_rounds(status);

-- Results
CREATE INDEX idx_results_bp         ON results(bidding_process_id);
CREATE INDEX idx_results_outcome    ON results(final_outcome);

-- Orders
CREATE INDEX idx_orders_tender      ON orders_received(tender_id)   WHERE is_deleted = FALSE;
CREATE INDEX idx_orders_customer    ON orders_received(customer_id) WHERE is_deleted = FALSE;
CREATE INDEX idx_orders_date        ON orders_received(order_received_date);

-- Supporting tables
CREATE INDEX idx_corrigendum_tender ON corrigendums(tender_id);
CREATE INDEX idx_competitors_tender ON tender_competitors(tender_id);
CREATE INDEX idx_consortium_tender  ON consortium_members(tender_id);
CREATE INDEX idx_history_bp         ON stage_history(bidding_process_id);
CREATE INDEX idx_actions_bp         ON stage_actions(bidding_process_id);
CREATE INDEX idx_alerts_assigned    ON alerts(assigned_to)  WHERE is_dismissed = FALSE;
CREATE INDEX idx_alerts_due         ON alerts(due_date)     WHERE is_dismissed = FALSE;

-- =============================================================================
-- AUTO-UPDATE HEALTH FUNCTION
-- =============================================================================
CREATE OR REPLACE FUNCTION update_bidding_health()
RETURNS void AS $$
BEGIN
  UPDATE bidding_process bp
  SET
    days_in_current_stage = EXTRACT(DAY FROM NOW() - stage_entered_at)::INT,
    is_overdue = CASE
      WHEN stage_due_date IS NOT NULL
        AND stage_due_date < CURRENT_DATE
        AND current_stage NOT IN ('Closed')
      THEN TRUE ELSE FALSE
    END,
    health_status = CASE
      WHEN current_stage = 'Closed' THEN 'Green'
      WHEN stage_due_date IS NOT NULL AND stage_due_date < CURRENT_DATE THEN 'Red'
      WHEN stage_due_date IS NOT NULL AND stage_due_date <= CURRENT_DATE + 3 THEN 'Amber'
      WHEN EXTRACT(DAY FROM NOW() - stage_entered_at) > 30 THEN 'Amber'
      ELSE 'Green'
    END,
    updated_at = NOW()
  WHERE is_deleted = FALSE AND current_stage != 'Closed';
END;
$$ LANGUAGE plpgsql;

-- Daily cron: 0 2 * * * psql -U mp_user -d marketing_portal -c 'SELECT update_bidding_health();'

-- =============================================================================
-- SEED: Default admin user
-- Password: Admin@1234
-- =============================================================================
INSERT INTO users (username, email, password_hash, full_name, role)
VALUES (
  'admin', 'admin@company.com',
  '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewEBsKoOsT5jH9Ey',
  'System Administrator', 'admin'
);
