// import express from "express";
import {
    CreateLeadSubmitted,
    GetLeadSubmitted,
    CreateLeadSubmittedBulk
  } from "../controllers/LeadSubmittedController.js";
  
  export const LeadSubmittedRouter = (app) => {
    app.use(function (req, res, next) {
      //console.log("req",req.body)
      res.header(
        "Access-Control-Allow-Headers",
        "x-access-token, Origin, Content-Type, Accept"
      );
      next();
    });
    console.log("hitted Lead Submitted Router");
    app.get("/getLeadSubmitted", GetLeadSubmitted);
  
    app.post("/getLeadSubmitted", CreateLeadSubmitted);
    app.post(
      "/leadSubmittedBulkUpload",
      CreateLeadSubmittedBulk
    );
  
    //  app.post(
    //   "/pdfupload",
    //   UploadPdfFile
    //);
  };
  