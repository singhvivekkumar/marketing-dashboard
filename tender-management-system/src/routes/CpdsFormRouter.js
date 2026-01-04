// import express from "express";
import {
    CreateCpdsForm,
    CreateCpdsBulkUpload,
    GetCpdsForm,
  } from "../controllers/CpdsFormController.js";
  
  export const CpdsFormRouter = (app) => {
    app.use(function (req, res, next) {
      //console.log("req",req.body)
      res.header(
        "Access-Control-Allow-Headers",
        "x-access-token, Origin, Content-Type, Accept"
      );
      next();
    });
    console.log("hitted CpdsFormRouter");
  
    app.get("/getCpdsForm", GetCpdsForm);
  
    app.post("/getCpdsForm", CreateCpdsForm);
  
    app.post("/cpdsFormBulkUpload", CreateCpdsBulkUpload);
  };
  