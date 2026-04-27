// BQ Stage pipeline — 6 stages
export const BQ_STAGES = [
  'Scope of Work Study',
  'Feasibility Study',
  'Technical Proposal',
  'Tech Head Approval',
  'FLM / Finance Approval',
  'BQ Submitted',
]

export const BQ_STATUS_OPTIONS = [
  'Draft',
  'Scope Study',
  'Feasibility',
  'Technical Proposal',
  'Tech Head Approval',
  'Finance Approval',
  'Submitted',
  'Revised',
  'Won',
  'Lost',
]

export const COMPETITOR_TYPES = ['Indian Private', 'Indian PSU', 'Foreign OEM', 'JV / Consortium']

// Linked to mockLeads — only "Go Decision" or "Passed" leads appear here
export const mockBQs = [
  {
    id: 'BQ-2526-009',
    leadRef: 'L-2526-001',
    projectName: 'Radar Integration System',
    customer: 'Bharat Electronics Limited',
    customerShort: 'BEL',
    customerType: 'Internal',        // Internal (govt PSU) or External
    contactPerson: 'Shri R.P. Nair, GM (Projects)',
    contactEmail: 'rpnair@bel.co.in',
    domain: 'Electronics & Systems',
    sector: 'Defence',
    market: 'Domestic',
    owner: 'Ravi Kumar',
    status: 'Tech Head Approval',
    currentStage: 3,                 // 0-indexed

    // BQ financial details
    estimatedValueExGST: 95.50,
    gstPercent: 18,
    estimatedValueIncGST: 112.69,
    currency: 'INR',

    // Key dates
    rfqDate: '2026-04-10',           // when RFQ was received
    createdDate: '2026-04-12',
    submissionDate: '2026-04-30',    // original due date
    extendedDate: '',                // if extended
    letterDate: '2026-04-28',        // date of letter/covering note

    remarks: 'BQ for AESA Radar integration with CMS. Technical team has validated scope. Proposal covers supply, integration, testing, and commissioning. Validity: 90 days from submission.',

    // Scope of work summary
    scopeSummary: 'Supply of 4 units AESA Radar sub-assembly, integration with existing Combat Management System, factory acceptance testing (FAT), site acceptance testing (SAT), and documentation. Warranty: 24 months.',

    // Technical proposal details
    techProposal: {
      preparedBy: 'Amit Shah',
      reviewedBy: 'Dr. A. Bhatt, GM',
      approvedBy: '',
      submittedDate: '2026-04-20',
      remarks: 'Proposed solution uses our in-house AESA module (Model: AXAR-7). Integration timeline: 14 months. FAT/SAT: 2 months.',
    },

    // Approvals
    approvals: [
      { level: 'Tech Head', role: 'GM — Electronics', name: 'Dr. A. Bhatt', status: 'Pending', date: null },
      { level: 'FLM / Finance', role: 'Finance Head', name: 'Shri P. Kulkarni, CFO', status: 'Not Started', date: null },
      { level: 'BD Head', role: 'VP — Business Development', name: 'Ms. Priya Nair', status: 'Not Started', date: null },
    ],

    competitors: [
      { name: 'ECIL', type: 'Indian PSU', estimatedBid: 88.00, strengths: 'Strong customer relationship, prior work with BEL', weaknesses: 'Limited AESA experience', likelyL1: false },
      { name: 'Astra Microwave', type: 'Indian Private', estimatedBid: 102.00, strengths: 'Good RF capability', weaknesses: 'Higher price band', likelyL1: false },
      { name: 'Thales India JV', type: 'JV / Consortium', estimatedBid: 140.00, strengths: 'Technology leader', weaknesses: 'Expensive, offset compliance issues', likelyL1: false },
    ],

    auditLog: [
      { timestamp: '20 Apr 2026, 11:00', user: 'Amit Shah',   action: 'Technical Proposal prepared and submitted for Tech Head review.' },
      { timestamp: '17 Apr 2026, 14:30', user: 'Ravi Kumar',  action: 'Feasibility Study completed. Marked Feasible. Stage moved to Technical Proposal.' },
      { timestamp: '14 Apr 2026, 09:15', user: 'Ravi Kumar',  action: 'Scope of Work study initiated. Lead L-2526-001 data fetched.' },
      { timestamp: '12 Apr 2026, 10:00', user: 'Ravi Kumar',  action: 'BQ created against Lead L-2526-001.' },
    ],
  },
  {
    id: 'BQ-2526-008',
    leadRef: 'L-2526-004',
    projectName: 'Naval IRST Export — UK MoD',
    customer: 'UK Ministry of Defence',
    customerShort: 'UK MoD',
    customerType: 'External',
    contactPerson: 'Wg. Cdr. James Hartley',
    contactEmail: 'jhartley@mod.gov.uk',
    domain: 'Optronics',
    sector: 'Defence',
    market: 'Export',
    owner: 'Ravi Kumar',
    status: 'Submitted',
    currentStage: 5,

    estimatedValueExGST: 241.00,
    gstPercent: 0,                   // Export — zero-rated
    estimatedValueIncGST: 241.00,
    currency: 'GBP',

    rfqDate: '2026-03-22',
    createdDate: '2026-03-25',
    submissionDate: '2026-04-15',
    extendedDate: '2026-04-22',
    letterDate: '2026-04-22',

    remarks: 'Export BQ for Naval IRST system. GST zero-rated for export. SCOMET classification applied. Validity: 120 days.',

    scopeSummary: 'Supply of Naval IRST (2 units), Type-45 integration kit, technical documentation, training programme (2 weeks), and 3-year product support. DDP terms, UK delivery.',

    techProposal: {
      preparedBy: 'Sunita Menon',
      reviewedBy: 'Dr. A. Bhatt, GM',
      approvedBy: 'Dr. A. Bhatt, GM',
      submittedDate: '2026-04-10',
      remarks: 'Proposed NIRST-MK2 system. Validated for sea-state 6 conditions. Integration tested at DSTL facility.',
    },

    approvals: [
      { level: 'Tech Head', role: 'GM — Optronics', name: 'Dr. A. Bhatt', status: 'Approved', date: '12 Apr 2026' },
      { level: 'FLM / Finance', role: 'Finance Head', name: 'Shri P. Kulkarni, CFO', status: 'Approved', date: '18 Apr 2026' },
      { level: 'BD Head', role: 'VP — Business Development', name: 'Ms. Priya Nair', status: 'Approved', date: '20 Apr 2026' },
    ],

    competitors: [
      { name: 'Safran', type: 'Foreign OEM', estimatedBid: 290.00, strengths: 'Market leader in IRST', weaknesses: 'High cost, geopolitical', likelyL1: false },
      { name: 'FLIR / Teledyne', type: 'Foreign OEM', estimatedBid: 260.00, strengths: 'Proven naval record', weaknesses: 'US ITAR restrictions', likelyL1: false },
    ],

    auditLog: [
      { timestamp: '22 Apr 2026, 16:00', user: 'Ravi Kumar',   action: 'BQ submitted to UK MoD via official channel. Letter dated 22 Apr 2026.' },
      { timestamp: '20 Apr 2026, 11:30', user: 'Priya Nair',   action: 'BD Head approval granted. BQ cleared for submission.' },
      { timestamp: '18 Apr 2026, 09:00', user: 'P. Kulkarni',  action: 'Finance (FLM) approval granted.' },
      { timestamp: '12 Apr 2026, 15:00', user: 'Dr. A. Bhatt', action: 'Tech Head approval granted. Proposal signed off.' },
      { timestamp: '10 Apr 2026, 10:00', user: 'Sunita Menon', action: 'Technical Proposal completed and submitted for approval.' },
      { timestamp: '25 Mar 2026, 09:00', user: 'Ravi Kumar',   action: 'BQ created against Lead L-2526-004.' },
    ],
  },
  {
    id: 'BQ-2526-007',
    leadRef: 'L-2526-003',
    projectName: 'Comms System Upgrade — Army',
    customer: 'Hindustan Aeronautics Limited',
    customerShort: 'HAL',
    customerType: 'Internal',
    contactPerson: 'Gp. Capt. (Retd.) A. Tiwari',
    contactEmail: 'atiwari@hal-india.co.in',
    domain: 'Communications',
    sector: 'Defence',
    market: 'Domestic',
    owner: 'Amit Shah',
    status: 'Feasibility',
    currentStage: 1,

    estimatedValueExGST: 52.00,
    gstPercent: 18,
    estimatedValueIncGST: 61.36,
    currency: 'INR',

    rfqDate: '2026-04-01',
    createdDate: '2026-04-03',
    submissionDate: '2026-05-10',
    extendedDate: '',
    letterDate: '',

    remarks: 'Early stage BQ for tactical comms upgrade. Feasibility study in progress by technical team.',

    scopeSummary: '',

    techProposal: {
      preparedBy: '',
      reviewedBy: '',
      approvedBy: '',
      submittedDate: '',
      remarks: '',
    },

    approvals: [
      { level: 'Tech Head', role: 'GM — Communications', name: 'Shri D. Patil, DGM', status: 'Not Started', date: null },
      { level: 'FLM / Finance', role: 'Finance Head', name: 'Shri P. Kulkarni, CFO', status: 'Not Started', date: null },
      { level: 'BD Head', role: 'VP — Business Development', name: 'Ms. Priya Nair', status: 'Not Started', date: null },
    ],

    competitors: [],

    auditLog: [
      { timestamp: '03 Apr 2026, 11:00', user: 'Amit Shah', action: 'BQ created against Lead L-2526-003. Scope of Work study started.' },
      { timestamp: '03 Apr 2026, 14:00', user: 'Amit Shah', action: 'Stage moved to Feasibility Study. Technical team assigned.' },
    ],
  },
]
