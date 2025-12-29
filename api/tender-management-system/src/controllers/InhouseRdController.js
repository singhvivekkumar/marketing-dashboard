import db from "../models/index.js";
const InHouseRDModel = db.InHouseRDModel;


export const CreateInHouseRDBulk = async (req, res) => {
  try {
    const BulkData = req.body.excelData;
    console.log("CreateInHouseRDBulk service Bulk called", BulkData);

    const insertedRecords = await InHouseRDModel.bulkCreate(BulkData, {
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
        "Error CreateInHouseRDBulk: Duplicate key value violates unique constraint"
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
      console.error("Error CreateInHouseRDBulk :", error);
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

export const CreateInHouseRD = (req, res) => {


  // defaultValues: {
  //   projectName: "",
  //   teamMembers: "",
  //   dateOfInitiation: "",
  //   dateOfCompletion: "",
  //   description: "",
  //   projectValue: "",


  const InHouseRDModelEx = {
    projectName: req.body.projectName,
    teamMembers: req.body.teamMembers,
    dateOfInitiation: req.body.dateOfInitiation,
    dateOfCompletion: req.body.dateOfCompletion,
    description: req.body.description,
    projectValue: req.body.projectValue,
    //submittedAt: req.body.submittedAt,
    OperatorId: req.body.OperatorId,
    OperatorName: req.body.OperatorName,
    OperatorRole: req.body.OperatorRole,
    OperatorSBU: req.body.OperatorSBU,

  };

  InHouseRDModel.create(InHouseRDModelEx)
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
          "Some error occurred while Create Domestic Leads Data.",
      });
    });

  // console.log(" UploadPdfFile into Harddisk");
};

