// import express from "express";
import {
  CreateTpcrForm,
  GetTpcrForm,
  CreateTpcrFormBulk,
} from "../controllers/TpcrFormController.js";

export const TpcrFormRouter = (app) => {
  app.use(function (req, res, next) {
    console.log("req", req.body);
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });
  console.log("hitted TPCR Form Router");
  app.get("/getTPCRForm", GetTpcrForm);

  app.post("/getTPCRForm", CreateTpcrForm);

  app.post("/tpcrFormBulkUpload", CreateTpcrFormBulk);

  //  app.post(
  //   "/pdfupload",
  //   UploadPdfFile
  //);
};
