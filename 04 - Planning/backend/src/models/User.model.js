const { DataTypes } = require('sequelize');
const sequelize     = require('../config/database');

const User = sequelize.define('User', {
  id: {
    type:         DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey:   true,
  },
  username: {
    type:      DataTypes.STRING(100),
    allowNull: false,
    unique:    true,
    set(val) { this.setDataValue('username', val.toLowerCase().trim()); },
  },
  email: {
    type:      DataTypes.STRING(200),
    allowNull: false,
    unique:    true,
    validate:  { isEmail: true },
  },
  password_hash: {
    type:      DataTypes.TEXT,
    allowNull: false,
  },
  full_name: {
    type:      DataTypes.STRING(200),
    allowNull: false,
  },
  role: {
    type:      DataTypes.STRING(20),
    allowNull: false,
    validate:  { isIn: [['executive', 'manager', 'head', 'admin']] },
  },
  is_active: {
    type:         DataTypes.BOOLEAN,
    defaultValue: true,
  },
}, {
  tableName:  'users',
  timestamps: true,
  createdAt:  'created_at',
  updatedAt:  'updated_at',
});

module.exports = User;
