import db from "../models/index.js";
const LostFormModel = db.LostFormModel;

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
    technicalScore: req.body.technicalScore,
    quotedPrice: req.body.quotedPrice,
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

