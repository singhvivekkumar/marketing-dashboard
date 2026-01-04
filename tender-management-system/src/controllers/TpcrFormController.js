import db from "../models/index.js";
import multer from "multer";
import path from "path";

const TPCRFormModel = db.TPCRFormModel;

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "Mar_uploads/");
  },
  filename: function (req, file, cb) {
    // cb(null, Date.now() + '-' + file.originalname)
    cb(null, file.originalname);
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 1000 * 1024 * 1024 }, // set file size limit to 1000 MB
});



export const CreateTpcrFormBulk = async (req, res) => {
  try {
    const BulkData = req.body.excelData;
    console.log("CreateTpcrFormBulk service Bulk called", BulkData);

    const insertedRecords = await TPCRFormModel.bulkCreate(BulkData, {
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
        "Error CreateTpcrFormBulk: Duplicate key value violates unique constraint"
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
      console.error("Error CreateTpcrFormBulk :", error);
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



export const GetTpcrForm = (request, response) => {
  TPCRFormModel.findAll({
    raw: true,
  })
    .then((data) => {
      console.log("TPCRFormModelEx Data", data);
      response.json({ data });
    })
    .catch((err) => {
      console.log(err); //read from CSV

      response.json({ data: "No data found for GetTpcrForm" });
    });
};



export const CreateTpcrForm = (req, res) => {

  const TPCRFormModelEx = {
    tpcrSlno: req.body.tpcrSlno,
    domain: req.body.domain,
    projectName: req.body.projectName,
    isYourSBULeadSBU: req.body.isYourSBULeadSBU,
    leadSBUName: req.body.leadSBUName,
    qty: req.body.qty,
    sOrSsUnderThisProject: req.body.sOrSsUnderThisProject,
    businessValue: req.body.businessValue,
    technologyParameters: req.body.technologyParameters,
    drdoRemarks: req.body.drdoRemarks,

    FileName: req.body.fileName,
    FilePath: req.body.filePath,
    HardDiskFileName: req.body.hardDiskFileName,
    
    // user data fields
    OperatorId: req.body.OperatorId,
    OperatorName: req.body.OperatorName,
    OperatorRole: req.body.OperatorRole,
    OperatorSBU: req.body.OperatorSBU,
  };

  TPCRFormModel.create(TPCRFormModelEx)
    .then((data) => {
      res.send(data);
      console.log("Successfully inserted by CreateTpcrForm controller");
    })
    .catch((err) => { 
      console.log("Error from CreateTpcrForm controller", err);
      res.status(500).send({
        message:
          err.message ||
          "Some error occurred while Create Lead Submitted Data.",
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


