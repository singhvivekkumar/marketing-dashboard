import db from "../models/index.js";
import {
  logHistory,
  logBulkHistory,
  getRecordHistory,
} from "../services/historyService.js";

const BudgetaryQuotationModel = db.BudgetaryQuotationModel;
const BudgetaryQuotationHistory = db.BudgetaryQuotationHistory;

export const CreateBudgetaryQuotationBulk = async (req, res) => {
  try {
    const BulkData = req.body.excelData;
    const { OperatorId, OperatorName } = req.body;

    console.log("CreateBudgetaryQuotationBulk service Bulk called", BulkData);

    const insertedRecords = await BudgetaryQuotationModel.bulkCreate(BulkData, {
      validate: true,
    });

    // Log bulk history
    await logBulkHistory(
      BudgetaryQuotationHistory,
      insertedRecords,
      OperatorId,
      OperatorName
    );

    res.status(200).json({
      success: true,
      data: insertedRecords,
      message: "All records inserted successfully",
      error: {}
    });
  } catch (error) {
    console.error("Error has encountered...");
    if (error.name === "SequelizeUniqueConstraintError") {
      console.error(
        "Error CreateBudgetaryQuotationBulk: Duplicate key value violates unique constraint"
      );
      res.status(400).json({
        success: false,
        data: [],
        message: "Duplicate key value violates unique constraint",
        error: error,
      });
    } else {
      console.error("Error CreateBudgetaryQuotationBulk :", error);
      res.status(500).json({
        success: false,
        data: [],
        message: "An error occurred",
        error: error,
      });
    }
  }
};

export const GetBudgetaryQuotation = (request, response) => {
  BudgetaryQuotationModel.findAll({
    raw: true,
  })
    .then((data) => {
      // console.log("MarketingOrderReceivedDomExp Data", data);
      response.json({ data });
    })
    .catch((err) => {
      console.log(err); //read from CSV

      response.json({ data: "No data found for GetBudgetaryQuotation" });
    });
};

export const CreateBudgetaryQuotation = async (req, res) => {
  try {
    const BudgetaryQuotationModelEx = {
      bqTitle: req.body.bqTitle,
      customerName: req.body.customerName,
      customerAddress: req.body.customerAddress,
      leadOwner: req.body.leadOwner,
      defenceAndNonDefence: req.body.defenceAndNonDefence,
      estimateValueInCrWithoutGST: req.body.estimateValueInCrWithoutGST,
      submittedValueInCrWithoutGST: req.body.submittedValueInCrWithoutGST,
      dateOfLetterSubmission: req.body.dateOfLetterSubmission,
      referenceNo: req.body.referenceNo,
      JSON_competitors: req.body.JSON_competitors,
      presentStatus: req.body.presentStatus,
      OperatorId: req.body.OperatorId,
      OperatorName: req.body.OperatorName,
      OperatorRole: req.body.OperatorRole,
      OperatorSBU: req.body.OperatorSBU,
    };

    const data = await BudgetaryQuotationModel.create(BudgetaryQuotationModelEx);

    // Log to history
    await logHistory(
      BudgetaryQuotationHistory,
      data.id,
      "added",
      req.body.OperatorId,
      req.body.OperatorName,
      null,
      data.toJSON()
    );

    console.log("Success");
    res.status(201).json({
      success: true,
      data: data,
      message: "Budgetary Quotation created successfully"
    });
  } catch (err) {
    console.log("Error while saving", err);
    res.status(500).send({
      message:
        err.message ||
        "Some error occurred while Create Budgetary Quotation Data.",
    });
  }
};

export const UpdateBudgetaryQuotation = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        data: null,
        message: "Quotation ID is required"
      });
    }

    const quotation = await BudgetaryQuotationModel.findByPk(id);

    if (!quotation) {
      return res.status(404).json({
        success: false,
        data: null,
        message: `Quotation with ID ${id} not found`
      });
    }

    // Store old data before update
    const previousData = quotation.toJSON();

    const updateData = {
      bqTitle: req.body.bqTitle || quotation.bqTitle,
      customerName: req.body.customerName || quotation.customerName,
      customerAddress: req.body.customerAddress || quotation.customerAddress,
      leadOwner: req.body.leadOwner || quotation.leadOwner,
      defenceAndNonDefence: req.body.defenceAndNonDefence || quotation.defenceAndNonDefence,
      estimateValueInCrWithoutGST: req.body.estimateValueInCrWithoutGST || quotation.estimateValueInCrWithoutGST,
      submittedValueInCrWithoutGST: req.body.submittedValueInCrWithoutGST || quotation.submittedValueInCrWithoutGST,
      dateOfLetterSubmission: req.body.dateOfLetterSubmission || quotation.dateOfLetterSubmission,
      referenceNo: req.body.referenceNo || quotation.referenceNo,
      JSON_competitors: req.body.JSON_competitors || quotation.JSON_competitors,
      presentStatus: req.body.presentStatus || quotation.presentStatus,
      OperatorId: req.body.OperatorId || quotation.OperatorId,
      OperatorName: req.body.OperatorName || quotation.OperatorName,
      OperatorRole: req.body.OperatorRole || quotation.OperatorRole,
      OperatorSBU: req.body.OperatorSBU || quotation.OperatorSBU
    };

    const updatedQuotation = await quotation.update(updateData);

    // Log to history with old and new data
    await logHistory(
      BudgetaryQuotationHistory,
      id,
      "updated",
      updateData.OperatorId,
      updateData.OperatorName,
      previousData,
      updatedQuotation.toJSON()
    );

    res.status(200).json({
      success: true,
      data: updatedQuotation,
      message: "Budgetary Quotation updated successfully"
    });
  } catch (error) {
    console.error("Error updating budgetary quotation:", error);

    if (error.name === "SequelizeUniqueConstraintError") {
      return res.status(400).json({
        success: false,
        data: null,
        message: "Reference number already exists",
        error: error.message
      });
    }

    if (error.name === "SequelizeValidationError") {
      return res.status(400).json({
        success: false,
        data: null,
        message: "Validation error",
        error: error.errors.map(e => e.message)
      });
    }

    res.status(500).json({
      success: false,
      data: null,
      message: "Error updating budgetary quotation",
      error: error.message
    });
  }
};

export const DeleteBudgetaryQuotation = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        data: null,
        message: "Quotation ID is required"
      });
    }

    const quotation = await BudgetaryQuotationModel.findByPk(id);

    if (!quotation) {
      return res.status(404).json({
        success: false,
        data: null,
        message: `Quotation with ID ${id} not found`
      });
    }

    const recordData = quotation.toJSON();

    // Log to history before delete
    await logHistory(
      BudgetaryQuotationHistory,
      id,
      "deleted",
      quotation.OperatorId,
      quotation.OperatorName,
      recordData,
      null
    );

    await quotation.destroy();

    res.status(200).json({
      success: true,
      data: null,
      message: "Budgetary Quotation deleted successfully"
    });
  } catch (error) {
    console.error("Error deleting budgetary quotation:", error);

    res.status(500).json({
      success: false,
      data: null,
      message: "Error deleting budgetary quotation",
      error: error.message
    });
  }
};

/**
 * Get complete history for a quotation
 */
export const GetBudgetaryQuotationHistory = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        data: null,
        message: "Quotation ID is required"
      });
    }

    const history = await BudgetaryQuotationHistory.findAll({
      where: {
        budgetary_quotation_id: id
      },
      order: [["timestamp", "DESC"]],
      raw: true
    });

    res.status(200).json({
      success: true,
      data: history,
      message: "Quotation history retrieved successfully"
    });
  } catch (error) {
    console.error("Error fetching quotation history:", error);

    res.status(500).json({
      success: false,
      data: null,
      message: "Error fetching quotation history",
      error: error.message
    });
  }
};
