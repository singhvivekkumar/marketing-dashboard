import db from "../models/index.js";

const BQ = db.BudgetaryQuotationModel;
const Domestic = db.DomesticLeadsModel;
const Export = db.ExportLeadsModel;
const Orders = db.MarketingOrderReceivedDomExp;
const Lost = db.LostFormModel;
const Submitted = db.LeadSubmittedModel;

class AnalysisService {
  // ==============================
  // 1. BQ CONVERSION FUNNEL
  // ==============================
  async getBQConversionFunnel() {
    const bqs = await BQ.findAll();
    const leads = [...(await Domestic.findAll()), ...(await Export.findAll())];
    const orders = await Orders.findAll();

    return [
      { stage: "BQs", count: bqs.length },
      { stage: "Leads", count: leads.length },
      { stage: "Orders", count: orders.length },
    ];
  }

  // ==============================
  // 2. ORDER VALUE DISTRIBUTION
  // ==============================
  async getOrderValueDistribution() {
    const orders = await Orders.findAll();

    const bands = {
      "<10": 0,
      "10-50": 0,
      "50-100": 0,
      "100+": 0,
    };

    orders.forEach((order) => {
      const val = parseFloat(order.valueWithGST) || 0;

      if (val < 10) bands["<10"]++;
      else if (val < 50) bands["10-50"]++;
      else if (val < 100) bands["50-100"]++;
      else bands["100+"]++;
    });

    return Object.entries(bands).map(([band, value]) => ({
      band,
      value,
    }));
  }

  // ==============================
  // 3. QUARTERLY ORDERS
  // ==============================
  // async getQuarterlyOrders() {
  //   const orders = await Orders.findAll();

  //   function getFiscalYear(dateStr) {
  //     const date = new Date(dateStr);
  //     const year = date.getFullYear();
  //     const month = date.getMonth(); // 0-based (0-11)

  //     // In India, fiscal year runs from April to March
  //     // So if month is March (2) or earlier, it's previous year's fiscal year
  //     if (month <= 2) {
  //       return `FY ${year - 1}-${year}`;
  //     } else {
  //       return `FY ${year}-${year + 1}`;
  //     }
  //   }

  //   const quarters = { Q1: 0, Q2: 0, Q3: 0, Q4: 0 };

  //   orders.forEach((order) => {
  //     // Get fiscal year for this order
  //     const fy = getFiscalYear(order.orderRxdDate);
  //     const date = new Date(order.orderRxdDate);
  //     const month = date.getMonth() + 1;
  //     console.log(fy);
  //     if (fy === "FY 2025-2026") {
  //       if (month >= 4 && month <= 6) quarters.Q1++;
  //       else if (month <= 9) quarters.Q2++;
  //       else if (month <= 12) quarters.Q3++;
  //       else quarters.Q4++;
  //     }
  //     if (fy === "FY 2024-2025") {
  //       if (month >= 4 && month <= 6) quarters.Q1++;
  //       else if (month <= 9) quarters.Q2++;
  //       else if (month <= 12) quarters.Q3++;
  //       else quarters.Q4++;
  //     }
  //   });

  //   return Object.entries(quarters).map(([quarter, value]) => ({
  //     quarter,
  //     "FY 25-26": value,
  //   }));
  // }
  async getQuarterlyOrders() {
    const orders = await Orders.findAll();
    const today = new Date(); // In 2026, this identifies FY 25-26
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
  
    // 1. Dynamically determine what "Current" and "Previous" FY strings are
    let currStart;
    if (currentMonth >= 3) { // April or later
      currStart = currentYear;
    } else { // Jan, Feb, March
      currStart = currentYear - 1;
    }
  
    const fyCurrent = `FY ${currStart % 100}-${(currStart + 1) % 100}`;
    const fyPrevious = `FY ${(currStart - 1) % 100}-${currStart % 100}`;
  
    // 2. Initialize results with ONLY these two keys
    const results = [
      { quarter: 'Q1', [fyCurrent]: 0, [fyPrevious]: 0 },
      { quarter: 'Q2', [fyCurrent]: 0, [fyPrevious]: 0 },
      { quarter: 'Q3', [fyCurrent]: 0, [fyPrevious]: 0 },
      { quarter: 'Q4', [fyCurrent]: 0, [fyPrevious]: 0 },
    ];
  
    orders.forEach((row) => {
      const date = new Date(row.orderRxdDate);
      const month = date.getMonth();
      const year = date.getFullYear();
  
      let rowFY = "";
      let qIndex = 0;
  
      // Determine Fiscal Year of the specific row
      if (month >= 3) {
        rowFY = `FY ${year % 100}-${(year + 1) % 100}`;
        qIndex = Math.floor((month - 3) / 3);
      } else {
        rowFY = `FY ${(year - 1) % 100}-${year % 100}`;
        qIndex = 3; // Q4
      }
  
      // 3. STRICT FILTER: Only increment if it matches Current or Previous FY
      if (rowFY === fyCurrent || rowFY === fyPrevious) {
        results[qIndex][rowFY]++;
      }
    });
  
    return results;
  };
  

  // ==============================
  // 4. TENDER TYPE BREAKDOWN
  // ==============================
  async getDocumentTypeBreakdown() {
    const leads = [...(await Domestic.findAll()), ...(await Export.findAll())];

    const map = {};

    leads.forEach((l) => {
      const type = l.tenderType || "Unknown";
      map[type] = (map[type] || 0) + 1;
    });

    return Object.entries(map).map(([name, value]) => ({
      name,
      value,
    }));
  }

  //  async getDocumentTypeCounts() {
  //       try {
  //           // Fetch all tenders from the database
  //           const tenders = await this.Tender.findAll();

  //           // Count occurrences of each documentType
  //           const documentTypeCounts = tenders.reduce((acc, tender) => {
  //               const docType = tender.documentType;
  //               if (docType) {
  //                   acc[docType] = (acc[docType] || 0) + 1;
  //               }
  //               return acc;
  //           }, {});

  //           // Define color mapping for document types
  //           const colorMapping = {
  //               'RFP': '#2563eb',
  //               'RFQ': '#0d9488',
  //               'RFI': '#7c3aed',
  //               'NIT': '#d97706'
  //           };

  //           // Format the results
  //           const result = Object.entries(documentTypeCounts).map(([name, value]) => ({
  //               name,
  //               value,
  //               color: colorMapping[name] || '#606060' // Default color if not mapped
  //           }));

  //           return result;
  //       } catch (error) {
  //           console.error('Error fetching document types:', error);
  //           throw error;
  //       }
  //   }


  // ==============================
  // 5. OWNER PERFORMANCE (WON VALUE)
  // ==============================
  async getOwnerPerformance() {
    const leads = [...(await Domestic.findAll()), ...(await Export.findAll())];

    const map = {};

    leads.forEach((l) => {
      if (l.wonLostParticipated === "Participated-Won") {
        const owner = l.leadOwner || "Unknown";
        const val = parseFloat(l.orderWonValueInCrWithoutGST) || 0;

        if (!map[owner]) map[owner] = 0;
        map[owner] += val;
      }
    });

    return Object.entries(map).map(([owner, value]) => ({
      owner,
      value: Math.round(value),
    }));
  }

  async getAnalysisKPIs() {
    const bqs = await db.BudgetaryQuotationModel.findAll();
    const domestic = await db.DomesticLeadsModel.findAll();
    const exportL = await db.ExportLeadsModel.findAll();
    const orders = await db.MarketingOrderReceivedDomExp.findAll();

    const allLeads = [...domestic, ...exportL];

    // =========================
    // 1. AVG DEAL SIZE
    // =========================
    let totalOrderValue = 0;

    orders.forEach((o) => {
      totalOrderValue += parseFloat(o.valueWithGST) || 0;
    });

    const avgDealSize = orders.length
      ? (totalOrderValue / orders.length).toFixed(1)
      : 0;

    // =========================
    // 2. BQ CONVERSION %
    // =========================
    const conversion = bqs.length
      ? ((orders.length / bqs.length) * 100).toFixed(1)
      : 0;

    // =========================
    // 3. PIPELINE VALUE (OPEN LEADS)
    // =========================
    let pipelineValue = 0;

    allLeads.forEach((l) => {
      if (l.openClosed === "Open") {
        pipelineValue += parseFloat(l.estimatedValueInCrWithoutGST) || 0;
      }
    });

    // =========================
    // 4. AVG LEAD AGE
    // =========================
    const today = new Date();
    let totalDays = 0;
    let count = 0;

    allLeads.forEach((l) => {
      if (l.tenderDated) {
        const leadDate = new Date(l.tenderDated);
        const diff = (today - leadDate) / (1000 * 60 * 60 * 24);

        totalDays += diff;
        count++;
      }
    });

    const avgLeadAge = count ? Math.round(totalDays / count) : 0;

    // =========================
    // 5. EXPORT LEADS COUNT
    // =========================
    const exportCount = exportL.length;

    // =========================
    // 6. SOLE BIDDING %
    // =========================
    let soleCount = 0;

    allLeads.forEach((l) => {
      if (l.soleOrConsortium === "Sole") soleCount++;
    });

    const solePercent = allLeads.length
      ? ((soleCount / allLeads.length) * 100).toFixed(1)
      : 0;

    return {
      avgDealSize,
      conversion,
      pipelineValue: Math.round(pipelineValue),
      avgLeadAge,
      exportCount,
      solePercent,
    };
  }
}

export default new AnalysisService();
