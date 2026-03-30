/**
 * Pipeline Service
 * Handles pipeline status, upcoming deadlines, and pipeline value data
 */

import db from "../models/index.js";

const domesticLeadsModel = db.DomesticLeadsModel;
const exportLeadsModel = db.ExportLeadsModel;
const orderReceivedModel = db.MarketingOrderReceivedDomExp;

const pipelineData = {
  pipelineStatus: [
    { stage: "Identified", count: 12 },
    { stage: "In Prep", count: 9 },
    { stage: "Submitted", count: 11 },
    { stage: "Eval.", count: 6 },
    { stage: "Pre-bid", count: 4 },
  ],

  pipelineDomain: [
    { domain: "Radar", Civil: 18, Defence: 45 },
    { domain: "Telecom", Civil: 24, Defence: 18 },
    { domain: "CCTV", Civil: 32, Defence: 12 },
    { domain: "Comms", Civil: 14, Defence: 28 },
    { domain: "Power", Civil: 8, Defence: 10 },
  ],

  upcomingDeadlines: [
    {
      id: 1,
      tenderName: "Army Comms Upgrade",
      customer: "MoD",
      type: "Open",
      value: "₹92.00",
      deadline: "22 Mar '26",
      owner: "Rajan K",
      status: "In progress",
    },
    {
      id: 2,
      tenderName: "Highway Surveillance",
      customer: "NHAI",
      type: "Limited",
      value: "₹28.50",
      deadline: "28 Mar '26",
      owner: "Priya S",
      status: "Pending docs",
    },
    {
      id: 3,
      tenderName: "Port Radar System",
      customer: "Paradip Port",
      type: "Open",
      value: "₹41.20",
      deadline: "05 Apr '26",
      owner: "Anil M",
      status: "In progress",
    },
    {
      id: 4,
      tenderName: "Airbase CCTV Upgrade",
      customer: "IAI",
      type: "Single Source",
      value: "₹15.80",
      deadline: "10 Apr '26",
      owner: "Rajan K",
      status: "Draft ready",
    },
  ],
};

class PipelineService {
  constructor() {
    // Call the async function to fetch the leads
    this.initializeLeads();
  }
  async initializeLeads() {
    try {
      const [domesticLeads, exportLeads, orderReceivedData] = await Promise.all(
        [
          domesticLeadsModel.findAll(),
          exportLeadsModel.findAll(),
          orderReceivedModel.findAll(),
        ]
      );

      // Store the leads as properties of the class
      this.domesticLeads = domesticLeads;
      this.exportLeads = exportLeads;
      this.orderReceivedData = orderReceivedData;
    } catch (error) {
      console.error("Error fetching leads:", error);
      // Handle the error appropriately (e.g., log it, throw it, set default values)
      this.domesticLeads = []; // set as empty array to avoid error in other methods
      this.exportLeads = [];
      this.orderReceivedData = [];
    }
  }


  async getPipelineStatus() {
    const tenders = [...this.domesticLeads, ...this.exportLeads];
  
    const statusMap = {};
  
    tenders.forEach((tender) => {
      // Only OPEN leads
      if (tender.openClosed?.toLowerCase() !== "open") return;
  
      const status = tender.presentStatus || "Unknown";
  
      if (!statusMap[status]) {
        statusMap[status] = 0;
      }
  
      statusMap[status]++;
    });
  
    // Convert to chart format
    return Object.entries(statusMap).map(([stage, count]) => ({
      stage,
      count,
    }));
  }


  async getPipelineDomain() {
    const tenders = [...this.domesticLeads, ...this.exportLeads];
  
    const domainMap = {};
  
    tenders.forEach((tender) => {
      // Only OPEN leads
      if (tender.openClosed?.toLowerCase() !== "open") return;
  
      const domain = tender.businessDomain || "Unknown";
  
      if (!domainMap[domain]) {
        domainMap[domain] = {
          Civil: 0,
          Defence: 0,
        };
      }
  
      const value = parseFloat(tender.estimatedValueInCrWithoutGST) || 0;
  
      // Split Civil vs Defence
      if (tender.defenceOrNonDefence?.toLowerCase() === "defence") {
        domainMap[domain].Defence += value;
      } else {
        domainMap[domain].Civil += value;
      }
    });
  
    // Convert to chart format
    return Object.entries(domainMap).map(([domain, values]) => ({
      domain,
      Civil: Number(values.Civil.toFixed(2)),
      Defence: Number(values.Defence.toFixed(2)),
    }));
  }
  

  // Get pipeline status (stages)
  getPipelineStatus() {
    return pipelineData.pipelineStatus;
  }

  // Get pipeline value by domain
  getPipelineDomain(domain = null) {
    if (!domain) return pipelineData.pipelineDomain;

    const domainData = pipelineData.pipelineDomain.find(
      (d) => d.domain === domain
    );
    return domainData || null;
  }

  // Get upcoming deadlines
  // getUpcomingDeadlines(days = null, status = null) {
  //   let deadlines = pipelineData.upcomingDeadlines;

  //   if (status) {
  //     deadlines = deadlines.filter((d) => d.status === status);
  //   }

  //   return deadlines;
  // }
  async getUpcomingSubmissions() {
    try {
        // Fetch all tenders from the database
        const tenders = [...this.domesticLeads, ...this.exportLeads];

        // Current date for comparison
        const currentDate = new Date();
        const thirtyDaysFromNow = new Date();
        thirtyDaysFromNow.setDate(currentDate.getDate() + 30);

        // Initialize the result array
        const result = [];

        // Process each tender
        tenders.forEach((tender, index) => {
            // Check if the tender is open
            if (tender.openClosed !== 'Open') return;

            // Check if lastDateOfSub is within the next 30 days
            const lastSubDate = new Date(tender.lastDateOfSub);
            if (lastSubDate > thirtyDaysFromNow) return;
            if (lastSubDate < currentDate) return;

            // Check if prebidMeetingDateTime is after today
            const prebidDate = new Date(tender.prebidMeetingDateTime);
            if (prebidDate <= currentDate) return;

            // Extract and format the required information
            const formattedTender = {
                id: index + 1,
                tenderName: tender.tenderName,
                customer: tender.customerName,
                type: tender.tenderType,
                value: `₹${parseFloat(tender.valueWithGST).toFixed(2)}`,
                deadline: `${lastSubDate.getDate()} ${lastSubDate.toLocaleString('default', { month: 'short' })} '${lastSubDate.getFullYear() % 100}`,
                owner: tender.leadOwner,
                status: tender.presentStatus
            };

            result.push(formattedTender);
        });

        return result;
    } catch (error) {
        console.error('Error fetching upcoming submissions:', error);
        throw error;
    }
}

  // Get deadline by ID
  getDeadlineById(id) {
    const deadline = pipelineData.upcomingDeadlines.find(
      (d) => d.id === parseInt(id)
    );
    if (!deadline) {
      throw new Error(`Deadline with ID ${id} not found`);
    }
    return deadline;
  }

    // 🔥 MAIN KPI FUNCTION (DB BASED)
    async getKPIPipeline() {
      const tenders = [...this.domesticLeads, ...this.exportLeads];
  
      const currentDate = new Date();
  
      let openLeads = 0;
      let prebidPending = 0;
      let submissionsDue = 0;
      let corrigendums = 0;
      let consortiumDeals = 0;
      let expectedWin = 0;
  
      tenders.forEach((tender) => {
        // ✅ Open Leads
        if (tender.openClosed?.toLowerCase() === "open") {
          openLeads++;
        }
  
        // ✅ Pre-bid Pending
        if (tender.prebidMeetingDateTime) {
          const prebidDate = new Date(tender.prebidMeetingDateTime);
          if (!isNaN(prebidDate) && prebidDate > currentDate) {
            prebidPending++;
          }
        }
  
        // ✅ Submissions Due
        if (tender.lastDateOfSub) {
          const subDate = new Date(tender.lastDateOfSub);
          if (!isNaN(subDate) && subDate > currentDate) {
            submissionsDue++;
          }
        }
  
        // ✅ Corrigendums
        if (tender.corrigendumsDateFile && tender.corrigendumsDateFile !== "") {
          corrigendums++;
        }
  
        // ✅ Consortium Deals
        if (tender.soleOrConsortium?.toLowerCase() === "consortium") {
          consortiumDeals++;
        }
  
        // ✅ Expected Win (Cr)
        if (tender.estimatedValueInCrWithoutGST) {
          const value = parseFloat(tender.estimatedValueInCrWithoutGST);
          if (!isNaN(value)) {
            expectedWin += value;
          }
        }
      });
  
      // 🔥 FORMAT EXACTLY FOR YOUR KPI GRID
      return [
        {
          label: "Open Leads",
          value: openLeads,
          delta: "Across 5 stages",
          deltaType: "neutral",
        },
        {
          label: "Pre-bid Pending",
          value: prebidPending,
          delta: "This month",
          deltaType: "neutral",
        },
        {
          label: "Submissions Due",
          value: submissionsDue,
          delta: "Next 7 days",
          deltaType: "down",
        },
        {
          label: "Corrigendums",
          value: corrigendums,
          delta: "Active tenders",
          deltaType: "neutral",
        },
        {
          label: "Consortium Deals",
          value: consortiumDeals,
          delta: "+3 vs last FY",
          deltaType: "up",
        },
        {
          label: "Expected Win (Cr)",
          value: `₹${expectedWin.toFixed(2)}`,
          delta: "Weighted pipeline",
          deltaType: "up",
        },
      ];
    }  

  // Get KPI pipeline
  // getKPIPipeline() {
  //   return {
  //     openLeads: 42,
  //     preBidPending: 8,
  //     submissionsDue: 5,
  //     corrigendums: 12,
  //     consortiumDeals: 11,
  //     expectedWin: '₹98',
  //   };
  // }

  // async getKPIPipeline() {
  //   const tenders = [...this.domesticLeads, ...this.exportLeads];
  //   try {
  //     // Initialize metrics
  //     const metrics = {
  //       openLeads: 0,
  //       prebidPending: 0,
  //       submissionsDue: 0,
  //       corrigendums: 0,
  //       consortiumDeals: 0,
  //       expectedWin: 0,
  //     };

  //     // Current date for comparison
  //     const currentDate = new Date();

  //     // Process each tender
  //     tenders.forEach((tender) => {
  //       // Open Leads
  //       if (tender.openClosed === "Open") {
  //         metrics.openLeads++;
  //       }

  //       // Pre-bid Pending
  //       const prebidDate = new Date(tender.prebidMeetingDateTime);
  //       console.log("current time : ", prebidDate, " ---- ", currentDate);
  //       if (prebidDate > currentDate) {
  //         metrics.prebidPending++;
  //       }

  //       // Submissions Due
  //       const lastSubDate = new Date(tender.lastDateOfSub);
  //       if (lastSubDate > currentDate) {
  //         metrics.submissionsDue++;
  //       }

  //       // Corrigendums
  //       if (tender.corrigendumsDateFile) {
  //         metrics.corrigendums++;
  //       }

  //       // Consortium Deals
  //       if (tender.soleOrConsortium === "Consortium") {
  //         metrics.consortiumDeals++;
  //       }

  //       // Expected Win (Cr)
  //       if (tender.estimatedValueInCrWithoutGST) {
  //         metrics.expectedWin += parseFloat(
  //           tender.estimatedValueInCrWithoutGST
  //         );
  //       }
  //     });

  //     // Format the results
  //     const result = [
  //       {
  //         label: "Open Leads",
  //         value: metrics.openLeads,
  //         delta: "Across 5 stages",
  //         deltaType: "neutral",
  //       },
  //       {
  //         label: "Pre-bid Pending",
  //         value: metrics.prebidPending,
  //         delta: "This month",
  //         deltaType: "neutral",
  //       },
  //       {
  //         label: "Submissions Due",
  //         value: metrics.submissionsDue,
  //         delta: "Next 7 days",
  //         deltaType: "down",
  //       },
  //       {
  //         label: "Corrigendums",
  //         value: metrics.corrigendums,
  //         delta: "Active tenders",
  //         deltaType: "neutral",
  //       },
  //       {
  //         label: "Consortium Deals",
  //         value: metrics.consortiumDeals,
  //         delta: "+3 vs last FY",
  //         deltaType: "up",
  //       },
  //       {
  //         label: "Expected Win (Cr)",
  //         value: `₹${metrics.expectedWin.toFixed(2)}`,
  //         delta: "Weighted pipeline",
  //         deltaType: "up",
  //       },
  //     ];

  //     return result;
  //   } catch (error) {
  //     console.error("Error fetching dashboard metrics:", error);
  //     throw error;
  //   }
  // }

  // Get summary
  
  getSummary() {
    const totalPipeline = pipelineData.pipelineStatus.reduce(
      (sum, s) => sum + s.count,
      0
    );
    const totalDeadlines = pipelineData.upcomingDeadlines.length;

    return {
      totalOpenLeads: totalPipeline,
      upcomingDeadlines: totalDeadlines,
      stages: pipelineData.pipelineStatus.length,
    };
  }
}

export default new PipelineService();
