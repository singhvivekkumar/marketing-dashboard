import db from "../models/index.js";
import {
  logHistory,
  logBulkHistory,
} from "../services/historyService.js";

const CRMLeadsModel = db.CRMLeadsModel;
const CRMLeadHistory = db.CRMLeadHistory;

export const CreateCRMLeadsBulk = async (req, res) => {
  try {
    const BulkData = req.body.excelData;
    const { OperatorId, OperatorName } = req.body;
    console.log("CreateCRMLeadsBulk service Bulk called", BulkData);

    const insertedRecords = await CRMLeadsModel.bulkCreate(BulkData, {
      validate: true,
    });

    // Log bulk history
    await logBulkHistory(
      CRMLeadHistory,
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
        "Error CreateCRMLeadsBulk: Duplicate key value violates unique constraint"
      );
      res.status(400).json({
        success: false,
        data: [],
        message: "Duplicate key value violates unique constraint",
        error: error,
      });
    } else {
      console.error("Error CreateCRMLeadsBulk :", error);
      res.status(500).json({
        success: false,
        data: [],
        message: "An error occurred",
        error: error,
      });
    }
  }
};


export const GetCRMLeads = (request, response) => {
  CRMLeadsModel.findAll({
    raw: true,
  })
    .then((data) => {
      // console.log("MarketingOrderReceivedDomExp Data", data);
      response.json({ data });
    })
    .catch((err) => {
      console.log(err); //read from CSV

      response.json({ data: "No data found for GetCRMLeads" });
    });
};

export const CreateCRMLeads = async (req, res) => {
  try {
    const CRMLeadsModelEx = {
      leadID: req.body.leadID,
      issueDate: req.body.issueDate,
      tenderName: req.body.tenderName,
      organisation: req.body.organisation,
      documentType: req.body.documentType,
      tenderType: req.body.tenderType,
      emdInCrore: req.body.emdInCrore,
      approxTenderValueCrore: req.body.approxTenderValueCrore,
      lastDateSubmission: req.body.lastDateSubmission,
      preBidDate: req.body.preBidDate,
      teamAssigned: req.body.teamAssigned,
      remarks: req.body.remarks,
      corrigendumInfo: req.body.corrigendumInfo,
      OperatorId: req.body.OperatorId,
      OperatorName: req.body.OperatorName,
      OperatorRole: req.body.OperatorRole,
      OperatorSBU: req.body.OperatorSBU,
    };

    const data = await CRMLeadsModel.create(CRMLeadsModelEx);

    // Log to history
    await logHistory(
      CRMLeadHistory,
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
      message: "CRM Lead created successfully"
    });
  } catch (err) {
    console.log("Error while saving", err);
    res.status(500).send({
      message:
        err.message ||
        "Some error occurred while Create CRM Lead Data.",
    });
  }
};

export const UploadPdfFile = (req, res) => {
  console.log(" UploadPdfFile into Harddisk");

  {
    const __dirname = path.resolve();
    let UPLOADS_DIR = path.join(__dirname, "uploads");
    upload.single("video")(req, res, function (err) {
      if (err instanceof multer.MulterError) {
        // A Multer error occurred when uploading.
        console.log("Error 2", err);
        res.status(500).json({ error: err });
      } else if (err) {
        // An unknown error occurred when uploading.
        console.log("Error 1", err);
        res.status(500).json({ error: err });
      } else {
        const now = new Date(Date.now());
        const dateString = now.toString();
        // Everything went fine.
        const filename = req.file.filename;
        res
          .status(200)
          .json({
            message: "File uploaded successfully",
            filename: filename,
            time: dateString,
            path: UPLOADS_DIR,
          });
      }
    });
  }
};

