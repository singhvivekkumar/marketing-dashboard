import db from "../models/index.js";
const BudgetaryQuotationModel = db.BudgetaryQuotationModel;
//import multer from "multer";
//import path from "path";

export const CreateBudgetaryQuotationBulk = async (req, res) => {
  try {
    const BulkData = req.body.excelData;
    console.log("CreateBudgetaryQuotationBulk service Bulk called", BulkData);

    const insertedRecords = await BudgetaryQuotationModel.bulkCreate(BulkData, {
      validate: true,
    });

    res.status(200).json({
      success: true,
      data: insertedRecords,
      message: "All records inserted successfully",
      error: {}
    });
  } catch (error) {
    console.error("Error has encountered...");
    if (error.name === "SequelizeUniqueConstraintError") {
      // Handle unique constraint violation error
      console.error(
        "Error CreateBudgetaryQuotationBulk: Duplicate key value violates unique constraint"
      );
      // Return appropriate error response to client
      res.status(400).json({
        success: false,
        data: [],
        message: "Duplicate key value violates unique constraint",
        error: error,
      });
    } else {
      // Handle other errors
      console.error("Error CreateBudgetaryQuotationBulk :", error);
      // Return appropriate error response to client
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

export const CreateBudgetaryQuotation = (req, res) => {
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
    // submittedAt: req.body.submittedAt,
    // // new fields
    OperatorId: req.body.OperatorId,
    OperatorName: req.body.OperatorName,
    OperatorRole: req.body.OperatorRole,
    OperatorSBU: req.body.OperatorSBU,

    // bqTitle: data.bqTitle,
    // customer: data.customer,
    // leadOwner: data.leadOwner,
    // classification: data.classification,
    // estimatedValueWithoutGST: parseFloat(
    //   parseFloat(data.estimatedValueWithoutGST).toFixed(2)
    // ),
    // estimatedValueWithGST: parseFloat(
    //   parseFloat(data.estimatedValueWithGST).toFixed(2)
    // ),
    // dateLetterSubmission: data.dateLetterSubmission,
    // referenceNumber: data.referenceNumber,
    // competitor: data.competitor,
    // presentStatus: data.presentStatus,
    // submittedAt: new Date().toISOString(),
    // OperatorId: "291536",
    // OperatorName: "Vivek Kumar Singh",
    // OperatorRole:"Lead Owner",
    // OperatorSBU: "Software SBU",
  };

  BudgetaryQuotationModel.create(BudgetaryQuotationModelEx)
    .then((data) => {
      // res.send(data);
      console.log("Success");
      res.send(data);
    })
    .catch((err) => {
      console.log("Error while saving", err);
      res.status(500).send({
        message:
          err.message ||
          "Some error occurred while Create Budgetary Quotation Data.",
      });
    });

  // console.log(" UploadPdfFile into Harddisk");
};

export const UpdateBudgetaryQuotation = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate that id is provided
    if (!id) {
      return res.status(400).json({
        success: false,
        data: null,
        message: "Quotation ID is required"
      });
    }

    // Find the quotation
    const quotation = await BudgetaryQuotationModel.findByPk(id);

    if (!quotation) {
      return res.status(404).json({
        success: false,
        data: null,
        message: `Quotation with ID ${id} not found`
      });
    }

    // Prepare update data
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

    // Update the quotation
    const updatedQuotation = await quotation.update(updateData);

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

    // Validate that id is provided
    if (!id) {
      return res.status(400).json({
        success: false,
        data: null,
        message: "Quotation ID is required"
      });
    }

    // Find and delete the quotation
    const quotation = await BudgetaryQuotationModel.findByPk(id);

    if (!quotation) {
      return res.status(404).json({
        success: false,
        data: null,
        message: `Quotation with ID ${id} not found`
      });
    }

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
