import db from "../models/index.js";
import {
  logHistory,
  logBulkHistory,
} from "../services/historyService.js";

const LostFormModel = db.LostFormModel;
const OperationHistory = db.OperationHistory;

const MODEL_NAME = "LostForm";

export const CreateLostFormBulk = async (req, res) => {
  try {
    const BulkData = req.body.excelData;
    const { OperatorId, OperatorName } = req.body;
    console.log("CreateLostFormBulk service Bulk called", BulkData);

    const insertedRecords = await LostFormModel.bulkCreate(BulkData, {
      validate: true,
    });

    // Log bulk history
    await logBulkHistory(
      OperationHistory,
      MODEL_NAME,
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
        "Error CreateLostFormBulk: Duplicate key value violates unique constraint"
      );
      res.status(400).json({
        success: false,
        data: [],
        message: "Duplicate key value violates unique constraint",
        error: error,
      });
    } else {
      console.error("Error CreateLostFormBulk :", error);
      res.status(500).json({
        success: false,
        data: [],
        message: "An error occurred",
        error: error,
      });
    }
  }
};

export const GetLostForm = (request, response) => {
  LostFormModel.findAll({
    raw: true,
  })
    .then((data) => {
      console.log("Lost Form Data", data);
      response.json({ data });
    })
    .catch((err) => {
      console.log(err); //read from CSV
      response.json({ data: "No data found for Get Lost Form" });
    });
};

export const CreateLostForm = async (req, res) => {
  try {
    console.log("data received by lost controller req: ", req);

    const LostFormModelEx = {
      tenderName: req.body.tenderName,
      tenderReferenceNo: req.body.tenderReferenceNo,
      customerName: req.body.customerName,
      customerAddress: req.body.customerAddress,
      tenderType: req.body.tenderType,
      documentType: req.body.documentType,
      valueInCrWithoutGST: req.body.valueInCrWithoutGST,
      valueInCrWithGST: req.body.valueInCrWithGST,
      reasonForLossing: req.body.reasonForLossing,
      yearWeLost: req.body.yearWeLost,
      partners: req.body.partners,
      competitors: req.body.competitors,
      competitorstechnicalScore: req.body.competitorstechnicalScore,
      competitorsquotedPrice: req.body.competitorsquotedPrice,
      beltechnicalScore: req.body.beltechnicalScore,
      belquotedPrice: req.body.belquotedPrice,
      OperatorId: req.body.OperatorId,
      OperatorName: req.body.OperatorName,
      OperatorRole: req.body.OperatorRole,
      OperatorSBU: req.body.OperatorSBU,
    };

    const data = await LostFormModel.create(LostFormModelEx);

    // Log to history
    await logHistory(
      OperationHistory,
      MODEL_NAME,
      data.id,
      "added",
      req.body.OperatorId,
      req.body.OperatorName,
      null,
      data.toJSON()
    );

    console.log("Success Lost Form Model");
    res.status(201).json({
      success: true,
      data: data,
      message: "Lost Form created successfully"
    });
  } catch (err) {
    console.log("Error while saving", err);
    res.status(500).send({
      message:
        err.message ||
        "Some error occurred while Create Lost Form Data.",
    });
  }
};

