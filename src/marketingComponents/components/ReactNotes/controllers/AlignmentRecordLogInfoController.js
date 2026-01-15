
import db from "../models/index.js";
const AlignmentRecordLogInfo = db.AlignmentRecordLogInfo;


// Right it acc

export const GetAlignmentRecordLogInfo = (request, response) => {
  AlignmentRecordLogInfo.findAll({
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

export const CreateAlignmentRecordLogInfo = (req, res) => {
  console.log(" CreateAlignmentRecordLogInfo service called for req.body.id", req.body);

  const AlignmentRecordLogInfodata = {
  
  
    OperatorId: req.body.OperatorId,
    OperatorName: req.body.OperatorName,
    OperatorRole: req.body.OperatorRole,
    ParameterName: req.body.ParameterName,
    TestPoints: req.body.TestPoints,
    Predefined_Min_Value: req.body.Predefined_Min_Value,
    Predefined_Max_Value: req.body.Predefined_Max_Value,
    Unit: req.body.Unit,
    ObservedValue: req.body.ObservedValue,
    Remarks: req.body.Remarks,
    Date: req.body.Date,
    TestingType: req.body.TestingType,
    TestingLocation: req.body.TestingLocation,
  };
  

  console.log(" CreateAlignmentRecordLogInfo service called for AlignmentRecordLogInfodata", AlignmentRecordLogInfodata);
//  Save Profile in the database
  AlignmentRecordLogInfo.create( AlignmentRecordLogInfodata) 
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