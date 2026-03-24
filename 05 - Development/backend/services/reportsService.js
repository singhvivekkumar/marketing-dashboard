/**
 * Reports Service
 * Handles yearly reports, summaries, and data exports
 */

const reportsData = {
  yearlyValue: [
    { fy: 'FY 21-22', value: 148 },
    { fy: 'FY 22-23', value: 162 },
    { fy: 'FY 23-24', value: 182 },
    { fy: 'FY 24-25', value: 208 },
    { fy: 'FY 25-26', value: 247 },
  ],

  winRateTrend: [
    { fy: 'FY 21-22', rate: 27 },
    { fy: 'FY 22-23', rate: 29 },
    { fy: 'FY 23-24', rate: 38 },
    { fy: 'FY 24-25', rate: 31 },
    { fy: 'FY 25-26', rate: 34 },
  ],

  yearSummary: [
    {
      id: 1,
      fy: 'FY 2025–26',
      bqs: 67,
      leads: 112,
      orders: 128,
      value: '₹247',
      winRate: '34%',
      lost: 38,
      growth: '+18.7%',
    },
    {
      id: 2,
      fy: 'FY 2024–25',
      bqs: 58,
      leads: 98,
      orders: 105,
      value: '₹208',
      winRate: '31%',
      lost: 33,
      growth: '+14.3%',
    },
    {
      id: 3,
      fy: 'FY 2023–24',
      bqs: 52,
      leads: 89,
      orders: 92,
      value: '₹182',
      winRate: '38%',
      lost: 28,
      growth: '+12.1%',
    },
    {
      id: 4,
      fy: 'FY 2022–23',
      bqs: 45,
      leads: 76,
      orders: 82,
      value: '₹162',
      winRate: '29%',
      lost: 31,
      growth: '+7.8%',
    },
  ],

  quarterlyData: [
    { quarter: 'Q1', 'FY 25-26': 24, 'FY 24-25': 20 },
    { quarter: 'Q2', 'FY 25-26': 29, 'FY 24-25': 24 },
    { quarter: 'Q3', 'FY 25-26': 33, 'FY 24-25': 28 },
    { quarter: 'Q4', 'FY 25-26': 42, 'FY 24-25': 33 },
  ],

  tenderType: [
    { name: 'Open', value: 38, color: '#2563eb' },
    { name: 'Limited', value: 22, color: '#0d9488' },
    { name: 'Single Source', value: 18, color: '#7c3aed' },
    { name: 'Nomination', value: 12, color: '#d97706' },
    { name: 'Rate Contract', value: 10, color: '#9ca3af' },
  ],

  leadOwner: [
    { owner: 'Rajan K', value: 68 },
    { owner: 'Priya S', value: 52 },
    { owner: 'Anil M', value: 44 },
    { owner: 'Deepa R', value: 38 },
    { owner: 'Sanjay V', value: 28 },
  ],
};

class ReportsService {
  // Get yearly value trend
  getYearlyValue() {
    return reportsData.yearlyValue;
  }

  // Get win rate trend
  getWinRateTrend() {
    return reportsData.winRateTrend;
  }

  // Get year summary
  getYearSummary() {
    return reportsData.yearSummary;
  }

  // Get specific year summary
  getYearById(id) {
    const year = reportsData.yearSummary.find(y => y.id === parseInt(id));
    if (!year) {
      throw new Error(`Year with ID ${id} not found`);
    }
    return year;
  }

  // Get quarterly data
  getQuarterlyData(fy = null) {
    if (!fy) return reportsData.quarterlyData;

    return reportsData.quarterlyData.map(q => ({
      quarter: q.quarter,
      value: q[fy] || 0,
    }));
  }

  // Get tender type breakdown
  getTenderType() {
    return reportsData.tenderType;
  }

  // Get lead owner performance
  getLeadOwnerPerformance() {
    return reportsData.leadOwner;
  }

  // Get full report summary
  getReportSummary() {
    const currentYear = reportsData.yearSummary[0];
    return {
      currentFY: currentYear.fy,
      totalOrders: currentYear.orders,
      totalValue: currentYear.value,
      averageWinRate: '32%',
      totalLeads: currentYear.leads,
      generatedDate: new Date().toISOString(),
      yearsAvailable: reportsData.yearSummary.length,
    };
  }

  // Export report data (for CSV/JSON export)
  getExportData(format = 'json') {
    return {
      format,
      yearlyValue: reportsData.yearlyValue,
      winRateTrend: reportsData.winRateTrend,
      yearSummary: reportsData.yearSummary,
      quarterlyData: reportsData.quarterlyData,
      tenderType: reportsData.tenderType,
      leadOwner: reportsData.leadOwner,
      exportDate: new Date().toISOString(),
    };
  }
}

module.exports = new ReportsService();
