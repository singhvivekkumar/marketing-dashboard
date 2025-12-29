export const BudgetaryQuotationModel = (sequelize, Sequelize) => {
  
    const BudgetaryQuotationModel = sequelize.define("BudgetaryQuotationModel",
      {
        id: {
          type: Sequelize.INTEGER,
          autoIncrement: true,
          primaryKey:true
        },
        bqTitle: {
          type: Sequelize.STRING,
        },
        customerName: {
          type: Sequelize.STRING,
        },
        customerAddress: {
          type: Sequelize.STRING,
        },
  
        leadOwner: {
          type: Sequelize.STRING,
        },
        defenceAndNonDefence: {
          type: Sequelize.STRING,
        },
        estimateValueInCrWithoutGST: {
          type: Sequelize.STRING,
        },
        submittedValueInCrWithoutGST: {
          type: Sequelize.STRING,
        },
        dateOfLetterSubmission: {
          type: Sequelize.STRING,
        },
        referenceNo: {
          type: Sequelize.STRING,
          
        },
        JSON_competitors: {
          type: Sequelize.STRING,
        },
        presentStatus: {
          type: Sequelize.STRING,
        },
  
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
  
    //console.log(BudgetaryQuotationModel)
  
    return BudgetaryQuotationModel;
  };
  