export const ExportLeadsModel = (sequelize, Sequelize) => {
    const ExportLeadsModel = sequelize.define("ExportLeadsModel", {
      // tenderName: "",
      // tenderReferenceNo: "",
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
  
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
      },
      tenderName: {
        type: Sequelize.TEXT,
      },
  
      tenderReferenceNo: {
        type: Sequelize.STRING,
        primaryKey: true,
      },
      customerName: {
        type: Sequelize.TEXT,
      },
  
      customerAddress: {
        type: Sequelize.TEXT,
      },
      // tenderType: {
      //   type: Sequelize.STRING,
      // },
      documentType: {
        type: Sequelize.STRING,
      },
      leadOwner: {
        type: Sequelize.STRING,
      },
      civilOrDefence: {
        type: Sequelize.STRING,
      },
      valueOfEMD: {
        type: Sequelize.STRING,
      },
      businessDomain: {
        type: Sequelize.STRING,
      },
      estimatedValueInCrWithoutGST: {
        type: Sequelize.STRING,
      },
  
      submittedValueInCrWithoutGST: {
        type: Sequelize.STRING,
      },
      tenderDated: {
        type: Sequelize.STRING,
      },
      lastDateOfSub: {
        type: Sequelize.STRING,
      },
      soleOrConsortium: {
        type: Sequelize.STRING,
      },
      prebidMeetingDateTime: {
        type: Sequelize.TEXT,
      },
      competitorsInfo: {
        type: Sequelize.STRING,
      },
      wonLostParticipated: {
        type: Sequelize.STRING,
      },
      openClosed: {
        type: Sequelize.STRING,
      },
      orderWonValueInCrWithoutGST: {
        type: Sequelize.STRING,
      },
      presentStatus: {
        type: Sequelize.STRING,
      },
      reasonForLossingOpp: {
        type: Sequelize.STRING,
      },
      corrigendumsDateFile: {
        type: Sequelize.STRING,
      },
      // USER DETAILS
      OperatorId: {
        type: Sequelize.STRING,
      },
      OperatorName: {
        type: Sequelize.STRING,
      },
      OperatorRole: {
        type: Sequelize.STRING,
      },
      OperatorSBU: {
        type: Sequelize.STRING,
      },
    });
  
    console.log(ExportLeadsModel);
  
    return ExportLeadsModel;
  };
  