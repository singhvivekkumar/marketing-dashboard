// import express from "express";
import {
    CreateInHouseRD,
    CreateInHouseRDBulk,
    GetInHouseRDData,
  } from "../controllers/InhouseRdController.js";
  
  export const InHouseRdRouter = (app) => {
    app.use(function (req, res, next) {
      //console.log("req",req.body)
      res.header(
        "Access-Control-Allow-Headers",
        "x-access-token, Origin, Content-Type, Accept"
      );
      next();
    });
    console.log("hitted DomesticLeadsRouter");
    app.get("/getInHouseRd", GetInHouseRDData);
  
    app.post("/getInHouseRd", CreateInHouseRD);
    app.post("/inHouseRDBulkUpload", CreateInHouseRDBulk);
    //  app.post(
    //   "/pdfupload",
    //   UploadPdfFile
    //);
  };
  