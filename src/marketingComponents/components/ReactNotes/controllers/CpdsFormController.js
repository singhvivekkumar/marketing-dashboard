import db from "../models/index.js";
const CPDSFormModel = db.CPDSFormModel;
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

export const CreateCpdsBulkUpload = async (req, res) => {
  try {
    const BulkData = req.body.excelData;
    console.log("CreateCpdsBulkUpload service Bulk called", BulkData);

    const insertedRecords = await CPDSFormModel.bulkCreate(BulkData, {
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
        "Error CreateCpdsBulkUpload: Duplicate key value violates unique constraint"
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
      console.error("Error CreateCpdsBulkUpload :", error);
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



export const GetCpdsForm = (request, response) => {
  CPDSFormModel.findAll({
    raw: true,
  })
    .then((data) => {
      console.log("CPDSFormModel Data", data);
      response.json({ data });
    })
    .catch((err) => {
      console.log(err); //read from CSV

      response.json({ data: "No data found for GetCpdsForm" });
    });
};

export const CreateCpdsForm = (req, res) => {


  const CPDSFormModelEx = {
    pdsNo: req.body.pdsNo,
    title: req.body.title,
    remarks: req.body.remarks,
    // 
    OperatorId: req.body.OperatorId,
    OperatorName: req.body.OperatorName,
    OperatorRole: req.body.OperatorRole,
    OperatorSBU: req.body.OperatorSBU,
    //submittedAt: req.body.submittedAt,

    
    // defaultValues: {
        //     pdsNo: "",
        //     title: "",
        //     remarks: "",

  };

  CPDSFormModel.create(CPDSFormModelEx)
    .then((data) => {
      res.send(data);
      console.log("Successfully inserted by CreateCpdsForm controller");
    })
    .catch((err) => {
      console.log("Error while saving", err);
      res.status(500).send({
        message:
          err.message ||
          "Some error occurred while Create CPDS Data.",
      });
    });

  // console.log(" UploadPdfFile into Harddisk");
};

export const CpdsUploadFile = (req, res) => {
  console.log(" OrderUploadFile into Harddisk", req.body);
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

export const UpdateCpdsForm = (req, res) => {
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

  console.log("queryData for UpdateCpdsForm", queryData);

  CPDSFormModel.update(queryData, {
    where: { id: queryData["id"] },
  })
    .then((num) => {
      if (num == 1) {
        console.log("Updated Repair Successfully");
        // res.status(200).json({ message: " Updated Successfully" });
        res.status(200).json({
          success: true,
          data: num,
          message: "CPDS Form updated successfully",
        });
      } else {
        console.log("Updated  UnSuccessfully");
        // console.log("bhgh3ew3433333333333",res.status)
        res.send({
          message: `Cannot update UpdateCpdsForm with id=${id}. was not found or req.body is empty!`,
        });
      }
    })
    .catch((err) => {
      console.log("Error while Updating");
      res.status(500).send({
        message: "Error updating UpdateCpdsForm with id=" + id,
      });
    });
  // }
};


export const DeleteCpdsForm= (req, res) => {

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

  CPDSFormModel.destroy({
    where: { id: queryData["id"] },
  })
    .then((num) => {
      if (num == 1) {
        console.log("DELETE Successfully");
        res.status(200).json({ message: " deleted Successfully for CPDS Form" });
      } else 
      {
        
        res.send({
          message: `Cannot  Delete CPDS Form with id=${id}. was not found or req.body is empty!`,
        });
        console.log("DELETE UnSuccessfully");
      }
    })
    .catch((err) => {
      console.log("Error while DELETE");
      res.status(500).send({
        message: "Error DELETE CPDS Form with id=" + id,
      });
    });

};

