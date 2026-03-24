/**
 * Pipeline Service
 * Handles pipeline status, upcoming deadlines, and pipeline value data
 */

const pipelineData = {
  pipelineStatus: [
    { stage: 'Identified', count: 12 },
    { stage: 'In Prep', count: 9 },
    { stage: 'Submitted', count: 11 },
    { stage: 'Eval.', count: 6 },
    { stage: 'Pre-bid', count: 4 },
  ],

  pipelineDomain: [
    { domain: 'Radar', Civil: 18, Defence: 45 },
    { domain: 'Telecom', Civil: 24, Defence: 18 },
    { domain: 'CCTV', Civil: 32, Defence: 12 },
    { domain: 'Comms', Civil: 14, Defence: 28 },
    { domain: 'Power', Civil: 8, Defence: 10 },
  ],

  upcomingDeadlines: [
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
  ],
};

class PipelineService {
  // Get pipeline status (stages)
  getPipelineStatus() {
    return pipelineData.pipelineStatus;
  }

  // Get pipeline value by domain
  getPipelineDomain(domain = null) {
    if (!domain) return pipelineData.pipelineDomain;

    const domainData = pipelineData.pipelineDomain.find(d => d.domain === domain);
    return domainData || null;
  }

  // Get upcoming deadlines
  getUpcomingDeadlines(days = null, status = null) {
    let deadlines = pipelineData.upcomingDeadlines;

    if (status) {
      deadlines = deadlines.filter(d => d.status === status);
    }

    return deadlines;
  }

  // Get deadline by ID
  getDeadlineById(id) {
    const deadline = pipelineData.upcomingDeadlines.find(d => d.id === parseInt(id));
    if (!deadline) {
      throw new Error(`Deadline with ID ${id} not found`);
    }
    return deadline;
  }

  // Get KPI pipeline
  getKPIPipeline() {
    return {
      openLeads: 42,
      preBidPending: 8,
      submissionsDue: 5,
      corrigendums: 12,
      consortiumDeals: 11,
      expectedWin: '₹98',
    };
  }

  // Get summary
  getSummary() {
    const totalPipeline = pipelineData.pipelineStatus.reduce((sum, s) => sum + s.count, 0);
    const totalDeadlines = pipelineData.upcomingDeadlines.length;

    return {
      totalOpenLeads: totalPipeline,
      upcomingDeadlines: totalDeadlines,
      stages: pipelineData.pipelineStatus.length,
    };
  }
}

module.exports = new PipelineService();
