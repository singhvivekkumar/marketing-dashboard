// const db = require("../models");
import db from "../models/index.js";
import { config } from "../config/auth.config.js";
// const config = require("../config/auth.config");
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import CryptoJS from "crypto-js";

// var CryptoJS = require("crypto-js");
// const User = db.user;
// const Role = db.role;
const Op = db.Sequelize.Op;
// var jwt = require("jsonwebtoken");
// var bcrypt = require("bcryptjs");

// export const signup = (req, res) => {
//   // Save User to Database
//   User.create({
//     username: req.body.username,
//     email: req.body.email,
//     password: bcrypt.hashSync(req.body.password, 8)
//   })
//     .then(user => {
//       if (req.body.roles) {
//         Role.findAll({
//           where: {
//             name: {
//               [Op.or]: req.body.roles
//             }
//           }
//         }).then(roles => {
//           user.setRoles(roles).then(() => {
//             res.send({ message: "User was registered successfully!" });
//           });
//         });
//       } else {
//         // user role = 1
//         user.setRoles([1]).then(() => {
//           res.send({ message: "User was registered successfully!" });
//         });
//       }
//     })
//     .catch(err => {
//       res.status(500).send({ message: err.message });
//     });
// };

const User = db.userprofile;
const SessionMng = db.sessionMngt;

export const signin = (req, res) => {
  //console.log("Sign in ", req.body);

  User.findOne({
    where: {
      userID: req.body.userID,
    },
  })
    .then((user) => {
      if (!user) {
        return res.status(404).send({ message: "User Not found." });
      }
      // var passwordIsValid = bcrypt.compareSync(
      //   req.body.password,
      //   user.password
      // );

      console.log("user", user.password);
      var passwordIsValid = false;

      var bytes = CryptoJS.AES.decrypt(user.password, config.secret);
      var decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));

     // console.log("decryptedData", decryptedData, req.body.password);

      if (req.body.password == decryptedData) {
        passwordIsValid = true;
      }

      if (!passwordIsValid) {
        return res.status(401).send({
          accessToken: null,
          message: "Invalid Password!",
        });
      }

      // let data={
      //   time:Date(),
      //   id:user.userID
      // }
      var token = jwt.sign({ id: user.userID }, config.secret, {
        expiresIn: 86400, // 24 hours
      });
      // var token = jwt.sign(data, config.secret, {
      //   expiresIn: 86400, // 24 hours
      // });



      //Code to save the token in sessionManagement TAble
      const session = {
        userID: user.userID,
        token: token,
      };

      SessionMng.findOne({
        where: {
          userID: user.userID,
        },
      }).then((user) => {

        if (!user) {
          // return res.status(404).send({ message: "User Not found." });
          SessionMng.create(session)
        .then((data) => {
          console.log("Success");
        })
        .catch((err) => {
          console.log("Error while saving");
        });
        }
        else{
          SessionMng.destroy({
            where: { userID: user.userID },
          }).then((num) => {
            if (num == 1) {
              SessionMng.create(session)
                .then((data) => {
                  console.log("Success");
                })
                .catch((err) => {
                  console.log("Error while saving");
                });
            }
          });

        }
        
      })
      // SessionMng.create(session)
      //   .then((data) => {
      //     console.log("Success");
      //   })
      //   .catch((err) => {
      //     console.log("Error while saving");
      //   });

      res.status(200).send({
        id: user.userID,
        username: user.username,
        userRole: user.userRole,
        admin: user.admin,
        accessToken: token,
        description:user.description,
      });

      var authorities = [];
      // user.getRoles().then(roles => {
      //   for (let i = 0; i < roles.length; i++) {
      //     authorities.push("ROLE_" + roles[i].name.toUpperCase());
      //   }
      //   res.status(200).send({
      //     id: user.id,
      //     username: user.username,
      //     email: user.email,
      //     roles: authorities,
      //     accessToken: token
      //   });
      // });
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};




export const logout = (req, res) => {
  console.log("Log out ", req.body.userID);

  SessionMng.destroy({
    where: { userID: req.body.userID },
  })
    .then((num) => {
      if (num == 1) {
        res.status(200).send({
          message: "Logout Successfully",
        });
      } else {
        res.send({
          message: `Not Logout`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Logged out Earlier",
      });
    });
};
