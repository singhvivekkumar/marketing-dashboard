// Mock data for the dashboard
export const MONTHS = ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'];

export const monthData = [
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

export const fyData = {
  '2026': { queue: 42, orders: 128, value: '₹247', bq: 67, wr: '34%', lost: 38 },
  '2025': { queue: 35, orders: 105, value: '₹208', bq: 58, wr: '31%', lost: 33 },
  '2024': { queue: 28, orders: 92, value: '₹182', bq: 52, wr: '38%', lost: 28 },
  '2023': { queue: 22, orders: 82, value: '₹162', bq: 45, wr: '29%', lost: 31 },
  '2022': { queue: 18, orders: 75, value: '₹148', bq: 38, wr: '27%', lost: 26 },
};

export const fiveYearData = [
  { fy: 'FY 21-22', orders: 75, value: 148 },
  { fy: 'FY 22-23', orders: 82, value: 162 },
  { fy: 'FY 23-24', orders: 92, value: 182 },
  { fy: 'FY 24-25', orders: 105, value: 208 },
  { fy: 'FY 25-26', orders: 128, value: 247 },
];

export const leadOutcomesData = [
  { name: 'Won', value: 34, color: '#16a34a' },
  { name: 'Lost', value: 22, color: '#dc2626' },
  { name: 'Participated', value: 30, color: '#2563eb' },
  { name: 'Not-Part.', value: 14, color: '#d97706' },
];

export const monthlyTrendData = [
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

export const civilDefenceData = [
  { category: 'Leads', Civil: 68, Defence: 44 },
  { category: 'Orders', Civil: 78, Defence: 50 },
  { category: 'BQs', Civil: 55, Defence: 30 },
];

export const leadSubTypesData = [
  { name: 'Submitted', value: 28, color: '#2563eb' },
  { name: 'Domestic', value: 35, color: '#0d9488' },
  { name: 'Export', value: 18, color: '#7c3aed' },
  { name: 'CRM Lead', value: 14, color: '#d97706' },
  { name: 'Lost Lead', value: 17, color: '#dc2626' },
];

export const domainWinLossData = [
  { domain: 'Radar', Won: 12, Lost: 5 },
  { domain: 'Telecom', Won: 8, Lost: 4 },
  { domain: 'CCTV', Won: 15, Lost: 7 },
  { domain: 'Comms', Won: 6, Lost: 3 },
  { domain: 'Power', Won: 5, Lost: 2 },
  { domain: 'IT', Won: 9, Lost: 4 },
];

export const top10CustomersData = [
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

export const lostLeadsTableData = [
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
];

export const bqConversionFunnelData = [
  { stage: 'BQs Submitted', count: 67 },
  { stage: 'Converted to Lead', count: 48 },
  { stage: 'Submitted to Tender', count: 38 },
  { stage: 'Won Order', count: 26 },
];

export const orderValueDistributionData = [
  { band: '<5 Cr', count: 12 },
  { band: '5–20 Cr', count: 38 },
  { band: '20–50 Cr', count: 45 },
  { band: '50–100 Cr', count: 25 },
  { band: '>100 Cr', count: 8 },
];

export const quarterlyData = [
  { quarter: 'Q1', 'FY 25-26': 24, 'FY 24-25': 20 },
  { quarter: 'Q2', 'FY 25-26': 29, 'FY 24-25': 24 },
  { quarter: 'Q3', 'FY 25-26': 33, 'FY 24-25': 28 },
  { quarter: 'Q4', 'FY 25-26': 42, 'FY 24-25': 33 },
];

export const tenderTypeData = [
  { name: 'Open', value: 38, color: '#2563eb' },
  { name: 'Limited', value: 22, color: '#0d9488' },
  { name: 'Single Source', value: 18, color: '#7c3aed' },
  { name: 'Nomination', value: 12, color: '#d97706' },
  { name: 'Rate Contract', value: 10, color: '#9ca3af' },
];

export const leadOwnerData = [
  { owner: 'Rajan K', value: 68 },
  { owner: 'Priya S', value: 52 },
  { owner: 'Anil M', value: 44 },
  { owner: 'Deepa R', value: 38 },
  { owner: 'Sanjay V', value: 28 },
];

export const pipelineStatusData = [
  { stage: 'Identified', count: 12 },
  { stage: 'In Prep', count: 9 },
  { stage: 'Submitted', count: 11 },
  { stage: 'Eval.', count: 6 },
  { stage: 'Pre-bid', count: 4 },
];

export const pipelineDomainData = [
  { domain: 'Radar', Civil: 18, Defence: 45 },
  { domain: 'Telecom', Civil: 24, Defence: 18 },
  { domain: 'CCTV', Civil: 32, Defence: 12 },
  { domain: 'Comms', Civil: 14, Defence: 28 },
  { domain: 'Power', Civil: 8, Defence: 10 },
];

export const upcomingDeadlinesData = [
  {
    id: 1,
    tenderName: 'Army Comms Upgrade',
    customer: 'MoD',
    type: 'Open',
    value: '₹92.00',
    deadline: '22 Mar \'26',
    owner: 'Rajan K',
    status: 'In progress',
  },
  {
    id: 2,
    tenderName: 'Highway Surveillance',
    customer: 'NHAI',
    type: 'Limited',
    value: '₹28.50',
    deadline: '28 Mar \'26',
    owner: 'Priya S',
    status: 'Pending docs',
  },
  {
    id: 3,
    tenderName: 'Port Radar System',
    customer: 'Paradip Port',
    type: 'Open',
    value: '₹41.20',
    deadline: '05 Apr \'26',
    owner: 'Anil M',
    status: 'In progress',
  },
  {
    id: 4,
    tenderName: 'Airbase CCTV Upgrade',
    customer: 'IAI',
    type: 'Single Source',
    value: '₹15.80',
    deadline: '10 Apr \'26',
    owner: 'Rajan K',
    status: 'Draft ready',
  },
];

export const yearlyValueData = [
  { fy: 'FY 21-22', value: 148 },
  { fy: 'FY 22-23', value: 162 },
  { fy: 'FY 23-24', value: 182 },
  { fy: 'FY 24-25', value: 208 },
  { fy: 'FY 25-26', value: 247 },
];

export const winRateTrendData = [
  { fy: 'FY 21-22', rate: 27 },
  { fy: 'FY 22-23', rate: 29 },
  { fy: 'FY 23-24', rate: 38 },
  { fy: 'FY 24-25', rate: 31 },
  { fy: 'FY 25-26', rate: 34 },
];

export const yearSummaryData = [
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
    growth: '+9.5%',
  },
  {
    id: 5,
    fy: 'FY 2021–22',
    bqs: 38,
    leads: 64,
    orders: 75,
    value: '₹148',
    winRate: '27%',
    lost: 26,
    growth: 'Baseline',
  },
];

export const monitoringData = {
  systemStatus: { label: 'System Status', value: 'Online', status: 'online', color: '#16a34a' },
  activeUsers: { label: 'Active Users', value: 7, status: 'Live' },
  recordsToday: { label: 'Records Today', value: 12, status: '+12' },
  docsUploaded: { label: 'Docs Uploaded', value: 5, status: 'Today' },
};

export const moduleUsageData = [
  { name: 'Lead Mgmt', value: 48, color: '#2563eb' },
  { name: 'Orders', value: 28, color: '#0d9488' },
  { name: 'BQ', value: 18, color: '#7c3aed' },
  { name: 'R&D', value: 6, color: '#d97706' },
];
