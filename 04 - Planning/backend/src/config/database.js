const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host:    process.env.DB_HOST || 'localhost',
    port:    process.env.DB_PORT || 5432,
    dialect: 'postgres',
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    pool: {
      max: 10,
      min: 0,
      acquire: 30000,
      idle:    10000,
    },
  }
);

// Test connection on startup
(async () => {
  try {
    await sequelize.authenticate();
    console.log('  Database connected successfully');
  } catch (err) {
    console.error('  Database connection failed:', err.message);
    process.exit(1);
  }
})();

module.exports = sequelize;
