import db from "../models/index.js";
import {
  logHistory,
  logBulkHistory,
} from "../services/historyService.js";

const InHouseRDModel = db.InHouseRDModel;
const InHouseRDHistory = db.InHouseRDHistory;


export const CreateInHouseRDBulk = async (req, res) => {
  try {
    const BulkData = req.body.excelData;
    const { OperatorId, OperatorName } = req.body;
    console.log("CreateInHouseRDBulk service Bulk called", BulkData);

    const insertedRecords = await InHouseRDModel.bulkCreate(BulkData, {
      validate: true,
    });

    // Log bulk history
    await logBulkHistory(
      InHouseRDHistory,
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
        "Error CreateInHouseRDBulk: Duplicate key value violates unique constraint"
      );
      res.status(400).json({
        success: false,
        data: [],
        message: "Duplicate key value violates unique constraint",
        error: error,
      });
    } else {
      console.error("Error CreateInHouseRDBulk :", error);
      res.status(500).json({
        success: false,
        data: [],
        message: "An error occurred",
        error: error,
      });
    }
  }
};


export const GetInHouseRDData = (request, response) => {
  InHouseRDModel.findAll({
    raw: true,
  })
    .then((data) => {
      console.log("InHouseRDModel Data", data);
      response.json({ data });
    })
    .catch((err) => {
      console.log(err); //read from CSV

      response.json({ data: "No data found for GetInHouseRDData" });
    });
};

export const CreateInHouseRD = async (req, res) => {
  try {
    const InHouseRDModelEx = {
      projectName: req.body.projectName,
      teamMembers: req.body.teamMembers,
      dateOfInitiation: req.body.dateOfInitiation,
      dateOfCompletion: req.body.dateOfCompletion,
      description: req.body.description,
      projectValue: req.body.projectValue,
      OperatorId: req.body.OperatorId,
      OperatorName: req.body.OperatorName,
      OperatorRole: req.body.OperatorRole,
      OperatorSBU: req.body.OperatorSBU,
    };

    const data = await InHouseRDModel.create(InHouseRDModelEx);

    // Log to history
    await logHistory(
      InHouseRDHistory,
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
      message: "InHouse RD created successfully"
    });
  } catch (err) {
    console.log("Error while saving", err);
    res.status(500).send({
      message:
        err.message ||
        "Some error occurred while Create InHouse RD Data.",
    });
  }
};


