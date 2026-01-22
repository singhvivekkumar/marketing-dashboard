import db from "../models/index.js";
import {
  logHistory,
  logBulkHistory,
} from "../services/historyService.js";

const MarketingOrderReceivedDomExp = db.MarketingOrderReceivedDomExp;
const MarketingOrderReceivedDomExpHistory = db.MarketingOrderReceivedDomExpHistory;
import multer from "multer";
import path from "path";

export const CreateMarketingOrderReceivedDomExpBulk = async (req, res) => {
  try {
    const BulkData = req.body.excelData;
    const { OperatorId, OperatorName } = req.body;
    console.log("CreateMarketingOrderReceivedDomExpBulk service Bulk called", BulkData);

    const insertedRecords = await MarketingOrderReceivedDomExp.bulkCreate(BulkData, {
      validate: true,
    });

    // Log bulk history
    await logBulkHistory(
      MarketingOrderReceivedDomExpHistory,
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
        "Error CreateMarketingOrderReceivedDomExpBulk: Duplicate key value violates unique constraint"
      );
      res.status(400).json({
        success: false,
        data: [],
        message: "Duplicate key value violates unique constraint",
        error: error,
      });
    } else {
      console.error("Error CreateMarketingOrderReceivedDomExpBulk :", error);
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

export const CreateGetOrderReceivedData = async (req, res) => {
  try {
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
      OperatorId: req.body.OperatorId,
      OperatorName: req.body.OperatorName,
      OperatorRole: req.body.OperatorRole,
      OperatorSBU: req.body.OperatorSBU,
      FileName: req.body.fileName,
      FilePath: req.body.filePath,
      HardDiskFileName: req.body.hardDiskFileName,
      Dom_or_Export: req.body.Dom_or_Export,
    };

    const data = await MarketingOrderReceivedDomExp.create(OrderReceivedReqData);

    // Log to history
    await logHistory(
      MarketingOrderReceivedDomExpHistory,
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
      message: "Order Received created successfully"
    });
  } catch (err) {
    console.log("Error while saving", err);
    res.status(500).send({
      message:
        err.message ||
        "Some error occurred while Create OrderReceived Data.",
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
