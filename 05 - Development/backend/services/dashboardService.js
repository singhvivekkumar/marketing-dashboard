/**
 * Dashboard Service
 * Handles month-to-month and fiscal year data
 */
import { Sequelize } from "sequelize";
import db from "../models/index.js";

const domesticLeadsModel = db.DomesticLeadsModel;
const exportLeadsModel = db.ExportLeadsModel;
const orderReceivedModel = db.MarketingOrderReceivedDomExp;

const MONTHS = [
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
  "Jan",
  "Feb",
  "Mar",
];

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
  2026: { queue: 42, orders: 128, value: "₹247", bq: 67, wr: "34%", lost: 38 },
  2025: { queue: 35, orders: 105, value: "₹208", bq: 58, wr: "31%", lost: 33 },
  2024: { queue: 28, orders: 92, value: "₹182", bq: 52, wr: "38%", lost: 28 },
  2023: { queue: 22, orders: 82, value: "₹162", bq: 45, wr: "29%", lost: 31 },
  2022: { queue: 18, orders: 75, value: "₹148", bq: 38, wr: "27%", lost: 26 },
};

class DashboardService {
  constructor() {
    // Call the async function to fetch the leads
    this.initializeLeads();
  }
  async initializeLeads() {
    try {
      const [domesticLeads, exportLeads, orderReceivedData] = await Promise.all(
        [
          domesticLeadsModel.findAll({
            // where: {
            //   tenderDated: {
            //     [Sequelize.Op.like]: `%${fy}%`,
            //   },
            // },
          }),
          exportLeadsModel.findAll({
            // where: {
            //   tenderDated: {
            //     [Sequelize.Op.like]: `%${fy}%`,
            //   },
            // },
          }),
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
  // Get month data with FY filter
  getMonthData(fy = "2026") {
    return monthlyData.map((item, index) => ({
      month: MONTHS[index],
      ...item,
      fy,
    }));
  }

  // Get monthly data with months
  getMonthsWithData(fy = "2026") {
    return {
      months: MONTHS,
      data: this.getMonthData(fy),
    };
  }

  // Get fiscal year summary
  async getFYSummary(fy = "2025") {
    try {
      // Fetch all domestic and export leads for the given fiscal year
      // const [domesticLeads, exportLeads] = await Promise.all([
      //   domesticLeadsModel.findAll({
      //     // where: {
      //     //   tenderDated: {
      //     //     [Sequelize.Op.like]: `%${fy}%`,
      //     //   },
      //     // },
      //   }),
      //   exportLeadsModel.findAll({
      //     // where: {
      //     //   tenderDated: {
      //     //     [Sequelize.Op.like]: `%${fy}%`,
      //     //   },
      //     // },
      //   }),
      // ]);

      // Combine both lead arrays into a single array
      const allLeadsArray = [...this.domesticLeads, ...this.exportLeads];
      const totalAnalysedLeads = allLeadsArray.length;

      // Calculate metrics using reduce for efficiency
      const metrics = allLeadsArray.reduce(
        (acc, lead) => {
          const status = lead.wonLostParticipated;

          switch (status) {
            case "Not-Participated":
              acc.notParticipated++;
              break;
            case "Pursuing":
              acc.pursuing++;
              break;
            case "Participated":
              acc.participated++;
              break;
            case "Participated-Pursuing":
              acc.participated++;
              acc.inEvaluation++;
              break;
            case "Participated-Won":
              acc.participated++;
              acc.won++;
              break;
            case "Participated-Lost":
              acc.participated++;
              acc.lost++;
              break;
            case "In-Evaluation":
              acc.inEvaluation++;
              break;
            default:
              // Handle any unexpected status values
              break;
          }

          return acc;
        },
        {
          notParticipated: 0,
          pursuing: 0,
          participated: 0,
          won: 0,
          lost: 0,
          inEvaluation: 0,
        }
      );

      // Calculate the number of leads in evaluation
      // (assuming "In-Evaluation" is a separate status)
      // metrics.inEvaluation = allLeadsArray.filter(
      //   lead => lead.wonLostParticipated === "In-Evaluation"
      // ).length;

      return {
        totalAnalysedLeads,
        pursuingLeads: metrics.pursuing,
        participatedLeads: metrics.participated,
        notParticipatedLeads: metrics.notParticipated,
        wonLeads: metrics.won,
        lostLeads: metrics.lost,
        inEvaluationLeads: metrics.inEvaluation,
        // allLeadsArray,
      };
    } catch (error) {
      console.error("Error fetching fiscal year summary:", error);
      throw new Error(`Failed to retrieve fiscal year summary for ${fy}`);
    }
  }

  // Get all FY data
  getAllFYData() {
    return fiscalYearData;
  }

  // Get KPI cards data
  async getKPIs(fy = "2025") {
    const fyData = await this.getFYSummary(fy);
    return fyData;
  }

  // =============================================================================
  // 2. ORDERS — 5-YEAR HISTORY
  // GET /api/analytics/orders-5year
  // Returns: [{year, label, order_count, total_value_cr}] for last 5 FYs
  // =============================================================================
  async ordersReceived5year() {
    try {
      // Get order counts and values grouped by financial year (Apr–Mar)
      // const rows = await sequelize.query(`
      //   SELECT
      //     CASE
      //       WHEN EXTRACT(MONTH FROM order_received_date) >= 4
      //       THEN EXTRACT(YEAR FROM order_received_date)::INT
      //       ELSE EXTRACT(YEAR FROM order_received_date)::INT - 1
      //     END AS fy_start,
      //     COUNT(*) AS order_count,
      //     COALESCE(SUM(value_excl_gst_cr), 0) AS total_value_cr
      //   FROM orders_received
      //   WHERE is_deleted = FALSE
      //   GROUP BY fy_start
      //   ORDER BY fy_start DESC
      //   LIMIT 5
      // `, { type: QueryTypes.SELECT });
      const allOrderReceived = await orderReceivedModel.findAll();

      // Sort ascending (oldest first) and format labels
      // const sorted = allOrderReceived.reverse().map(r => ({
      //   year:         r.fy_start,
      //   label:        `FY ${String(r.fy_start).slice(2)}-${String(parseInt(r.fy_start) + 1).slice(2)}`,
      //   order_count:  parseInt(r.order_count),
      //   total_value_cr: parseFloat(r.total_value_cr).toFixed(2),
      // }));

      return allOrderReceived;
    } catch (err) {
      next(err);
    }
  }

  async getBusinessDomainAnalysis() {
    // const tenders = await this.TenderModel.findAll(); // Fetch all tenders

    const domainData = {}; // Object to store domain counts

    // tenders.forEach(tender => {
    //   const businessDomain = tender.businessDomain;

    //   if (!domainData[businessDomain]) {
    //     domainData[businessDomain] = { export: 0, domestic: 0 };
    //   }

    //   // Assuming you have logic to classify each tender as 'export' or 'domestic' based on some criteria.
    //   // Replace this with your actual logic.  For now, I'm assuming it's determined by the tenderName.
    //   if (tender.tenderName.includes('Export')) {
    //     domainData[businessDomain].export++;
    //   } else {
    //     domainData[businessDomain].domestic++;
    //   }
    // });

    this.domesticLeads.forEach((tender) => {
      const businessDomain = tender.businessDomain;

      if (!domainData[businessDomain]) {
        domainData[businessDomain] = { export: 0, domestic: 0 };
      }

      domainData[businessDomain].domestic++;
    });

    this.exportLeads.forEach((tender) => {
      const businessDomain = tender.businessDomain;

      if (!domainData[businessDomain]) {
        domainData[businessDomain] = { export: 0, domestic: 0 };
      }

      domainData[businessDomain].export++;
    });

    const result = [];
    for (const domain in domainData) {
      result.push({
        domain: domain,
        export: domainData[domain].export,
        domestic: domainData[domain].domestic,
      });
    }

    console.log("getBusinessDomainAnalysis : ", result);
    return result;
  }

  async getTenderTypeCount() {
    try {
      // Fetch all tenders from the database
      // const tenders = await this.Tender.findAll();

      // Count occurrences of each tenderType
      const tenderTypeCounts = this.domesticLeads.reduce((acc, tender) => {
        const tenderType = tender.tenderType;
        if (tenderType) {
          acc[tenderType] = (acc[tenderType] || 0) + 1;
        }
        return acc;
      }, {});

      // Define color mapping for tender types
      const colorMapping = {
        ST: "#2563eb",
        LT: "#d97706",
        MT: "#0d9488",
      };

      // Format the results
      const result = Object.entries(tenderTypeCounts).map(([name, value]) => ({
        name,
        value,
        color: colorMapping[name] || "#606060", // Default color if not mapped
      }));

      return result;
    } catch (error) {
      console.error("Error fetching tender types:", error);
      throw error;
    }
  }

  async getTopCustomers() {
    try {
      const orders = this.orderReceivedData;
  
      const customerMap = {};
  
      orders.forEach((order) => {
        const customer = order.customerName || "Unknown";
        const value = parseFloat(order.valueWithGST) || 0;
  
        if (!customerMap[customer]) {
          customerMap[customer] = 0;
        }
  
        customerMap[customer] += value;
      });
  
      const result = Object.entries(customerMap)
        .map(([name, value]) => ({
          name,
          value: Math.round(value),
        }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 10);
  
      return result;
    } catch (err) {
      console.error(err);
      return [];
    }
  }
  
}

export default new DashboardService();
