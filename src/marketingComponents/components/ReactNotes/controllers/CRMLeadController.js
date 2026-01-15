import db from "../models/index.js";
const CRMLeadsModel = db.CRMLeadsModel;
import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    // cb(null, Date.now() + '-' + file.originalname)
    cb(null, file.originalname);
  },
});


// MULTER INSTANCE
const upload = multer({
  storage : storage,
  limits: { fileSize: 1000 * 1024 * 1024 }, // 1000 MB
});

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
      console.log(" error from GetCRMLeads : ",err); //read from CSV

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
    FileName: req.body.fileName,
    FilePath: req.body.filePath,
    HardDiskFileName: req.body.hardDiskFileName,
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

export const CrmUploadFile = (req, res) => {
  console.log(" CrmUploadFile into Harddisk", req.body);
  upload.array("files", 10)(req, res, function (err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "No files uploaded" });
    }

    const uploadedFiles = req.files.map((file) => ({
      originalName: file.originalname,
      savedName: file.filename,
      filePath: file.path, // C:\FileUploads\filename
      size: file.size,
    }));

    res.status(200).json(uploadedFiles);
  });
};


