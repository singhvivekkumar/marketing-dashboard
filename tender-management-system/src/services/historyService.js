/**
 * History Service - Entity-specific history logging
 * Provides separate history tables for each entity
 */

/**
 * Log operation to entity-specific history table
 */
export const logHistory = async (
  HistoryModel,
  recordId,
  status,
  operatorId,
  operatorName,
  previousData = null,
  newData = null
) => {
  try {
    let changes = null;
    if (status === "updated" && previousData && newData) {
      changes = calculateChanges(previousData, newData);
    }

    const idField = getIdField(HistoryModel.name);

    await HistoryModel.create({
      [idField]: recordId,
      status,
      operator_id: operatorId,
      operator_name: operatorName,
      previous_data: previousData,
      new_data: newData,
      changes,
      timestamp: new Date(),
    });

    return { success: true };
  } catch (error) {
    console.error("Error logging history:", error);
    return { success: false, error: error.message };
  }
};

/**
 * Log bulk create operations
 */
export const logBulkHistory = async (
  HistoryModel,
  records,
  operatorId,
  operatorName
) => {
  try {
    const idField = getIdField(HistoryModel.name);
    
    const historyRecords = records.map((record) => ({
      [idField]: record.id,
      status: "added",
      operator_id: operatorId,
      operator_name: operatorName,
      previous_data: null,
      new_data: record.toJSON(),
      changes: null,
      timestamp: new Date(),
    }));

    await HistoryModel.bulkCreate(historyRecords);
    return { success: true };
  } catch (error) {
    console.error("Error logging bulk history:", error);
    return { success: false, error: error.message };
  }
};

/**
 * Get history for a specific record
 */
export const getRecordHistory = async (HistoryModel, recordId) => {
  try {
    const idField = getIdField(HistoryModel.name);
    
    const history = await HistoryModel.findAll({
      where: {
        [idField]: recordId,
      },
      order: [["timestamp", "DESC"]],
      raw: true,
    });
    return { success: true, data: history };
  } catch (error) {
    console.error("Error fetching record history:", error);
    return { success: false, error: error.message };
  }
};

/**
 * Get history by operator
 */
export const getOperatorHistory = async (
  HistoryModel,
  operatorId,
  limit = 100,
  offset = 0
) => {
  try {
    const history = await HistoryModel.findAll({
      where: { operator_id: operatorId },
      order: [["timestamp", "DESC"]],
      limit,
      offset,
      raw: true,
    });

    const total = await HistoryModel.count({
      where: { operator_id: operatorId },
    });

    return { success: true, data: history, total };
  } catch (error) {
    console.error("Error fetching operator history:", error);
    return { success: false, error: error.message };
  }
};

/**
 * Get history by status
 */
export const getHistoryByStatus = async (
  HistoryModel,
  status,
  limit = 100,
  offset = 0
) => {
  try {
    const history = await HistoryModel.findAll({
      where: { status },
      order: [["timestamp", "DESC"]],
      limit,
      offset,
      raw: true,
    });

    const total = await HistoryModel.count({
      where: { status },
    });

    return { success: true, data: history, total };
  } catch (error) {
    console.error("Error fetching history by status:", error);
    return { success: false, error: error.message };
  }
};

/**
 * Calculate what fields changed between two objects
 */
function calculateChanges(oldData, newData) {
  const changes = {};

  for (const key in newData) {
    const oldVal = oldData[key];
    const newVal = newData[key];

    const oldDate =
      oldVal instanceof Date ? oldVal.getTime() : oldVal;
    const newDate =
      newVal instanceof Date ? newVal.getTime() : newVal;

    if (oldDate !== newDate) {
      changes[key] = {
        old: oldVal,
        new: newVal,
      };
    }
  }

  for (const key in oldData) {
    if (!(key in newData)) {
      changes[key] = {
        old: oldData[key],
        new: undefined,
      };
    }
  }

  return Object.keys(changes).length > 0 ? changes : null;
}

/**
 * Map Sequelize model name to its ID field name
 */
function getIdField(modelName) {
  const idFieldMap = {
    "BudgetaryQuotationHistory": "budgetary_quotation_id",
    "DomesticLeadsHistory": "domestic_leads_id",
    "ExportLeadsHistory": "export_leads_id",
    "LostFormHistory": "lost_form_id",
    "CRMLeadHistory": "crm_lead_id",
    "LeadSubmittedHistory": "lead_submitted_id",
    "InHouseRDHistory": "inhouse_rd_id",
    "MarketingOrderReceivedDomExpHistory": "marketing_order_received_dom_exp_id",
    "OrderReceivedDocumentHistory": "order_received_document_id",
  };

  return idFieldMap[modelName] || "record_id";
}
