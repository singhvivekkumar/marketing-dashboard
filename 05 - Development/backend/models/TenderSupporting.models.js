// backend/src/models/TenderStageHistory.model.js
const { DataTypes } = require('sequelize');
const sequelize     = require('../config/database');

const TenderStageHistory = sequelize.define('TenderStageHistory', {
  id:               { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  lifecycle_id:     { type: DataTypes.UUID, allowNull: false },
  lead_id:          { type: DataTypes.UUID, allowNull: false },
  from_stage:       { type: DataTypes.STRING(30) },
  to_stage:         { type: DataTypes.STRING(30), allowNull: false },
  transitioned_at:  { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  transitioned_by:  { type: DataTypes.UUID },
  days_spent:       { type: DataTypes.INTEGER, defaultValue: 0 },
  notes:            { type: DataTypes.TEXT },
  was_overdue:      { type: DataTypes.BOOLEAN, defaultValue: false },
  original_due_date:{ type: DataTypes.DATEONLY },
}, { tableName:'tender_stage_history', timestamps:false });

module.exports = TenderStageHistory;

// ─────────────────────────────────────────────────────────────────────────────
// backend/src/models/TenderStageAction.model.js
const TenderStageAction = sequelize.define('TenderStageAction', {
  id:             { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  lifecycle_id:   { type: DataTypes.UUID, allowNull: false },
  stage:          { type: DataTypes.STRING(30), allowNull: false },
  action_title:   { type: DataTypes.STRING(255), allowNull: false },
  action_type:    { type: DataTypes.STRING(20), allowNull: false,
                    validate: { isIn: [['Task','Document','Approval','Alert']] } },
  is_mandatory:   { type: DataTypes.BOOLEAN, defaultValue: true },
  is_completed:   { type: DataTypes.BOOLEAN, defaultValue: false },
  completed_by:   { type: DataTypes.UUID },
  completed_at:   { type: DataTypes.DATE },
  due_date:       { type: DataTypes.DATEONLY },
  assigned_to:    { type: DataTypes.UUID },
  notes:          { type: DataTypes.TEXT },
  document_path:  { type: DataTypes.TEXT },
  document_name:  { type: DataTypes.STRING(255) },
  sort_order:     { type: DataTypes.INTEGER, defaultValue: 0 },
}, {
  tableName: 'tender_stage_actions',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

module.exports.TenderStageAction = TenderStageAction;

// ─────────────────────────────────────────────────────────────────────────────
// backend/src/models/TenderCorrigendum.model.js
const TenderCorrigendum = sequelize.define('TenderCorrigendum', {
  id:              { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  lifecycle_id:    { type: DataTypes.UUID, allowNull: false },
  lead_id:         { type: DataTypes.UUID, allowNull: false },
  corrigendum_no:  { type: DataTypes.INTEGER, allowNull: false },
  issued_date:     { type: DataTypes.DATEONLY, allowNull: false },
  description:     { type: DataTypes.TEXT, allowNull: false },
  impact:          { type: DataTypes.STRING(25) },
  new_deadline:    { type: DataTypes.DATEONLY },
  extension_days:  { type: DataTypes.INTEGER },
  file_path:       { type: DataTypes.TEXT },
  file_name:       { type: DataTypes.STRING(255) },
  uploaded_by:     { type: DataTypes.UUID },
}, { tableName:'tender_corrigendums', timestamps:true, createdAt:'created_at', updatedAt:false });

module.exports.TenderCorrigendum = TenderCorrigendum;

// ─────────────────────────────────────────────────────────────────────────────
// backend/src/models/TenderCompetitor.model.js
const TenderCompetitor = sequelize.define('TenderCompetitor', {
  id:                   { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  lifecycle_id:         { type: DataTypes.UUID, allowNull: false },
  lead_id:              { type: DataTypes.UUID, allowNull: false },
  competitor_name:      { type: DataTypes.STRING(255), allowNull: false },
  is_consortium:        { type: DataTypes.BOOLEAN, defaultValue: false },
  consortium_lead:      { type: DataTypes.STRING(255) },
  known_strength:       { type: DataTypes.TEXT },
  known_weakness:       { type: DataTypes.TEXT },
  prev_bid_price_cr:    { type: DataTypes.DECIMAL(10,2) },
  won_this_tender:      { type: DataTypes.BOOLEAN, defaultValue: false },
  l_position:           { type: DataTypes.STRING(5) },
  bid_price_at_result:  { type: DataTypes.DECIMAL(10,2) },
  source_of_intel:      { type: DataTypes.STRING(100) },
}, { tableName:'tender_competitors', timestamps:true, createdAt:'created_at', updatedAt:'updated_at' });

module.exports.TenderCompetitor = TenderCompetitor;

// ─────────────────────────────────────────────────────────────────────────────
// backend/src/models/TenderConsortiumMember.model.js
const TenderConsortiumMember = sequelize.define('TenderConsortiumMember', {
  id:             { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  lifecycle_id:   { type: DataTypes.UUID, allowNull: false },
  lead_id:        { type: DataTypes.UUID, allowNull: false },
  partner_name:   { type: DataTypes.STRING(255), allowNull: false },
  role:           { type: DataTypes.STRING(100) },
  scope_of_work:  { type: DataTypes.TEXT },
  value_share_cr: { type: DataTypes.DECIMAL(10,2) },
  mou_signed:     { type: DataTypes.BOOLEAN, defaultValue: false },
  mou_date:       { type: DataTypes.DATEONLY },
  contact_person: { type: DataTypes.STRING(200) },
  contact_email:  { type: DataTypes.STRING(200) },
}, { tableName:'tender_consortium_members', timestamps:true, createdAt:'created_at', updatedAt:false });

module.exports.TenderConsortiumMember = TenderConsortiumMember;

// ─────────────────────────────────────────────────────────────────────────────
// backend/src/models/TenderAlert.model.js
const TenderAlert = sequelize.define('TenderAlert', {
  id:            { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  lifecycle_id:  { type: DataTypes.UUID, allowNull: false },
  lead_id:       { type: DataTypes.UUID, allowNull: false },
  assigned_to:   { type: DataTypes.UUID },
  alert_type:    { type: DataTypes.STRING(30), allowNull: false,
                   validate: { isIn: [['Submission Deadline','Pre-Bid Meeting','EMD Expiry',
                     'PBG Expiry','Corrigendum Issued','Stage Overdue',
                     'Action Pending','Result Expected','Custom']] } },
  title:         { type: DataTypes.STRING(255), allowNull: false },
  message:       { type: DataTypes.TEXT },
  due_date:      { type: DataTypes.DATEONLY, allowNull: false },
  days_before:   { type: DataTypes.INTEGER, defaultValue: 3 },
  is_read:       { type: DataTypes.BOOLEAN, defaultValue: false },
  is_dismissed:  { type: DataTypes.BOOLEAN, defaultValue: false },
  severity:      { type: DataTypes.STRING(10), defaultValue: 'Normal',
                   validate: { isIn: [['Info','Normal','Warning','Critical']] } },
}, { tableName:'tender_alerts', timestamps:true, createdAt:'created_at', updatedAt:false });

module.exports.TenderAlert = TenderAlert;
