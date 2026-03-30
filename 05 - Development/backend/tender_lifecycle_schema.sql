-- =============================================================================
-- TENDER LIFECYCLE ENGINE — Complete Database Setup
-- Run this on top of your existing marketing_portal database
-- Command: psql -U mp_user -d marketing_portal -f tender_lifecycle_schema.sql
-- =============================================================================

-- ─── Step 1: Extend the existing leads table ─────────────────────────────────
ALTER TABLE leads
  ADD COLUMN IF NOT EXISTS tender_reference_no      VARCHAR(150),
  ADD COLUMN IF NOT EXISTS publishing_authority     VARCHAR(255),
  ADD COLUMN IF NOT EXISTS portal_name              VARCHAR(100),
  ADD COLUMN IF NOT EXISTS portal_tender_id         VARCHAR(150),
  ADD COLUMN IF NOT EXISTS emd_exempted             BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS emd_mode                 VARCHAR(30)
    CHECK (emd_mode IN ('DD','BG','Online','NEFT','Exempt')),
  ADD COLUMN IF NOT EXISTS submission_mode          VARCHAR(20)
    CHECK (submission_mode IN ('Online','Physical','Hybrid')),
  ADD COLUMN IF NOT EXISTS bid_validity_days        INT,
  ADD COLUMN IF NOT EXISTS turnover_requirement_cr  DECIMAL(10,2),
  ADD COLUMN IF NOT EXISTS experience_requirement   TEXT,
  ADD COLUMN IF NOT EXISTS msme_applicable          BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS startup_applicable       BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS win_probability_pct      INT
    CHECK (win_probability_pct BETWEEN 0 AND 100),
  ADD COLUMN IF NOT EXISTS strategic_importance     VARCHAR(10)
    CHECK (strategic_importance IN ('Low','Medium','High','Must-Win')),
  ADD COLUMN IF NOT EXISTS internal_notes           TEXT;

-- ─── Step 2: Main Lifecycle Table ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS tender_lifecycle (
  id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id                 UUID NOT NULL REFERENCES leads(id) ON DELETE CASCADE,

  -- Current stage
  current_stage           VARCHAR(30) NOT NULL DEFAULT 'Identified'
                          CHECK (current_stage IN (
                            'Identified','Qualifying','Document Study',
                            'Pre-Bid Meeting','Bid Submission',
                            'Evaluation','Result','Closed'
                          )),
  stage_entered_at        TIMESTAMP DEFAULT NOW(),
  stage_due_date          DATE,
  stage_owner_id          UUID REFERENCES users(id) ON DELETE SET NULL,

  -- Go/No-Go
  go_no_go_decision       VARCHAR(10) DEFAULT 'Pending'
                          CHECK (go_no_go_decision IN ('Go','No-Go','Pending')),
  go_no_go_reason         TEXT,
  go_no_go_decided_by     UUID REFERENCES users(id) ON DELETE SET NULL,
  go_no_go_decided_at     TIMESTAMP,

  -- Financial
  estimated_cost_cr       DECIMAL(10,2),
  bid_price_cr            DECIMAL(10,2),
  bid_price_incl_gst_cr   DECIMAL(10,2),
  emd_amount              DECIMAL(12,2),
  emd_paid_date           DATE,
  emd_receipt_no          VARCHAR(100),
  emd_mode                VARCHAR(30),
  emd_refund_date         DATE,
  emd_refunded            BOOLEAN DEFAULT FALSE,
  pbg_amount              DECIMAL(12,2),
  pbg_expiry_date         DATE,
  pbg_bank_name           VARCHAR(200),
  pbg_reference_no        VARCHAR(100),

  -- Submission tracking
  submission_date_actual  TIMESTAMP,
  submission_portal_ref   VARCHAR(200),
  technical_bid_submitted BOOLEAN DEFAULT FALSE,
  financial_bid_submitted BOOLEAN DEFAULT FALSE,

  -- Evaluation dates
  technical_opening_date  DATE,
  financial_opening_date  DATE,
  technical_qualified     BOOLEAN,
  technical_disqualification_reason TEXT,

  -- Result
  result_l_position       VARCHAR(5),
  result_l1_price_cr      DECIMAL(10,2),
  result_price_diff_cr    DECIMAL(10,2),
  result_announced_date   DATE,
  negotiation_done        BOOLEAN DEFAULT FALSE,
  negotiation_price_cr    DECIMAL(10,2),
  negotiation_notes       TEXT,

  -- Final outcome
  final_outcome           VARCHAR(30)
                          CHECK (final_outcome IN (
                            'Won','Lost-L2','Lost-L3','Lost-Technical',
                            'Lost-Price','Withdrawn','Cancelled-by-Customer',
                            'Not-Participated','Disqualified'
                          )),
  loss_reason_category    VARCHAR(30)
                          CHECK (loss_reason_category IN (
                            'Price Too High','Technical Gap','Late Submission',
                            'Eligibility Issue','Strategic Decision',
                            'Resource Constraint','Partner Issue','Other'
                          )),
  detailed_loss_reason    TEXT,
  order_value_cr          DECIMAL(10,2),
  order_received_id       UUID REFERENCES orders_received(id) ON DELETE SET NULL,

  -- Health & priority
  priority                VARCHAR(10) DEFAULT 'Normal'
                          CHECK (priority IN ('Low','Normal','High','Critical')),
  health_status           VARCHAR(10) DEFAULT 'Green'
                          CHECK (health_status IN ('Green','Amber','Red')),
  is_overdue              BOOLEAN DEFAULT FALSE,
  days_in_current_stage   INT DEFAULT 0,

  -- Audit
  created_by              UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at              TIMESTAMP DEFAULT NOW(),
  updated_at              TIMESTAMP DEFAULT NOW(),
  is_deleted              BOOLEAN DEFAULT FALSE,

  -- One lifecycle per lead
  CONSTRAINT unique_lead_lifecycle UNIQUE (lead_id)
);

-- ─── Step 3: Stage History (full audit trail) ─────────────────────────────────
CREATE TABLE IF NOT EXISTS tender_stage_history (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lifecycle_id      UUID NOT NULL REFERENCES tender_lifecycle(id) ON DELETE CASCADE,
  lead_id           UUID NOT NULL REFERENCES leads(id) ON DELETE CASCADE,

  from_stage        VARCHAR(30),
  to_stage          VARCHAR(30) NOT NULL,
  transitioned_at   TIMESTAMP DEFAULT NOW(),
  transitioned_by   UUID REFERENCES users(id) ON DELETE SET NULL,
  days_spent        INT DEFAULT 0,
  notes             TEXT,
  was_overdue       BOOLEAN DEFAULT FALSE,
  original_due_date DATE
);

-- ─── Step 4: Stage Actions / Checklist ───────────────────────────────────────
CREATE TABLE IF NOT EXISTS tender_stage_actions (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lifecycle_id    UUID NOT NULL REFERENCES tender_lifecycle(id) ON DELETE CASCADE,
  stage           VARCHAR(30) NOT NULL,

  action_title    VARCHAR(255) NOT NULL,
  action_type     VARCHAR(20) NOT NULL
                  CHECK (action_type IN ('Task','Document','Approval','Alert')),
  is_mandatory    BOOLEAN DEFAULT TRUE,
  is_completed    BOOLEAN DEFAULT FALSE,
  completed_by    UUID REFERENCES users(id) ON DELETE SET NULL,
  completed_at    TIMESTAMP,
  due_date        DATE,
  assigned_to     UUID REFERENCES users(id) ON DELETE SET NULL,
  notes           TEXT,
  document_path   TEXT,
  document_name   VARCHAR(255),
  sort_order      INT DEFAULT 0,

  created_at      TIMESTAMP DEFAULT NOW(),
  updated_at      TIMESTAMP DEFAULT NOW()
);

-- ─── Step 5: Corrigendums ─────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS tender_corrigendums (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lifecycle_id     UUID NOT NULL REFERENCES tender_lifecycle(id) ON DELETE CASCADE,
  lead_id          UUID NOT NULL REFERENCES leads(id) ON DELETE CASCADE,

  corrigendum_no   INT NOT NULL,
  issued_date      DATE NOT NULL,
  description      TEXT NOT NULL,
  impact           VARCHAR(25)
                   CHECK (impact IN (
                     'Deadline Extended','Spec Changed','Value Changed',
                     'EMD Changed','Scope Changed','Cancelled','Other'
                   )),
  new_deadline     DATE,
  extension_days   INT,
  file_path        TEXT,
  file_name        VARCHAR(255),
  uploaded_by      UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at       TIMESTAMP DEFAULT NOW(),

  CONSTRAINT unique_corrigendum_per_lifecycle UNIQUE (lifecycle_id, corrigendum_no)
);

-- ─── Step 6: Competitor Intelligence ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS tender_competitors (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lifecycle_id          UUID NOT NULL REFERENCES tender_lifecycle(id) ON DELETE CASCADE,
  lead_id               UUID NOT NULL REFERENCES leads(id) ON DELETE CASCADE,

  competitor_name       VARCHAR(255) NOT NULL,
  is_consortium         BOOLEAN DEFAULT FALSE,
  consortium_lead       VARCHAR(255),
  known_strength        TEXT,
  known_weakness        TEXT,
  prev_bid_price_cr     DECIMAL(10,2),
  won_this_tender       BOOLEAN DEFAULT FALSE,
  l_position            VARCHAR(5),
  bid_price_at_result   DECIMAL(10,2),
  source_of_intel       VARCHAR(100),

  created_at            TIMESTAMP DEFAULT NOW(),
  updated_at            TIMESTAMP DEFAULT NOW()
);

-- ─── Step 7: Consortium Partners ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS tender_consortium_members (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lifecycle_id    UUID NOT NULL REFERENCES tender_lifecycle(id) ON DELETE CASCADE,
  lead_id         UUID NOT NULL REFERENCES leads(id) ON DELETE CASCADE,

  partner_name    VARCHAR(255) NOT NULL,
  role            VARCHAR(100),
  scope_of_work   TEXT,
  value_share_cr  DECIMAL(10,2),
  mou_signed      BOOLEAN DEFAULT FALSE,
  mou_date        DATE,
  contact_person  VARCHAR(200),
  contact_email   VARCHAR(200),

  created_at      TIMESTAMP DEFAULT NOW()
);

-- ─── Step 8: Alerts & Reminders ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS tender_alerts (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lifecycle_id    UUID NOT NULL REFERENCES tender_lifecycle(id) ON DELETE CASCADE,
  lead_id         UUID NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
  assigned_to     UUID REFERENCES users(id) ON DELETE SET NULL,

  alert_type      VARCHAR(30) NOT NULL
                  CHECK (alert_type IN (
                    'Submission Deadline','Pre-Bid Meeting','EMD Expiry',
                    'PBG Expiry','Corrigendum Issued','Stage Overdue',
                    'Action Pending','Result Expected','Custom'
                  )),
  title           VARCHAR(255) NOT NULL,
  message         TEXT,
  due_date        DATE NOT NULL,
  days_before     INT DEFAULT 3,
  is_read         BOOLEAN DEFAULT FALSE,
  is_dismissed    BOOLEAN DEFAULT FALSE,
  severity        VARCHAR(10) DEFAULT 'Normal'
                  CHECK (severity IN ('Info','Normal','Warning','Critical')),

  created_at      TIMESTAMP DEFAULT NOW()
);

-- =============================================================================
-- INDEXES
-- =============================================================================
CREATE INDEX IF NOT EXISTS idx_lifecycle_lead_id     ON tender_lifecycle(lead_id);
CREATE INDEX IF NOT EXISTS idx_lifecycle_stage        ON tender_lifecycle(current_stage)   WHERE is_deleted = FALSE;
CREATE INDEX IF NOT EXISTS idx_lifecycle_health       ON tender_lifecycle(health_status)   WHERE is_deleted = FALSE;
CREATE INDEX IF NOT EXISTS idx_lifecycle_priority     ON tender_lifecycle(priority)        WHERE is_deleted = FALSE;
CREATE INDEX IF NOT EXISTS idx_lifecycle_overdue      ON tender_lifecycle(is_overdue)      WHERE is_deleted = FALSE;
CREATE INDEX IF NOT EXISTS idx_lifecycle_outcome      ON tender_lifecycle(final_outcome)   WHERE is_deleted = FALSE;
CREATE INDEX IF NOT EXISTS idx_stage_history_lc       ON tender_stage_history(lifecycle_id);
CREATE INDEX IF NOT EXISTS idx_actions_lifecycle      ON tender_stage_actions(lifecycle_id);
CREATE INDEX IF NOT EXISTS idx_actions_stage          ON tender_stage_actions(stage);
CREATE INDEX IF NOT EXISTS idx_corrigendum_lc         ON tender_corrigendums(lifecycle_id);
CREATE INDEX IF NOT EXISTS idx_competitors_lc         ON tender_competitors(lifecycle_id);
CREATE INDEX IF NOT EXISTS idx_alerts_assigned        ON tender_alerts(assigned_to)  WHERE is_dismissed = FALSE;
CREATE INDEX IF NOT EXISTS idx_alerts_due             ON tender_alerts(due_date)     WHERE is_dismissed = FALSE;

-- =============================================================================
-- FUNCTION: Auto-update health status and days_in_stage
-- Run via a nightly cron or after each stage update
-- =============================================================================
CREATE OR REPLACE FUNCTION update_lifecycle_health()
RETURNS void AS $$
BEGIN
  UPDATE tender_lifecycle
  SET
    days_in_current_stage = EXTRACT(DAY FROM NOW() - stage_entered_at)::INT,
    is_overdue = CASE
      WHEN stage_due_date IS NOT NULL AND stage_due_date < CURRENT_DATE THEN TRUE
      ELSE FALSE
    END,
    health_status = CASE
      WHEN final_outcome IS NOT NULL            THEN 'Green'
      WHEN stage_due_date < CURRENT_DATE        THEN 'Red'
      WHEN stage_due_date <= CURRENT_DATE + 3   THEN 'Amber'
      ELSE 'Green'
    END,
    updated_at = NOW()
  WHERE is_deleted = FALSE AND current_stage != 'Closed';
END;
$$ LANGUAGE plpgsql;

-- =============================================================================
-- FUNCTION: Auto-generate stage actions when stage changes
-- =============================================================================
CREATE OR REPLACE FUNCTION generate_stage_actions(
  p_lifecycle_id UUID,
  p_stage        VARCHAR(30),
  p_assigned_to  UUID
) RETURNS void AS $$
DECLARE
  action_data JSONB;
  action      JSONB;
BEGIN
  -- Define default actions per stage
  action_data := CASE p_stage
    WHEN 'Identified' THEN '[
      {"title":"Register tender reference number and portal ID","type":"Task","mandatory":true,"order":1},
      {"title":"Download and save tender notice/NIT document","type":"Document","mandatory":true,"order":2},
      {"title":"Assign lead owner and set qualifying deadline","type":"Task","mandatory":true,"order":3},
      {"title":"Check submission portal and registration requirements","type":"Task","mandatory":false,"order":4}
    ]'::JSONB
    WHEN 'Qualifying' THEN '[
      {"title":"Review technical specifications and eligibility criteria","type":"Task","mandatory":true,"order":1},
      {"title":"Verify turnover and experience requirements","type":"Task","mandatory":true,"order":2},
      {"title":"Check EMD requirements and mode of payment","type":"Task","mandatory":true,"order":3},
      {"title":"Assess in-house technical capability to deliver","type":"Task","mandatory":true,"order":4},
      {"title":"Check consortium requirement / partner availability","type":"Task","mandatory":false,"order":5},
      {"title":"Record Go / No-Go decision with justification","type":"Approval","mandatory":true,"order":6}
    ]'::JSONB
    WHEN 'Document Study' THEN '[
      {"title":"Download complete tender document set (BOQ, drawings, specs)","type":"Document","mandatory":true,"order":1},
      {"title":"Study scope of work and technical specifications thoroughly","type":"Task","mandatory":true,"order":2},
      {"title":"Identify and list clarification queries for pre-bid meeting","type":"Task","mandatory":true,"order":3},
      {"title":"Prepare internal cost estimate","type":"Task","mandatory":true,"order":4},
      {"title":"Upload document study notes","type":"Document","mandatory":false,"order":5}
    ]'::JSONB
    WHEN 'Pre-Bid Meeting' THEN '[
      {"title":"Attend pre-bid meeting (mark attendance)","type":"Task","mandatory":true,"order":1},
      {"title":"Upload pre-bid meeting minutes","type":"Document","mandatory":true,"order":2},
      {"title":"Record all clarifications received","type":"Task","mandatory":true,"order":3},
      {"title":"Check and upload corrigendum if issued","type":"Document","mandatory":false,"order":4},
      {"title":"Update bid price estimate based on clarifications","type":"Task","mandatory":true,"order":5}
    ]'::JSONB
    WHEN 'Bid Submission' THEN '[
      {"title":"Prepare technical bid documents","type":"Document","mandatory":true,"order":1},
      {"title":"Prepare and finalise financial bid / BOQ","type":"Document","mandatory":true,"order":2},
      {"title":"Arrange and submit EMD (DD/BG/Online)","type":"Task","mandatory":true,"order":3},
      {"title":"Upload EMD payment receipt","type":"Document","mandatory":true,"order":4},
      {"title":"Submit bid on portal / physically before deadline","type":"Task","mandatory":true,"order":5},
      {"title":"Save submission acknowledgement / receipt","type":"Document","mandatory":true,"order":6},
      {"title":"Record submission reference number","type":"Task","mandatory":true,"order":7}
    ]'::JSONB
    WHEN 'Evaluation' THEN '[
      {"title":"Note technical bid opening date and attend if required","type":"Task","mandatory":true,"order":1},
      {"title":"Record technical evaluation result (Qualified/Disqualified)","type":"Task","mandatory":true,"order":2},
      {"title":"Note financial bid opening date","type":"Task","mandatory":true,"order":3},
      {"title":"Record financial opening result and L-position","type":"Task","mandatory":true,"order":4}
    ]'::JSONB
    WHEN 'Result' THEN '[
      {"title":"Record official result — L1/L2/L3 position","type":"Task","mandatory":true,"order":1},
      {"title":"Record L1 bidder name and price","type":"Task","mandatory":true,"order":2},
      {"title":"Calculate price difference from L1","type":"Task","mandatory":true,"order":3},
      {"title":"Initiate negotiation if applicable (GFR Rule 179)","type":"Task","mandatory":false,"order":4},
      {"title":"Update competitor intelligence with result data","type":"Task","mandatory":true,"order":5}
    ]'::JSONB
    WHEN 'Closed' THEN '[
      {"title":"Record final outcome (Won/Lost/Withdrawn)","type":"Task","mandatory":true,"order":1},
      {"title":"If Won: create Order Received record","type":"Task","mandatory":false,"order":2},
      {"title":"If Won: arrange Performance Bank Guarantee (PBG)","type":"Task","mandatory":false,"order":3},
      {"title":"Follow up EMD refund (if Lost/Withdrawn)","type":"Task","mandatory":false,"order":4},
      {"title":"Document lessons learned for future bids","type":"Task","mandatory":true,"order":5},
      {"title":"Update competitor profile with result intelligence","type":"Task","mandatory":true,"order":6}
    ]'::JSONB
    ELSE '[]'::JSONB
  END;

  -- Insert each action
  FOR action IN SELECT * FROM jsonb_array_elements(action_data)
  LOOP
    INSERT INTO tender_stage_actions (
      lifecycle_id, stage, action_title, action_type,
      is_mandatory, assigned_to, sort_order
    ) VALUES (
      p_lifecycle_id,
      p_stage,
      action->>'title',
      action->>'type',
      (action->>'mandatory')::BOOLEAN,
      p_assigned_to,
      (action->>'order')::INT
    );
  END LOOP;
END;
$$ LANGUAGE plpgsql;

-- =============================================================================
-- VIEW: Lifecycle dashboard summary (used by analytics)
-- =============================================================================
CREATE OR REPLACE VIEW v_lifecycle_summary AS
SELECT
  tl.id,
  tl.lead_id,
  l.tender_name,
  l.customer_name,
  l.civil_defence,
  l.business_domain,
  l.lead_subtype,
  l.estimated_value_cr,
  l.submitted_value_cr,
  l.last_submission_date,
  l.sole_consortium,
  l.win_probability_pct,
  l.strategic_importance,
  tl.current_stage,
  tl.stage_due_date,
  tl.go_no_go_decision,
  tl.bid_price_cr,
  tl.emd_amount,
  tl.result_l_position,
  tl.result_l1_price_cr,
  tl.result_price_diff_cr,
  tl.final_outcome,
  tl.order_value_cr,
  tl.priority,
  tl.health_status,
  tl.is_overdue,
  tl.days_in_current_stage,
  u.full_name AS stage_owner_name,
  -- Pending actions count
  (SELECT COUNT(*) FROM tender_stage_actions tsa
   WHERE tsa.lifecycle_id = tl.id
     AND tsa.stage = tl.current_stage
     AND tsa.is_completed = FALSE
     AND tsa.is_mandatory = TRUE
  ) AS pending_mandatory_actions,
  -- Corrigendums count
  (SELECT COUNT(*) FROM tender_corrigendums tc WHERE tc.lifecycle_id = tl.id) AS corrigendum_count,
  tl.created_at,
  tl.updated_at
FROM tender_lifecycle tl
JOIN leads l ON l.id = tl.lead_id
LEFT JOIN users u ON u.id = tl.stage_owner_id
WHERE tl.is_deleted = FALSE AND l.is_deleted = FALSE;
