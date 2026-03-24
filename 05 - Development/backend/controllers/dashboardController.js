/**
 * Dashboard Controller
 * Handles requests for dashboard data: monthly data and fiscal year summaries
 */

const dashboardService = require('../services/dashboardService');

class DashboardController {
  // GET /api/dashboard/month-data
  getMonthData(req, res) {
    try {
      const { fy } = req.query;
      const data = dashboardService.getMonthsWithData(fy);

      res.json({
        success: true,
        data,
        fy: fy || '2026',
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
      const { fy = '2026' } = req.query;
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
  getKPIs(req, res) {
    try {
      const { fy = '2026' } = req.query;
      const data = dashboardService.getKPIs(fy);

      res.json({
        success: true,
        data,
        fy,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message,
      });
    }
  }
}

module.exports = new DashboardController();
