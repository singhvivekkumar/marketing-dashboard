/**
 * Pipeline Controller
 * Handles requests for pipeline data: status, deadlines, value by domain
 */

const pipelineService = require('../services/pipelineService');

class PipelineController {
  // GET /api/pipeline/status
  getPipelineStatus(req, res) {
    try {
      const data = pipelineService.getPipelineStatus();

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

  // GET /api/pipeline/domain
  getPipelineDomain(req, res) {
    try {
      const { domain } = req.query;
      const data = pipelineService.getPipelineDomain(domain);

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

  // GET /api/pipeline/deadlines
  getUpcomingDeadlines(req, res) {
    try {
      const { days, status } = req.query;
      const data = pipelineService.getUpcomingDeadlines(days, status);

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

  // GET /api/pipeline/deadlines/:id
  getDeadlineById(req, res) {
    try {
      const { id } = req.params;
      const data = pipelineService.getDeadlineById(id);

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

  // GET /api/pipeline/kpis
  getKPIPipeline(req, res) {
    try {
      const data = pipelineService.getKPIPipeline();

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

  // GET /api/pipeline/summary
  getSummary(req, res) {
    try {
      const data = pipelineService.getSummary();

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

module.exports = new PipelineController();
