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
    tpcrSource: req.body.tpcrSource,
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

export const TpcrUploadFile = (req, res) => {
  console.log(" TpcrUploadFile into Harddisk", req.body);
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

export const UpdateTpcrForm = (req, res) => {
  console.log("req.body for  : ", req.body);

  const id = req.body["id"];

  // Validate that id is provided
  if (!id) {
    return res.status(400).json({
      success: false,
      data: null,
      message: "Quotation ID is required",
    });
  }

  
  const queryData = req.body;

  console.log("queryData for UpdateTpcrForm", queryData);

  TPCRFormModel.update(queryData, {
    where: { id: queryData["id"] },
  })
    .then((num) => {
      if (num == 1) {
        console.log("Updated Repair Successfully");
        // res.status(200).json({ message: " Updated Successfully" });
        res.status(200).json({
          success: true,
          data: num,
          message: "TPCR Form updated successfully",
        });
      } else {
        console.log("Updated  UnSuccessfully");
        // console.log("bhgh3ew3433333333333",res.status)
        res.send({
          message: `Cannot update UpdateTpcrForm with id=${id}. was not found or req.body is empty!`,
        });
      }
    })
    .catch((err) => {
      console.log("Error while Updating");
      res.status(500).send({
        message: "Error updating UpdateTpcrForm with id=" + id,
      });
    });
  // }
};


export const DeleteTpcrForm= (req, res) => {

  const id = req.body["id"];

  // Validate that id is provided
  if (!id) {
    return res.status(400).json({
      success: false,
      data: null,
      message: "Quotation ID is required",
    });
  }

  let queryData = {};
  queryData["id"] = req.body["id"];

  TPCRFormModel.destroy({
    where: { id: queryData["id"] },
  })
    .then((num) => {
      if (num == 1) {
        console.log("DELETE Successfully");
        res.status(200).json({ message: " deleted Successfully for TPCR Form" });
      } else 
      {
        
        res.send({
          message: `Cannot  Delete TPCR Form with id=${id}. was not found or req.body is empty!`,
        });
        console.log("DELETE UnSuccessfully");
      }
    })
    .catch((err) => {
      console.log("Error while DELETE");
      res.status(500).send({
        message: "Error DELETE TPCR Form with id=" + id,
      });
    });

};