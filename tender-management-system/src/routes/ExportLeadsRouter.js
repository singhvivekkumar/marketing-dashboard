// import express from "express";
import {
  CreateExportLeads,
  CreateExportLeadsBulk,
  GetExportLeads,
} from "../controllers/ExportLeadsController.js";

export const ExportLeadsRouter = (app) => {
  app.use(function (req, res, next) {
    //console.log("req",req.body)
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });
  console.log("hitted DomesticLeadsRouter");
  app.get("/getExportLead", GetExportLeads);

  app.post("/getExportLead", CreateExportLeads);
  app.post("/exportLeadsBulkUpload", CreateExportLeadsBulk);
  //  app.post(
  //   "/pdfupload",
  //   UploadPdfFile
  //);
};
