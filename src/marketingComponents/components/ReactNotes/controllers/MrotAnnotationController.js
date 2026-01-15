import express from "express";
import fs from "fs";
import CsvReadableStream from "csv-reader";

import db from "../models/index.js";

const UserAnnotationHistory = db.UserAnnotationHistory;


// Right it acc

export const GetAnnotationData = (request, response) => {
  UserAnnotationHistory.findAll({
    raw: true,
  })
    .then((data) => {
     

      //console.log("Annotation Data", data);
      response.json( {data });
    })
    .catch((err) => {
      console.log(err); //read from CSV

      response.json( {"data":"No data found" });
    })

     
};

export const CreateAnnotationData = (req, res) => {
  //console.log(" CreateAnnotationData service called for req.body.id", req.body);

  const Annodata = {
    //id:req.body.id,
    OperatorId: req.body.OperatorId,
    OperatorName: req.body.OperatorName,
    OperatorRole: req.body.OperatorRole,
    PdfName: req.body.PdfName,
    PdfPath: req.body.PdfPath,
    PdfPageNumber: req.body.PdfPageNumber,
    PdfSectionNumber: req.body.PdfSectionNumber,
    OperatorRemarks: req.body.OperatorRemarks,
    AnnotationCreatedDate: req.body.AnnotationCreatedDate,

  };
  
  // Save Profile in the database
  UserAnnotationHistory.create(Annodata) 
    .then((data) => {
      // res.send(data);
      console.log("Success");
      res.send(data);
    })
    .catch((err) => {
      console.log("Error while saving");
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Tutorial.",
      });
    });

  
};


