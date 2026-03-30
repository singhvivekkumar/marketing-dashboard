/**
 * Dashboard Controller
 * Handles requests for dashboard data: monthly data and fiscal year summaries
 */

import dashboardService from "../services/dashboardService.js"; // Note the .js extension

// Format response helper based on guide
const sendResponse = (res, data, message = "Operation successful") => {
  res.status(200).json({
    success: true,
    message,
    data,
    timestamp: new Date().toISOString(),
  });
};

class DashboardController {
  // GET /api/dashboard/month-data
  getMonthData(req, res) {
    try {
      const { fy } = req.query;
      const data = dashboardService.getMonthsWithData(fy);

      res.json({
        success: true,
        data,
        fy: fy || "2026",
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message,
      });
    }
  }

  // GET /api/dashboard/fy-summary
  getFYSummary(req, res) {
    try {
      const { fy = "2026" } = req.query;
      const data = dashboardService.getFYSummary(fy);

      res.json({
        success: true,
        data,
        fy,
      });
    } catch (error) {
      res.status(404).json({
        success: false,
        error: error.message,
      });
    }
  }

  // GET /api/dashboard/all-fy
  getAllFYData(req, res) {
    try {
      const data = dashboardService.getAllFYData();

      res.json({
        success: true,
        data,
        years: Object.keys(data),
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message,
      });
    }
  }
  // GET /api/dashboard/kpis
  async getKPIs(req, res) {
    try {
      const { fy = "2026" } = req.query;
      const data = await dashboardService.getKPIs(fy);
      console.log("dashboard controller : ", data);
      return res.json({
        success: true,
        data,
        fy,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
        error: error,
      });
    }
  }
  
}

export const getLead = async (req, res, next) => {
  try {
    const { fy = "2024" } = req.query;
    const data = await dashboardService.getKPIs(fy);
    sendResponse(res, data);
  } catch (err) {
    next(err);
  }
};

export const getOrdersLast5year = async (req, res, next) => {
  try {
    const { fy } = req.query;
    const data = await dashboardService.ordersReceived5year();
    sendResponse(res, data);
  } catch (err) {
    next(err);
  } 
};

export const getDomainAnalysis = async (req, res, next) => {

  try {
    const domainAnalysis = await dashboardService.getBusinessDomainAnalysis();
    sendResponse(res, domainAnalysis);
  } catch (err) {
    next(err)
  }
};

export const getTenderTypeCount = async (req, res, next) => {

  try {
    const tenderTypeCount = await dashboardService.getTenderTypeCount();
    sendResponse(res, tenderTypeCount);
  } catch (err) {
    next(err)
  }
};

export const getTopCustomers = async (req, res, next) => {
  try {
    const data = await dashboardService.getTopCustomers();
    sendResponse(res, data);
  } catch (err) {
    next(err);
  }
};


export default new DashboardController(); // Use export default instead of module.exports
