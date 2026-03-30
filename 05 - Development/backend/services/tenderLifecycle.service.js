// services/tenderLifecycle.service.js

import db from '../models/index.js';
import {
  STAGES, TRANSITIONS, TERMINAL_STAGES,
  STAGE_REQUIRED_FIELDS,
} from '../constants/tenderLifeCycle.js';
import { getDeadlineStatus, getDeadlineAlerts } from '../utils/deadlineIntelligence.js';

const DomesticLeads = db.DomesticLeadsModel;
const ExportLeads   = db.ExportLeadsModel;

// ── Validation ──────────────────────────────────────────────────────────────

const getMissingFields = (tender, stage) => {
  const required = STAGE_REQUIRED_FIELDS[stage] ?? [];
  return required.filter((f) => !tender[f] || tender[f].toString().trim() === '');
};

// ── Stage Resolver ───────────────────────────────────────────────────────────
// Derives the current lifecycle stage from existing DB columns.
// Call this once on records that predate the lifecycleStage column.

export const resolveStageFromData = (tender) => {
  const wlp = tender.wonLostParticipated ?? '';

  if (wlp === 'Not-Participated')   return STAGES.NOT_PARTICIPATED;
  if (tender.presentStatus === 'Supply Completed'
   || tender.presentStatus === 'Work Completed')  return STAGES.LEARNING_LOOP;
  if (tender.presentStatus === 'Order Received'
   || tender.presentStatus === 'Delivery Phase'
   || tender.presentStatus === 'Work in Progress'
   || tender.presentStatus === 'Implementation Phase'
   || tender.presentStatus === 'Execution Phase'
   || tender.presentStatus === 'Pre-Construction Activities') return STAGES.DELIVERY;
  if (wlp === 'Participated-Won')   return STAGES.ORDER_WON;
  if (wlp === 'Participated-Lost')  return STAGES.CLOSED_LOST;
  if (wlp === 'In-Evaluation')      return STAGES.IN_EVALUATION;
  if (tender.submittedValueInCrWithoutGST) return STAGES.SUBMITTED;
  if (tender.lastDateOfSub)         return STAGES.PRE_BID_MEETING;
  if (tender.documentType)          return STAGES.DOC_PREPARATION;
  if (tender.soleOrConsortium)      return STAGES.BID_NO_BID;
  return STAGES.LEAD_IDENTIFIED;
};

// ── Core Transition ──────────────────────────────────────────────────────────

export const advanceStage = async (tenderId, targetStage, payload = {}, isExport = false) => {
  const Model  = isExport ? ExportLeads : DomesticLeads;
  const tender = await Model.findByPk(tenderId);
  if (!tender) throw new Error(`Tender ${tenderId} not found`);

  const currentStage = tender.lifecycleStage ?? resolveStageFromData(tender);

  // Guard: terminal
  if (TERMINAL_STAGES.has(currentStage))
    throw new Error(`Tender ${tenderId} is in terminal stage ${currentStage}`);

  // Guard: valid transition
  const allowed = TRANSITIONS[currentStage] ?? [];
  if (!allowed.includes(targetStage))
    throw new Error(`Invalid transition: ${currentStage} → ${targetStage}`);

  // Guard: required fields in payload + existing record
  const merged       = { ...tender.dataValues, ...payload };
  const missingFields = getMissingFields(merged, currentStage);
  if (missingFields.length)
    throw new Error(`Cannot advance — missing fields: ${missingFields.join(', ')}`);

  // Build update delta
  const update = {
    ...payload,
    lifecycleStage:      targetStage,
    lifecycleUpdatedAt:  new Date(),
    lifecycleHistory:    [
      ...(tender.lifecycleHistory ?? []),
      { from: currentStage, to: targetStage, at: new Date().toISOString() },
    ],
  };

  // Auto-derive presentStatus from stage if not explicitly set
  if (!payload.presentStatus)
    update.presentStatus = STAGE_TO_STATUS[targetStage] ?? tender.presentStatus;

  // If moving to WON, auto-calc value delta
  if (targetStage === STAGES.ORDER_WON && payload.orderWonValueInCrWithoutGST) {
    const estimated = parseFloat(tender.estimatedValueInCrWithoutGST) || 0;
    const won       = parseFloat(payload.orderWonValueInCrWithoutGST)  || 0;
    update.valueDeltaCr = parseFloat((won - estimated).toFixed(2));
  }

  await Model.update(update, { where: { id: tenderId } });
  return { tenderId, from: currentStage, to: targetStage, update };
};

// Auto status labels per stage
const STAGE_TO_STATUS = {
  [STAGES.LEAD_IDENTIFIED]:  'Lead Identified',
  [STAGES.BID_NO_BID]:       'Bid/No-Bid Review',
  [STAGES.DOC_PREPARATION]:  'Document Preparation',
  [STAGES.PRE_BID_MEETING]:  'Pre-Bid Meeting Pending',
  [STAGES.SUBMITTED]:        'Submitted',
  [STAGES.IN_EVALUATION]:    'In Evaluation',
  [STAGES.ORDER_WON]:        'Order Received',
  [STAGES.DELIVERY]:         'Delivery Phase',
  [STAGES.CLOSED_LOST]:      'Order Lost',
  [STAGES.NOT_PARTICIPATED]: 'Not Participated',
  [STAGES.LEARNING_LOOP]:    'Closed',
};

// ── Queries ───────────────────────────────────────────────────────────────────

export const getTendersByStage = async (stage, isExport = false) => {
  const Model = isExport ? ExportLeads : DomesticLeads;
  return Model.findAll({ where: { lifecycleStage: stage }, order: [['lastDateOfSub', 'ASC']] });
};

export const getPipelineSummary = async () => {
  const [domestic, exports] = await Promise.all([
    DomesticLeads.findAll(),
    ExportLeads.findAll(),
  ]);

  const all = [...domestic, ...exports].map((t) => ({
    ...t.dataValues,
    lifecycleStage: t.lifecycleStage ?? resolveStageFromData(t.dataValues),
  }));

  // Group by stage
  const byStage = all.reduce((acc, t) => {
    acc[t.lifecycleStage] = acc[t.lifecycleStage] ?? { count: 0, totalValue: 0, tenders: [] };
    acc[t.lifecycleStage].count++;
    acc[t.lifecycleStage].totalValue += parseFloat(t.estimatedValueInCrWithoutGST) || 0;
    acc[t.lifecycleStage].tenders.push(t.id);
    return acc;
  }, {});

  // Win rate
  const won  = byStage[STAGES.ORDER_WON]?.count   ?? 0;
  const lost = byStage[STAGES.CLOSED_LOST]?.count  ?? 0;
  const winRate = won + lost > 0 ? ((won / (won + lost)) * 100).toFixed(1) + '%' : 'N/A';

  // Deadline alerts
  const alerts = getDeadlineAlerts(all);

  return { byStage, winRate, deadlineAlerts: alerts };
};

// ── Deadline Intelligence (public) ────────────────────────────────────────────

export const getDeadlineReport = async () => {
  const [domestic, exports] = await Promise.all([
    DomesticLeads.findAll(),
    ExportLeads.findAll(),
  ]);

  const all = [...domestic, ...exports].map((t) => ({
    ...t.dataValues,
    lifecycleStage: t.lifecycleStage ?? resolveStageFromData(t.dataValues),
  }));

  return getDeadlineAlerts(all).map(({ tender, deadline }) => ({
    id:          tender.id,
    tenderName:  tender.tenderName,
    leadOwner:   tender.leadOwner,
    stage:       tender.lifecycleStage,
    ...deadline,
  }));
};

// ── Learning Loop Analytics ───────────────────────────────────────────────────

export const getLearningLoopInsights = async () => {
  const [domestic, exports] = await Promise.all([
    DomesticLeads.findAll(),
    ExportLeads.findAll(),
  ]);
  const all = [...domestic, ...exports].map((t) => t.dataValues);

  // Loss reasons breakdown
  const lossReasons = all
    .filter((t) => t.reasonForLossingOpp)
    .reduce((acc, t) => {
      acc[t.reasonForLossingOpp] = (acc[t.reasonForLossingOpp] ?? 0) + 1;
      return acc;
    }, {});

  // Win rate by businessDomain
  const domainStats = all.reduce((acc, t) => {
    const d = t.businessDomain;
    if (!d) return acc;
    acc[d] = acc[d] ?? { won: 0, lost: 0, total: 0 };
    acc[d].total++;
    if (t.wonLostParticipated === 'Participated-Won')  acc[d].won++;
    if (t.wonLostParticipated === 'Participated-Lost') acc[d].lost++;
    return acc;
  }, {});

  const domainWinRates = Object.entries(domainStats).map(([domain, s]) => ({
    domain,
    winRate: s.won + s.lost > 0
      ? ((s.won / (s.won + s.lost)) * 100).toFixed(1) + '%'
      : 'N/A',
    ...s,
  }));

  // Competitor frequency
  const competitorFreq = all
    .filter((t) => t.competitorsInfo)
    .flatMap((t) => t.competitorsInfo.split(',').map((c) => c.trim()))
    .reduce((acc, name) => {
      acc[name] = (acc[name] ?? 0) + 1;
      return acc;
    }, {});

  // Average value delta (estimated vs won)
  const wonWithDelta = all.filter((t) => t.valueDeltaCr != null);
  const avgDelta = wonWithDelta.length
    ? (wonWithDelta.reduce((s, t) => s + t.valueDeltaCr, 0) / wonWithDelta.length).toFixed(2)
    : null;

  return { lossReasons, domainWinRates, competitorFreq, avgValueDeltaCr: avgDelta };
};