export const DomesticLeadsModel = (sequelize, Sequelize) => {
  const DomesticLeadsModel = sequelize.define("DomesticLeadsModel", {

    // "tenderType",
    // "documentType",
    // "leadOwner",
    // "civilOrDefence",
    // "businessDomain",
    // "valueOfEMD",
    // "estimatedValueInCrWithoutGST",
    // "submittedValueInCrWithoutGST",
    // "tenderDated",
    // "lastDateOfSub",
    // "soleOrConsortium",
    // "prebidMeetingDateTime",
    // "competitorsInfo",
    // "wonLostParticipated",
    // "openClosed",
    // "orderWonValueInCrWithoutGST",
    // "presentStatus",
    // "reasonForLossingOpp",
    // "corrigendumsDateFile",
    // "participatedWithPartner",
    id:{
      type: Sequelize.INTEGER,
      autoIncrement:true,
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
    tenderType: {
      type: Sequelize.STRING,
    },
    documentType: {
      type: Sequelize.STRING,
    },
    leadOwner: {
      type: Sequelize.STRING,
    },
    civilOrDefence: {
      type: Sequelize.STRING,
    },
    businessDomain: {
      type: Sequelize.STRING,
    },
    valueOfEMD: {
      type: Sequelize.STRING,
    },
    estimatedValueInCrWithoutGST: {
      type: Sequelize.STRING,
    },
    submittedValueInCrWithoutGST: {
      type: Sequelize.STRING,
    },
    tenderDated: {
      type: Sequelize.STRING
    },
    lastDateOfSub: {
      type: Sequelize.TEXT,
    },
    soleOrConsortium: {
      type: Sequelize.STRING,
    },
    prebidMeetingDateTime: {
      type: Sequelize.STRING,
    },
    competitorsInfo: {
      type: Sequelize.TEXT,
    },
    wonLostParticipated: {
      type: Sequelize.TEXT,
    },
    estimatedValueInCrWithoutGST: {
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
    participatedWithPartner:{
      type: Sequelize.STRING,
    },
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

  return DomesticLeadsModel;
};
