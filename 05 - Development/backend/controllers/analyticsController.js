/**
 * Reports Controller
 * Handles requests for reports: yearly data, summaries, exports
 */

const reportsService = require('../services/reportsService');

class ReportsController {
  // GET /api/reports/yearly-value
  getYearlyValue(req, res) {
    try {
      const data = reportsService.getYearlyValue();

      res.json({
        success: true,
        data,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message,
      });
    }
  }

  // GET /api/reports/win-rate-trend
  getWinRateTrend(req, res) {
    try {
      const data = reportsService.getWinRateTrend();

      res.json({
        success: true,
        data,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message,
      });
    }
  }

  // GET /api/reports/year-summary
  getYearSummary(req, res) {
    try {
      const data = reportsService.getYearSummary();

      res.json({
        success: true,
        data,
        count: data.length,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message,
      });
    }
  }

  // GET /api/reports/year-summary/:id
  getYearById(req, res) {
    try {
      const { id } = req.params;
      const data = reportsService.getYearById(id);

      res.json({
        success: true,
        data,
      });
    } catch (error) {
      res.status(404).json({
        success: false,
        error: error.message,
      });
    }
  }

  // GET /api/reports/quarterly
  getQuarterlyData(req, res) {
    try {
      const { fy } = req.query;
      const data = reportsService.getQuarterlyData(fy);

      res.json({
        success: true,
        data,
        fy: fy || 'all',
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message,
      });
    }
  }

  // GET /api/reports/tender-type
  getTenderType(req, res) {
    try {
      const data = reportsService.getTenderType();

      res.json({
        success: true,
        data,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message,
      });
    }
  }

  // GET /api/reports/lead-owner
  getLeadOwnerPerformance(req, res) {
    try {
      const data = reportsService.getLeadOwnerPerformance();

      res.json({
        success: true,
        data,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message,
      });
    }
  }

  // GET /api/reports/summary
  getReportSummary(req, res) {
    try {
      const data = reportsService.getReportSummary();

      res.json({
        success: true,
        data,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message,
      });
    }
  }

  // GET /api/reports/export
  getExportData(req, res) {
    try {
      const { format = 'json' } = req.query;
      const data = reportsService.getExportData(format);

      if (format === 'csv') {
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename="reports.csv"');
        // Convert to CSV format if needed
        res.send(JSON.stringify(data, null, 2));
      } else {
        res.json({
          success: true,
          data,
        });
      }
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message,
      });
    }
  }
}

module.exports = new ReportsController();
