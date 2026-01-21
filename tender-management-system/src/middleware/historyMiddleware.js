/**
 * History Middleware - Automatically logs history for any model changes
 * Attach to controller methods for automatic history tracking
 */

export const withHistoryLogging = (OperationHistory, modelName) => {
  return {
    /**
     * Wrap create operations
     */
    async logCreate(operatorId, operatorName, createFn) {
      try {
        const result = await createFn();
        
        // Log to history
        await OperationHistory.create({
          model_name: modelName,
          record_id: result.id,
          status: "added",
          operator_id: operatorId,
          operator_name: operatorName,
          previous_data: null,
          new_data: result.toJSON ? result.toJSON() : result,
          changes: null,
          timestamp: new Date(),
        }).catch((err) =>
          console.warn("History logging failed:", err.message)
        );

        return result;
      } catch (error) {
        throw error;
      }
    },

    /**
     * Wrap update operations
     */
    async logUpdate(operatorId, operatorName, oldData, updateFn) {
      try {
        const result = await updateFn();
        const newData = result.toJSON ? result.toJSON() : result;
        const changes = calculateChanges(oldData, newData);

        // Log to history
        await OperationHistory.create({
          model_name: modelName,
          record_id: result.id,
          status: "updated",
          operator_id: operatorId,
          operator_name: operatorName,
          previous_data: oldData,
          new_data: newData,
          changes,
          timestamp: new Date(),
        }).catch((err) =>
          console.warn("History logging failed:", err.message)
        );

        return result;
      } catch (error) {
        throw error;
      }
    },

    /**
     * Wrap delete operations
     */
    async logDelete(operatorId, operatorName, recordData, deleteFn) {
      try {
        await deleteFn();

        // Log to history
        await OperationHistory.create({
          model_name: modelName,
          record_id: recordData.id,
          status: "deleted",
          operator_id: operatorId,
          operator_name: operatorName,
          previous_data: recordData,
          new_data: null,
          changes: null,
          timestamp: new Date(),
        }).catch((err) =>
          console.warn("History logging failed:", err.message)
        );

        return true;
      } catch (error) {
        throw error;
      }
    },
  };
};

/**
 * Calculate what fields changed
 */
function calculateChanges(oldData, newData) {
  const changes = {};

  for (const key in newData) {
    const oldVal = oldData[key];
    const newVal = newData[key];

    // Handle date comparison
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

  return Object.keys(changes).length > 0 ? changes : null;
}
