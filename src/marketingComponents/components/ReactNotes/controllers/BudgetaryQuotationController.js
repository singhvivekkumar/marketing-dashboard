import db from "../models/index.js";
const BudgetaryQuotationModel = db.BudgetaryQuotationModel;
import multer from "multer";
import path from "path";
import fs from "fs";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
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

export const CreateBudgetaryQuotationBulk = async (req, res) => {
  try {
    const BulkData = req.body.excelData;
    console.log("CreateBudgetaryQuotationBulk service Bulk called", BulkData);

    const insertedRecords = await BudgetaryQuotationModel.bulkCreate(BulkData, {
      validate: true,
    });

    res.status(200).json({
      success: true,
      data: insertedRecords,
      message: "All records inserted successfully",
      error: {},
    });
  } catch (error) {
    console.error("Error has encountered...");
    if (error.name === "SequelizeUniqueConstraintError") {
      // Handle unique constraint violation error
      console.error(
        "Error CreateBudgetaryQuotationBulk: Duplicate key value violates unique constraint"
      );
      // Return appropriate error res to client
      res.status(400).json({
        success: false,
        data: [],
        message: "Duplicate key value violates unique constraint",
        error: error,
      });
    } else {
      // Handle other errors
      console.error("Error CreateBudgetaryQuotationBulk :", error);
      // Return appropriate error res to client
      res.status(500).json({
        success: false,
        data: [],
        message: "An error occurred",
        error: error,
      });
    }
  }
};

export const GetBudgetaryQuotation = (request, response) => {
  BudgetaryQuotationModel.findAll({
    raw: true,
  })
    .then((data) => {
      // console.log("MarketingOrderReceivedDomExp Data", data);
      response.status(200).json({
        success: false,
        data: data,
        message: "data is successfully matched",
        error: {},
      });
    })
    .catch((err) => {
      console.log(err); //read from CSV
      response.status(500).json({
        success: false,
        data: [],
        message: "No data found for GetBudgetaryQuotation",
        error: err,
      });
    });
};

export const CreateBudgetaryQuotation = (req, res) => {
  const BudgetaryQuotationModelEx = {
    bqTitle: req.body.bqTitle,
    customerName: req.body.customerName,
    customerAddress: req.body.customerAddress,
    leadOwner: req.body.leadOwner,
    defenceAndNonDefence: req.body.defenceAndNonDefence,
    estimateValueInCrWithoutGST: req.body.estimateValueInCrWithoutGST,

    submittedValueInCrWithoutGST: req.body.submittedValueInCrWithoutGST,
    dateOfLetterSubmission: req.body.dateOfLetterSubmission,
    referenceNo: req.body.referenceNo,
    JSON_competitors: req.body.JSON_competitors,
    presentStatus: req.body.presentStatus,
    // details of file
    FileName: req.body.fileName,
    FilePath: req.body.filePath,
    HardDiskFileName: req.body.hardDiskFileName,
    // submittedAt: req.body.submittedAt,
    // // new fields
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

  BudgetaryQuotationModel.create(BudgetaryQuotationModelEx)
    .then((data) => {
      // res.send(data);
      console.log("Success");
      res.status(200).json({
        success: true,
        data: data,
        message: "The Record inserted successfully",
        error: {},
      });
    })
    .catch((err) => {
      console.log("Error while saving", err);
      res.status(500).send({
        success: false,
        data: [],
        message:
          err.message ||
          "Some error occurred while Create Budgetary Quotation Data.",
          error: err,
      });
    });

  // console.log(" UploadPdfFile into Harddisk");
};

export const UpdateBudgetaryQuotation = (req, res) => {
  console.log("req.body for  update: ", req.body);

  const id = req.body["id"];

  // Validate that id is provided
  if (!id) {
    return res.status(400).json({
      success: false,
      data: null,
      message: "Quotation ID is required",
      error: {}
    });
  }

  const queryData = req.body;
  console.log("queryData TO UPDATE : ", queryData);

  BudgetaryQuotationModel.update(queryData, {
    where: { id: queryData["id"] },
  })
    .then((num) => {
      if (num == 1) {
        console.log("Updated Repair Successfully");
        // res.status(200).json({ message: " Updated Successfully" });
        res.status(200).json({
          success: true,
          data: num,
          message: "Budgetary Quotation updated successfully",
        });
      } else {
        console.log("Updated  UnSuccessfully");
        // console.log("bhgh3ew3433333333333",res.status)
        res.send({
          message: `Cannot update UpdateBudgetaryQuotation with id=${id}. was not found or req.body is empty!`,
        });
      }
    })
    .catch((err) => {
      console.log("Error while Updating");
      res.status(500).send({
        message: "Error updating UpdateSparesData_OBS with id=" + id,
      });
    });
  // }
};

// export const UpdateBudgetaryQuotationVivek = async (req, res) => {
//   try {
//     // const { id } = req.params;

//     const id = req.body.id;
//

//     // Validate that id is provided
//     if (!id) {
//       return res.status(400).json({
//         success: false,
//         data: null,
//         message: "Quotation ID is required",
//       });
//     }

//     console.log(" update is hitted two : ");

//     // Find the quotation
//     const quotation = await BudgetaryQuotationModel.findByPk(referenceNo);

//     console.log(" update is hitted three : ", quotation);

//     if (!quotation) {
//       console.log(" didn't get the quotation...");
//       return res.status(404).json({
//         success: false,
//         data: null,
//         message: `Quotation with ID ${id} not found`,
//       });
//     }
//     console.log(" Got the quotation from database");

//     // Prepare update data
//     const updateData = {
//       bqTitle: req.body.bqTitle || quotation.bqTitle,
//       customerName: req.body.customerName || quotation.customerName,
//       customerAddress: req.body.customerAddress || quotation.customerAddress,
//       leadOwner: req.body.leadOwner || quotation.leadOwner,
//       defenceAndNonDefence:
//         req.body.defenceAndNonDefence || quotation.defenceAndNonDefence,
//       estimateValueInCrWithoutGST:
//         req.body.estimateValueInCrWithoutGST ||
//         quotation.estimateValueInCrWithoutGST,
//       submittedValueInCrWithoutGST:
//         req.body.submittedValueInCrWithoutGST ||
//         quotation.submittedValueInCrWithoutGST,
//       dateOfLetterSubmission:
//         req.body.dateOfLetterSubmission || quotation.dateOfLetterSubmission,
//       // referenceNo: req.body.referenceNo || quotation.referenceNo,
//       JSON_competitors: req.body.JSON_competitors || quotation.JSON_competitors,
//       presentStatus: req.body.presentStatus || quotation.presentStatus,
//       OperatorId: req.body.OperatorId || quotation.OperatorId,
//       OperatorName: req.body.OperatorName || quotation.OperatorName,
//       OperatorRole: req.body.OperatorRole || quotation.OperatorRole,
//       OperatorSBU: req.body.OperatorSBU || quotation.OperatorSBU,
//       FileName: req.body.fileName || quotation.FileName,
//       FilePath: req.body.filePath || quotation.FilePath,
//       HardDiskFileName: req.body.hardDiskFileName || quotation.HardDiskFileName,
//     };

//     // Update the quotation
//     const updatedQuotation = await quotation.update(updateData);

//     res.status(200).json({
//       success: true,
//       data: updatedQuotation,
//       message: "Budgetary Quotation updated successfully",
//     });
//   } catch (error) {
//     console.error("Error updating budgetary quotation:", error);

//     if (error.name === "SequelizeUniqueConstraintError") {
//       return res.status(400).json({
//         success: false,
//         data: null,
//         message: "Reference number already exists",
//         error: error.message,
//       });
//     }

//     if (error.name === "SequelizeValidationError") {
//       return res.status(400).json({
//         success: false,
//         data: null,
//         message: "Validation error",
//         error: error.errors.map((e) => e.message),
//       });
//     }

//     res.status(500).json({
//       success: false,
//       data: null,
//       message: "Error updating budgetary quotation",
//       error: error.message,
//     });
//   }
// };

// export const DeleteBudgetaryQuotationVivek = async (req, res) => {
//   try {
//     const { id } = req.params;

//     // Validate that id is provided
//     if (!id) {
//       return res.status(400).json({
//         success: false,
//         data: null,
//         message: "Quotation ID is required",
//       });
//     }

//     // Find and delete the quotation
//     const quotation = await BudgetaryQuotationModel.findAll({ where});

//     if (!quotation) {
//       return res.status(404).json({
//         success: false,
//         data: null,
//         message: `Quotation with ID ${id} not found`,
//       });
//     }

//     await quotation.destroy();

//     res.status(200).json({
//       success: true,
//       data: null,
//       message: "Budgetary Quotation deleted successfully",
//     });
//   } catch (error) {
//     console.error("Error deleting budgetary quotation:", error);

//     res.status(500).json({
//       success: false,
//       data: null,
//       message: "Error deleting budgetary quotation",
//       error: error.message,
//     });
//   }
// };

export const DeleteBudgetaryQuotation = (req, res) => {
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

  BudgetaryQuotationModel.destroy({
    where: { id: queryData["id"] },
  })
    .then((num) => {
      if (num == 1) {
        console.log("DELETE Successfully");
        res
          .status(200)
          .json({ message: " Updated Successfully for SparesData OBS" });
      } else {
        res.send({
          message: `Cannot  Update SparesData_OBS with id=${id}. was not found or req.body is empty!`,
        });
        console.log("DELETE UnSuccessfully");
      }
    })
    .catch((err) => {
      console.log("Error while DELETE");
      res.status(500).send({
        message: "Error DELETE SparesData_OBS with id=" + id,
      });
    });
};

export const UploadFile = (req, res) => {
  console.log(" Upload File into Harddisk");

  {
    const __dirname = path.resolve();
    let UPLOADS_DIR = path.join(__dirname, "uploads");

    upload.single("video")(req, res, function (err) {
      if (err instanceof multer.MulterError) {
        // A Multer error occurred when uploading.
        console.log("Multer error occurred", err);
        res.status(500).json({ error: err });
      } else if (err) {
        // An unknown error occurred when uploading.
        console.log("Unknown error occurred", err);
        res.status(500).json({ error: err });
      } else {
        const now = new Date(Date.now());
        const dateString = now.toString();
        // Everything went fine.
        const filename = req.file.filename;
        res.status(200).json({
          success: true,
          message: "File uploaded successfully",
          data: {
            fileName: filename,
            dateTime: dateString,
            filePath: UPLOADS_DIR,
          },
        });
      }
    });
  }
};

export const DownloadFile = (req, res) => {
  const hardDiskFileName = req.query.hardDiskFileName;
  console.log(" req.query of DownloadFile ", req.query);

  const __dirname = path.resolve();
  console.log("fullpath : ", __dirname);

  const UPLOADS_DIR = path.join(__dirname, "uploads");
  console.log("fullpath : ", UPLOADS_DIR);

  const fullPath = path.join(UPLOADS_DIR, hardDiskFileName);

  console.log("fullpath : ", fullPath);

  // Security: Sanitize the filename to prevent path traversal attacks.
  //  This is ESSENTIAL.  Don't just use the filename directly from the request.
  // const safeFilename = path.basename(filename); // Extract just the filename

  // Check if the file exists
  // if (!fs.existsSync(fullPath)) {
  //   return res.status(404).send('File not found');
  // }

  try {
    if (fs.existsSync(fullPath)) {
      const fileStats = fs.statSync(fullPath);

      // Ensure that the file is not a directory
      if (fileStats.isFile()) {
        // Create a readable stream for the file
        const fileStream = fs.createReadStream(fullPath);

        // Set response headers
        res.writeHead(200, {
          "Content-Type": "application/pdf",
          "Content-Length": fileStats.size,
          "filename": "rakshithaFile"
        });
        // res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
        // Pipe the file stream to the response object
        fileStream.pipe(res);
        console.log(`The ${hardDiskFileName} is sent successfully.`);
      } else {
        // Handle the case where the path points to a directory
        console.error("Error: The specified path is  not Configured.");
        res.status(400).send("The specified path is  not Configured.");
      }
    } else {
      // Handle the case where the file does not exist
      console.error("Error: The specified file does not exist.");
      res.status(404).json({
        success: false,
        data: null,
        message: "The specified file does not exist.",
        error: {},
      });
    }
  } catch (error) {
    // Handle other errors such as permission issues or unexpected errors

    console.error("Error sending file:", error);
    res.status(500).json({
      success: false,
      data: null,
      message: "Error while downloading the documents",
      error: error,
    });
  }
};
