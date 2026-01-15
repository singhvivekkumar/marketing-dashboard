
import db from "../models/index.js";
const AlignmentDynamicFineSensorData = db.AlignmentDynamicFineSensorData;


// Right it acc

export const GetAlignmentFineSensorData = (request, response) => {
  AlignmentDynamicFineSensorData.findAll({
    raw: true,
  })
    .then((data) => {
     

     // console.log("AlignmentDynamicFineSensorData Data", data);
      response.json( {data });
    })
    .catch((err) => {
      console.log(err); //read from CSV

      response.json( {"data":"No data found" });
    })

     
};

export const CreateAlignmentFineSensorData = (req, res) => {
  //console.log(" AlignmentDynamicFineSensorData service called for req.body.id", req.body);

  const AlignmentRecordLogInfodata = {
  
  
    OperatorId: req.body.OperatorId,
    OperatorName: req.body.OperatorName,
    OperatorRole: req.body.OperatorRole,

 
    SerialNumber: req.body.SerialNumber,
    ReportDate: req.body.ReportDate,
    ItemLocation: req.body.ItemLocation,

    ShipName: req.body.ShipName,
    SidewardValue: req.body.SidewardValue,
    UpwardValue: req.body.UpwardValue,

    SensorName: req.body.SensorName,
    SensorKey: req.body.SensorKey,
  
  };
  

 // console.log(" AlignmentDynamicFineSensorData service called for AlignmentDynamicFineSensorData", AlignmentRecordLogInfodata);
//  Save Profile in the database
AlignmentDynamicFineSensorData.create( AlignmentRecordLogInfodata) 
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