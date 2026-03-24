/**
 * Analytics Service
 * Handles all analytics-related data: trends, distributions, performance metrics
 */

const analyticsData = {
  fiveYearTrend: [
    { fy: 'FY 21-22', orders: 75, value: 148 },
    { fy: 'FY 22-23', orders: 82, value: 162 },
    { fy: 'FY 23-24', orders: 92, value: 182 },
    { fy: 'FY 24-25', orders: 105, value: 208 },
    { fy: 'FY 25-26', orders: 128, value: 247 },
  ],

  leadOutcomes: [
    { name: 'Won', value: 34, color: '#16a34a' },
    { name: 'Lost', value: 22, color: '#dc2626' },
    { name: 'Participated', value: 30, color: '#2563eb' },
    { name: 'Not-Part.', value: 14, color: '#d97706' },
  ],

  monthlyTrend: [
    { month: 'Apr', 'FY 25-26': 8, 'FY 24-25': 6 },
    { month: 'May', 'FY 25-26': 6, 'FY 24-25': 5 },
    { month: 'Jun', 'FY 25-26': 10, 'FY 24-25': 8 },
    { month: 'Jul', 'FY 25-26': 9, 'FY 24-25': 7 },
    { month: 'Aug', 'FY 25-26': 12, 'FY 24-25': 9 },
    { month: 'Sep', 'FY 25-26': 8, 'FY 24-25': 6 },
    { month: 'Oct', 'FY 25-26': 11, 'FY 24-25': 9 },
    { month: 'Nov', 'FY 25-26': 13, 'FY 24-25': 10 },
    { month: 'Dec', 'FY 25-26': 9, 'FY 24-25': 7 },
    { month: 'Jan', 'FY 25-26': 14, 'FY 24-25': 11 },
    { month: 'Feb', 'FY 25-26': 10, 'FY 24-25': 8 },
    { month: 'Mar', 'FY 25-26': 18, 'FY 24-25': 14 },
  ],

  civilDefence: [
    { category: 'Leads', Civil: 68, Defence: 44 },
    { category: 'Orders', Civil: 78, Defence: 50 },
    { category: 'BQs', Civil: 55, Defence: 30 },
  ],

  leadSubTypes: [
    { name: 'Submitted', value: 28, color: '#2563eb' },
    { name: 'Domestic', value: 35, color: '#0d9488' },
    { name: 'Export', value: 18, color: '#7c3aed' },
    { name: 'CRM Lead', value: 14, color: '#d97706' },
    { name: 'Lost Lead', value: 17, color: '#dc2626' },
  ],

  domainWinLoss: [
    { domain: 'Radar', Won: 12, Lost: 5 },
    { domain: 'Telecom', Won: 8, Lost: 4 },
    { domain: 'CCTV', Won: 15, Lost: 7 },
    { domain: 'Comms', Won: 6, Lost: 3 },
    { domain: 'Power', Won: 5, Lost: 2 },
    { domain: 'IT', Won: 9, Lost: 4 },
  ],

  topCustomers: [
    { name: 'MoD', value: 82 },
    { name: 'BEL', value: 68 },
    { name: 'ONGC', value: 54 },
    { name: 'DRDO', value: 48 },
    { name: 'NHAI', value: 42 },
    { name: 'BSF', value: 38 },
    { name: 'AAI', value: 34 },
    { name: 'BSNL', value: 28 },
    { name: 'RVNL', value: 22 },
    { name: 'GAIL', value: 18 },
  ],

  lostLeads: [
    {
      id: 1,
      tenderName: 'Coastal Radar Network',
      customer: 'Indian Navy',
      domain: 'Defence',
      value: '₹45.20',
      competitor: 'DRDO Pvt',
      reason: 'Higher price quoted',
      date: 'Jan \'26',
    },
    {
      id: 2,
      tenderName: 'Urban CCTV Phase 3',
      customer: 'Delhi Police',
      domain: 'Civil',
      value: '₹12.80',
      competitor: 'TechVision',
      reason: 'Technical spec mismatch',
      date: 'Dec \'25',
    },
    {
      id: 3,
      tenderName: 'Border Telecom Grid',
      customer: 'BSF',
      domain: 'Defence',
      value: '₹78.50',
      competitor: 'BEL',
      reason: 'L2 — price difference ₹3.2Cr',
      date: 'Nov \'25',
    },
    {
      id: 4,
      tenderName: 'Port Surveillance System',
      customer: 'Mumbai Port Trust',
      domain: 'Civil',
      value: '₹22.40',
      competitor: 'Honeywell',
      reason: 'Not participated — resource constraint',
      date: 'Oct \'25',
    },
    {
      id: 5,
      tenderName: 'Airfield Security NIT',
      customer: 'AAI',
      domain: 'Civil',
      value: '₹18.90',
      competitor: 'G4S',
      reason: 'Lost on delivery timeline',
      date: 'Sep \'25',
    },
  ],

  bqConversion: [
    { stage: 'BQs Submitted', count: 67 },
    { stage: 'Converted to Lead', count: 48 },
    { stage: 'Submitted to Tender', count: 38 },
    { stage: 'Won Order', count: 26 },
  ],

  orderValueDistribution: [
    { band: '<5 Cr', count: 12 },
    { band: '5–20 Cr', count: 38 },
    { band: '20–50 Cr', count: 45 },
    { band: '50–100 Cr', count: 25 },
    { band: '>100 Cr', count: 8 },
  ],
};

class AnalyticsService {
  // Five year trend
  getFiveYearTrend() {
    return analyticsData.fiveYearTrend;
  }

  // Lead outcomes distribution
  getLeadOutcomes() {
    return analyticsData.leadOutcomes;
  }

  // Monthly trend comparison
  getMonthlyTrend(fy = null) {
    if (!fy) return analyticsData.monthlyTrend;

    return analyticsData.monthlyTrend.map(item => ({
      month: item.month,
      [fy]: item[fy] || 0,
    }));
  }

  // Civil vs Defence comparison
  getCivilDefence() {
    return analyticsData.civilDefence;
  }

  // Lead sub-types distribution
  getLeadSubTypes() {
    return analyticsData.leadSubTypes;
  }

  // Domain-wise win/loss data
  getDomainPerformance(domain = null) {
    if (!domain) return analyticsData.domainWinLoss;

    return analyticsData.domainWinLoss.filter(d => d.domain === domain);
  }

  // Top customers
  getTopCustomers(limit = 10) {
    return analyticsData.topCustomers.slice(0, limit);
  }

  // Lost leads with filtering
  getLostLeads(domain = null, limit = null) {
    let data = analyticsData.lostLeads;

    if (domain) {
      data = data.filter(lead => lead.domain === domain);
    }

    if (limit) {
      data = data.slice(0, parseInt(limit));
    }

    return {
      data,
      total: analyticsData.lostLeads.length,
      filtered: data.length,
    };
  }

  // Get specific lost lead
  getLostLeadById(id) {
    const lead = analyticsData.lostLeads.find(l => l.id === parseInt(id));
    if (!lead) {
      throw new Error(`Lost lead with ID ${id} not found`);
    }
    return lead;
  }

  // BQ conversion funnel
  getBQConversion() {
    return analyticsData.bqConversion;
  }

  // Order value distribution
  getOrderValueDistribution() {
    return analyticsData.orderValueDistribution;
  }

  // Get KPI analytics
  getKPIAnalytics() {
    return {
      avgDealSize: '₹19.3',
      bqConversion: '48%',
      pipelineValue: '₹312',
      avgLeadAge: 47,
      exportLeads: 18,
      soleBidding: '62%',
    };
  }
}

module.exports = new AnalyticsService();
