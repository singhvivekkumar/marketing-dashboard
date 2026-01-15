
import db from "../models/index.js";
const AlignmentStaticCoarseParallaxDatawrtSIRP = db.AlignmentStaticCoarseParallaxDatawrtSIRP;


// Right it acc

export const GetAlignmentCoarsewrtSIRPData = (request, response) => {
  AlignmentStaticCoarseParallaxDatawrtSIRP.findAll({
    raw: true,
  })
    .then((data) => {
     

      //console.log("AlignmentDynamicFinewrtTMX Data", data);
      response.json( {data });
    })
    .catch((err) => {
      console.log(err); //read from CSV

      response.json( {"data":"No data found" });
    })

     
};

export const CreateAlignmentCoarsewrtSIRPData = (req, res) => {
  //console.log(" AlignmentDynamicFinewrtTMX service called for req.body.id", req.body);

  const AlignmentRecordLogInfodata = {
  
  
    OperatorId: req.body.OperatorId,
    OperatorName: req.body.OperatorName,
    OperatorRole: req.body.OperatorRole,

 
    SerialNumber: req.body.SerialNumber,
    ReportDate: req.body.ReportDate,
    ItemLocation: req.body.ItemLocation,

    ShipName: req.body.ShipName,
    XValue: req.body.XValue,
    YValue: req.body.YValue,
    ZValue: req.body.ZValue,
    SensorName: req.body.SensorName,
    SensorKey: req.body.SensorKey,
  
  };
  

  //console.log(" AlignmentDynamicFineSensorData service called for AlignmentDynamicFinewrtTMX", AlignmentRecordLogInfodata);
//  Save Profile in the database
AlignmentStaticCoarseParallaxDatawrtSIRP.create( AlignmentRecordLogInfodata) 
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