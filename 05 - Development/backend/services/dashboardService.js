/**
 * Dashboard Service
 * Handles month-to-month and fiscal year data
 */

const MONTHS = ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'];

const monthlyData = [
  { orders: 8, leads: 9, bqs: 5, value: 18.2, won: 3, lost: 2 },
  { orders: 6, leads: 7, bqs: 4, value: 14.5, won: 2, lost: 2 },
  { orders: 10, leads: 11, bqs: 6, value: 22.8, won: 4, lost: 3 },
  { orders: 9, leads: 10, bqs: 5, value: 19.4, won: 3, lost: 2 },
  { orders: 12, leads: 13, bqs: 7, value: 28.1, won: 5, lost: 3 },
  { orders: 8, leads: 9, bqs: 5, value: 16.9, won: 3, lost: 2 },
  { orders: 11, leads: 12, bqs: 6, value: 24.3, won: 4, lost: 3 },
  { orders: 13, leads: 14, bqs: 8, value: 30.2, won: 5, lost: 4 },
  { orders: 9, leads: 10, bqs: 5, value: 18.7, won: 3, lost: 2 },
  { orders: 14, leads: 15, bqs: 8, value: 32.5, won: 6, lost: 4 },
  { orders: 10, leads: 11, bqs: 6, value: 21.4, won: 4, lost: 3 },
  { orders: 18, leads: 1, bqs: 8, value: 0, won: 0, lost: 0 },
];

const fiscalYearData = {
  '2026': { queue: 42, orders: 128, value: '₹247', bq: 67, wr: '34%', lost: 38 },
  '2025': { queue: 35, orders: 105, value: '₹208', bq: 58, wr: '31%', lost: 33 },
  '2024': { queue: 28, orders: 92, value: '₹182', bq: 52, wr: '38%', lost: 28 },
  '2023': { queue: 22, orders: 82, value: '₹162', bq: 45, wr: '29%', lost: 31 },
  '2022': { queue: 18, orders: 75, value: '₹148', bq: 38, wr: '27%', lost: 26 },
};

class DashboardService {
  // Get month data with FY filter
  getMonthData(fy = '2026') {
    return monthlyData.map((item, index) => ({
      month: MONTHS[index],
      ...item,
      fy,
    }));
  }

  // Get monthly data with months
  getMonthsWithData(fy = '2026') {
    return {
      months: MONTHS,
      data: this.getMonthData(fy),
    };
  }

  // Get fiscal year summary
  getFYSummary(fy = '2026') {
    if (!fiscalYearData[fy]) {
      throw new Error(`Fiscal year ${fy} not found`);
    }
    return fiscalYearData[fy];
  }

  // Get all FY data
  getAllFYData() {
    return fiscalYearData;
  }

  // Get KPI cards data
  getKPIs(fy = '2026') {
    const fyData = this.getFYSummary(fy);
    return {
      leadsInQueue: fyData.queue,
      totalOrders: fyData.orders,
      orderValue: fyData.value,
      bqsSubmitted: fyData.bq,
      winRate: fyData.wr,
      lostLeads: fyData.lost,
    };
  }
}

module.exports = new DashboardService();
