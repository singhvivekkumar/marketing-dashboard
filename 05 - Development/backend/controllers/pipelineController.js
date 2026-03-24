/**
 * Analytics Controller
 * Handles requests for analytics data: trends, distributions, comparisons
 */

const analyticsService = require('../services/analyticsService');

class AnalyticsController {
  // GET /api/analytics/five-year-trend
  getFiveYearTrend(req, res) {
    try {
      const data = analyticsService.getFiveYearTrend();

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

  // GET /api/analytics/lead-outcomes
  getLeadOutcomes(req, res) {
    try {
      const data = analyticsService.getLeadOutcomes();

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

  // GET /api/analytics/monthly-trend
  getMonthlyTrend(req, res) {
    try {
      const { fy } = req.query;
      const data = analyticsService.getMonthlyTrend(fy);

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

  // GET /api/analytics/civil-defence
  getCivilDefence(req, res) {
    try {
      const data = analyticsService.getCivilDefence();

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

  // GET /api/analytics/lead-subtypes
  getLeadSubTypes(req, res) {
    try {
      const data = analyticsService.getLeadSubTypes();

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

  // GET /api/analytics/domain-performance
  getDomainPerformance(req, res) {
    try {
      const { domain } = req.query;
      const data = analyticsService.getDomainPerformance(domain);

      res.json({
        success: true,
        data,
        domain: domain || 'all',
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message,
      });
    }
  }

  // GET /api/analytics/top-customers
  getTopCustomers(req, res) {
    try {
      const { limit } = req.query;
      const data = analyticsService.getTopCustomers(limit);

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

  // GET /api/analytics/lost-leads
  getLostLeads(req, res) {
    try {
      const { domain, limit } = req.query;
      const result = analyticsService.getLostLeads(domain, limit);

      res.json({
        success: true,
        data: result.data,
        total: result.total,
        filtered: result.filtered,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message,
      });
    }
  }

  // GET /api/analytics/lost-leads/:id
  getLostLeadById(req, res) {
    try {
      const { id } = req.params;
      const data = analyticsService.getLostLeadById(id);

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

  // GET /api/analytics/bq-conversion
  getBQConversion(req, res) {
    try {
      const data = analyticsService.getBQConversion();

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

  // GET /api/analytics/order-distribution
  getOrderValueDistribution(req, res) {
    try {
      const data = analyticsService.getOrderValueDistribution();

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

  // GET /api/analytics/kpis
  getKPIAnalytics(req, res) {
    try {
      const data = analyticsService.getKPIAnalytics();

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
}

module.exports = new AnalyticsController();
