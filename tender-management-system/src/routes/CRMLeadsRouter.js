import {
  CreateCRMLeads,
  CreateCRMLeadsBulk,
  GetCRMLeads,
} from "../controllers/CRMLeadController.js";

export const CRMLeadsRouter = (app) => {
  app.use(function (req, res, next) {
    //console.log("req",req.body)
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });
  console.log("hitted CRMLeadsRouter");

  app.get("/getCRMLeads", GetCRMLeads);

  app.post("/getCRMLeads", CreateCRMLeads);

  app.post("/crmLeadsBulkUpload", CreateCRMLeadsBulk);
  //  app.post(
  //   "/pdfupload",
  //   UploadPdfFile
  //);
};
