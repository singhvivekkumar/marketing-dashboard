import express from "express";
import fs from "fs";
import CsvReadableStream from "csv-reader";
import { v4 as uuid } from "uuid";
import makeCsvWriteStream from "csv-write-stream";
import db from "../models/index.js";
import { sequelize } from "../models/index.js";

const MrotCrticalMaint = db.MrotCrticalMaint;

var fields = [
  "ID",
  "TimeStamp",
  "TaskID",
  "userLoginID",
  "Unit",
  "ActivityName",
  "Periodicity",
  "ActionDoneDate",
  "NextActionDate",
  "DaysAdded",
  "AgencyName",
  "MaintainerName",
];
// Right it acc

export const GetCriticalMaintData = (request, response) => {
  MrotCrticalMaint.findAll({
    raw: true,
  })
    .then((MaintData) => {
      // const MaintData = data.reduce((acc, item) => {
      //   const category = item.Unit;
      //   acc[category] = [...(acc[category] || []), item];
      //   return acc;
      // }, {});

      //console.log("MaintData", MaintData);
      response.json( {MaintData });
    })
    .catch((err) => {
      console.log(err); //read from CSV

      try {
        let inputStream = fs.createReadStream(
          "./Data/" + "MrotCriticalMaint.csv",
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
            MaintData.push(row);
            //console.log("MaintData ", MaintData);
          })
          .on("end", function () {
            //console.log("No more rows!");
            if (MaintData.length > 0) {
              //console.log("MaintData", MaintData);
              response.json({ MaintData });
            }
            //console.log("MaintData ", MaintData);
          });
      } catch (err) {
        console.log(err);

        //console.log("MaintData", MaintData);
        response.json({ MaintData });
      }
    });
};

export const CreateCriticalMaintData = (req, res) => {
  console.log("CreateCriticalMaintData service called", req.body.data);

  // New Code for Database

  const MaintData = {
    ID: req.body.data["ID"],
    TimeStamp: req.body.data["TimeStamp"],
    TaskID: req.body.data["TaskID"],
    userLoginID: req.body.data["userLoginID"],
    Unit: req.body.data["Unit"],

    ActivityName: req.body.data["ActivityName"],
    Periodicity: req.body.data["Periodicity"],
    ActionDoneDate: req.body.data["ActionDoneDate"],
    NextActionDate: req.body.data["NextActionDate"],

    DaysAdded: req.body.data["DaysAdded"],
    AgencyName: req.body.data["AgencyName"],
    MaintainerName: req.body.data["MaintainerName"],
  };
  // Save Profile in the database
  MrotCrticalMaint.create(MaintData)
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

  // let writer = [];
  // var finalPathFile = "./Data/userProfile.csv";
  // console.log("/user profile", req.body);
  // try {
  //   if (!fs.existsSync(finalPathFile))
  //     writer = makeCsvWriteStream({ headers: fields });
  //   else writer = makeCsvWriteStream({ sendHeaders: false });

  //   writer.pipe(fs.createWriteStream(finalPathFile, { flags: "a" }));
  //   writer.write(req.body.data);
  //   writer.end();
  //   res.json({ message: "Submitted Successfully" });
  //   console.log("/updateProfile wah", new Date());
  // } catch (err) {
  //   res.json({ message: "Not Submitted Successfully" });
  // }
};

export const CreateCriticalMaintDataBulk = async(req, res) => {
  

  try {
    const MaintData = req.body.csvDataJSON;
    console.log("CreateCriticalMaintData service Bulk called", MaintData);
    const insertedRecords = await MrotCrticalMaint.bulkCreate(MaintData, { validate: true });
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

export const UpdateCriticalMaintData = (request, response) => {
  //var fields=["ID","TimeStamp","TaskID","userLoginID","Unit","ActivityName","Periodicity","ActionDoneDate","NextActionDate","DaysAdded","AgencyName","MaintainerName"]

  //console.log("Request in Update ", request.body);
  //request.body.data", request.body.data);
  const id = request.body.data["ID"];
  let queryData = {};

  queryData["ID"] = request.body.data["ID"];
  // queryData["TimeStamp"] = request.body.data["TimeStamp"];
  // queryData["TaskID"] = request.body.data["TaskID"];

  // queryData["userLoginID"] = request.body.data["userLoginID"];
  // queryData["Unit"] = request.body.data["Unit"];
  // queryData["ActivityName"] = request.body.data["ActivityName"];
  // queryData["Periodicity"] = request.body.data["Periodicity"];
  queryData["ActionDoneDate"] = request.body.data["ActionDoneDate"];
  queryData["NextActionDate"] = request.body.data["NextActionDate"];
  // queryData["DaysAdded"] = request.body.data["DaysAdded"];
  queryData["AgencyName"] = request.body.data["AgencyName"];
  queryData["MaintainerName"] = request.body.data["MaintainerName"];
  queryData["Remarks"] = request.body.data["Remarks"];

  console.log("queryData", queryData);

  MrotCrticalMaint.update(queryData, {
    where: { ID: queryData["ID"] },
  })
    .then((num) => {
      if (num == 1) {
        console.log("Updated Successfully");
        response.status(200).json({ message: " Updated Successfully" });
      } else {
        console.log("Updated UnSuccessfully");
        response.send({
          message: `Cannot update Maintenace with id=${id}. was not found or req.body is empty!`,
        });
      }
    })
    .catch((err) => {
      console.log("Error while Updating");
      response.status(500).send({
        message: "Error updating Tutorial with id=" + id,
      });
    });

  // try {
  //   let inputStream = fs.createReadStream(
  //     "./Data/" + "MrotCriticalMaint.csv",
  //     "utf8"
  //   );

  //   inputStream
  //     .pipe(
  //       new CsvReadableStream({
  //         parseNumbers: true,
  //         parseBooleans: true,
  //         trim: true,
  //       })
  //     )
  //     .on("data", function (row) {
  //       // console.log("Row and request.body.data",row[0], request.body.data["id"] )
  //       if (row[0] == request.body.data["id"]) {
  //         // console.log("Row in if ",row)
  //         let localRow = row;

  //         localRow[0] = request.body.data["id"];
  //         localRow[1] = request.body.data["name"];
  //         localRow[2] = request.body.data["password"];
  //         localRow[3] = request.body.data["role"];
  //         localRow[4] = request.body.data["admin"];
  //         localRow[5] = request.body.data["description"];

  //         //  console.log("local array",localRow)
  //         users.push(localRow);
  //       } else {
  //         users.push(row);
  //       }

  //       // console.log("users  In", users);
  //     })
  //     .on("end", function () {
  //       console.log("No more rows!");
  //       var fields = ["id", "name", "password", "role", "admin", "description"];
  //       if (users.length > 0) {
  //         // console.log("users", users);
  //         let ProfileHeaders = users[0];
  //         let localprofiledata = [...users];
  //         localprofiledata.shift();
  //         let profileData = localprofiledata;

  //         let finalProfileData = [];

  //         profileData.map((item) => {
  //           let object = {};
  //           ProfileHeaders.map((element, index) => {
  //             object[element] = item[index];
  //           });
  //           finalProfileData.push(object);
  //         });
  //         fs.writeFile("./Data/MrotCriticalMaint.csv", "", (err) => {
  //           if (err) throw err;
  //         });
  //         console.log("finalProfileData", finalProfileData);
  //         let writer = [];
  //         var finalPathFile = "./Data/MrotCriticalMaint.csv";
  //         // // console.log("/updateProfile", req.body);
  //         try {
  //           if (!fs.existsSync(finalPathFile))
  //             writer = makeCsvWriteStream({ headers: fields });
  //           else writer = makeCsvWriteStream({ headers: fields });

  //           writer.pipe(fs.createWriteStream(finalPathFile, { flags: "a" }));

  //           for (let i = 0; i < finalProfileData.length; i++) {
  //             writer.write(finalProfileData[i]);
  //           }

  //           writer.end();
  //           response.status(200).json({ message: " Updated Successfully" });
  //         } catch (err) {}
  //       }
  //     });
  // } catch (err) {
  //   console.log(err);
  //   response.status(500).json({ message: "Not Updated Successfully" });

  //   // console.log("users", users);
  // }
};

export const DeleteCriticalMaintData = (request, res) => {
  console.log("Req body for Delete", request.body.ID);
  let ID = request.body.ID;
  console.log("Req body for Delete ID", ID);

  MrotCrticalMaint.destroy({
    where: { ID: ID },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "Record  deleted successfully!",
        });
      } else {
        res.send({
          message: `Cannot delete Record with id=${ID}. Maybe  was not found!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Could not delete Record with id=" + ID,
      });
    });

  // let users = [];

  // try {
  //   let inputStream = fs.createReadStream(
  //     "./Data/" + "userProfile.csv",
  //     "utf8"
  //   );

  //   inputStream
  //     .pipe(
  //       new CsvReadableStream({
  //         parseNumbers: true,
  //         parseBooleans: true,
  //         trim: true,
  //       })
  //     )
  //     .on("data", function (row) {
  //       if (row[0] == UserID) {
  //         console.log("Deleted Found", row[0], row);
  //       } else {
  //         users.push(row);
  //       }

  //       // console.log("users  In", users);
  //     })
  //     .on("end", function () {
  //       console.log("No more rows!", users);
  //       var fields = ["id", "name", "password", "role", "admin", "description"];
  //       if (users.length > 0) {
  //         console.log("users", users);
  //         let ProfileHeaders = users[0];
  //         let localprofiledata = [...users];
  //         localprofiledata.shift();
  //         let profileData = localprofiledata;

  //         let finalProfileData = [];

  //         profileData.map((item) => {
  //           let object = {};
  //           ProfileHeaders.map((element, index) => {
  //             object[element] = item[index];
  //           });
  //           finalProfileData.push(object);
  //         });
  //         fs.writeFile("./Data/userProfile.csv", "", (err) => {
  //           if (err) throw err;
  //         });
  //        // console.log("finalProfileData", finalProfileData);
  //         let writer = [];
  //         var finalPathFile = "./Data/userProfile.csv";
  //         // // console.log("/updateProfile", req.body);
  //         try {
  //           if (!fs.existsSync(finalPathFile))
  //             writer = makeCsvWriteStream({ headers: fields });
  //           else writer = makeCsvWriteStream({ headers: fields });

  //           writer.pipe(fs.createWriteStream(finalPathFile, { flags: "a" }));

  //           for (let i = 0; i < finalProfileData.length; i++) {
  //             writer.write(finalProfileData[i]);
  //           }

  //           writer.end();
  //           res.json({ message: " Deleted Successfully" });
  //         } catch (err) {}
  //       }
  //     });
  // } catch (err) {
  //   console.log(err);
  //   res.json({ message: " Not Deleted Successfully" });
  //   //console.log("users", users);
  // }
};
