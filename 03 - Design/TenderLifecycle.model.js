// backend/src/models/TenderLifecycle.model.js
const { DataTypes } = require('sequelize');
const sequelize     = require('../config/database');

const STAGES = [
  'Identified','Qualifying','Document Study',
  'Pre-Bid Meeting','Bid Submission','Evaluation','Result','Closed'
];

const STAGE_ORDER = Object.fromEntries(STAGES.map((s, i) => [s, i]));

const TenderLifecycle = sequelize.define('TenderLifecycle', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },

  lead_id:              { type: DataTypes.UUID, allowNull: false },
  current_stage:        { type: DataTypes.STRING(30), defaultValue: 'Identified',
                          validate: { isIn: [STAGES] } },
  stage_entered_at:     { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  stage_due_date:       { type: DataTypes.DATEONLY },
  stage_owner_id:       { type: DataTypes.UUID },

  go_no_go_decision:    { type: DataTypes.STRING(10), defaultValue: 'Pending',
                          validate: { isIn: [['Go','No-Go','Pending']] } },
  go_no_go_reason:      { type: DataTypes.TEXT },
  go_no_go_decided_by:  { type: DataTypes.UUID },
  go_no_go_decided_at:  { type: DataTypes.DATE },

  estimated_cost_cr:    { type: DataTypes.DECIMAL(10,2) },
  bid_price_cr:         { type: DataTypes.DECIMAL(10,2) },
  bid_price_incl_gst_cr:{ type: DataTypes.DECIMAL(10,2) },
  emd_amount:           { type: DataTypes.DECIMAL(12,2) },
  emd_paid_date:        { type: DataTypes.DATEONLY },
  emd_receipt_no:       { type: DataTypes.STRING(100) },
  emd_mode:             { type: DataTypes.STRING(30) },
  emd_refund_date:      { type: DataTypes.DATEONLY },
  emd_refunded:         { type: DataTypes.BOOLEAN, defaultValue: false },
  pbg_amount:           { type: DataTypes.DECIMAL(12,2) },
  pbg_expiry_date:      { type: DataTypes.DATEONLY },
  pbg_bank_name:        { type: DataTypes.STRING(200) },
  pbg_reference_no:     { type: DataTypes.STRING(100) },

  submission_date_actual:  { type: DataTypes.DATE },
  submission_portal_ref:   { type: DataTypes.STRING(200) },
  technical_bid_submitted: { type: DataTypes.BOOLEAN, defaultValue: false },
  financial_bid_submitted: { type: DataTypes.BOOLEAN, defaultValue: false },

  technical_opening_date:            { type: DataTypes.DATEONLY },
  financial_opening_date:            { type: DataTypes.DATEONLY },
  technical_qualified:               { type: DataTypes.BOOLEAN },
  technical_disqualification_reason: { type: DataTypes.TEXT },

  result_l_position:      { type: DataTypes.STRING(5) },
  result_l1_price_cr:     { type: DataTypes.DECIMAL(10,2) },
  result_price_diff_cr:   { type: DataTypes.DECIMAL(10,2) },
  result_announced_date:  { type: DataTypes.DATEONLY },
  negotiation_done:       { type: DataTypes.BOOLEAN, defaultValue: false },
  negotiation_price_cr:   { type: DataTypes.DECIMAL(10,2) },
  negotiation_notes:      { type: DataTypes.TEXT },

  final_outcome:          { type: DataTypes.STRING(30),
                            validate: { isIn: [['Won','Lost-L2','Lost-L3','Lost-Technical','Lost-Price','Withdrawn','Cancelled-by-Customer','Not-Participated','Disqualified']] } },
  loss_reason_category:   { type: DataTypes.STRING(30) },
  detailed_loss_reason:   { type: DataTypes.TEXT },
  order_value_cr:         { type: DataTypes.DECIMAL(10,2) },
  order_received_id:      { type: DataTypes.UUID },

  priority:               { type: DataTypes.STRING(10), defaultValue: 'Normal',
                            validate: { isIn: [['Low','Normal','High','Critical']] } },
  health_status:          { type: DataTypes.STRING(10), defaultValue: 'Green',
                            validate: { isIn: [['Green','Amber','Red']] } },
  is_overdue:             { type: DataTypes.BOOLEAN, defaultValue: false },
  days_in_current_stage:  { type: DataTypes.INTEGER, defaultValue: 0 },

  created_by:   { type: DataTypes.UUID },
  is_deleted:   { type: DataTypes.BOOLEAN, defaultValue: false },
}, {
  tableName:  'tender_lifecycle',
  timestamps: true,
  createdAt:  'created_at',
  updatedAt:  'updated_at',
  defaultScope: { where: { is_deleted: false } },
});

// Attach stage constants to model
TenderLifecycle.STAGES      = STAGES;
TenderLifecycle.STAGE_ORDER = STAGE_ORDER;

module.exports = TenderLifecycle;
