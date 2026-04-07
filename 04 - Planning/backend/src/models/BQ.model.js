const { DataTypes } = require('sequelize');
const sequelize     = require('../config/database');
const User          = require('./User.model');

const BQ = sequelize.define('BQ', {
  id: {
    type:         DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey:   true,
  },
  bq_title:           { type: DataTypes.STRING(255), allowNull: false },
  customer_name:      { type: DataTypes.STRING(255), allowNull: false },
  customer_address:   { type: DataTypes.TEXT,        allowNull: false },
  lead_owner_id:      { type: DataTypes.UUID,        allowNull: true  },
  defence_type:       {
    type:     DataTypes.STRING(20),
    allowNull: false,
    validate: { isIn: [['Defence', 'Non-Defence']] },
  },
  estimated_value_cr: { type: DataTypes.DECIMAL(10,2), allowNull: false },
  submitted_value_cr: { type: DataTypes.DECIMAL(10,2), allowNull: false },
  submission_date:    { type: DataTypes.DATEONLY,       allowNull: false },
  reference_no:       { type: DataTypes.STRING(100) },
  competitors:        { type: DataTypes.TEXT },
  present_status:     { type: DataTypes.STRING(100), allowNull: false },
  document_path:      { type: DataTypes.TEXT },        // local path: uploads/bq/abc.pdf
  document_name:      { type: DataTypes.STRING(255) }, // original filename shown to user
  created_by:         { type: DataTypes.UUID },
  is_deleted:         { type: DataTypes.BOOLEAN, defaultValue: false },
}, {
  tableName:  'bq_quotations',
  timestamps: true,
  createdAt:  'created_at',
  updatedAt:  'updated_at',
  defaultScope: {
    where: { is_deleted: false },
  },
});

// Associations
BQ.belongsTo(User, { foreignKey: 'lead_owner_id', as: 'lead_owner' });
BQ.belongsTo(User, { foreignKey: 'created_by',    as: 'creator'    });

module.exports = BQ;
