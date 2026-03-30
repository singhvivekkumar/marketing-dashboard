
/**
 * Pipeline Controller
 * Handles requests for pipeline data: status, deadlines, value by domain
 */

import pipelineService from "../services/pipelineService.js"; // Note the .js extension

// Format response helper based on guide
const sendResponse = (res, data, message = "Operation successful") => {
  res.status(200).json({
    success: true,
    message,
    data,
    timestamp: new Date().toISOString(),
  });
};

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


export const getKPIPipeline = async (req, res, next) => {
  try {
    const pipelineKpisData = await pipelineService.getKPIPipeline();
    sendResponse(res, pipelineKpisData);
  } catch (err) {
    next(err)
  }
};

export const getUpcomingSubmissions = async (req, res, next) => {
  try {
    const upcomingSubmissions = await pipelineService.getUpcomingSubmissions();
    sendResponse(res, upcomingSubmissions);
  } catch (err) {
    next(err)
  }
};

export const getPipelineStatus = async (req, res, next) => {
  try {
    const data = await pipelineService.getPipelineStatus();
    sendResponse(res, data);
  } catch (err) {
    next(err);
  }
};

export const getPipelineDomain = async (req, res, next) => {
  try {
    const data = await pipelineService.getPipelineDomain();
    sendResponse(res, data);
  } catch (err) {
    next(err);
  }
};


export default new PipelineController();
