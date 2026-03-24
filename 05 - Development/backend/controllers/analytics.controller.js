// backend/src/controllers/analytics.controller.js
//
// All queries use raw SQL via Sequelize's query() for maximum flexibility
// and performance on complex aggregations.
//
// Common query parameters accepted by most endpoints:
//   date_from     — ISO date string  e.g. 2025-04-01
//   date_to       — ISO date string  e.g. 2026-03-31
//   financial_year— e.g. "2026" means FY 2025-26 (Apr 2025 – Mar 2026)
//   civil_defence — "Civil" | "Defence"
//   lead_owner    — UUID of a user

const { QueryTypes } = require('sequelize');
const sequelize       = require('../config/database');

// ─── Helper: build date range from params ─────────────────────────────────────
function getDateRange(query) {
  let { date_from, date_to, financial_year } = query;

  // If financial_year provided, override date_from/date_to
  if (financial_year) {
    const fy = parseInt(financial_year);
    date_from = `${fy - 1}-04-01`;   // e.g. FY 2026 → 2025-04-01
    date_to   = `${fy}-03-31`;       // e.g. FY 2026 → 2026-03-31
  }

  return { date_from: date_from || null, date_to: date_to || null };
}

// ─── Helper: append optional WHERE clauses ────────────────────────────────────
function buildWhere(conditions) {
  const clauses = conditions.filter(Boolean);
  return clauses.length ? `AND ${clauses.join(' AND ')}` : '';
}

// ─── Helper: financial year label from a date ─────────────────────────────────
// Returns "FY 25-26" style string for grouping
function fyLabel(year, month) {
  // April (month 4) starts a new FY
  if (month >= 4) return `FY ${String(year).slice(2)}-${String(year + 1).slice(2)}`;
  return `FY ${String(year - 1).slice(2)}-${String(year).slice(2)}`;
}

// =============================================================================
// 1. KPI CARDS
// GET /api/analytics/kpi
// Returns: leads_in_queue, total_orders, total_order_value_excl_gst,
//          total_bqs, win_rate_pct, total_lost_leads
// =============================================================================
exports.kpi = async (req, res, next) => {
  try {
    const { date_from, date_to } = getDateRange(req.query);
    const { civil_defence, lead_owner } = req.query;

    const leadDateFilter   = date_from ? `AND l.created_at BETWEEN '${date_from}' AND '${date_to} 23:59:59'` : '';
    const orderDateFilter  = date_from ? `AND o.created_at BETWEEN '${date_from}' AND '${date_to} 23:59:59'` : '';
    const bqDateFilter     = date_from ? `AND b.created_at BETWEEN '${date_from}' AND '${date_to} 23:59:59'` : '';
    const civilFilter      = civil_defence ? `AND l.civil_defence = '${civil_defence}'` : '';
    const ownerFilter      = lead_owner    ? `AND l.lead_owner_id = '${lead_owner}'`    : '';

    const [leadsInQueue] = await sequelize.query(`
      SELECT COUNT(*) AS count
      FROM leads l
      WHERE l.is_deleted = FALSE
        AND l.open_closed = 'Open'
        ${leadDateFilter} ${civilFilter} ${ownerFilter}
    `, { type: QueryTypes.SELECT });

    const [totalOrders] = await sequelize.query(`
      SELECT COUNT(*) AS count
      FROM orders_received o
      WHERE o.is_deleted = FALSE ${orderDateFilter}
    `, { type: QueryTypes.SELECT });

    const [orderValue] = await sequelize.query(`
      SELECT COALESCE(SUM(o.value_excl_gst_cr), 0) AS total
      FROM orders_received o
      WHERE o.is_deleted = FALSE ${orderDateFilter}
    `, { type: QueryTypes.SELECT });

    const [totalBQs] = await sequelize.query(`
      SELECT COUNT(*) AS count
      FROM bq_quotations b
      WHERE b.is_deleted = FALSE ${bqDateFilter}
    `, { type: QueryTypes.SELECT });

    const [winStats] = await sequelize.query(`
      SELECT
        COUNT(*) FILTER (WHERE outcome = 'Won')                                             AS won,
        COUNT(*) FILTER (WHERE outcome IN ('Won','Lost','Participated','Not-Participated')) AS total
      FROM leads l
      WHERE l.is_deleted = FALSE
        ${leadDateFilter} ${civilFilter} ${ownerFilter}
    `, { type: QueryTypes.SELECT });

    const [lostLeads] = await sequelize.query(`
      SELECT COUNT(*) AS count
      FROM leads l
      WHERE l.is_deleted = FALSE
        AND l.outcome = 'Lost'
        ${leadDateFilter} ${civilFilter} ${ownerFilter}
    `, { type: QueryTypes.SELECT });

    const won   = parseInt(winStats.won   || 0);
    const total = parseInt(winStats.total || 0);
    const winRate = total > 0 ? Math.round((won / total) * 100) : 0;

    res.json({
      success: true,
      data: {
        leads_in_queue:          parseInt(leadsInQueue.count),
        total_orders:            parseInt(totalOrders.count),
        total_order_value_excl_gst: parseFloat(orderValue.total).toFixed(2),
        total_bqs:               parseInt(totalBQs.count),
        win_rate_pct:            winRate,
        total_lost_leads:        parseInt(lostLeads.count),
      },
    });
  } catch (err) { next(err); }
};

// =============================================================================
// 2. ORDERS — 5-YEAR HISTORY
// GET /api/analytics/orders-5year
// Returns: [{year, label, order_count, total_value_cr}] for last 5 FYs
// =============================================================================
exports.orders5year = async (req, res, next) => {
  try {
    // Get order counts and values grouped by financial year (Apr–Mar)
    const rows = await sequelize.query(`
      SELECT
        CASE
          WHEN EXTRACT(MONTH FROM order_received_date) >= 4
          THEN EXTRACT(YEAR FROM order_received_date)::INT
          ELSE EXTRACT(YEAR FROM order_received_date)::INT - 1
        END AS fy_start,
        COUNT(*) AS order_count,
        COALESCE(SUM(value_excl_gst_cr), 0) AS total_value_cr
      FROM orders_received
      WHERE is_deleted = FALSE
      GROUP BY fy_start
      ORDER BY fy_start DESC
      LIMIT 5
    `, { type: QueryTypes.SELECT });

    // Sort ascending (oldest first) and format labels
    const sorted = rows.reverse().map(r => ({
      year:         r.fy_start,
      label:        `FY ${String(r.fy_start).slice(2)}-${String(parseInt(r.fy_start) + 1).slice(2)}`,
      order_count:  parseInt(r.order_count),
      total_value_cr: parseFloat(r.total_value_cr).toFixed(2),
    }));

    res.json({ success: true, data: sorted });
  } catch (err) { next(err); }
};

// =============================================================================
// 3. LEAD OUTCOMES
// GET /api/analytics/lead-outcomes
// Returns: [{outcome, count, percentage}]
// =============================================================================
exports.leadOutcomes = async (req, res, next) => {
  try {
    const { date_from, date_to } = getDateRange(req.query);
    const { civil_defence, lead_owner } = req.query;

    const dateFilter  = date_from ? `AND created_at BETWEEN '${date_from}' AND '${date_to} 23:59:59'` : '';
    const civilFilter = civil_defence ? `AND civil_defence = '${civil_defence}'` : '';
    const ownerFilter = lead_owner    ? `AND lead_owner_id = '${lead_owner}'`    : '';

    const rows = await sequelize.query(`
      SELECT
        outcome,
        COUNT(*) AS count
      FROM leads
      WHERE is_deleted = FALSE
        ${dateFilter} ${civilFilter} ${ownerFilter}
      GROUP BY outcome
      ORDER BY count DESC
    `, { type: QueryTypes.SELECT });

    const total = rows.reduce((s, r) => s + parseInt(r.count), 0);
    const data  = rows.map(r => ({
      outcome:    r.outcome,
      count:      parseInt(r.count),
      percentage: total > 0 ? Math.round((parseInt(r.count) / total) * 100) : 0,
    }));

    res.json({ success: true, data, total });
  } catch (err) { next(err); }
};

// =============================================================================
// 4. LEAD PIPELINE (active leads by present_status)
// GET /api/analytics/lead-pipeline
// Returns: [{status, count, value_cr}]
// =============================================================================
exports.leadPipeline = async (req, res, next) => {
  try {
    const { date_from, date_to } = getDateRange(req.query);
    const { civil_defence, lead_owner } = req.query;

    const dateFilter  = date_from ? `AND created_at BETWEEN '${date_from}' AND '${date_to} 23:59:59'` : '';
    const civilFilter = civil_defence ? `AND civil_defence = '${civil_defence}'` : '';
    const ownerFilter = lead_owner    ? `AND lead_owner_id = '${lead_owner}'`    : '';

    const rows = await sequelize.query(`
      SELECT
        present_status                            AS status,
        COUNT(*)                                  AS count,
        COALESCE(SUM(estimated_value_cr), 0)      AS value_cr
      FROM leads
      WHERE is_deleted = FALSE
        AND open_closed = 'Open'
        ${dateFilter} ${civilFilter} ${ownerFilter}
      GROUP BY present_status
      ORDER BY count DESC
      LIMIT 10
    `, { type: QueryTypes.SELECT });

    res.json({
      success: true,
      data: rows.map(r => ({
        status:   r.status,
        count:    parseInt(r.count),
        value_cr: parseFloat(r.value_cr).toFixed(2),
      })),
    });
  } catch (err) { next(err); }
};

// =============================================================================
// 5. LEAD SUB-TYPES
// GET /api/analytics/lead-subtypes
// Returns: [{subtype, count, percentage}]
// =============================================================================
exports.leadSubtypes = async (req, res, next) => {
  try {
    const { date_from, date_to } = getDateRange(req.query);
    const dateFilter = date_from ? `AND created_at BETWEEN '${date_from}' AND '${date_to} 23:59:59'` : '';

    const rows = await sequelize.query(`
      SELECT
        lead_subtype  AS subtype,
        COUNT(*)      AS count
      FROM leads
      WHERE is_deleted = FALSE ${dateFilter}
      GROUP BY lead_subtype
      ORDER BY count DESC
    `, { type: QueryTypes.SELECT });

    const total = rows.reduce((s, r) => s + parseInt(r.count), 0);
    res.json({
      success: true,
      data: rows.map(r => ({
        subtype:    r.subtype,
        count:      parseInt(r.count),
        percentage: total > 0 ? Math.round((parseInt(r.count) / total) * 100) : 0,
      })),
      total,
    });
  } catch (err) { next(err); }
};

// =============================================================================
// 6. MONTHLY ORDER TREND (current FY vs previous FY)
// GET /api/analytics/order-monthly
// Returns: [{month, month_num, current_fy, prev_fy}]
// =============================================================================
exports.orderMonthly = async (req, res, next) => {
  try {
    const { financial_year } = req.query;
    const fy = parseInt(financial_year || new Date().getFullYear());

    // Current FY: Apr (fy-1) → Mar (fy)
    const curFrom = `${fy - 1}-04-01`;
    const curTo   = `${fy}-03-31`;
    // Previous FY
    const prevFrom = `${fy - 2}-04-01`;
    const prevTo   = `${fy - 1}-03-31`;

    const [curRows, prevRows] = await Promise.all([
      sequelize.query(`
        SELECT
          EXTRACT(MONTH FROM order_received_date)::INT AS month_num,
          EXTRACT(YEAR  FROM order_received_date)::INT AS year_num,
          COUNT(*) AS count,
          COALESCE(SUM(value_excl_gst_cr), 0) AS value_cr
        FROM orders_received
        WHERE is_deleted = FALSE
          AND order_received_date BETWEEN '${curFrom}' AND '${curTo}'
        GROUP BY month_num, year_num
        ORDER BY year_num, month_num
      `, { type: QueryTypes.SELECT }),

      sequelize.query(`
        SELECT
          EXTRACT(MONTH FROM order_received_date)::INT AS month_num,
          COUNT(*) AS count,
          COALESCE(SUM(value_excl_gst_cr), 0) AS value_cr
        FROM orders_received
        WHERE is_deleted = FALSE
          AND order_received_date BETWEEN '${prevFrom}' AND '${prevTo}'
        GROUP BY month_num
        ORDER BY month_num
      `, { type: QueryTypes.SELECT }),
    ]);

    // FY months: Apr=4, May=5, ..., Mar=3 → display as 0–11
    const FY_MONTHS = [
      { num:4,  label:'Apr' }, { num:5,  label:'May' }, { num:6,  label:'Jun' },
      { num:7,  label:'Jul' }, { num:8,  label:'Aug' }, { num:9,  label:'Sep' },
      { num:10, label:'Oct' }, { num:11, label:'Nov' }, { num:12, label:'Dec' },
      { num:1,  label:'Jan' }, { num:2,  label:'Feb' }, { num:3,  label:'Mar' },
    ];

    const curMap  = Object.fromEntries(curRows.map( r => [r.month_num, r]));
    const prevMap = Object.fromEntries(prevRows.map(r => [r.month_num, r]));

    const data = FY_MONTHS.map(m => ({
      month:       m.label,
      month_num:   m.num,
      current_fy:  parseInt(curMap[m.num]?.count    || 0),
      prev_fy:     parseInt(prevMap[m.num]?.count   || 0),
      current_val: parseFloat(curMap[m.num]?.value_cr  || 0).toFixed(2),
      prev_val:    parseFloat(prevMap[m.num]?.value_cr || 0).toFixed(2),
    }));

    res.json({ success: true, data, fy_label: `FY ${String(fy-1).slice(2)}-${String(fy).slice(2)}` });
  } catch (err) { next(err); }
};

// =============================================================================
// 7. BQ CONVERSION FUNNEL
// GET /api/analytics/bq-conversion
// Returns: [{stage, count}] — BQs → Leads → Orders
// =============================================================================
exports.bqConversion = async (req, res, next) => {
  try {
    const { date_from, date_to } = getDateRange(req.query);
    const dateFilter = date_from ? `AND created_at BETWEEN '${date_from}' AND '${date_to} 23:59:59'` : '';

    const [[bqRow], [leadRow], [wonRow]] = await Promise.all([
      sequelize.query(`SELECT COUNT(*) AS count FROM bq_quotations WHERE is_deleted = FALSE ${dateFilter}`, { type: QueryTypes.SELECT }),
      sequelize.query(`SELECT COUNT(*) AS count FROM leads WHERE is_deleted = FALSE ${dateFilter}`, { type: QueryTypes.SELECT }),
      sequelize.query(`SELECT COUNT(*) AS count FROM leads WHERE is_deleted = FALSE AND outcome = 'Won' ${dateFilter}`, { type: QueryTypes.SELECT }),
    ]);

    const [orderRow] = await sequelize.query(
      `SELECT COUNT(*) AS count FROM orders_received WHERE is_deleted = FALSE ${dateFilter.replace('created_at','created_at')}`,
      { type: QueryTypes.SELECT }
    );

    const stages = [
      { stage: 'BQs Submitted',       count: parseInt(bqRow.count)    },
      { stage: 'Leads Created',        count: parseInt(leadRow.count)  },
      { stage: 'Orders Received',      count: parseInt(orderRow.count) },
      { stage: 'Won Leads',            count: parseInt(wonRow.count)   },
    ];

    res.json({ success: true, data: stages });
  } catch (err) { next(err); }
};

// =============================================================================
// 8. CIVIL vs DEFENCE SPLIT
// GET /api/analytics/civil-defence
// Returns: { leads: {Civil, Defence}, orders: (derived from BQ defence_type) }
// =============================================================================
exports.civilDefence = async (req, res, next) => {
  try {
    const { date_from, date_to } = getDateRange(req.query);
    const dateFilter = date_from ? `AND created_at BETWEEN '${date_from}' AND '${date_to} 23:59:59'` : '';

    const [leadRows, bqRows] = await Promise.all([
      sequelize.query(`
        SELECT civil_defence, COUNT(*) AS count
        FROM leads WHERE is_deleted = FALSE ${dateFilter}
        GROUP BY civil_defence
      `, { type: QueryTypes.SELECT }),

      sequelize.query(`
        SELECT defence_type, COUNT(*) AS count
        FROM bq_quotations WHERE is_deleted = FALSE ${dateFilter.replace('created_at','created_at')}
        GROUP BY defence_type
      `, { type: QueryTypes.SELECT }),
    ]);

    const leads = { Civil: 0, Defence: 0 };
    leadRows.forEach(r => { leads[r.civil_defence] = parseInt(r.count); });

    const bqs = { Defence: 0, 'Non-Defence': 0 };
    bqRows.forEach(r => { bqs[r.defence_type] = parseInt(r.count); });

    res.json({
      success: true,
      data: {
        leads: [
          { name: 'Civil',    count: leads.Civil   || 0 },
          { name: 'Defence',  count: leads.Defence || 0 },
        ],
        bqs: [
          { name: 'Defence',     count: bqs['Defence']     || 0 },
          { name: 'Non-Defence', count: bqs['Non-Defence'] || 0 },
        ],
      },
    });
  } catch (err) { next(err); }
};

// =============================================================================
// 9. WIN / LOSS BY BUSINESS DOMAIN
// GET /api/analytics/win-loss-domain
// Returns: [{domain, won, lost, participated, not_participated}]
// =============================================================================
exports.winLossDomain = async (req, res, next) => {
  try {
    const { date_from, date_to } = getDateRange(req.query);
    const { civil_defence, lead_owner } = req.query;

    const dateFilter  = date_from ? `AND created_at BETWEEN '${date_from}' AND '${date_to} 23:59:59'` : '';
    const civilFilter = civil_defence ? `AND civil_defence = '${civil_defence}'` : '';
    const ownerFilter = lead_owner    ? `AND lead_owner_id = '${lead_owner}'`    : '';

    const rows = await sequelize.query(`
      SELECT
        business_domain                                                   AS domain,
        COUNT(*) FILTER (WHERE outcome = 'Won')              AS won,
        COUNT(*) FILTER (WHERE outcome = 'Lost')             AS lost,
        COUNT(*) FILTER (WHERE outcome = 'Participated')     AS participated,
        COUNT(*) FILTER (WHERE outcome = 'Not-Participated') AS not_participated,
        COUNT(*)                                             AS total
      FROM leads
      WHERE is_deleted = FALSE
        ${dateFilter} ${civilFilter} ${ownerFilter}
      GROUP BY business_domain
      ORDER BY total DESC
      LIMIT 10
    `, { type: QueryTypes.SELECT });

    res.json({
      success: true,
      data: rows.map(r => ({
        domain:           r.domain,
        won:              parseInt(r.won),
        lost:             parseInt(r.lost),
        participated:     parseInt(r.participated),
        not_participated: parseInt(r.not_participated),
        total:            parseInt(r.total),
      })),
    });
  } catch (err) { next(err); }
};

// =============================================================================
// 10. TOP 10 CUSTOMERS BY ORDER VALUE
// GET /api/analytics/top-customers
// Returns: [{customer_name, order_count, total_value_cr}]
// =============================================================================
exports.topCustomers = async (req, res, next) => {
  try {
    const { date_from, date_to } = getDateRange(req.query);
    const dateFilter = date_from ? `AND created_at BETWEEN '${date_from}' AND '${date_to} 23:59:59'` : '';

    const rows = await sequelize.query(`
      SELECT
        customer_name,
        COUNT(*)                            AS order_count,
        COALESCE(SUM(value_excl_gst_cr), 0) AS total_value_cr
      FROM orders_received
      WHERE is_deleted = FALSE ${dateFilter}
      GROUP BY customer_name
      ORDER BY total_value_cr DESC
      LIMIT 10
    `, { type: QueryTypes.SELECT });

    res.json({
      success: true,
      data: rows.map(r => ({
        customer_name:  r.customer_name,
        order_count:    parseInt(r.order_count),
        total_value_cr: parseFloat(r.total_value_cr).toFixed(2),
      })),
    });
  } catch (err) { next(err); }
};

// =============================================================================
// 11. LOST LEAD ANALYSIS TABLE
// GET /api/analytics/lost-leads
// Returns: paginated list of lost leads with full details
// =============================================================================
exports.lostLeads = async (req, res, next) => {
  try {
    const { date_from, date_to } = getDateRange(req.query);
    const { civil_defence, lead_owner, page = 1, limit = 20 } = req.query;

    const dateFilter  = date_from ? `AND l.created_at BETWEEN '${date_from}' AND '${date_to} 23:59:59'` : '';
    const civilFilter = civil_defence ? `AND l.civil_defence = '${civil_defence}'` : '';
    const ownerFilter = lead_owner    ? `AND l.lead_owner_id = '${lead_owner}'`    : '';
    const offset      = (parseInt(page) - 1) * parseInt(limit);

    const [rows, [countRow]] = await Promise.all([
      sequelize.query(`
        SELECT
          l.id,
          l.tender_name,
          l.customer_name,
          l.business_domain,
          l.civil_defence,
          l.submitted_value_cr,
          l.estimated_value_cr,
          l.competitors_info,
          l.reason_for_losing,
          l.last_submission_date,
          l.created_at,
          u.full_name AS lead_owner_name
        FROM leads l
        LEFT JOIN users u ON u.id = l.lead_owner_id
        WHERE l.is_deleted = FALSE
          AND l.outcome = 'Lost'
          ${dateFilter} ${civilFilter} ${ownerFilter}
        ORDER BY l.created_at DESC
        LIMIT ${parseInt(limit)} OFFSET ${offset}
      `, { type: QueryTypes.SELECT }),

      sequelize.query(`
        SELECT COUNT(*) AS total
        FROM leads l
        WHERE l.is_deleted = FALSE AND l.outcome = 'Lost'
          ${dateFilter} ${civilFilter} ${ownerFilter}
      `, { type: QueryTypes.SELECT }),
    ]);

    res.json({
      success: true,
      data: rows,
      pagination: {
        total:       parseInt(countRow.total),
        page:        parseInt(page),
        limit:       parseInt(limit),
        total_pages: Math.ceil(parseInt(countRow.total) / parseInt(limit)),
      },
    });
  } catch (err) { next(err); }
};

// =============================================================================
// 12. MONTHLY REPORT — full breakdown for one month
// GET /api/analytics/monthly-report?year=2026&month=1  (month = 1-12)
// =============================================================================
exports.monthlyReport = async (req, res, next) => {
  try {
    const { year, month } = req.query;
    if (!year || !month) {
      return res.status(422).json({ success: false, error: 'year and month are required.' });
    }
    const y = parseInt(year);
    const m = parseInt(month);
    const from = `${y}-${String(m).padStart(2,'0')}-01`;
    // Last day of month
    const to   = new Date(y, m, 0).toISOString().slice(0,10);

    const [[orders], [leads], [bqs], [wonLeads], [lostLeads], [orderValue]] = await Promise.all([
      sequelize.query(`SELECT COUNT(*) AS count FROM orders_received WHERE is_deleted=FALSE AND order_received_date BETWEEN '${from}' AND '${to}'`, { type: QueryTypes.SELECT }),
      sequelize.query(`SELECT COUNT(*) AS count FROM leads WHERE is_deleted=FALSE AND created_at BETWEEN '${from}' AND '${to} 23:59:59'`, { type: QueryTypes.SELECT }),
      sequelize.query(`SELECT COUNT(*) AS count FROM bq_quotations WHERE is_deleted=FALSE AND created_at BETWEEN '${from}' AND '${to} 23:59:59'`, { type: QueryTypes.SELECT }),
      sequelize.query(`SELECT COUNT(*) AS count FROM leads WHERE is_deleted=FALSE AND outcome='Won' AND created_at BETWEEN '${from}' AND '${to} 23:59:59'`, { type: QueryTypes.SELECT }),
      sequelize.query(`SELECT COUNT(*) AS count FROM leads WHERE is_deleted=FALSE AND outcome='Lost' AND created_at BETWEEN '${from}' AND '${to} 23:59:59'`, { type: QueryTypes.SELECT }),
      sequelize.query(`SELECT COALESCE(SUM(value_excl_gst_cr),0) AS total FROM orders_received WHERE is_deleted=FALSE AND order_received_date BETWEEN '${from}' AND '${to}'`, { type: QueryTypes.SELECT }),
    ]);

    const leadsCount = parseInt(leads.count);
    const wonCount   = parseInt(wonLeads.count);

    res.json({
      success: true,
      data: {
        year:        y,
        month:       m,
        from,
        to,
        orders:      parseInt(orders.count),
        leads:       leadsCount,
        bqs:         parseInt(bqs.count),
        won:         wonCount,
        lost:        parseInt(lostLeads.count),
        order_value: parseFloat(orderValue.total).toFixed(2),
        win_rate:    leadsCount > 0 ? Math.round((wonCount / leadsCount) * 100) : 0,
      },
    });
  } catch (err) { next(err); }
};

// =============================================================================
// 13. YEARLY REPORT — all FYs summary
// GET /api/analytics/yearly-report
// Returns: [{fy_label, fy_start, bqs, leads, orders, order_value_cr, win_rate, lost_leads, growth_pct}]
// =============================================================================
exports.yearlyReport = async (req, res, next) => {
  try {
    // Pull all data grouped by financial year from all three tables
    const [orderRows, leadRows, bqRows] = await Promise.all([
      sequelize.query(`
        SELECT
          CASE WHEN EXTRACT(MONTH FROM order_received_date) >= 4
            THEN EXTRACT(YEAR FROM order_received_date)::INT
            ELSE EXTRACT(YEAR FROM order_received_date)::INT - 1
          END AS fy_start,
          COUNT(*)                            AS order_count,
          COALESCE(SUM(value_excl_gst_cr), 0) AS total_value_cr
        FROM orders_received
        WHERE is_deleted = FALSE
        GROUP BY fy_start
        ORDER BY fy_start ASC
      `, { type: QueryTypes.SELECT }),

      sequelize.query(`
        SELECT
          CASE WHEN EXTRACT(MONTH FROM created_at) >= 4
            THEN EXTRACT(YEAR FROM created_at)::INT
            ELSE EXTRACT(YEAR FROM created_at)::INT - 1
          END AS fy_start,
          COUNT(*)                                               AS lead_count,
          COUNT(*) FILTER (WHERE outcome = 'Won')  AS won_count,
          COUNT(*) FILTER (WHERE outcome = 'Lost') AS lost_count
        FROM leads
        WHERE is_deleted = FALSE
        GROUP BY fy_start
        ORDER BY fy_start ASC
      `, { type: QueryTypes.SELECT }),

      sequelize.query(`
        SELECT
          CASE WHEN EXTRACT(MONTH FROM created_at) >= 4
            THEN EXTRACT(YEAR FROM created_at)::INT
            ELSE EXTRACT(YEAR FROM created_at)::INT - 1
          END AS fy_start,
          COUNT(*) AS bq_count
        FROM bq_quotations
        WHERE is_deleted = FALSE
        GROUP BY fy_start
        ORDER BY fy_start ASC
      `, { type: QueryTypes.SELECT }),
    ]);

    // Get all FY years present across tables
    const allFYs = [...new Set([
      ...orderRows.map(r => r.fy_start),
      ...leadRows.map(r => r.fy_start),
      ...bqRows.map(r => r.fy_start),
    ])].sort();

    const orderMap = Object.fromEntries(orderRows.map(r => [r.fy_start, r]));
    const leadMap  = Object.fromEntries(leadRows.map(r => [r.fy_start, r]));
    const bqMap    = Object.fromEntries(bqRows.map(r => [r.fy_start, r]));

    const result = allFYs.map((fy, i) => {
      const orders     = orderMap[fy] || {};
      const leads      = leadMap[fy]  || {};
      const bqs        = bqMap[fy]    || {};
      const leadCount  = parseInt(leads.lead_count  || 0);
      const wonCount   = parseInt(leads.won_count   || 0);
      const totalPart  = leadCount;
      const winRate    = totalPart > 0 ? Math.round((wonCount / totalPart) * 100) : 0;
      const orderVal   = parseFloat(orders.total_value_cr || 0);

      // Growth % vs previous FY
      let growthPct = null;
      if (i > 0) {
        const prevFY    = allFYs[i - 1];
        const prevOrders = orderMap[prevFY];
        if (prevOrders) {
          const prevVal = parseFloat(prevOrders.total_value_cr || 0);
          growthPct = prevVal > 0 ? Math.round(((orderVal - prevVal) / prevVal) * 100) : null;
        }
      }

      return {
        fy_start:       fy,
        fy_label:       `FY ${String(fy).slice(2)}-${String(fy + 1).slice(2)}`,
        bqs:            parseInt(bqs.bq_count    || 0),
        leads:          leadCount,
        orders:         parseInt(orders.order_count || 0),
        order_value_cr: orderVal.toFixed(2),
        win_rate_pct:   winRate,
        lost_leads:     parseInt(leads.lost_count || 0),
        growth_pct:     growthPct,
      };
    });

    // Summary stats
    const values = result.map(r => parseFloat(r.order_value_cr));
    const total5yr = values.reduce((s, v) => s + v, 0);
    const cagr = values.length >= 2 && values[0] > 0
      ? Math.round(((Math.pow(values[values.length-1] / values[0], 1 / (values.length - 1)) - 1) * 100) * 10) / 10
      : null;

    res.json({
      success: true,
      data:    result,
      summary: {
        total_value_all_years: total5yr.toFixed(2),
        cagr_pct:              cagr,
        best_year_by_orders:   result.reduce((a, b) => a.orders > b.orders ? a : b, result[0])?.fy_label || null,
        best_year_by_value:    result.reduce((a, b) => parseFloat(a.order_value_cr) > parseFloat(b.order_value_cr) ? a : b, result[0])?.fy_label || null,
        peak_win_rate:         Math.max(...result.map(r => r.win_rate_pct)),
        avg_orders_per_year:   Math.round(result.reduce((s, r) => s + r.orders, 0) / (result.length || 1)),
      },
    });
  } catch (err) { next(err); }
};
