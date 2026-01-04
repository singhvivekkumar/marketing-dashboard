import db from "../models/index.js";
const MarketingOrderReceivedDomExp = db.MarketingOrderReceivedDomExp;
import multer from "multer";
import path from "path";

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
    contractName: req.body.contractName,
    customerName: req.body.customerName,
    customerAddress: req.body.customerAddress,
    orderReceicedDate: req.body.orderReceivedDate,
    purchaseOrder: req.body.PoCoWoNo,
    typeOfTender: req.body.typeOfTender,

    valueWithoutGST: req.body.valueWithoutGST,
    valueWithGST: req.body.valueWithGST,
    JSON_competitors: req.body.JSON_competitors,
    remarks: req.body.remarks,
    contractCopy: req.body.attachment,
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
