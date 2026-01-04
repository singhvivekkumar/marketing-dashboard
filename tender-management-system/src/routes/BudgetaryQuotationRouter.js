// import express from "express";
import {
  CreateBudgetaryQuotation,
  GetBudgetaryQuotation,
  CreateBudgetaryQuotationBulk,
  UpdateBudgetaryQuotation,
  DeleteBudgetaryQuotation,
} from "../controllers/BudgetaryQuotationController.js";

export const BudgetaryQuotationRouter = (app) => {
  app.use(function (req, res, next) {
    //console.log("req",req.body)
    res.header(
      "Access-Control-Allow-Headers", 
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });
  console.log("hitted BudgetaryQuotationRouter");
  app.get("/getBudgetaryQuoatation", GetBudgetaryQuotation);
  app.post("/getBudgetaryQuoatation", CreateBudgetaryQuotation);
  app.put("/getBudgetaryQuoatation/:id", UpdateBudgetaryQuotation);
  app.delete("/getBudgetaryQuoatation/:id", DeleteBudgetaryQuotation);
  app.post(
    "/bqbulkUpload",
    CreateBudgetaryQuotationBulk
  );

  //  app.post(
  //   "/pdfupload",
  //   UploadPdfFile
  //);
};
