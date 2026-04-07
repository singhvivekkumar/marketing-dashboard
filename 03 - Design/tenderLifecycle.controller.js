// backend/src/controllers/tenderLifecycle.controller.js
const { QueryTypes, Op } = require('sequelize');
const sequelize           = require('../config/database');
const path                = require('path');
const fs                  = require('fs');
const TenderLifecycle     = require('../models/TenderLifecycle.model');
const TenderStageHistory  = require('../models/TenderSupporting.models');
const {
  TenderStageAction, TenderCorrigendum,
  TenderCompetitor, TenderConsortiumMember, TenderAlert,
} = require('../models/TenderSupporting.models');

// ─── Helpers ──────────────────────────────────────────────────────────────────
const STAGE_ORDER = TenderLifecycle.STAGE_ORDER;

// Call the DB function to generate default actions for a stage
async function generateDefaultActions(lifecycleId, stage, assignedTo) {
  await sequelize.query(
    `SELECT generate_stage_actions(:lid, :stage, :owner)`,
    { replacements: { lid: lifecycleId, stage, owner: assignedTo || null }, type: QueryTypes.SELECT }
  );
}

// Auto-generate alerts for a new stage
async function generateStageAlerts(lifecycle, lead) {
  const alerts = [];
  const stage  = lifecycle.current_stage;

  if (stage === 'Bid Submission' && lead.last_submission_date) {
    const due = new Date(lead.last_submission_date);
    alerts.push({ alert_type:'Submission Deadline', title:`Bid deadline: ${lead.tender_name}`,
      message:`Bid must be submitted by ${lead.last_submission_date}`,
      due_date: lead.last_submission_date, days_before:5, severity:'Critical' });

    // 1-day warning
    const warn = new Date(due); warn.setDate(warn.getDate() - 1);
    alerts.push({ alert_type:'Submission Deadline', title:`URGENT: Bid deadline tomorrow — ${lead.tender_name}`,
      message:`Final check and submission required today`,
      due_date: warn.toISOString().slice(0,10), days_before:1, severity:'Critical' });
  }

  if (stage === 'Pre-Bid Meeting' && lead.prebid_datetime) {
    alerts.push({ alert_type:'Pre-Bid Meeting', title:`Pre-bid meeting: ${lead.tender_name}`,
      message:`Pre-bid meeting scheduled. Ensure attendance and prepare queries.`,
      due_date: lead.prebid_datetime.slice(0,10), days_before:2, severity:'Warning' });
  }

  if (stage === 'Evaluation' && lifecycle.technical_opening_date) {
    alerts.push({ alert_type:'Result Expected', title:`Technical opening: ${lead.tender_name}`,
      due_date: lifecycle.technical_opening_date, days_before:1, severity:'Normal' });
  }

  if (lifecycle.pbg_expiry_date) {
    alerts.push({ alert_type:'PBG Expiry', title:`PBG expiring soon: ${lead.tender_name}`,
      due_date: lifecycle.pbg_expiry_date, days_before:30, severity:'Warning' });
  }

  for (const a of alerts) {
    await TenderAlert.create({
      lifecycle_id: lifecycle.id, lead_id: lifecycle.lead_id,
      assigned_to: lifecycle.stage_owner_id, ...a,
    });
  }
}

// ─── Compute health based on stage_due_date ───────────────────────────────────
function computeHealth(stageDueDate) {
  if (!stageDueDate) return 'Green';
  const today = new Date();
  const due   = new Date(stageDueDate);
  const diff  = Math.floor((due - today) / (1000*60*60*24));
  if (diff < 0)  return 'Red';
  if (diff <= 3) return 'Amber';
  return 'Green';
}

// =============================================================================
// CREATE lifecycle for a lead
// POST /api/lifecycle
// =============================================================================
exports.create = async (req, res, next) => {
  try {
    const { lead_id, stage_due_date, stage_owner_id, priority } = req.body;

    if (!lead_id) return res.status(422).json({ success:false, error:'lead_id is required.' });

    // Check lead exists
    const [lead] = await sequelize.query(
      `SELECT id, tender_name, last_submission_date, prebid_datetime FROM leads WHERE id = :id AND is_deleted = FALSE`,
      { replacements:{ id:lead_id }, type:QueryTypes.SELECT }
    );
    if (!lead) return res.status(404).json({ success:false, error:'Lead not found.' });

    // Prevent duplicate
    const existing = await TenderLifecycle.findOne({ where:{ lead_id } });
    if (existing) return res.status(409).json({ success:false, error:'A lifecycle already exists for this lead.' });

    const lc = await TenderLifecycle.create({
      lead_id,
      current_stage:   'Identified',
      stage_entered_at: new Date(),
      stage_due_date:  stage_due_date || null,
      stage_owner_id:  stage_owner_id || req.user.id,
      priority:        priority || 'Normal',
      health_status:   computeHealth(stage_due_date),
      created_by:      req.user.id,
    });

    // First stage history entry
    await TenderStageHistory.create({
      lifecycle_id:   lc.id, lead_id,
      from_stage:     null, to_stage: 'Identified',
      transitioned_by: req.user.id, days_spent:0,
    });

    // Generate default actions
    await generateDefaultActions(lc.id, 'Identified', lc.stage_owner_id);

    // Generate alerts
    await generateStageAlerts(lc, lead);

    res.status(201).json({ success:true, data:lc, message:'Tender lifecycle created.' });
  } catch(err) { next(err); }
};

// =============================================================================
// LIST all lifecycles
// GET /api/lifecycle
// =============================================================================
exports.list = async (req, res, next) => {
  try {
    const {
      stage, health, priority, is_overdue, civil_defence,
      lead_owner, search, page=1, limit=20
    } = req.query;

    const conditions = [`tl.is_deleted = FALSE`, `l.is_deleted = FALSE`];
    if (stage)        conditions.push(`tl.current_stage = '${stage}'`);
    if (health)       conditions.push(`tl.health_status = '${health}'`);
    if (priority)     conditions.push(`tl.priority = '${priority}'`);
    if (is_overdue === 'true') conditions.push(`tl.is_overdue = TRUE`);
    if (civil_defence) conditions.push(`l.civil_defence = '${civil_defence}'`);
    if (lead_owner)   conditions.push(`l.lead_owner_id = '${lead_owner}'`);
    if (search) conditions.push(
      `(l.tender_name ILIKE '%${search}%' OR l.customer_name ILIKE '%${search}%')`
    );

    const where  = conditions.join(' AND ');
    const offset = (parseInt(page)-1) * parseInt(limit);

    const [rows, [countRow]] = await Promise.all([
      sequelize.query(`
        SELECT
          tl.id, tl.lead_id, tl.current_stage, tl.stage_due_date,
          tl.go_no_go_decision, tl.bid_price_cr, tl.final_outcome,
          tl.priority, tl.health_status, tl.is_overdue, tl.days_in_current_stage,
          tl.result_l_position, tl.order_value_cr, tl.emd_amount,
          l.tender_name, l.customer_name, l.civil_defence, l.business_domain,
          l.lead_subtype, l.estimated_value_cr, l.last_submission_date,
          l.sole_consortium, l.win_probability_pct, l.strategic_importance,
          u.full_name AS stage_owner_name,
          (SELECT COUNT(*) FROM tender_stage_actions tsa
           WHERE tsa.lifecycle_id = tl.id AND tsa.stage = tl.current_stage
             AND tsa.is_completed = FALSE AND tsa.is_mandatory = TRUE
          ) AS pending_actions,
          (SELECT COUNT(*) FROM tender_corrigendums tc WHERE tc.lifecycle_id = tl.id) AS corrigendum_count
        FROM tender_lifecycle tl
        JOIN leads l ON l.id = tl.lead_id
        LEFT JOIN users u ON u.id = tl.stage_owner_id
        WHERE ${where}
        ORDER BY
          CASE tl.health_status WHEN 'Red' THEN 0 WHEN 'Amber' THEN 1 ELSE 2 END,
          CASE tl.priority WHEN 'Critical' THEN 0 WHEN 'High' THEN 1 WHEN 'Normal' THEN 2 ELSE 3 END,
          tl.stage_due_date ASC NULLS LAST
        LIMIT ${parseInt(limit)} OFFSET ${offset}
      `, { type:QueryTypes.SELECT }),

      sequelize.query(
        `SELECT COUNT(*) AS total FROM tender_lifecycle tl JOIN leads l ON l.id = tl.lead_id WHERE ${where}`,
        { type:QueryTypes.SELECT }
      ),
    ]);

    // Refresh health & days_in_stage in background
    await sequelize.query(`SELECT update_lifecycle_health()`, { type:QueryTypes.SELECT });

    res.json({ success:true, data:rows,
      pagination:{ total:parseInt(countRow.total), page:parseInt(page), limit:parseInt(limit),
        total_pages: Math.ceil(parseInt(countRow.total)/parseInt(limit)) } });
  } catch(err) { next(err); }
};

// =============================================================================
// GET single lifecycle (full detail)
// GET /api/lifecycle/:id
// =============================================================================
exports.getOne = async (req, res, next) => {
  try {
    const { id } = req.params;

    const [lc] = await sequelize.query(`
      SELECT tl.*, l.tender_name, l.customer_name, l.customer_location,
        l.civil_defence, l.business_domain, l.lead_subtype, l.tender_type,
        l.document_type, l.estimated_value_cr, l.submitted_value_cr,
        l.tender_dated, l.last_submission_date, l.prebid_datetime,
        l.sole_consortium, l.competitors_info, l.outcome, l.open_closed,
        l.present_status, l.win_probability_pct, l.strategic_importance,
        l.tender_reference_no, l.portal_name, l.portal_tender_id,
        l.emd_exempted, l.submission_mode, l.bid_validity_days,
        l.internal_notes,
        u_owner.full_name AS stage_owner_name,
        u_creator.full_name AS created_by_name
      FROM tender_lifecycle tl
      JOIN leads l ON l.id = tl.lead_id
      LEFT JOIN users u_owner   ON u_owner.id   = tl.stage_owner_id
      LEFT JOIN users u_creator ON u_creator.id = tl.created_by
      WHERE tl.id = :id AND tl.is_deleted = FALSE
    `, { replacements:{ id }, type:QueryTypes.SELECT });

    if (!lc) return res.status(404).json({ success:false, error:'Lifecycle not found.' });

    // Load all related data in parallel
    const [history, actions, corrigendums, competitors, consortium, alerts] = await Promise.all([
      sequelize.query(`
        SELECT tsh.*, u.full_name AS transitioned_by_name
        FROM tender_stage_history tsh
        LEFT JOIN users u ON u.id = tsh.transitioned_by
        WHERE tsh.lifecycle_id = :id ORDER BY tsh.transitioned_at ASC
      `, { replacements:{ id }, type:QueryTypes.SELECT }),

      sequelize.query(`
        SELECT tsa.*, u.full_name AS assigned_to_name, u2.full_name AS completed_by_name
        FROM tender_stage_actions tsa
        LEFT JOIN users u  ON u.id  = tsa.assigned_to
        LEFT JOIN users u2 ON u2.id = tsa.completed_by
        WHERE tsa.lifecycle_id = :id ORDER BY tsa.stage, tsa.sort_order
      `, { replacements:{ id }, type:QueryTypes.SELECT }),

      sequelize.query(`SELECT * FROM tender_corrigendums WHERE lifecycle_id = :id ORDER BY corrigendum_no`, { replacements:{ id }, type:QueryTypes.SELECT }),
      sequelize.query(`SELECT * FROM tender_competitors WHERE lifecycle_id = :id ORDER BY created_at`, { replacements:{ id }, type:QueryTypes.SELECT }),
      sequelize.query(`SELECT * FROM tender_consortium_members WHERE lifecycle_id = :id ORDER BY created_at`, { replacements:{ id }, type:QueryTypes.SELECT }),
      sequelize.query(`
        SELECT ta.*, u.full_name AS assigned_to_name
        FROM tender_alerts ta LEFT JOIN users u ON u.id = ta.assigned_to
        WHERE ta.lifecycle_id = :id AND ta.is_dismissed = FALSE ORDER BY ta.due_date ASC
      `, { replacements:{ id }, type:QueryTypes.SELECT }),
    ]);

    res.json({ success:true, data:{ ...lc, history, actions, corrigendums, competitors, consortium, alerts } });
  } catch(err) { next(err); }
};

// =============================================================================
// MOVE TO NEXT STAGE (or specific stage)
// PUT /api/lifecycle/:id/stage
// Body: { to_stage, notes, stage_due_date, stage_owner_id }
// =============================================================================
exports.moveStage = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { to_stage, notes, stage_due_date, stage_owner_id } = req.body;

    const lc = await TenderLifecycle.findByPk(id);
    if (!lc) return res.status(404).json({ success:false, error:'Lifecycle not found.' });

    // Validate transition direction (can only go forward, or back one in rare cases)
    const from_order = STAGE_ORDER[lc.current_stage];
    const to_order   = STAGE_ORDER[to_stage];
    if (to_order === undefined) return res.status(422).json({ success:false, error:`Invalid stage: ${to_stage}` });
    if (to_order <= from_order && to_stage !== 'Closed') {
      return res.status(422).json({ success:false, error:`Cannot move backward from ${lc.current_stage} to ${to_stage}. Only forward transitions are allowed.` });
    }

    // Check mandatory actions completed before moving forward
    if (to_order > from_order) {
      const [{ incomplete }] = await sequelize.query(`
        SELECT COUNT(*) AS incomplete FROM tender_stage_actions
        WHERE lifecycle_id = :id AND stage = :stage
          AND is_mandatory = TRUE AND is_completed = FALSE
      `, { replacements:{ id, stage:lc.current_stage }, type:QueryTypes.SELECT });

      if (parseInt(incomplete) > 0) {
        return res.status(422).json({
          success:false,
          error:`${incomplete} mandatory action(s) must be completed before moving to ${to_stage}.`,
          incomplete_count: parseInt(incomplete),
        });
      }
    }

    const daysSpent = Math.floor((new Date() - new Date(lc.stage_entered_at)) / (1000*60*60*24));

    // Write history
    await TenderStageHistory.create({
      lifecycle_id:   id, lead_id:lc.lead_id,
      from_stage:     lc.current_stage, to_stage,
      transitioned_by:req.user.id, days_spent: daysSpent,
      notes, was_overdue: lc.is_overdue,
      original_due_date: lc.stage_due_date,
    });

    // Update lifecycle
    await lc.update({
      current_stage:   to_stage,
      stage_entered_at:new Date(),
      stage_due_date:  stage_due_date || null,
      stage_owner_id:  stage_owner_id || lc.stage_owner_id,
      health_status:   computeHealth(stage_due_date),
      is_overdue:      false,
      days_in_current_stage: 0,
      // Auto-close outcome tracking
      ...(to_stage === 'Closed' && req.body.final_outcome && {
        final_outcome: req.body.final_outcome,
        loss_reason_category: req.body.loss_reason_category,
        detailed_loss_reason: req.body.detailed_loss_reason,
        order_value_cr: req.body.order_value_cr,
      }),
    });

    // Generate default actions for new stage
    await generateDefaultActions(id, to_stage, lc.stage_owner_id);

    // Generate alerts
    const [lead] = await sequelize.query(
      `SELECT * FROM leads WHERE id = :id`, { replacements:{ id:lc.lead_id }, type:QueryTypes.SELECT }
    );
    await generateStageAlerts(lc, lead);

    res.json({ success:true, data:lc, message:`Moved to stage: ${to_stage}` });
  } catch(err) { next(err); }
};

// =============================================================================
// UPDATE lifecycle fields (financial, result, etc.)
// PUT /api/lifecycle/:id
// =============================================================================
exports.update = async (req, res, next) => {
  try {
    const lc = await TenderLifecycle.findByPk(req.params.id);
    if (!lc) return res.status(404).json({ success:false, error:'Lifecycle not found.' });

    const allowedFields = [
      'stage_due_date','stage_owner_id','priority',
      'estimated_cost_cr','bid_price_cr','bid_price_incl_gst_cr',
      'emd_amount','emd_paid_date','emd_receipt_no','emd_mode','emd_refund_date','emd_refunded',
      'pbg_amount','pbg_expiry_date','pbg_bank_name','pbg_reference_no',
      'submission_date_actual','submission_portal_ref',
      'technical_bid_submitted','financial_bid_submitted',
      'technical_opening_date','financial_opening_date',
      'technical_qualified','technical_disqualification_reason',
      'result_l_position','result_l1_price_cr','result_price_diff_cr',
      'result_announced_date','negotiation_done','negotiation_price_cr','negotiation_notes',
      'final_outcome','loss_reason_category','detailed_loss_reason',
      'order_value_cr','order_received_id',
    ];

    const updates = {};
    allowedFields.forEach(f => { if (req.body[f] !== undefined) updates[f] = req.body[f]; });
    if (updates.stage_due_date) updates.health_status = computeHealth(updates.stage_due_date);

    await lc.update(updates);
    res.json({ success:true, data:lc, message:'Lifecycle updated.' });
  } catch(err) { next(err); }
};

// =============================================================================
// RECORD GO / NO-GO DECISION
// PUT /api/lifecycle/:id/go-no-go
// =============================================================================
exports.goNoGo = async (req, res, next) => {
  try {
    const { decision, reason } = req.body;
    if (!['Go','No-Go'].includes(decision)) {
      return res.status(422).json({ success:false, error:'Decision must be Go or No-Go.' });
    }

    const lc = await TenderLifecycle.findByPk(req.params.id);
    if (!lc) return res.status(404).json({ success:false, error:'Lifecycle not found.' });

    await lc.update({
      go_no_go_decision:  decision,
      go_no_go_reason:    reason || null,
      go_no_go_decided_by:req.user.id,
      go_no_go_decided_at:new Date(),
    });

    // If No-Go, auto-close to Closed stage
    if (decision === 'No-Go') {
      await exports.moveStage({ params:{ id:lc.id }, body:{
        to_stage:'Closed', notes:`No-Go decision: ${reason}`,
        final_outcome:'Not-Participated',
        detailed_loss_reason: reason,
      }, user:req.user }, res, next);
      return;
    }

    res.json({ success:true, data:lc, message:`Go/No-Go recorded: ${decision}` });
  } catch(err) { next(err); }
};

// =============================================================================
// ACTIONS — complete an action / upload document for action
// PATCH /api/lifecycle/:id/actions/:actionId
// =============================================================================
exports.completeAction = async (req, res, next) => {
  try {
    const action = await TenderStageAction.findByPk(req.params.actionId);
    if (!action) return res.status(404).json({ success:false, error:'Action not found.' });

    const updates = {
      is_completed: true,
      completed_by: req.user.id,
      completed_at: new Date(),
      notes: req.body.notes || action.notes,
    };

    if (req.file) {
      updates.document_path = `uploads/lifecycle/${req.file.filename}`;
      updates.document_name = req.file.originalname;
    }

    await action.update(updates);

    // Check if all mandatory actions for current stage are now complete
    const [{ incomplete }] = await sequelize.query(`
      SELECT COUNT(*) AS incomplete FROM tender_stage_actions
      WHERE lifecycle_id = :lid AND stage = :stage
        AND is_mandatory = TRUE AND is_completed = FALSE
    `, { replacements:{ lid:action.lifecycle_id, stage:action.stage }, type:QueryTypes.SELECT });

    res.json({
      success:true, data:action,
      message:'Action completed.',
      all_mandatory_done: parseInt(incomplete) === 0,
      remaining_mandatory: parseInt(incomplete),
    });
  } catch(err) { next(err); }
};

// =============================================================================
// ADD CORRIGENDUM
// POST /api/lifecycle/:id/corrigendum
// =============================================================================
exports.addCorrigendum = async (req, res, next) => {
  try {
    const { id } = req.params;
    const lc = await TenderLifecycle.findByPk(id);
    if (!lc) return res.status(404).json({ success:false, error:'Lifecycle not found.' });

    // Get next corrigendum number
    const [{ max_no }] = await sequelize.query(
      `SELECT COALESCE(MAX(corrigendum_no), 0) AS max_no FROM tender_corrigendums WHERE lifecycle_id = :id`,
      { replacements:{ id }, type:QueryTypes.SELECT }
    );

    const { issued_date, description, impact, new_deadline, extension_days } = req.body;

    const corrNum = parseInt(max_no) + 1;
    const corr = await TenderCorrigendum.create({
      lifecycle_id: id, lead_id: lc.lead_id,
      corrigendum_no: corrNum,
      issued_date, description, impact,
      new_deadline: new_deadline || null,
      extension_days: extension_days || null,
      file_path: req.file ? `uploads/leads/${req.file.filename}` : null,
      file_name: req.file ? req.file.originalname : null,
      uploaded_by: req.user.id,
    });

    // If deadline extended, update the lead's last_submission_date
    if (impact === 'Deadline Extended' && new_deadline) {
      await sequelize.query(
        `UPDATE leads SET last_submission_date = :deadline, updated_at = NOW() WHERE id = :lid`,
        { replacements:{ deadline: new_deadline, lid: lc.lead_id }, type:QueryTypes.UPDATE }
      );
      // Create alert for new deadline
      await TenderAlert.create({
        lifecycle_id: id, lead_id: lc.lead_id,
        assigned_to: lc.stage_owner_id,
        alert_type: 'Corrigendum Issued',
        title: `Corrigendum #${corrNum} — deadline extended`,
        message: `New submission deadline: ${new_deadline} (extended by ${extension_days || '?'} days)`,
        due_date: new_deadline, severity: 'Warning',
      });
    }

    res.status(201).json({ success:true, data:corr, message:`Corrigendum #${corrNum} added.` });
  } catch(err) { next(err); }
};

// =============================================================================
// ADD / UPDATE COMPETITOR
// POST /api/lifecycle/:id/competitors
// =============================================================================
exports.addCompetitor = async (req, res, next) => {
  try {
    const lc = await TenderLifecycle.findByPk(req.params.id);
    if (!lc) return res.status(404).json({ success:false, error:'Lifecycle not found.' });

    const comp = await TenderCompetitor.create({ lifecycle_id:lc.id, lead_id:lc.lead_id, ...req.body });
    res.status(201).json({ success:true, data:comp });
  } catch(err) { next(err); }
};

exports.updateCompetitor = async (req, res, next) => {
  try {
    const comp = await TenderCompetitor.findByPk(req.params.competitorId);
    if (!comp) return res.status(404).json({ success:false, error:'Competitor not found.' });
    await comp.update(req.body);
    res.json({ success:true, data:comp });
  } catch(err) { next(err); }
};

// =============================================================================
// CONSORTIUM MEMBERS
// POST /api/lifecycle/:id/consortium
// =============================================================================
exports.addConsortiumMember = async (req, res, next) => {
  try {
    const lc = await TenderLifecycle.findByPk(req.params.id);
    if (!lc) return res.status(404).json({ success:false, error:'Lifecycle not found.' });
    const member = await TenderConsortiumMember.create({ lifecycle_id:lc.id, lead_id:lc.lead_id, ...req.body });
    res.status(201).json({ success:true, data:member });
  } catch(err) { next(err); }
};

// =============================================================================
// ALERTS
// GET /api/lifecycle/alerts/my   — current user's alerts
// PATCH /api/lifecycle/alerts/:alertId/read
// =============================================================================
exports.myAlerts = async (req, res, next) => {
  try {
    const alerts = await sequelize.query(`
      SELECT ta.*, tl.current_stage, l.tender_name, l.customer_name
      FROM tender_alerts ta
      JOIN tender_lifecycle tl ON tl.id = ta.lifecycle_id
      JOIN leads l ON l.id = ta.lead_id
      WHERE ta.assigned_to = :uid AND ta.is_dismissed = FALSE
      ORDER BY
        CASE ta.severity WHEN 'Critical' THEN 0 WHEN 'Warning' THEN 1 WHEN 'Normal' THEN 2 ELSE 3 END,
        ta.due_date ASC
      LIMIT 50
    `, { replacements:{ uid: req.user.id }, type:QueryTypes.SELECT });

    res.json({ success:true, data:alerts, unread_count: alerts.filter(a => !a.is_read).length });
  } catch(err) { next(err); }
};

exports.markAlertRead = async (req, res, next) => {
  try {
    await TenderAlert.update({ is_read:true }, { where:{ id:req.params.alertId } });
    res.json({ success:true, message:'Alert marked as read.' });
  } catch(err) { next(err); }
};

exports.dismissAlert = async (req, res, next) => {
  try {
    await TenderAlert.update({ is_dismissed:true }, { where:{ id:req.params.alertId } });
    res.json({ success:true, message:'Alert dismissed.' });
  } catch(err) { next(err); }
};

// =============================================================================
// DASHBOARD SUMMARY
// GET /api/lifecycle/dashboard/summary
// =============================================================================
exports.dashboardSummary = async (req, res, next) => {
  try {
    const [stageCounts, healthCounts, overdueTenders,
           topPriority, recentActivity, pipelineValue] = await Promise.all([

      // Count by stage
      sequelize.query(`
        SELECT current_stage AS stage, COUNT(*) AS count
        FROM tender_lifecycle WHERE is_deleted = FALSE AND final_outcome IS NULL
        GROUP BY current_stage ORDER BY
          CASE current_stage
            WHEN 'Identified' THEN 1 WHEN 'Qualifying' THEN 2
            WHEN 'Document Study' THEN 3 WHEN 'Pre-Bid Meeting' THEN 4
            WHEN 'Bid Submission' THEN 5 WHEN 'Evaluation' THEN 6
            WHEN 'Result' THEN 7 WHEN 'Closed' THEN 8 END
      `, { type:QueryTypes.SELECT }),

      // Health summary
      sequelize.query(`
        SELECT health_status, COUNT(*) AS count
        FROM tender_lifecycle WHERE is_deleted = FALSE AND final_outcome IS NULL
        GROUP BY health_status
      `, { type:QueryTypes.SELECT }),

      // Overdue tenders
      sequelize.query(`
        SELECT tl.id, tl.current_stage, tl.stage_due_date, tl.days_in_current_stage,
          tl.priority, l.tender_name, l.customer_name, u.full_name AS owner
        FROM tender_lifecycle tl
        JOIN leads l ON l.id = tl.lead_id
        LEFT JOIN users u ON u.id = tl.stage_owner_id
        WHERE tl.is_overdue = TRUE AND tl.is_deleted = FALSE
        ORDER BY tl.stage_due_date ASC LIMIT 10
      `, { type:QueryTypes.SELECT }),

      // Top priority active tenders
      sequelize.query(`
        SELECT tl.id, tl.current_stage, tl.priority, tl.health_status,
          tl.stage_due_date, tl.bid_price_cr, l.tender_name, l.customer_name,
          l.estimated_value_cr, l.win_probability_pct, l.strategic_importance,
          u.full_name AS owner
        FROM tender_lifecycle tl
        JOIN leads l ON l.id = tl.lead_id
        LEFT JOIN users u ON u.id = tl.stage_owner_id
        WHERE tl.is_deleted = FALSE AND tl.final_outcome IS NULL
          AND tl.priority IN ('Critical','High')
        ORDER BY CASE tl.priority WHEN 'Critical' THEN 0 ELSE 1 END,
          tl.stage_due_date ASC NULLS LAST
        LIMIT 8
      `, { type:QueryTypes.SELECT }),

      // Recent stage transitions (activity feed)
      sequelize.query(`
        SELECT tsh.*, l.tender_name, l.customer_name, u.full_name AS actor
        FROM tender_stage_history tsh
        JOIN leads l ON l.id = tsh.lead_id
        LEFT JOIN users u ON u.id = tsh.transitioned_by
        ORDER BY tsh.transitioned_at DESC LIMIT 10
      `, { type:QueryTypes.SELECT }),

      // Weighted pipeline value
      sequelize.query(`
        SELECT
          COALESCE(SUM(l.estimated_value_cr), 0) AS total_pipeline_cr,
          COALESCE(SUM(l.estimated_value_cr * COALESCE(l.win_probability_pct, 50) / 100.0), 0) AS weighted_pipeline_cr,
          COUNT(*) AS active_count
        FROM tender_lifecycle tl
        JOIN leads l ON l.id = tl.lead_id
        WHERE tl.is_deleted = FALSE AND tl.final_outcome IS NULL AND l.is_deleted = FALSE
      `, { type:QueryTypes.SELECT }),
    ]);

    res.json({
      success:true,
      data:{
        stage_counts:    stageCounts,
        health_counts:   healthCounts,
        overdue_tenders: overdueTenders,
        top_priority:    topPriority,
        recent_activity: recentActivity,
        pipeline:        pipelineValue[0],
      }
    });
  } catch(err) { next(err); }
};

// =============================================================================
// CALENDAR — upcoming deadlines next 30 days
// GET /api/lifecycle/dashboard/calendar
// =============================================================================
exports.calendar = async (req, res, next) => {
  try {
    const today   = new Date().toISOString().slice(0,10);
    const in30    = new Date(Date.now() + 30*24*60*60*1000).toISOString().slice(0,10);

    const deadlines = await sequelize.query(`
      SELECT
        tl.id AS lifecycle_id,
        tl.current_stage,
        tl.stage_due_date AS date,
        'Stage Deadline' AS event_type,
        l.tender_name, l.customer_name, l.civil_defence,
        tl.priority, tl.health_status,
        u.full_name AS owner
      FROM tender_lifecycle tl
      JOIN leads l ON l.id = tl.lead_id
      LEFT JOIN users u ON u.id = tl.stage_owner_id
      WHERE tl.stage_due_date BETWEEN :today AND :in30
        AND tl.is_deleted = FALSE AND tl.final_outcome IS NULL

      UNION ALL

      SELECT
        tl.id AS lifecycle_id,
        'Submission' AS current_stage,
        l.last_submission_date AS date,
        'Bid Deadline' AS event_type,
        l.tender_name, l.customer_name, l.civil_defence,
        tl.priority, tl.health_status,
        u.full_name AS owner
      FROM tender_lifecycle tl
      JOIN leads l ON l.id = tl.lead_id
      LEFT JOIN users u ON u.id = tl.stage_owner_id
      WHERE l.last_submission_date BETWEEN :today AND :in30
        AND tl.is_deleted = FALSE AND tl.final_outcome IS NULL

      UNION ALL

      SELECT
        tl.id AS lifecycle_id,
        'Alert' AS current_stage,
        ta.due_date AS date,
        ta.alert_type AS event_type,
        l.tender_name, l.customer_name, l.civil_defence,
        ta.severity AS priority, NULL AS health_status,
        u.full_name AS owner
      FROM tender_alerts ta
      JOIN tender_lifecycle tl ON tl.id = ta.lifecycle_id
      JOIN leads l ON l.id = ta.lead_id
      LEFT JOIN users u ON u.id = ta.assigned_to
      WHERE ta.due_date BETWEEN :today AND :in30
        AND ta.is_dismissed = FALSE

      ORDER BY date ASC
    `, { replacements:{ today, in30 }, type:QueryTypes.SELECT });

    res.json({ success:true, data:deadlines });
  } catch(err) { next(err); }
};

// =============================================================================
// ANALYTICS — Stage funnel, time-in-stage, win probability
// GET /api/lifecycle/analytics
// =============================================================================
exports.analytics = async (req, res, next) => {
  try {
    const { financial_year, civil_defence } = req.query;
    const civilFilter = civil_defence ? `AND l.civil_defence = '${civil_defence}'` : '';

    const [stageFunnel, timeInStage, outcomeReasons, competitorWins, goNoGoStats] = await Promise.all([

      sequelize.query(`
        SELECT
          current_stage AS stage,
          COUNT(*) AS total,
          COUNT(*) FILTER (WHERE health_status = 'Red')   AS red,
          COUNT(*) FILTER (WHERE health_status = 'Amber') AS amber,
          COUNT(*) FILTER (WHERE health_status = 'Green') AS green,
          COALESCE(SUM(l.estimated_value_cr), 0) AS total_value_cr
        FROM tender_lifecycle tl
        JOIN leads l ON l.id = tl.lead_id
        WHERE tl.is_deleted = FALSE ${civilFilter}
        GROUP BY current_stage
        ORDER BY CASE current_stage
          WHEN 'Identified' THEN 1 WHEN 'Qualifying' THEN 2
          WHEN 'Document Study' THEN 3 WHEN 'Pre-Bid Meeting' THEN 4
          WHEN 'Bid Submission' THEN 5 WHEN 'Evaluation' THEN 6
          WHEN 'Result' THEN 7 WHEN 'Closed' THEN 8 END
      `, { type:QueryTypes.SELECT }),

      sequelize.query(`
        SELECT to_stage AS stage, AVG(days_spent) AS avg_days, MAX(days_spent) AS max_days,
          MIN(days_spent) FILTER (WHERE days_spent > 0) AS min_days, COUNT(*) AS count
        FROM tender_stage_history
        GROUP BY to_stage
        ORDER BY CASE to_stage
          WHEN 'Identified' THEN 1 WHEN 'Qualifying' THEN 2 WHEN 'Document Study' THEN 3
          WHEN 'Pre-Bid Meeting' THEN 4 WHEN 'Bid Submission' THEN 5
          WHEN 'Evaluation' THEN 6 WHEN 'Result' THEN 7 WHEN 'Closed' THEN 8 END
      `, { type:QueryTypes.SELECT }),

      sequelize.query(`
        SELECT loss_reason_category AS reason, COUNT(*) AS count,
          COALESCE(SUM(order_value_cr), 0) AS value_cr
        FROM tender_lifecycle
        WHERE final_outcome NOT IN ('Won') AND loss_reason_category IS NOT NULL
          AND is_deleted = FALSE
        GROUP BY loss_reason_category ORDER BY count DESC
      `, { type:QueryTypes.SELECT }),

      sequelize.query(`
        SELECT competitor_name, COUNT(*) AS appearances,
          COUNT(*) FILTER (WHERE won_this_tender = TRUE) AS wins,
          AVG(bid_price_at_result) AS avg_price
        FROM tender_competitors
        GROUP BY competitor_name ORDER BY wins DESC LIMIT 10
      `, { type:QueryTypes.SELECT }),

      sequelize.query(`
        SELECT go_no_go_decision, COUNT(*) AS count
        FROM tender_lifecycle WHERE is_deleted = FALSE
        GROUP BY go_no_go_decision
      `, { type:QueryTypes.SELECT }),
    ]);

    res.json({ success:true, data:{ stageFunnel, timeInStage, outcomeReasons, competitorWins, goNoGoStats } });
  } catch(err) { next(err); }
};
