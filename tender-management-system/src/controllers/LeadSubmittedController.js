import db from "../models/index.js";
import {
  logHistory,
  logBulkHistory,
} from "../services/historyService.js";

const LeadSubmittedModel = db.LeadSubmittedModel;
const LeadSubmittedHistory = db.LeadSubmittedHistory;

export const CreateLeadSubmittedBulk = async (req, res) => {
  try {
    const BulkData = req.body.excelData;
    const { OperatorId, OperatorName } = req.body;
    console.log("CreateLeadSubmittedBulk service Bulk called", BulkData);

    const insertedRecords = await LeadSubmittedModel.bulkCreate(BulkData, {
      validate: true,
    });

    // Log bulk history
    await logBulkHistory(
      LeadSubmittedHistory,
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
        "Error CreateLeadSubmittedBulk: Duplicate key value violates unique constraint"
      );
      res.status(400).json({
        success: false,
        data: [],
        message: "Duplicate key value violates unique constraint",
        error: error,
      });
    } else {
      console.error("Error CreateLeadSubmittedBulk :", error);
      res.status(500).json({
        success: false,
        data: [],
        message: "An error occurred",
        error: error,
      });
    }
  }
};

export const GetLeadSubmitted = (request, response) => {
  LeadSubmittedModel.findAll({
    raw: true,
  })
    .then((data) => {
      // console.log("MarketingOrderReceivedDomExp Data", data);
      response.json({ data });
    })
    .catch((err) => {
      console.log(err); //read from CSV

      response.json({ data: "No data found for GetLeadSubmitted" });
    });
};

export const CreateLeadSubmitted = async (req, res) => {
  try {
    const LeadSubmittedModelEx = {
      tenderName: req.body.tenderName,
      customerName: req.body.customerName,
      customerAddress: req.body.customerAddress,
      tenderDate: req.body.tenderDate,
      bidOwner: req.body.bidOwner,
      rfpReceivedOn: req.body.rfpReceivedOn,
      valueEMDInCrore: req.body.valueEMDInCrore,
      rfpDueDate: req.body.rfpDueDate,
      dmktgInPrincipalApprovalRxdOn: req.body.dmktgInPrincipalApprovalRxdOn,
      sellingPriceApprovalInitiatedOn: req.body.sellingPriceApprovalInitiatedOn,
      bidSubmittedOn: req.body.bidSubmittedOn,
      approvalSBUFinanceOn: req.body.approvalSBUFinanceOn,
      approvalGMOn: req.body.approvalGMOn,
      sentToFinanceGMDmktgApprovalRxdOn:
        req.body.sentToFinanceGMDmktgApprovalRxdOn,
      dmktgApprovalRxdOn: req.body.dmktgApprovalRxdOn,
      tenderReferenceNo: req.body.tenderReferenceNo,
      tenderType: req.body.tenderType,
      website: req.body.website,
      presentStatus: req.body.presentStatus,
      competitorsInfo: req.body.competitorsInfo,
      participatedWithPartner: req.body.participatedWithPartner,
      OperatorId: req.body.OperatorId,
      OperatorName: req.body.OperatorName,
      OperatorRole: req.body.OperatorRole,
      OperatorSBU: req.body.OperatorSBU,
    };

    const data = await LeadSubmittedModel.create(LeadSubmittedModelEx);

    // Log to history
    await logHistory(
      LeadSubmittedHistory,
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
      message: "Lead Submitted created successfully"
    });
  } catch (err) {
    console.log("Error while saving", err);
    res.status(500).send({
      message:
        err.message ||
        "Some error occurred while Create Lead Submitted Data.",
    });
  }
};
