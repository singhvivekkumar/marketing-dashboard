// controllers/tenderLifecycle.controller.js

import * as LC from '../services/tenderLifecycle.service.js';

export const advanceTender = async (req, res, next) => {
  try {
    const { id }       = req.params;
    const { stage, ...payload } = req.body;
    const isExport     = req.query.type === 'export';
    const result       = await LC.advanceStage(id, stage, payload, isExport);
    res.json({ success: true, ...result });
  } catch (err) { next(err); }
};

export const getPipeline  = async (req, res, next) => {
  try { res.json(await LC.getPipelineSummary()); }
  catch (err) { next(err); }
};

export const getDeadlines = async (req, res, next) => {
  try { res.json(await LC.getDeadlineReport()); }
  catch (err) { next(err); }
};

export const getInsights  = async (req, res, next) => {
  try { res.json(await LC.getLearningLoopInsights()); }
  catch (err) { next(err); }
};