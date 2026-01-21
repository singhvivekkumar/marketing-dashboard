import db from "../models/index.js";
import {
  logHistory,
  logBulkHistory,
} from "../services/historyService.js";

const ExportLeadsModel = db.ExportLeadsModel;
const OperationHistory = db.OperationHistory;

const MODEL_NAME = "ExportLeads";


export const CreateExportLeadsBulk = async (req, res) => {
  try {
    const BulkData = req.body.excelData;
    const { OperatorId, OperatorName } = req.body;
    console.log("CreateExportLeadsBulk service Bulk called", BulkData);

    const insertedRecords = await ExportLeadsModel.bulkCreate(BulkData, {
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
        "Error CreateExportLeadsBulk: Duplicate key value violates unique constraint"
      );
      res.status(400).json({
        success: false,
        data: [],
        message: "Duplicate key value violates unique constraint",
        error: error,
      });
    } else {
      console.error("Error CreateExportLeadsBulk :", error);
      res.status(500).json({
        success: false,
        data: [],
        message: "An error occurred",
        error: error,
      });
    }
  }
};


export const GetExportLeads = (request, response) => {
  ExportLeadsModel.findAll({
    raw: true,
  })
    .then((data) => {
      console.log("ExportLeadsModel Data", data);
      response.json({ data });
    })
    .catch((err) => {
      console.log(err); //read from CSV

      response.json({ data: "No data found for GetExportLeads" });
    });
};

export const CreateExportLeads = async (req, res) => {
  try {
    const ExportLeadsModelEx = {
      tenderName: req.body.tenderName,
      tenderReferenceNo: req.body.tenderReferenceNo,
      customerName: req.body.customerName,
      customerAddress: req.body.customerAddress,
      tenderType: req.body.tenderType,
      documentType: req.body.documentType,
      leadOwner: req.body.leadOwner,
      civilOrDefence: req.body.civilOrDefence,
      businessDomain: req.body.businessDomain,
      valueOfEMD: req.body.valueOfEMD,
      estimatedValueInCrWithoutGST: req.body.estimatedValueInCrWithoutGST,
      submittedValueInCrWithoutGST: req.body.submittedValueInCrWithoutGST,
      tenderDated: req.body.tenderDated,
      lastDateOfSub: req.body.lastDateOfSub,
      soleOrConsortium: req.body.soleOrConsortium,
      prebidMeetingDateTime: req.body.prebidMeetingDateTime,
      competitorsInfo: req.body.competitorsInfo,
      wonLostParticipated: req.body.wonLostParticipated,
      openClosed: req.body.openClosed,
      orderWonValueInCrWithoutGST: req.body.orderWonValueInCrWithoutGST,
      presentStatus: req.body.presentStatus,
      reasonForLossingOpp: req.body.reasonForLossingOpp,
      corrigendumsDateFile: req.body.corrigendumsDateFile,
      OperatorId: req.body.OperatorId,
      OperatorName: req.body.OperatorName,
      OperatorRole: req.body.OperatorRole,
      OperatorSBU: req.body.OperatorSBU,
    };

    const data = await ExportLeadsModel.create(ExportLeadsModelEx);

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

    console.log("Success");
    res.status(201).json({
      success: true,
      data: data,
      message: "Export Lead created successfully"
    });
  } catch (err) {
    console.log("Error while saving", err);
    res.status(500).send({
      message:
        err.message ||
        "Some error occurred while Create Export Leads Data.",
    });
  }
};

