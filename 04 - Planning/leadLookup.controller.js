// ─────────────────────────────────────────────────────────────────────────────
// backend/src/controllers/leadLookup.controller.js
//
// The Lead Lookup API — used by EVERY form in the system.
// Enter a lead number (or partial name) → get all lead data → auto-fill form.
//
// Endpoints:
//   GET /api/leads/lookup?q=LEAD-2026-DEF-0047   → exact or fuzzy search
//   GET /api/leads/lookup/:lead_no               → exact fetch by lead_no
//   GET /api/leads/lookup/validate/:lead_no      → check if number exists (fast)
// ─────────────────────────────────────────────────────────────────────────────

const { QueryTypes } = require('sequelize');
const sequelize       = require('../config/database');

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/leads/lookup?q=...
//
// Accepts:
//   q  — lead_no (exact or partial), customer name, tender name, domain
//
// Returns: array of matching leads (max 8) for dropdown suggestions
// Used by: every form's lead lookup input as-you-type
// ─────────────────────────────────────────────────────────────────────────────
exports.search = async (req, res, next) => {
  try {
    const { q } = req.query;

    if (!q || q.trim().length < 2) {
      return res.json({ success: true, data: [] });
    }

    const term = q.trim();

    // Strategy:
    // 1. Exact match on lead_no  (highest priority)
    // 2. Prefix match on lead_no (LEAD-2026-DEF-0...)
    // 3. Full-text search across title + customer name + domain
    const rows = await sequelize.query(`
      SELECT
        l.id,
        l.lead_no,
        l.lead_title,
        l.lead_status,
        l.current_stage,
        l.civil_defence,
        l.business_domain,
        l.estimated_value_cr,
        l.submission_deadline,
        c.company_name  AS customer_name,
        u.full_name     AS lead_owner_name,
        -- Relevance scoring: exact lead_no = 3, prefix = 2, text search = 1
        CASE
          WHEN UPPER(l.lead_no) = UPPER(:term)               THEN 3
          WHEN UPPER(l.lead_no) LIKE UPPER(:prefix)          THEN 2
          WHEN l.search_vector @@ plainto_tsquery('english', :term) THEN 1
          ELSE 0
        END AS relevance
      FROM leads l
      JOIN customers c ON c.id = l.customer_id
      LEFT JOIN users u ON u.id = l.lead_owner_id
      WHERE l.is_deleted = FALSE
        AND (
          UPPER(l.lead_no) = UPPER(:term)
          OR UPPER(l.lead_no) LIKE UPPER(:prefix)
          OR UPPER(c.company_name) LIKE UPPER(:like)
          OR UPPER(l.lead_title)   LIKE UPPER(:like)
          OR l.search_vector @@ plainto_tsquery('english', :term)
        )
      ORDER BY relevance DESC, l.created_at DESC
      LIMIT 8
    `, {
      type: QueryTypes.SELECT,
      replacements: {
        term:   term,
        prefix: term + '%',
        like:   '%' + term + '%',
      },
    });

    res.json({
      success: true,
      data:    rows,
      count:   rows.length,
    });
  } catch (err) { next(err); }
};

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/leads/lookup/:lead_no
//
// Exact fetch by lead_no — returns full lead data for auto-filling a form.
// This is called once user selects a lead from the suggestion dropdown.
//
// Returns: complete lead record with customer, owner, tender, stage details
// ─────────────────────────────────────────────────────────────────────────────
exports.getByLeadNo = async (req, res, next) => {
  try {
    const { lead_no } = req.params;

    const [lead] = await sequelize.query(`
      SELECT * FROM v_lead_lookup
      WHERE UPPER(lead_no) = UPPER(:lead_no)
    `, {
      type: QueryTypes.SELECT,
      replacements: { lead_no },
    });

    if (!lead) {
      return res.status(404).json({
        success: false,
        error:   `Lead not found: ${lead_no}`,
        hint:    'Check the lead number format: LEAD-YYYY-XXX-NNNN',
      });
    }

    // Also fetch the stage history summary (last 3 transitions)
    const recentHistory = await sequelize.query(`
      SELECT from_stage, to_stage, changed_at, days_in_from_stage
      FROM lead_stage_log
      WHERE lead_id = :id
      ORDER BY changed_at DESC
      LIMIT 3
    `, {
      type: QueryTypes.SELECT,
      replacements: { id: lead.id },
    });

    res.json({
      success: true,
      data: {
        ...lead,
        recent_history: recentHistory,
      },
    });
  } catch (err) { next(err); }
};

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/leads/lookup/validate/:lead_no
//
// Lightweight existence check — just returns { exists: true/false, lead_no }.
// Used for real-time validation as user types (debounced, no full data fetch).
// ─────────────────────────────────────────────────────────────────────────────
exports.validate = async (req, res, next) => {
  try {
    const { lead_no } = req.params;

    const [row] = await sequelize.query(`
      SELECT lead_no, lead_title, current_stage, lead_status
      FROM leads
      WHERE UPPER(lead_no) = UPPER(:lead_no) AND is_deleted = FALSE
    `, {
      type: QueryTypes.SELECT,
      replacements: { lead_no },
    });

    if (!row) {
      return res.json({
        success:  true,
        exists:   false,
        lead_no,
      });
    }

    res.json({
      success:       true,
      exists:        true,
      lead_no:       row.lead_no,
      lead_title:    row.lead_title,
      current_stage: row.current_stage,
      lead_status:   row.lead_status,
    });
  } catch (err) { next(err); }
};

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/leads/generate-number?civil_defence=Defence&lead_subtype=Domestic
//
// Preview what the next lead number will be (before actually creating).
// Does NOT consume the sequence — just shows what would be generated.
// Used by the "New Lead" form to display the upcoming number.
// ─────────────────────────────────────────────────────────────────────────────
exports.previewNumber = async (req, res, next) => {
  try {
    const { civil_defence = 'Civil', lead_subtype = 'Domestic' } = req.query;

    // Get sector code
    const [{ sector_code }] = await sequelize.query(`
      SELECT get_sector_code(:cd, :ls) AS sector_code
    `, {
      type: QueryTypes.SELECT,
      replacements: { cd: civil_defence, ls: lead_subtype },
    });

    // Get current sequence without incrementing
    const fy = new Date().getMonth() >= 3
      ? new Date().getFullYear() + 1
      : new Date().getFullYear();

    const [seq] = await sequelize.query(`
      SELECT COALESCE(last_sequence, 0) AS current_seq
      FROM lead_number_sequences
      WHERE financial_year = :fy AND sector_code = :sc
    `, {
      type: QueryTypes.SELECT,
      replacements: { fy, sc: sector_code },
    });

    const nextSeq     = (parseInt(seq?.current_seq || 0) + 1);
    const previewNo   = `LEAD-${fy}-${sector_code}-${String(nextSeq).padStart(4, '0')}`;

    res.json({
      success:     true,
      preview:     previewNo,
      fy,
      sector_code,
      next_sequence: nextSeq,
    });
  } catch (err) { next(err); }
};
