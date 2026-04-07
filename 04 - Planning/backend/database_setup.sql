-- =============================================================================
-- Marketing Portal — Complete PostgreSQL Database Setup
-- Run this file once on a fresh PostgreSQL installation.
-- Command: psql -U postgres -f database_setup.sql
-- =============================================================================

-- ─── 1. Create database and user ─────────────────────────────────────────────
CREATE DATABASE marketing_portal;
CREATE USER mp_user WITH PASSWORD 'your_strong_password_here';
GRANT ALL PRIVILEGES ON DATABASE marketing_portal TO mp_user;

-- Connect to the new database before running the rest
\c marketing_portal;

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Grant schema privileges
GRANT ALL ON SCHEMA public TO mp_user;

-- =============================================================================
-- TABLES
-- =============================================================================

-- ─── Users ───────────────────────────────────────────────────────────────────
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

-- ─── Budgetary Quotations ─────────────────────────────────────────────────────
CREATE TABLE bq_quotations (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  bq_title            VARCHAR(255) NOT NULL,
  customer_name       VARCHAR(255) NOT NULL,
  customer_address    TEXT         NOT NULL,
  lead_owner_id       UUID REFERENCES users(id) ON DELETE SET NULL,
  defence_type        VARCHAR(20)  NOT NULL
                      CHECK (defence_type IN ('Defence','Non-Defence')),
  estimated_value_cr  DECIMAL(10,2) NOT NULL CHECK (estimated_value_cr >= 0),
  submitted_value_cr  DECIMAL(10,2) NOT NULL CHECK (submitted_value_cr >= 0),
  submission_date     DATE         NOT NULL,
  reference_no        VARCHAR(100),
  competitors         TEXT,
  present_status      VARCHAR(100) NOT NULL,
  document_path       TEXT,
  document_name       VARCHAR(255),
  created_by          UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at          TIMESTAMP DEFAULT NOW(),
  updated_at          TIMESTAMP DEFAULT NOW(),
  is_deleted          BOOLEAN DEFAULT FALSE
);

-- ─── Leads ────────────────────────────────────────────────────────────────────
CREATE TABLE leads (
  id                   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_subtype         VARCHAR(20)  NOT NULL
                       CHECK (lead_subtype IN ('Submitted','Domestic','Export','CRM','Lost')),
  tender_name          VARCHAR(500) NOT NULL,
  customer_name        VARCHAR(255) NOT NULL,
  customer_location    VARCHAR(255) NOT NULL,
  tender_type          VARCHAR(100) NOT NULL,
  document_type        VARCHAR(100) NOT NULL,
  lead_owner_id        UUID REFERENCES users(id) ON DELETE SET NULL,
  civil_defence        VARCHAR(10)  NOT NULL
                       CHECK (civil_defence IN ('Civil','Defence')),
  business_domain      VARCHAR(255) NOT NULL,
  emd_value            DECIMAL(14,2) CHECK (emd_value >= 0),
  estimated_value_cr   DECIMAL(10,2) NOT NULL CHECK (estimated_value_cr >= 0),
  submitted_value_cr   DECIMAL(10,2) CHECK (submitted_value_cr >= 0),
  tender_dated         DATE         NOT NULL,
  last_submission_date DATE         NOT NULL
                       CHECK (last_submission_date >= tender_dated),
  sole_consortium      VARCHAR(15)  NOT NULL
                       CHECK (sole_consortium IN ('Sole','Consortium')),
  prebid_datetime      TIMESTAMP,
  competitors_info     TEXT,
  outcome              VARCHAR(25)  NOT NULL
                       CHECK (outcome IN ('Won','Lost','Participated','Not-Participated')),
  open_closed          VARCHAR(10)  NOT NULL
                       CHECK (open_closed IN ('Open','Closed')),
  order_won_value_cr   DECIMAL(10,2) CHECK (order_won_value_cr >= 0),
  present_status       TEXT         NOT NULL,
  reason_for_losing    TEXT,
  created_by           UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at           TIMESTAMP DEFAULT NOW(),
  updated_at           TIMESTAMP DEFAULT NOW(),
  is_deleted           BOOLEAN DEFAULT FALSE,

  -- Enforce: order_won_value_cr required when outcome = Won
  CONSTRAINT chk_won_value CHECK (
    outcome != 'Won' OR order_won_value_cr IS NOT NULL
  ),
  -- Enforce: reason required when Lost or Not-Participated
  CONSTRAINT chk_reason CHECK (
    outcome NOT IN ('Lost','Not-Participated') OR reason_for_losing IS NOT NULL
  )
);

-- ─── Lead Corrigendums ────────────────────────────────────────────────────────
CREATE TABLE lead_corrigendums (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id          UUID NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
  corrigendum_date DATE NOT NULL,
  file_path        TEXT NOT NULL,
  file_name        VARCHAR(255) NOT NULL,
  uploaded_by      UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at       TIMESTAMP DEFAULT NOW()
);

-- ─── Orders Received ─────────────────────────────────────────────────────────
CREATE TABLE orders_received (
  id                   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tender_name          VARCHAR(500) NOT NULL,
  customer_name        VARCHAR(255) NOT NULL,
  customer_address     TEXT         NOT NULL,
  order_received_date  DATE         NOT NULL,
  po_wo_number         VARCHAR(100) UNIQUE NOT NULL,
  tender_type          VARCHAR(100) NOT NULL,
  value_excl_gst_cr    DECIMAL(10,2) NOT NULL CHECK (value_excl_gst_cr >= 0),
  value_incl_gst_cr    DECIMAL(10,2) NOT NULL
                       CHECK (value_incl_gst_cr >= value_excl_gst_cr),
  competitors          TEXT,
  remarks              TEXT,
  contract_doc_path    TEXT,
  contract_doc_name    VARCHAR(255),
  work_order_path      TEXT,
  work_order_name      VARCHAR(255),
  created_by           UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at           TIMESTAMP DEFAULT NOW(),
  updated_at           TIMESTAMP DEFAULT NOW(),
  is_deleted           BOOLEAN DEFAULT FALSE
);

-- ─── In-House R&D ─────────────────────────────────────────────────────────────
CREATE TABLE inhouse_rd (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_title    VARCHAR(255) NOT NULL,
  description      TEXT,
  business_domain  VARCHAR(255),
  start_date       DATE,
  target_date      DATE,
  status           VARCHAR(50) DEFAULT 'Active'
                   CHECK (status IN ('Active','On Hold','Completed','Cancelled')),
  team_members     TEXT,
  document_path    TEXT,
  document_name    VARCHAR(255),
  created_by       UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at       TIMESTAMP DEFAULT NOW(),
  updated_at       TIMESTAMP DEFAULT NOW(),
  is_deleted       BOOLEAN DEFAULT FALSE
);

-- =============================================================================
-- INDEXES (for query performance on filtered columns)
-- =============================================================================
CREATE INDEX idx_leads_subtype        ON leads(lead_subtype)       WHERE is_deleted = FALSE;
CREATE INDEX idx_leads_outcome        ON leads(outcome)            WHERE is_deleted = FALSE;
CREATE INDEX idx_leads_civil_defence  ON leads(civil_defence)      WHERE is_deleted = FALSE;
CREATE INDEX idx_leads_owner          ON leads(lead_owner_id)      WHERE is_deleted = FALSE;
CREATE INDEX idx_leads_open_closed    ON leads(open_closed)        WHERE is_deleted = FALSE;
CREATE INDEX idx_leads_created_at     ON leads(created_at);
CREATE INDEX idx_leads_tender_date    ON leads(tender_dated);
CREATE INDEX idx_orders_date          ON orders_received(order_received_date) WHERE is_deleted = FALSE;
CREATE INDEX idx_orders_created_at    ON orders_received(created_at);
CREATE INDEX idx_bq_defence           ON bq_quotations(defence_type)          WHERE is_deleted = FALSE;
CREATE INDEX idx_bq_status            ON bq_quotations(present_status)        WHERE is_deleted = FALSE;
CREATE INDEX idx_corrigendum_lead     ON lead_corrigendums(lead_id);

-- =============================================================================
-- SEED — Default Admin User
-- Password: Admin@1234  (bcrypt hash — change after first login!)
-- Generate a new hash: node -e "const b=require('bcryptjs'); console.log(b.hashSync('Admin@1234',12))"
-- =============================================================================
INSERT INTO users (username, email, password_hash, full_name, role)
VALUES (
  'admin',
  'admin@company.com',
  '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewEBsKoOsT5jH9Ey',
  'System Administrator',
  'admin'
);

-- =============================================================================
-- VERIFY — Run these SELECTs to confirm everything is created correctly
-- =============================================================================
-- SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';
-- SELECT * FROM users;
