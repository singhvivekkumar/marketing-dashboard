import express from "express";
import fs from "fs";
import CsvReadableStream from "csv-reader";
import { v4 as uuid } from "uuid";
import makeCsvWriteStream from "csv-write-stream";
import db from "../models/index.js";
const fireFormModel = db.fireFormModel;


// var fields=["equipment_name","equipment_code", "hour_meter_readingA","hour_meter_readingB",
// "Ops_deployment","Maint_others","date_occurredA", "date_occurredB",
// "fault_occurred","fault_detection","fault_category","self_diagnostics",
// "cause_of_failure","Env_condition_temp","Env_condition_humidity","symptoms_observed",
// "Effect_Op_Status","faulty_unit","serial_no","Fault_Localisation_hrs",
// "Fault_Localisation_min","Repair_Validation_hrs","Repair_Validation_mins", "logistic_access_hrs",
// "logistic_access_min","total_down_time_hrs","total_down_time_mins","repair_agency",
// "other_repair_action","Spare_Replaced_From", "spare_serial_number", "test_equipmnt",
// "documentaion","PCB_Module","cause_of_delay","voice_of_cust",
// "name_maintainer",
 
// ]
// Right it acc

/*
equipment_name
equipment_code
date_occurredA
date_occurredB
Ops_deployment
hour_meter_readingA
hour_meter_readingB
Maint_others
fault_occurred
fault_detection
fault_category
self_diagnostics
cause_of_failure
Env_condition_temp
Env_condition_humidity
symptoms_observed
Effect_Op_Status
faulty_unit
serial_no
Fault_Localisation_hrs
Fault_Localisation_min
Repair_Validation_hrs
Repair_Validation_mins
logistic_access_hrs
logistic_access_min
total_down_time_hrs
total_down_time_mins
repair_agency
other_repair_action
Spare_Replaced_From
spare_serial_number
test_equipmnt
documentaion
PCB_Module
cause_of_delay
voice_of_cust
name_maintainer
*/


export const GetFireFormData = (request, response) => {

  /*
  console.log("response",response.body)
  let users = [];

  try {
    let inputStream = fs.createReadStream(
      "./Data/" + "FireForm.csv",
      "utf8"
    );

    inputStream
      .pipe(
        new CsvReadableStream({
          parseNumbers: true,
          parseBooleans: true,
          trim: true,
        })
      )
      .on("data", function (row) {
        users.push(row);
        //console.log("users ", users);
      })
      .on("end", function () {
        //console.log("No more rows!");
        if (users.length > 0) {
          //console.log("users", users);
          response.json({ users });
        }
        console.log("users ", users);
      });
  } catch (err) {
    console.log(err);

    console.log("users", users);
    response.json({ users });
  }*/

  fireFormModel.findAll({
    raw: true,
  })
    .then((users) => {
     

      //console.log("get GetFireFormData Data", users);
      response.json( {users });
    })
    .catch((err) => {


     // console.log(err); //read from CSV

      response.json( {"data":"No data found" });
    })

};





export const CreateFireformData = (req, res) => {
  //    const user=req.body.data;
  //    users.push({...user,id:uuid()});

 /* let writer = [];
  var finalPathFile = "./Data/FireForm.csv";
  console.log("/updateProfile", req.body);
  try {
    if (!fs.existsSync(finalPathFile))
      writer = makeCsvWriteStream({ headers: fields });
    else writer = makeCsvWriteStream({ sendHeaders: false });

    writer.pipe(fs.createWriteStream(finalPathFile, { flags: "a" }));
    writer.write(req.body.data);
    writer.end();
    res.json({ message: "Submitted Successfully" });
    console.log("/updateProfile wah", new Date());
  } catch (err) {
    res.json({ message: "Not Submitted Successfully" });
  }*/

  //console.log("Fire Form Data",req.body.data)

 // console.log("Fire Form Data",req.body.data.equipment_name)

  const formData = {
  
  equipment_name:req.body.data.equipment_name,
  equipment_code:req.body.data.equipment_code,
  hour_meter_readingA: req.body.data.hour_meter_readingA,
  hour_meter_readingB:req.body.data.hour_meter_readingB, 
  Ops_deployment: req.body.data.Ops_deployment,
  Maint_others: req.body.data.Maint_others,
  date_occurredB: req.body.data.date_occurredB,
  date_occurredA: req.body.data.date_occurredA,
  fault_occurred: req.body.data.fault_occurred,
  fault_detection:req.body.data.fault_detection, 
  fault_category: req.body.data.fault_category,
  self_diagnostics: req.body.data.self_diagnostics,
  cause_of_failure: req.body.data.cause_of_failure,
  Env_condition_temp: req.body.data.Env_condition_temp,
  Env_condition_humidity:req.body.data.Env_condition_humidity, 
  symptoms_observed: req.body.data.symptoms_observed,
  Effect_Op_Status: req.body.data.Effect_Op_Status,
  faulty_unit: req.body.data.faulty_unit,
  serial_no: req.body.data.serial_no,
  Fault_Localisation_hrs: req.body.data.Fault_Localisation_hrs,
  Fault_Localisation_min: req.body.data.Fault_Localisation_min,
  Repair_Validation_hrs: req.body.data.Repair_Validation_hrs,
  Repair_Validation_mins: req.body.data.Repair_Validation_mins,
  logistic_access_hrs: req.body.data.logistic_access_hrs,
  logistic_access_min: req.body.data.logistic_access_min,
  total_down_time_hrs: req.body.data.total_down_time_hrs,
  total_down_time_mins: req.body.data.total_down_time_mins,
  repair_agency: req.body.data.repair_agency,
  other_repair_action: req.body.data.other_repair_action,
  Spare_Replaced_From:  req.body.data.Spare_Replaced_From,
  spare_serial_number: req.body.data.spare_serial_number,
  test_equipmnt:  req.body.data.test_equipmnt,
  documentaion: req.body.data.documentaion,
  PCB_Module: req.body.data.PCB_Module,
  cause_of_delay: req.body.data.cause_of_delay,
  voice_of_cust: req.body.data.voice_of_cust,
  name_maintainer: req.body.data.name_maintainer,

  OperatorId: req.body.data.OperatorId,
  OperatorName: req.body.data.OperatorName,
  OperatorRole: req.body.data.OperatorRole,
  
  };
  

//  Save Profile in the database


fireFormModel.create( formData) 
    .then((data) => {

      console.log("Success");
      res.send(data);
    })
    .catch((err) => {
      console.log("Error while saving");
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating",
      });
    });

  

};



