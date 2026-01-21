/**
 * History Service - Centralized history logging utility
 * Handles all operations tracking with error handling and transactions
 */

export const logHistory = async (
  OperationHistory,
  modelName,
  recordId,
  status,
  operatorId,
  operatorName,
  previousData = null,
  newData = null
) => {
  try {
    // Calculate changes object for updates
    let changes = null;
    if (status === "updated" && previousData && newData) {
      changes = calculateChanges(previousData, newData);
    }

    await OperationHistory.create({
      model_name: modelName,
      record_id: recordId,
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
    // Return error but don't throw - operation should not fail due to history logging
    return { success: false, error: error.message };
  }
};

/**
 * Calculate what fields changed between two objects
 */
function calculateChanges(oldData, newData) {
  const changes = {};

  // Compare all fields in newData
  for (const key in newData) {
    if (oldData[key] !== newData[key]) {
      changes[key] = {
        old: oldData[key],
        new: newData[key],
      };
    }
  }

  // Check for deleted fields
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
 * Log bulk create operations
 */
export const logBulkHistory = async (
  OperationHistory,
  modelName,
  records,
  operatorId,
  operatorName
) => {
  try {
    const historyRecords = records.map((record) => ({
      model_name: modelName,
      record_id: record.id,
      status: "added",
      operator_id: operatorId,
      operator_name: operatorName,
      previous_data: null,
      new_data: record.toJSON(),
      changes: null,
      timestamp: new Date(),
    }));

    await OperationHistory.bulkCreate(historyRecords);
    return { success: true };
  } catch (error) {
    console.error("Error logging bulk history:", error);
    return { success: false, error: error.message };
  }
};

/**
 * Get history for a specific record
 */
export const getRecordHistory = async (OperationHistory, modelName, recordId) => {
  try {
    const history = await OperationHistory.findAll({
      where: {
        model_name: modelName,
        record_id: recordId,
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
  OperationHistory,
  operatorId,
  limit = 100,
  offset = 0
) => {
  try {
    const history = await OperationHistory.findAll({
      where: { operator_id: operatorId },
      order: [["timestamp", "DESC"]],
      limit,
      offset,
      raw: true,
    });

    const total = await OperationHistory.count({
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
  OperationHistory,
  status,
  limit = 100,
  offset = 0
) => {
  try {
    const history = await OperationHistory.findAll({
      where: { status },
      order: [["timestamp", "DESC"]],
      limit,
      offset,
      raw: true,
    });

    const total = await OperationHistory.count({
      where: { status },
    });

    return { success: true, data: history, total };
  } catch (error) {
    console.error("Error fetching history by status:", error);
    return { success: false, error: error.message };
  }
};
