import db from "../models/index.js";
const MarketingOrderReceivedDomExp = db.MarketingOrderReceivedDomExp;
import multer from "multer";
import path from "path";

/* =========================================================
   FILE UPLOAD CONFIG
   ========================================================= */

// ABSOLUTE UPLOAD DIRECTORY
// const UPLOAD_DIR = "C:/FileUploads";

// CREATE FOLDER IF NOT EXISTS
// if (!fs.existsSync(UPLOAD_DIR)) {
//   fs.mkdirSync(UPLOAD_DIR, { recursive: true });
// }

// MULTER STORAGE
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, UPLOAD_DIR);
//   },
//   filename: function (req, file, cb) {
//     const uniqueName =
//       Date.now() +
//       "-" +
//       Math.round(Math.random() * 1e9) +
//       path.extname(file.originalname);
//     cb(null, uniqueName);
//   },
// });

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

export const CreateMarketingOrderReceivedDomExpBulk = async (req, res) => {
  try {
    const BulkData = req.body.excelData;
    console.log("CreateMarketingOrderReceivedDomExpBulk service Bulk called", BulkData);

    const insertedRecords = await MarketingOrderReceivedDomExp.bulkCreate(BulkData, {
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
        "Error CreateMarketingOrderReceivedDomExpBulk: Duplicate key value violates unique constraint"
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
      console.error("Error CreateMarketingOrderReceivedDomExpBulk :", error);
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


// Right it acc

export const GetOrderReceivedData = (request, response) => {
  MarketingOrderReceivedDomExp.findAll({
    raw: true,
  })
    .then((data) => {
      // console.log("MarketingOrderReceivedDomExp Data", data);
      response.json({ data });
    })
    .catch((err) => {
      console.log(err); //read from CSV

      response.json({ data: "No data found for GetOrderReceivedData" });
    });
};

export const CreateGetOrderReceivedData = (req, res) => {
  //console.log(" MarketingOrderReceivedDomExp service called for req", req);

  // console.log(
  //   " MarketingOrderReceivedDomExp service called for req body",
  //   req.body
  // );

  const __dirname = path.resolve();
  let UPLOADS_DIR = path.join(__dirname, "Mar_uploads");
  console.log("UPLOADS_DIR", UPLOADS_DIR);


  const OrderReceivedReqData = {
    projectTitle: req.body.projectTitle,
    customerName: req.body.customerName,
    customerAddress: req.body.customerAddress,
    defenceOrCivil: req.body.defenceOrCivil,
    PoCoWoNo: req.body.PoCoWoNo,
    orderRxdDate: req.body.orderRxdDate,
    qty: req.body.qty,
    valueWithoutGST: req.body.valueWithoutGST,
    valueWithGST: req.body.valueWithGST,
    tenderType: req.body.tenderType,
    deliverySchedule: req.body.deliverySchedule,

    remarks: req.body.remarks,
    JSON_competitors: req.body.JSON_competitors,
    submittedAt: req.body.submittedAt,
    // new fields
    OperatorId: req.body.OperatorId,
    OperatorName: req.body.OperatorName,
    OperatorRole: req.body.OperatorRole,
    OperatorSBU: req.body.OperatorSBU,
    FileName: req.body.fileName,
    FilePath: req.body.filePath,
    HardDiskFileName: req.body.hardDiskFileName,
    Dom_or_Export:req.body.Dom_or_Export,
  };

  MarketingOrderReceivedDomExp.create(OrderReceivedReqData)
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
          "Some error occurred while Create OrderReceived Data.",
      });
    });

  console.log(" create into Harddisk");
};

export const OrderUploadFile = (req, res) => {
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
      savedName: file.fileName,
      filePath: file.path, // C:\FileUploads\filename
      size: file.size,
    }));

    // res.json({
    //   files: uploadedFiles.map(f => ({
    //   originalName: f.originalname,
    //   savedName: f.filename,
    //   filePath: `/uploads/${f.filename}`,
    //   }))

    // res.status(200).json(uploadedFiles);

    res.status(200).json({
      files: uploadedFiles.map(f => ({
      originalName: f.originalname,
      savedName: f.filename,
      filePath: `/uploads/${f.filename}`,
      }))
    });
  });
};

// export const OrderUploadFile = (req, res) => {
//   console.log(" Upload File into Harddisk", req.body);

//   {
//     const __dirname = path.resolve();
//     let UPLOADS_DIR = path.join(__dirname, "uploads");

//     upload.array("video", 10)(req, res, function (err) {
//       if (err instanceof multer.MulterError) {
//         // A Multer error occurred when uploading.
//         console.log("Multer error occurred", err);
//         res.status(500).json({ error: err });
//       } else if (err) { 
//         // An unknown error occurred when uploading.
//         console.log("Unknown error occurred", err);
//         res.status(500).json({ error: err });
//       } else {
//         const now = new Date(Date.now());
//         const dateString = now.toString();
//         // Everything went fine.
//         const filename = req.file.filename;
//         res.status(200).json({
//           message: "File uploaded successfully",
//           filename: filename,
//           time: dateString,
//           path: UPLOADS_DIR,
//         });
//       }
//     });
//   }
// };

// export const UpdateOrderReceived = (req, res) => {
//   console.log("req.body for  update: ", req.body);

//   const id = req.body["id"];

//   // Validate that id is provided
//   if (!id) {
//     return res.status(400).json({
//       success: false,
//       data: null,
//       message: "Quotation ID is required",
//     });
//   }

//   const queryData = req.body;
//   console.log("queryData TO UPDATE : ", queryData);

//   MarketingOrderReceivedDomExp.update(queryData, {
//     where: { id: queryData["id"] },
//   })
//     .then((num) => {
//       if (num == 1) {
//         console.log("Updated Repair Successfully");
//         // res.status(200).json({ message: " Updated Successfully" });
//         res.status(200).json({
//           success: true,
//           data: num,
//           message: "Order Received updated successfully",
//         });
//       } else {
//         console.log("Updated  UnSuccessfully");
//         // console.log("bhgh3ew3433333333333",res.status)
//         res.send({
//           message: `Cannot update UpdateOrderReceived with id=${id}. was not found or req.body is empty!`,
//         });
//       }
//     })
//     .catch((err) => {
//       console.log("Error while Updating");
//       res.status(500).send({
//         message: "Error updating UpdateOrderReceived with id=" + id,
//       });
//     });
//   // }
// };

export const UpdateOrderReceived = (req, res) => {
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

  console.log("queryData for UpdateOrderReceived", queryData);

  MarketingOrderReceivedDomExp.update(queryData, {
    where: { id: queryData["id"] },
  })
    .then((num) => {
      if (num == 1) {
        console.log("Updated Repair Successfully");
        // res.status(200).json({ message: " Updated Successfully" });
        res.status(200).json({
          success: true,
          data: num,
          message: "Order Received updated successfully",
        });
      } else {
        console.log("Updated  UnSuccessfully");
        // console.log("bhgh3ew3433333333333",res.status)
        res.send({
          message: `Cannot update UpdateOrderReceived with id=${id}. was not found or req.body is empty!`,
        });
      }
    })
    .catch((err) => {
      console.log("Error while Updating");
      res.status(500).send({
        message: "Error updating UpdateOrderReceived with id=" + id,
      });
    });
  // }
};


export const DeleteOrderReceived= (req, res) => {

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

  MarketingOrderReceivedDomExp.destroy({
    where: { id: queryData["id"] },
  })
    .then((num) => {
      if (num == 1) {
        console.log("DELETE Successfully");
        res.status(200).json({ message: " deleted Successfully for Order Received" });
      } else 
      {
        
        res.send({
          message: `Cannot  Delete Order Received with id=${id}. was not found or req.body is empty!`,
        });
        console.log("DELETE UnSuccessfully");
      }
    })
    .catch((err) => {
      console.log("Error while DELETE");
      res.status(500).send({
        message: "Error DELETE Order Received with id=" + id,
      });
    });

};
