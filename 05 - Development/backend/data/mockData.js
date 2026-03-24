// Mock data matching the frontend requirements
const MONTHS = ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'];

const monthData = [
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

const fyData = {
  '2026': { queue: 42, orders: 128, value: '₹247', bq: 67, wr: '34%', lost: 38 },
  '2025': { queue: 35, orders: 105, value: '₹208', bq: 58, wr: '31%', lost: 33 },
  '2024': { queue: 28, orders: 92, value: '₹182', bq: 52, wr: '38%', lost: 28 },
  '2023': { queue: 22, orders: 82, value: '₹162', bq: 45, wr: '29%', lost: 31 },
  '2022': { queue: 18, orders: 75, value: '₹148', bq: 38, wr: '27%', lost: 26 },
};

const fiveYearData = [
  { fy: 'FY 21-22', orders: 75, value: 148 },
  { fy: 'FY 22-23', orders: 82, value: 162 },
  { fy: 'FY 23-24', orders: 92, value: 182 },
  { fy: 'FY 24-25', orders: 105, value: 208 },
  { fy: 'FY 25-26', orders: 128, value: 247 },
];

const leadOutcomesData = [
  { name: 'Won', value: 34, color: '#16a34a' },
  { name: 'Lost', value: 22, color: '#dc2626' },
  { name: 'Participated', value: 30, color: '#2563eb' },
  { name: 'Not-Part.', value: 14, color: '#d97706' },
];

const monthlyTrendData = [
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
];

const civilDefenceData = [
  { category: 'Leads', Civil: 68, Defence: 44 },
  { category: 'Orders', Civil: 78, Defence: 50 },
  { category: 'BQs', Civil: 55, Defence: 30 },
];

const leadSubTypesData = [
  { name: 'Submitted', value: 28, color: '#2563eb' },
  { name: 'Domestic', value: 35, color: '#0d9488' },
  { name: 'Export', value: 18, color: '#7c3aed' },
  { name: 'CRM Lead', value: 14, color: '#d97706' },
  { name: 'Lost Lead', value: 17, color: '#dc2626' },
];

const domainWinLossData = [
  { domain: 'Radar', Won: 12, Lost: 5 },
  { domain: 'Telecom', Won: 8, Lost: 4 },
  { domain: 'CCTV', Won: 15, Lost: 7 },
  { domain: 'Comms', Won: 6, Lost: 3 },
  { domain: 'Power', Won: 5, Lost: 2 },
  { domain: 'IT', Won: 9, Lost: 4 },
];

const top10CustomersData = [
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
];

const lostLeadsTableData = [
  {
    id: 1,
    tenderName: 'Coastal Radar Network',
    customer: 'Indian Navy',
    domain: 'Defence',
    value: '₹45.20',
    competitor: 'DRDO Pvt',
    lossReason: 'Pricing',
    reportedDate: '2026-02-15',
  },
  {
    id: 2,
    tenderName: 'Telecom Infrastructure',
    customer: 'BSNL',
    domain: 'Telecom',
    value: '₹32.50',
    competitor: 'Nokia',
    lossReason: 'Technical',
    reportedDate: '2026-02-18',
  },
  {
    id: 3,
    tenderName: 'CCTV Surveillance',
    customer: 'Delhi Police',
    domain: 'CCTV',
    value: '₹28.75',
    competitor: 'Hikvision',
    lossReason: 'Budget',
    reportedDate: '2026-02-20',
  },
  {
    id: 4,
    tenderName: 'Power Grid Monitoring',
    customer: 'Power Grid',
    domain: 'Power',
    value: '₹52.00',
    competitor: 'Siemens',
    lossReason: 'Delivery',
    reportedDate: '2026-02-22',
  },
  {
    id: 5,
    tenderName: 'IT Infrastructure',
    customer: 'ONGC',
    domain: 'IT',
    value: '₹39.80',
    competitor: 'IBM',
    lossReason: 'Pricing',
    reportedDate: '2026-02-25',
  },
];

const systemMetrics = {
  uptime: '99.8%',
  responseTime: '145ms',
  errorRate: '0.2%',
  activeUsers: 1247,
  lastUpdated: new Date().toISOString(),
};

module.exports = {
  MONTHS,
  monthData,
  fyData,
  fiveYearData,
  leadOutcomesData,
  monthlyTrendData,
  civilDefenceData,
  leadSubTypesData,
  domainWinLossData,
  top10CustomersData,
  lostLeadsTableData,
  systemMetrics,
};
