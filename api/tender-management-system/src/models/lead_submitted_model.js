export const LeadSubmittedModel = (sequelize, Sequelize) => {
  const LeadSubmittedModel = sequelize.define("LeadSubmittedModel", {

    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true
    },
    tenderName: {
      type: Sequelize.STRING,
    },
    customerName: {
      type: Sequelize.STRING,
    },
    customerAddress: {
      type: Sequelize.STRING,
    },
    tenderDate: {
      type: Sequelize.STRING,
    },
    bidOwner: {
      type: Sequelize.STRING,
    },
    rfpReceivedOn: {
      type: Sequelize.STRING,
      primaryKey: true,
    },
    valueEMDInCrore: {
      type: Sequelize.STRING,
    },
    rfpDueDate: {
      type: Sequelize.STRING,
    },
    dmktgInPrincipalApprovalRxdOn: {
      type: Sequelize.STRING,
    },
    sellingPriceApprovalInitiatedOn: {
      type: Sequelize.STRING,
    },
    bidSubmittedOn: {
      type: Sequelize.STRING,
    },
    approvalSBUFinanceOn: {
      type: Sequelize.STRING,
    },
    approvalGMOn: {
      type: Sequelize.STRING,
    },
    sentToFinanceGMDmktgApprovalRxdOn: {
      type: Sequelize.STRING,
    },
    dmktgApprovalRxdOn: {
      type: Sequelize.STRING,
    },
    tenderReferenceNo: {
      type: Sequelize.STRING,
      primaryKey: true
    },
    tenderType: {
      type: Sequelize.STRING,
    },
    website: {
      type: Sequelize.STRING,
    },
    presentStatus: {
      type: Sequelize.STRING,
    },
    // new 
    competitorsInfo: {
      type: Sequelize.TEXT, 
    },
    participatedWithPartner: {
      type: Sequelize.STRING,
    },
    
    // field
    OperatorId: {
      type: Sequelize.STRING,
    },
    OperatorName: {
      type: Sequelize.STRING
    },
    OperatorRole: {
      type: Sequelize.STRING,
    },
    OperatorSBU: {
      type: Sequelize.STRING,
    },

  });

  //console.log(BudgetaryQuotation)

  return LeadSubmittedModel;
};

