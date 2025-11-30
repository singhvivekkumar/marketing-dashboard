const db = require('../config/database');

class LostDomesticLead {
  static async findAll() {
    const result = await db.query('SELECT * FROM lost_domestic_leads ORDER BY created_at DESC');
    return result.rows;
  }

  static async findById(id) {
    const result = await db.query('SELECT * FROM lost_domestic_leads WHERE id = $1', [id]);
    return result.rows[0];
  }

  static async create(data) {
    const {
      serial_number, tender_name, customer, tender_type, type_bid,
      value_without_gst, value_with_gst, reason_losing, year,
      partner, competitors_info, technical_scores, quoted_prices
    } = data;

    const query = `
      INSERT INTO lost_domestic_leads 
      (serial_number, tender_name, customer, tender_type, type_bid, value_without_gst, value_with_gst, reason_losing, year, partner, competitors_info, technical_scores, quoted_prices)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
      RETURNING *
    `;

    const values = [
      serial_number, tender_name, customer, tender_type, type_bid,
      value_without_gst, value_with_gst, reason_losing, year,
      partner, JSON.stringify(competitors_info), JSON.stringify(technical_scores), JSON.stringify(quoted_prices)
    ];

    const result = await db.query(query, values);
    return result.rows[0];
  }

  static async update(id, data) {
    // Dynamic update query builder
    const keys = Object.keys(data);
    const setString = keys.map((key, index) => `${key} = $${index + 2}`).join(', ');
    
    if (keys.length === 0) return null;

    const query = `UPDATE lost_domestic_leads SET ${setString} WHERE id = $1 RETURNING *`;
    const values = [id, ...Object.values(data)];

    const result = await db.query(query, values);
    return result.rows[0];
  }

  static async delete(id) {
    const result = await db.query('DELETE FROM lost_domestic_leads WHERE id = $1 RETURNING id', [id]);
    return result.rows[0];
  }
}

module.exports = LostDomesticLead;