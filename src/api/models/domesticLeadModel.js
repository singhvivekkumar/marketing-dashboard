// models/leadModel.js
const pool = require("../db");

const FIELDS = [
  "serial_number", "tender_name", "customer", "tender_date",
  "rfp_received_on","rfp_due_date","dmktg_in_principal_approval",
  "selling_price_approval_initiated","bid_submitted_on","sbu_finance_approval",
  "gm_approval","sent_to_finance_gm_on","dmktg_approval_received","bid_owner",
  "emd_value_crore","tender_ref_no","tender_type","website","present_status"
];

const create = async (data) => {
  const cols = [];
  const vals = [];
  const params = [];
  let i = 1;
  for (const k of FIELDS) {
    if (data[k] !== undefined) {
      cols.push(k);
      params.push(`$${i}`);
      vals.push(data[k]);
      i++;
    }
  }
  cols.push("created_at", "updated_at");
  params.push("NOW()", "NOW()");

  const text = `INSERT INTO lead_submitted (${cols.join(",")}) VALUES (${params.join(",")}) RETURNING *`;
  const { rows } = await pool.query(text, vals);
  return rows[0];
};

const findById = async (id) => {
  const { rows } = await pool.query("SELECT * FROM lead_submitted WHERE id = $1", [id]);
  return rows[0] || null;
};

// list with pagination & simple filters: ?page=1&limit=20&customer=ABC&status=Submitted
const list = async ({ page = 1, limit = 20, customer, status, tender_type }) => {
  const offset = (page - 1) * limit;
  const where = [];
  const params = [];
  let i = 1;
  if (customer) { where.push(`customer ILIKE $${i++}`); params.push(`%${customer}%`); }
  if (status) { where.push(`present_status = $${i++}`); params.push(status); }
  if (tender_type) { where.push(`tender_type = $${i++}`); params.push(tender_type); }

  const whereSQL = where.length ? `WHERE ${where.join(" AND ")}` : "";
  const text = `SELECT * FROM lead_submitted ${whereSQL} ORDER BY created_at DESC LIMIT $${i++} OFFSET $${i++}`;
  params.push(limit, offset);
  const { rows } = await pool.query(text, params);
  return rows;
};

const update = async (id, data) => {
  const sets = [];
  const vals = [];
  let i = 1;
  for (const k of FIELDS) {
    if (data[k] !== undefined) {
      sets.push(`${k} = $${i++}`);
      vals.push(data[k]);
    }
  }
  if (sets.length === 0) return findById(id);
  vals.push(id);
  const text = `UPDATE lead_submitted SET ${sets.join(",")}, updated_at = NOW() WHERE id = $${i} RETURNING *`;
  const { rows } = await pool.query(text, vals);
  return rows[0];
};

const remove = async (id) => {
  const { rows } = await pool.query("DELETE FROM lead_submitted WHERE id = $1 RETURNING *", [id]);
  return rows[0];
};

module.exports = { create, findById, list, update, remove };
