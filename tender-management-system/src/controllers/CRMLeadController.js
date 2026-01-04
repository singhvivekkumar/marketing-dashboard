import db from "../models/index.js";
const CRMLeadsModel = db.CRMLeadsModel;
//import multer from "multer";
//import path from "path";

export const CreateCRMLeadsBulk = async (req, res) => {
  try {
    const BulkData = req.body.excelData;
    console.log("CreateCRMLeadsBulk service Bulk called", BulkData);

    const insertedRecords = await CRMLeadsModel.bulkCreate(BulkData, {
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
        "Error CreateCRMLeadsBulk: Duplicate key value violates unique constraint"
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
      console.error("Error CreateCRMLeadsBulk :", error);
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

export const CreateCRMLeads = (req, res) => {


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
    // submittedAt: req.body.submittedAt,
    // // new fields
    OperatorId: req.body.OperatorId,
    OperatorName: req.body.OperatorName,
    OperatorRole: req.body.OperatorRole,
    OperatorSBU: req.body.OperatorSBU,

    // leadID: '',
    //   issueDate: '',
    //   tenderName: '',
    //   organisation: '',
    //   documentType: '',
    //   tenderType: '',
    //   emdInCrore: '',
    //   approxTenderValueCrore: '',
    //   lastDateSubmission: '',
    //   preBidDate: '',
    //   teamAssigned: '',
    //   remarks: '',
    //   corrigendumInfo: ''
  };

  CRMLeadsModel.create(CRMLeadsModelEx)
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

