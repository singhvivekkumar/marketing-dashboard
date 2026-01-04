// import express from "express";
import {
  GetOrderReceivedData,
  CreateGetOrderReceivedData,
  UploadPdfFile,
  CreateMarketingOrderReceivedDomExpBulk,
} from "../controllers/MarketingOrderReceivedDomExpController.js";

export const MarketingOrderReceivedDomExpRouter = (app) => {
  app.use(function (req, res, next) {
    //console.log("req",req.body)
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });
  console.log("MarketingOrderReceivedDomExpRouter hitted");
  app.get("/getOrderReceived", GetOrderReceivedData);

  app.post("/getOrderReceived", CreateGetOrderReceivedData);

  app.post("/pdfUpload", UploadPdfFile);

  app.post("/orderReceivedBulkUpload", CreateMarketingOrderReceivedDomExpBulk);
};
