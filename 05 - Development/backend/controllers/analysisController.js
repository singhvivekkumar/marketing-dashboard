import analysisService from "../services/analysisService.js";

export const getBQFunnel = async (req, res) => {
  res.json({ success: true, data: await analysisService.getBQConversionFunnel() });
};

export const getOrderDistribution = async (req, res) => {
  res.json({ success: true, data: await analysisService.getOrderValueDistribution() });
};

export const getQuarterly = async (req, res) => {
  res.json({ success: true, data: await analysisService.getQuarterlyOrders() });
};

export const getDocumentType = async (req, res) => {
  res.json({ success: true, data: await analysisService.getDocumentTypeBreakdown() });
};

export const getOwnerPerformance = async (req, res) => {
  res.json({ success: true, data: await analysisService.getOwnerPerformance() });
};

export const getAnalysisKPIs = async (req, res) => {
    try {
      const data = await analysisService.getAnalysisKPIs();
  
      res.json({
        success: true,
        data,
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };
  
