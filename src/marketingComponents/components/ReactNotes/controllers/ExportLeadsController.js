import db from "../models/index.js";
const ExportLeadsModel = db.ExportLeadsModel;


export const CreateExportLeadsBulk = async (req, res) => {
  try {
    const BulkData = req.body.excelData;
    console.log("CreateExportLeadsBulk service Bulk called", BulkData);

    const insertedRecords = await ExportLeadsModel.bulkCreate(BulkData, {
      validate: true,
    });

    res.status(200).json({
      success: true,
      data: insertedRecords,
      message: "All records inserted successfully",
      error: {}
    });
  } catch (error) {
    console.error("Error has encountered...");
    if (error.name === "SequelizeUniqueConstraintError") {
      // Handle unique constraint violation error
      console.error(
        "Error CreateExportLeadsBulk: Duplicate key value violates unique constraint"
      );
      // Return appropriate error response to client
      res.status(400).json({
        success: false,
        data: [],
        message: "Duplicate key value violates unique constraint",
        error: error,
      });
    } else {
      // Handle other errors
      console.error("Error CreateExportLeadsBulk :", error);
      // Return appropriate error response to client
      res.status(500).json({
        success: false,
        data: [],
        message: "An error occurred",
        error: error,
      });
    }
  }
};


export const GetExportLeads = (request, response) => {
  ExportLeadsModel.findAll({
    raw: true,
  })
    .then((data) => {
      console.log("ExportLeadsModel Data", data);
      response.json({ data });
    })
    .catch((err) => {
      console.log(err); //read from CSV

      response.json({ data: "No data found for GetExportLeads" });
    });
};

export const CreateExportLeads = (req, res) => {


  const ExportLeadsModelEx = {
    tenderName: req.body.tenderName,
    tenderReferenceNo: req.body.tenderName,
    customerName: req.body.customerName,
    customerAddress: req.body.customerAddress,
    tenderType: req.body.tenderType,
    documentType: req.body.documentType,
    leadOwner: req.body.leadOwner,
    civilOrDefence: req.body.civilOrDefence,
    businessDomain: req.body.businessDomain,
    valueOfEMD: req.body.valueOfEMD,
    estimatedValueInCrWithoutGST: req.body.estimatedValueInCrWithoutGST,
    submittedValueInCrWithoutGST: req.body.submittedValueInCrWithoutGST,
    tenderDated: req.body.tenderDated,
    lastDateOfSub: req.body.lastDateOfSub,
    soleOrConsortium: req.body.soleOrConsortium,
    prebidMeetingDateTime: req.body.prebidMeetingDateTime,
    competitorsInfo: req.body.competitorsInfo,
    wonLostParticipated: req.body.wonLostParticipated,
    openClosed: req.body.openClosed,
    orderWonValueInCrWithoutGST: req.body.orderWonValueInCrWithoutGST,
    presentStatus: req.body.presentStatus,
    reasonForLossingOpp: req.body.reasonForLossingOpp,
    corrigendumsDateFile: req.body.corrigendumsDateFile,
    OperatorId: req.body.OperatorId,
    OperatorName: req.body.OperatorName,
    OperatorRole: req.body.OperatorRole,
    OperatorSBU: req.body.OperatorSBU,
    //submittedAt: req.body.submittedAt,



    
    // tenderName: "",
    // customerName: "",
    // customerAddress: "",
    // tenderType: "",
    // documentType: "",
    // leadOwner: "",
    // civilOrDefence: "",
    // businessDomain: "",
    // valueOfEMD: "",
    // estimatedValueInCrWithoutGST: "",
    // submittedValueInCrWithoutGST: "",
    // tenderDated: "",
    // lastDateOfSub: "",
    // soleOrConsortium: "",
    // prebidMeetingDateTime: "",
    // competitorsInfo: "",
    // wonLostParticipated: "",
    // openClosed: "",
    // orderWonValueInCrWithoutGST: "",
    // presentStatus: "",
    // reasonForLossingOpp: "",
    // corrigendumsDateFile: "",

  };

  ExportLeadsModel.create(ExportLeadsModelEx)
    .then((data) => {
      // res.send(data);
      console.log("Success");
      res.send(data);
    })
    .catch((err) => {
      console.log("Error while saving", err);
      res.status(500).send({
        message:
          err.message ||
          "Some error occurred while Create Domestic Leads Data.",
      });
    });

  // console.log(" UploadPdfFile into Harddisk");
};

export const UpdateExportLead = (req, res) => {
  console.log("req.body for  : ", req.body);

  const id = req.body["id"];

  // Validate that id is provided
  if (!id) {
    return res.status(400).json({
      success: false,
      data: null,
      message: "Quotation ID is required",
    });
  }

  
  const queryData = req.body;

  console.log("queryData for UpdateExportLead", queryData);

  ExportLeadsModel.update(queryData, {
    where: { id: queryData["id"] },
  })
    .then((num) => {
      if (num == 1) {
        console.log("Updated Repair Successfully");
        // res.status(200).json({ message: " Updated Successfully" });
        res.status(200).json({
          success: true,
          data: num,
          message: "Export Lead updated successfully",
        });
      } else {
        console.log("Updated  UnSuccessfully");
        // console.log("bhgh3ew3433333333333",res.status)
        res.send({
          message: `Cannot update UpdateExportLead with id=${id}. was not found or req.body is empty!`,
        });
      }
    })
    .catch((err) => {
      console.log("Error while Updating");
      res.status(500).send({
        message: "Error updating UpdateExportLead with id=" + id,
      });
    });
  // }
};


export const DeleteExportLead= (req, res) => {

  const id = req.body["id"];

  // Validate that id is provided
  if (!id) {
    return res.status(400).json({
      success: false,
      data: null,
      message: "Quotation ID is required",
    });
  }

  let queryData = {};
  queryData["id"] = req.body["id"];

  ExportLeadsModel.destroy({
    where: { id: queryData["id"] },
  })
    .then((num) => {
      if (num == 1) {
        console.log("DELETE Successfully");
        res.status(200).json({ message: " deleted Successfully for Export Lead" });
      } else 
      {
        
        res.send({
          message: `Cannot  Delete Export Lead with id=${id}. was not found or req.body is empty!`,
        });
        console.log("DELETE UnSuccessfully");
      }
    })
    .catch((err) => {
      console.log("Error while DELETE");
      res.status(500).send({
        message: "Error DELETE Export Lead with id=" + id,
      });
    });

};


