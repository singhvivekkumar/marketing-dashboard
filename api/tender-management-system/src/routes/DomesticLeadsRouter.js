// import express from "express";
import {
  CreateDomesticLeads,
  CreateDomesticLeadsBulk,
  GetDomesticLeads,
} from "../controllers/DomesticLeadsController.js";

export const DomesticLeadsRouter = (app) => {
  app.use(function (req, res, next) {
    //console.log("req",req.body)
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });
  console.log("hitted DomesticLeadsRouter");

  app.get("/getDomesticLead", GetDomesticLeads);

  app.post("/getDomesticLead", CreateDomesticLeads);

  app.post("/domesticLeadsBulkUpload", CreateDomesticLeadsBulk);
};
