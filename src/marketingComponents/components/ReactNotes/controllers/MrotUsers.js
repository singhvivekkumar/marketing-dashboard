import express from "express";
import fs from "fs";
import CsvReadableStream from "csv-reader";
import { v4 as uuid } from "uuid";
import makeCsvWriteStream from "csv-write-stream";
// const db = require("../models");
import db from "../models/index.js";

var fields = ["id", "name", "password", "role", "admin", "description"];
const Profile = db.userprofile;


export const SingleUserFirstTime = (request, response) => {


  //console.log("Gets User service called")
  console.log("GetProfile from firsttime..............")
  Profile.findAll({ raw: true })
  .then((data) => {

    response.json({ data });
  })
  .catch((err) => {
    console.log(err); //read from CSV

    response.json({ data:"Not Found" });
  });
};



export const GetUsers = (request, response) => {


  //console.log("Gets User service called")
  let users = [];

  Profile.findAll({ raw: true })
    .then((data) => {
      users.push(fields);

      //console.log("index", data);
      // res.send(data);
      data.map((item, index) => {
        let values = [];
        values.push(data[index].userID);
        values.push(data[index].username);
        values.push(data[index].password);
        values.push(data[index].userRole);
        values.push(data[index].admin);
        values.push(data[index].description);
        users.push(values);
      });

      //console.log("Profile user list from DB", users);
      response.json({ users });
    })
    .catch((err) => {
      console.log(err); //read from CSV

    //   try {
    //     let inputStream = fs.createReadStream(
    //       "./Data/" + "userProfile.csv",
    //       "utf8"
    //     );

    //     inputStream
    //       .pipe(
    //         new CsvReadableStream({
    //           parseNumbers: true,
    //           parseBooleans: true,
    //           trim: true,
    //         })
    //       )
    //       .on("data", function (row) {
    //         users.push(row);
    //         //console.log("users ", users);
    //       })
    //       .on("end", function () {
    //         //console.log("No more rows!");
    //         if (users.length > 0) {
    //           //console.log("users", users);
    //           response.json({ users });
    //         }
    //         //console.log("users ", users);
    //       });
    //   } catch (err) {
    //     console.log(err);

    //     //console.log("users", users);
    //     response.json({ users });
    //   }
    // }

    response.json({ users });
    }
    );
};

export const CreateUser = (req, res) => {
  //    const user=req.body.data;
  //    users.push({...user,id:uuid()});


  console.log("CreateUser service called")

//   let writer = [];
//   var finalPathFile = "./Data/userProfile.csv";
//  // console.log("/user profile", req.body);
//   try {
//     if (!fs.existsSync(finalPathFile))
//       writer = makeCsvWriteStream({ headers: fields });
//     else writer = makeCsvWriteStream({ sendHeaders: false });

//     writer.pipe(fs.createWriteStream(finalPathFile, { flags: "a" }));
//     writer.write(req.body.data);
//     writer.end();
//     res.json({ message: "Submitted Successfully" });
//     console.log("/updateProfile wah", new Date());
//   } catch (err) {
//     res.json({ message: "Not Submitted Successfully" });
//   }

  // New Code for Database

  const profile = {
    userID: req.body.data.id,
    username: req.body.data.name,
    password: req.body.data.password,
    userRole: req.body.data.role,
    admin: req.body.data.admin,
    description: req.body.data.description,
  };
  // Save Profile in the database
  Profile.create(profile)
    .then((data) => {
      // res.send(data);
      console.log("Success");
      res.json({ message: "Submitted Successfully" });
    })
    .catch((err) => {
      console.log("Error while saving");
      res.json({ message: "Not Submitted Successfully" });
      // res.status(500).send({
      //   message:
      //     err.message || "Some error occurred while creating the Tutorial."
      // });
    });
};

export const deleteUser = (request, res) => {


  let UserID=request.body[0].id
  console.log("Req body for Delete", UserID);

  let users = [];

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

  // Delete User using database

  // console.log("id", UserID);

  Profile.destroy({
    where: { userID: UserID },
  })
    .then((num) => {
      if (num == 1) {
        // res.send({
        //   message: "Tutorial was deleted successfully!"
        // });

        res.json({ message: " Deleted Successfully" });
      } else {
        // res.send({
        //   message: `Cannot delete Tutorial with id=${id}. Maybe Tutorial was not found!`
        // });
        res.json({ message: " Not Deleted Successfully" });
      }
    })
    .catch((err) => {
      // res.status(500).send({
      //   message: "Could not delete Tutorial with id=" + id
      // });
      res.json({ message: "Not Deleted Successfully" });
    });
};

export const updateUser = (request, res) => {


  let users = [];

  // try {
  //   console.log("Request in Update ", request.body.data["id"]);
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
  //           response.status(200).json({ message: " Updated Successfully" });
  //         } catch (err) {}
  //       }
  //     });
  // } catch (err) {
  //   console.log(err);
  //   response.status(500).json({ message: "Not Updated Successfully" });

  //   // console.log("users", users);
  // }

  // Update using database

  const id = request.body.data["id"];
  //console.log("request.body.data", request.body.data);

  let queryData = {};

  queryData["userID"] = request.body.data["id"];
  queryData["username"] = request.body.data["name"];
  queryData["password"] = request.body.data["password"];
  queryData["userRole"] = request.body.data["role"];
  queryData["admin"] = request.body.data["admin"];
  queryData["description"] = request.body.data["description"];

  //console.log("queryData", queryData);

  Profile.update(queryData, {
    where: { userID: queryData["userID"] },
  })
    .then((num) => {
      if (num == 1) {
        console.log("Updated Successfully");
        res.json({ message: " Updated Successfully" });
        // res.send({
        //   message: "Tutorial was updated successfully."
        // });
      } else {
        console.log("Updated UnSuccessfully");
        res.json({ message: " Not Updated Successfully" });
        // res.send({
        //   message: `Cannot update Tutorial with id=${id}. Maybe Tutorial was not found or req.body is empty!`
        // });
      }
    })
    .catch((err) => {
      console.log("Error while Updating");
      res.json({ message: " Not Updated Successfully" });
      // res.status(500).send({
      //   message: "Error updating Tutorial with id=" + id
      // });
    });
};
