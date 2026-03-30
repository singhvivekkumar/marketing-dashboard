export const TENDER_STAGES = {
  IDENTIFIED: "Identified",
  IN_PROGRESS: "In Progress",
  SUBMITTED: "Submitted",
  EVALUATED: "Evaluated",
  WON: "Won",
  LOST: "Lost",
};

// constants/tenderLifecycle.js

export const STAGES = {
  LEAD_IDENTIFIED:   'LEAD_IDENTIFIED',
  BID_NO_BID:        'BID_NO_BID',
  DOC_PREPARATION:   'DOC_PREPARATION',
  PRE_BID_MEETING:   'PRE_BID_MEETING',
  SUBMITTED:         'SUBMITTED',
  IN_EVALUATION:     'IN_EVALUATION',
  ORDER_WON:         'ORDER_WON',
  DELIVERY:          'DELIVERY',
  CLOSED_LOST:       'CLOSED_LOST',
  NOT_PARTICIPATED:  'NOT_PARTICIPATED',
  LEARNING_LOOP:     'LEARNING_LOOP',
};

// Which fields are required before advancing OUT of each stage
export const STAGE_REQUIRED_FIELDS = {
  [STAGES.LEAD_IDENTIFIED]: [
    'tenderName', 'tenderReferenceNo', 'customerName', 'tenderType',
    'businessDomain', 'civilOrDefence', 'tenderDated', 'leadOwner',
  ],
  [STAGES.BID_NO_BID]: [
    'soleOrConsortium', 'documentType', 'valueOfEMD',
    'estimatedValueInCrWithoutGST',
  ],
  [STAGES.DOC_PREPARATION]: [
    'lastDateOfSub',
  ],
  [STAGES.PRE_BID_MEETING]: [
    'submittedValueInCrWithoutGST',
  ],
  [STAGES.SUBMITTED]: [],
  [STAGES.IN_EVALUATION]: [
    'wonLostParticipated',
  ],
  [STAGES.ORDER_WON]: [
    'orderWonValueInCrWithoutGST',
  ],
  [STAGES.DELIVERY]: [
    'presentStatus', 'OperatorId', 'OperatorName', 'OperatorRole', 'OperatorSBU',
  ],
  [STAGES.CLOSED_LOST]: [
    'reasonForLossingOpp',
  ],
};

// Valid forward transitions. Keys = current stage, values = allowed next stages
export const TRANSITIONS = {
  [STAGES.LEAD_IDENTIFIED]:  [STAGES.BID_NO_BID],
  [STAGES.BID_NO_BID]:       [STAGES.DOC_PREPARATION, STAGES.NOT_PARTICIPATED],
  [STAGES.DOC_PREPARATION]:  [STAGES.PRE_BID_MEETING, STAGES.SUBMITTED],
  [STAGES.PRE_BID_MEETING]:  [STAGES.SUBMITTED],
  [STAGES.SUBMITTED]:        [STAGES.IN_EVALUATION],
  [STAGES.IN_EVALUATION]:    [STAGES.ORDER_WON, STAGES.CLOSED_LOST],
  [STAGES.ORDER_WON]:        [STAGES.DELIVERY],
  [STAGES.DELIVERY]:         [STAGES.LEARNING_LOOP],
  [STAGES.CLOSED_LOST]:      [STAGES.LEARNING_LOOP],
  [STAGES.NOT_PARTICIPATED]: [STAGES.LEARNING_LOOP],
};

// Terminal stages — no further transitions allowed
export const TERMINAL_STAGES = new Set([STAGES.LEARNING_LOOP]);

// Deadline fields per stage — used by deadline intelligence
export const STAGE_DEADLINES = {
  [STAGES.LEAD_IDENTIFIED]:  'tenderDated',
  [STAGES.DOC_PREPARATION]:  'prebidMeetingDateTime',
  [STAGES.PRE_BID_MEETING]:  'lastDateOfSub',
  [STAGES.SUBMITTED]:        'lastDateOfSub',
};

// How many days before deadline to trigger each alert level
export const DEADLINE_THRESHOLDS = {
  CRITICAL: 3,
  WARNING:  7,
  WATCH:    14,
};