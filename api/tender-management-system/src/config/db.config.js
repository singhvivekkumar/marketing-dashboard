// import db from "../models";

// module.exports = {
//     HOST: "192.168.0.20",
//     USER: "postgres",
//     PASSWORD: "bel123",
//     DB: "MROT",
//     dialect: "postgres",
//     pool: {
//       max: 5,
//       min: 0,
//       acquire: 30000,
//       idle: 10000
//     }
//   };

// DB: "TENDER_MANAGEMENT_SYSTEM",
export const dbConfig = {
  HOST: "127.0.0.1",
  USER: "postgres",
  PASSWORD: "1670",
  DB: "TENDER_MANAGEMENT_SYSTEM",
  dialect: "postgres",
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
};

console.log("Data Base connected with Updated Server", dbConfig.DB);
