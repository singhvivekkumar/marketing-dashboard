import db from "../models/index.js";
const LeadSubmittedModel = db.LeadSubmittedModel;

export const CreateLeadSubmittedBulk = async (req, res) => {
  try {
    const BulkData = req.body.excelData;
    console.log("CreateLeadSubmittedBulk service Bulk called", BulkData);

    const insertedRecords = await LeadSubmittedModel.bulkCreate(BulkData, {
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
        "Error CreateLeadSubmittedBulk: Duplicate key value violates unique constraint"
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
      console.error("Error CreateLeadSubmittedBulk :", error);
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

export const CreateLeadSubmitted = (req, res) => {
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
    sellingPriceApprovalInitiatedOn: req.body.sellingPriceApprovalInitiatedOn,
    dmktgApprovalRxdOn: req.body.dmktgApprovalRxdOn,
    tenderReferenceNo: req.body.tenderReferenceNo,
    tenderType: req.body.tenderType,
    website: req.body.website,
    presentStatus: req.body.presentStatus,
    // new fields

    competitorsInfo: req.body.competitorsInfo,
    participatedWithPartner: req.body.participatedWithPartner,

    // user data fields
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

  LeadSubmittedModel.create(LeadSubmittedModelEx)
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
          "Some error occurred while Create Lead Submitted Data.",
      });
    });

  // console.log(" UploadPdfFile into Harddisk");
};
