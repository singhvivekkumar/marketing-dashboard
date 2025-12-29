import db from "../models/index.js";
const LostFormModel = db.LostFormModel;

export const CreateLostFormBulk = async (req, res) => {
  try {
    const BulkData = req.body.excelData;
    console.log("CreateLostFormBulk service Bulk called", BulkData);

    const insertedRecords = await LostFormModel.bulkCreate(BulkData, {
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
        "Error CreateLostFormBulk: Duplicate key value violates unique constraint"
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
      console.error("Error CreateLostFormBulk :", error);
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

export const GetLostForm = (request, response) => {
  LostFormModel.findAll({
    raw: true,
  })
    .then((data) => {
      console.log("Lost Form Data", data);
      response.json({ data });
    })
    .catch((err) => {
      console.log(err); //read from CSV
      response.json({ data: "No data found for Get Lost Form" });
    });
};

export const CreateLostForm = (req, res) => {

  console.log("data received by lost controller req: ", req)

  const LostFormModelEx = {
    tenderName: req.body.tenderName,
    tenderReferenceNo: req.body.tenderReferenceNo,
    customerName: req.body.customerName,
    customerAddress: req.body.customerAddress,
    tenderType: req.body.tenderType,
    documentType: req.body.documentType,
    valueInCrWithoutGST: req.body.valueInCrWithoutGST,

    valueInCrWithGST: req.body.valueInCrWithGST,
    reasonForLossing: req.body.reasonForLossing,
    yearWeLost: req.body.yearWeLost,
    partners: req.body.partners,
    competitors: req.body.competitors,
    competitorstechnicalScore: req.body.competitorstechnicalScore,
    competitorsquotedPrice: req.body.competitorsquotedPrice,
    beltechnicalScore: req.body.beltechnicalScore,
    belquotedPrice: req.body.belquotedPrice,
    //   competitors: "",
    //   competitorstechnicalScore: "",
    //   competitorsquotedPrice: "",
    //   beltechnicalScore: "",
    //   belquotedPrice: "",

    // submittedAt: req.body.submittedAt,
    // // new fields
    OperatorId: req.body.OperatorId,
    OperatorName: req.body.OperatorName,
    OperatorRole: req.body.OperatorRole,
    OperatorSBU: req.body.OperatorSBU,

    /*  tenderName: "",
      customerName: "",
      customerAddress: "",
      tenderType: "",
      documentType: "",
      valueInCrWithoutGST: "",
      valueInCrWithGST: "",
      reasonForLossing: "",
      yearWeLost: "",
      partners: "",
      competitors: "",
      technicalScore: "",
      quotedPrice: "",
   */
  };

  LostFormModel.create(LostFormModelEx)
    .then((data) => {
      // res.send(data);
      console.log("Success Lost Form Model");
      res.send(data);
    })
    .catch((err) => {
      console.log("Error while saving", err);
      res.status(500).send({
        message:
          err.message ||
          "Some error occurred while Create Lost Form Data.",
      });
    });

  // console.log(" UploadPdfFile into Harddisk");
};

