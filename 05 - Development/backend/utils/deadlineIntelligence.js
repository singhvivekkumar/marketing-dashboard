// utils/deadlineIntelligence.js

import { STAGE_DEADLINES, DEADLINE_THRESHOLDS, STAGES } from '../constants/tenderLifeCycle.js'; // Note the .js extension

const parseDate = (raw) => {
  if (!raw) return null;
  const d = new Date(raw);
  return isNaN(d) ? null : d;
};

const daysUntil = (date) => {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const target = new Date(date);
  target.setHours(0, 0, 0, 0);
  return Math.ceil((target - now) / 86_400_000);
};

export const getDeadlineStatus = (tender) => {
  const deadlineField = STAGE_DEADLINES[tender.lifecycleStage];
  if (!deadlineField) return null;

  const raw  = tender[deadlineField];
  const date = parseDate(raw);
  if (!date) return null;

  const days = daysUntil(date);
  let urgency;

  if (days < 0)                              urgency = 'OVERDUE';
  else if (days <= DEADLINE_THRESHOLDS.CRITICAL) urgency = 'CRITICAL';
  else if (days <= DEADLINE_THRESHOLDS.WARNING)  urgency = 'WARNING';
  else if (days <= DEADLINE_THRESHOLDS.WATCH)    urgency = 'WATCH';
  else                                           urgency = 'ON_TRACK';

  return {
    field:      deadlineField,
    date:       date.toISOString().split('T')[0],
    daysLeft:   days,
    urgency,
    label:      days < 0
                  ? `Overdue by ${Math.abs(days)}d`
                  : days === 0
                    ? 'Due today'
                    : `${days}d remaining`,
  };
};

// Scan all tenders and return only those needing attention
export const getDeadlineAlerts = (tenders) =>
  tenders
    .map((t) => ({ tender: t, deadline: getDeadlineStatus(t) }))
    .filter(({ deadline }) => deadline && deadline.urgency !== 'ON_TRACK')
    .sort((a, b) => a.deadline.daysLeft - b.deadline.daysLeft);