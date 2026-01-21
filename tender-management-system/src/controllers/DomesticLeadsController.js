import db from "../models/index.js";
import {
  logHistory,
  logBulkHistory,
} from "../services/historyService.js";

const DomesticLeadsModel = db.DomesticLeadsModel;
const OperationHistory = db.OperationHistory;

const MODEL_NAME = "DomesticLeads";

export const CreateDomesticLeadsBulk = async (req, res) => {
  try {
    const BulkData = req.body.excelData;
    const { OperatorId, OperatorName } = req.body;
    console.log("CreateDomesticLeadsBulk service Bulk called", BulkData);

    const insertedRecords = await DomesticLeadsModel.bulkCreate(BulkData, {
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
        "Error CreateDomesticLeadsBulk: Duplicate key value violates unique constraint"
      );
      res.status(400).json({
        success: false,
        data: [],
        message: "Duplicate key value violates unique constraint",
        error: error,
      });
    } else {
      console.error("Error CreateDomesticLeadsBulk :", error);
      res.status(500).json({
        success: false,
        data: [],
        message: "An error occurred",
        error: error,
      });
    }
  }
};



export const GetDomesticLeads = (request, response) => {
  DomesticLeadsModel.findAll({
    raw: true,
  })
    .then((data) => {
      console.log("DomesticLeadsModel Data", data);
      response.json({ data });
    })
    .catch((err) => {
      console.log(err); //read from CSV

      response.json({ data: "No data found for GetDomesticLeads" });
    });
};

export const CreateDomesticLeads = async (req, res) => {
  try {
    const DomesticLeadsModelEx = {
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
      participatedWithPartner: req.body.participatedWithPartner,
      OperatorId: req.body.OperatorId,
      OperatorName: req.body.OperatorName,
      OperatorRole: req.body.OperatorRole,
      OperatorSBU: req.body.OperatorSBU,
    };

    const data = await DomesticLeadsModel.create(DomesticLeadsModelEx);

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
      message: "Domestic Lead created successfully"
    });
  } catch (err) {
    console.log("Error while saving", err);
    res.status(500).send({
      message:
        err.message ||
        "Some error occurred while Create Domestic Leads Data.",
    });
  }
};

