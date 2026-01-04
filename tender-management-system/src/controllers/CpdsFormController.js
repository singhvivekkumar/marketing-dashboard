import db from "../models/index.js";
const CPDSFormModel = db.CPDSFormModel;

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

