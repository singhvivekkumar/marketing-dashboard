import express from "express";
import fs from "fs";
import CsvReadableStream from "csv-reader";

import db from "../models/index.js";

const MrotSparesManagement_OBS = db.MrotSparesManagement_OBS;
const MrotSparesManagement_BD = db.MrotSparesManagement_BD;


// Right it acc

export const GetSparesData_OBS= (request, response) => {


    console.log("GetSparesData..............")
    MrotSparesManagement_OBS.findAll({ raw: true })
    .then((data) => { 

      response.json({ data });
    })
    .catch((err) => {
      console.log(err); //read from CSV

      response.json({ data:"Not Found" });
    });
  
};
export const DeleteSparesData_BD= (request, response) => {

  const id = request.body["ID"];

  let queryData = {};
  queryData["ID"] = request.body["ID"];

  MrotSparesManagement_BD.destroy({
    where: { SerialNumber: queryData["ID"] },
  })
    .then((num) => {
      if (num == 1) {
        console.log("DELETE Successfully");
        response.status(200).json({ message: " Updated Successfully for SparesData BD}" });
      } else 
      {
        
        response.send({
          message: `Cannot  Update SparesData_BD with id=${id}. was not found or req.body is empty!`,
        });
        console.log("DELETE UnSuccessfully");
      }
    })
    .catch((err) => {
      console.log("Error while DELETE");
      response.status(500).send({
        message: "Error DELETE SparesData_BD with id=" + id,
      });
    });

};

export const DeleteSparesData_OBS= (request, response) => {

  const id = request.body["ID"];

  let queryData = {};
  queryData["ID"] = request.body["ID"];

  MrotSparesManagement_OBS.destroy({
    where: { SerialNumber: queryData["ID"] },
  })
    .then((num) => {
      if (num == 1) {
        console.log("DELETE Successfully");
        response.status(200).json({ message: " Updated Successfully for SparesData OBS" });
      } else 
      {
        
        response.send({
          message: `Cannot  Update SparesData_OBS with id=${id}. was not found or req.body is empty!`,
        });
        console.log("DELETE UnSuccessfully");
      }
    })
    .catch((err) => {
      console.log("Error while DELETE");
      response.status(500).send({
        message: "Error DELETE SparesData_OBS with id=" + id,
      });
    });

};


export const UpdateSparesData_OBS= (request, response) => {


  console.log("request.body",request.body)

  const id = request.body["ID"];
  let queryData = {};

  queryData["ID"] = request.body["ID"];
  queryData["StorageLocation"] = request.body["StorageLocation"];


  console.log("queryData for UpdateSparesData_OBS rrrr", queryData["ID"]);

  MrotSparesManagement_OBS.update(queryData, {
    where: { ID: queryData["ID"] },
  })
    .then((num) => {
      if (num == 1) {
        console.log("Updated Successfully");
        response.status(200).json({ message: " Updated Successfully" });
      } else {
        console.log("Updated UnSuccessfully");
        response.send({
          message: `Cannot update UpdateSparesData_OBS with id=${id}. was not found or req.body is empty!`,
        });
      }
    })
    .catch((err) => {
      console.log("Error while Updating");
      response.status(500).send({
        message: "Error updating UpdateSparesData_OBS with id=" + id,
      });
    });

};


export const UpdateRepairSparesData_OBS = (request, response) => {


  console.log("request.body11",request.body)

  const id = request.body["ID"];

  // if(req.body.ID !==null || req.body.ID !== undefined){
  let queryData = {};

  queryData["ID"] = request.body["ID"];
  queryData["Cabinet"] = request.body["Cabinet"];
  queryData["QtyOwnShip"] = request.body["QtyOwnShip"];
  queryData["QtyLandedForRepair"] = request.body["QtyLandedForRepair"];

  console.log("queryData for UpdateRepairSparesData_OBS", queryData["ID"]);

  MrotSparesManagement_OBS.update(queryData, {
    where: {ID: queryData["ID"] },
  })
    .then((num) => {
      if (num == 1) {
        console.log("Updated Repair Successfully");
        response.status(200).json({ message: " Updated Successfully" });
      } else {
        console.log("Updated  UnSuccessfully");
        // console.log("bhgh3ew3433333333333",response.status)
        response.send({
          message: `Cannot update UpdateRepairSparesData_OBS with id=${id}. was not found or req.body is empty!`,
        });
      }
    })
    .catch((err) => {
      console.log("Error while Updating");
      response.status(500).send({
        message: "Error updating UpdateSparesData_OBS with id=" + id,
      });
    });
  // }
};

export const UpdateDefaultRepairSparesData_OBS = (request, response) => {


  console.log("request.body UpdateDefaultRepairSparesData_OBS",request.body)

  const id = request.body["ID"];

  // if(req.body.ID !==null || req.body.ID !== undefined){
  let queryData = {};

  queryData["ID"] = request.body["ID"];
  queryData["Cabinet"] = request.body["Cabinet"];
  queryData["QtyOwnShip"] = request.body["QtyOwnShip"];
  queryData["QtyLandedForRepair"] = request.body["QtyLandedForRepair"];
 

  console.log("queryData for UpdateDefaultRepairSparesData_OBS", queryData["ID"]);

  MrotSparesManagement_OBS.update(queryData, {
    where: {ID: queryData["ID"] },
  })
    .then((num) => {
      if (num == 1) {
        console.log("Updated Repair Successfully");
        response.status(200).json({ message: " Updated Successfully" });
      } else {
        console.log("Updated  UnSuccessfully");
        // console.log("bhgh3ew3433333333333",response.status)
        response.send({
          message: `Cannot update UpdateRepairSparesData_OBS with id=${id}. was not found or req.body is empty!`,
        });
      }
    })
    .catch((err) => {
      console.log("Error while Updating");
      response.status(500).send({
        message: "Error updating UpdateSparesData_OBS with id=" + id,
      });
    });
  // }
};


export const CreateSparesData_OBS= (req, res) => {


    console.log("CreateSparesData CreateSparesData called",req.body["SerialNumber"],req.body["SerialNumber"])

const OBSData = {
      ID: req.body["ID"],
      Cabinet: req.body["Cabinet"],
      SerialNumber: req.body["SerialNumber"],
      PartNumber: req.body["PartNumber"],
      Description: req.body["Description"],
      QtyOwnShip: req.body["QtyOwnShip"],
      QtyLandedForRepair: req.body["QtyLandedForRepair"],
      StorageLocation: req.body["StorageLocation"],
      RunningHrs: req.body["RunningHrs"],
      MTBF: req.body["MTBF"],
  
      DeployedDate: req.body["DeployedDate"],
      LastRepairDate: req.body["LastRepairDate"],
      MaintainerName: req.body["MaintainerName"],
      Remarks: req.body["Remarks"],
  
  
    };

//Save Profile in the database
MrotSparesManagement_OBS.create(OBSData)
      .then((data) => {
        // res.send(data);
        console.log("Success");
        res.send(data);
      })
      .catch((err) => {
        console.log("Error while saving");
        res.status(500).send({
          message:
            err.message || "Some error occurred while creating the OBS Data."
        });
      });
    // New Code for Database
  
    
  
  
};



export const GetSparesData_BD= (request, response) => {


  console.log("GetSparesData BD..............")
  MrotSparesManagement_BD.findAll({ raw: true })
  .then((data) => {

    
    response.json({ data });
  })
  .catch((err) => {
    console.log(err); //read from CSV

    response.json({ data:"Not Found" });
  });

};


export const CreateSparesData_BD= (req, res) => {


console.log("CreateSparesData  BD CreateSparesData called",req.body["SerialNumber"])

const OBSData = {
    ID: req.body["SerialNumber"],
    Cabinet: req.body["Cabinet"],
    SerialNumber: req.body["SerialNumber"],
    PartNumber: req.body["PartNumber"],
    Description: req.body["Description"],
    QtyBD: req.body["QtyBD"],
    RunningHrs: req.body["RunningHrs"],
    MTBF: req.body["MTBF"],

  };

//Save Profile in the database
MrotSparesManagement_BD.create(OBSData)
    .then((data) => {
      // res.send(data);
      console.log("Success");
      res.send(data);
    })
    .catch((err) => {
      console.log("Error while saving");
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the OBS Data."
      });
    });
  // New Code for Database

  


};

export const CreateOBSDataBulk = async(req, res) => {
  

  try {
    const MaintData = req.body.csvDataJSON;
    console.log("MrotSparesManagement_OBS service Bulk called", MaintData);
    const insertedRecords = await MrotSparesManagement_OBS.bulkCreate(MaintData, { validate: true });
    console.error("success:");
    res.status(200).json({ message: "Data inserted successfully" });
  } catch (error) {

  
    if (error.name === 'SequelizeUniqueConstraintError') {
      // Handle unique constraint violation error
      console.error('Error: Duplicate key value violates unique constraint');
      // Return appropriate error response to client
    } else {
      // Handle other errors
      console.error('Error:', error);
      // Return appropriate error response to client
    }


    console.error(error);
    res.status(500).json({ message: "An error occurred" });
  }
};

export const CreateBDDataBulk = async(req, res) => {
  

  try {
    const MaintData = req.body.csvDataJSON;
    console.log("MrotSparesManagement_BD service Bulk called", MaintData);
    const insertedRecords = await MrotSparesManagement_BD.bulkCreate(MaintData, { validate: true });
    console.error("success:");
    res.status(200).json({ message: "Data inserted successfully" });
  } catch (error) {

  
    if (error.name === 'SequelizeUniqueConstraintError') {
      // Handle unique constraint violation error
      console.error('Error: Duplicate key value violates unique constraint');
      // Return appropriate error response to client
    } else {
      // Handle other errors
      console.error('Error:', error);
      // Return appropriate error response to client
    }


    console.error(error);
    res.status(500).json({ message: "An error occurred" });
  }
};
