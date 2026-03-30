import express from "express";
import {
  getBQFunnel,
  getOrderDistribution,
  getQuarterly,
  getDocumentType,
  getOwnerPerformance,
  getAnalysisKPIs,
} from "../controllers/analysisController.js";

const router = express.Router();

router.get("/kpis", getAnalysisKPIs);

router.get("/bq-funnel", getBQFunnel);
router.get("/order-distribution", getOrderDistribution);
router.get("/quarterly", getQuarterly);
router.get("/document-type", getDocumentType);
router.get("/owner-performance", getOwnerPerformance);


export default router;
