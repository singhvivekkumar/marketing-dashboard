export const CRMLeadsModel = (sequelize, Sequelize) => {
      const CRMLeadsModel = sequelize.define("CRMLeadsModel",
      {
        id: {
          type: Sequelize.INTEGER,
          autoIncrement: true,
          primaryKey:true,
        },
        leadID: {
          type: Sequelize.STRING,
        },
        issueDate: {
          type: Sequelize.STRING,
        },
        tenderName: {
          type: Sequelize.STRING,
        },
  
        organisation: {
          type: Sequelize.STRING,
        },
        documentType: {
          type: Sequelize.STRING,
          
        },
        tenderType: {
          type: Sequelize.STRING,
        },
        emdInLakhs: {
          type: Sequelize.STRING,
        },
        approxTenderValueLakhs: {
          type: Sequelize.STRING,
        },
        lastDateSubmission: {
          type: Sequelize.STRING,
        },
        preBidDate: {
          type: Sequelize.STRING,
        },
        teamAssigned: {
          type: Sequelize.STRING,
        },
        remarks: {
            type: Sequelize.STRING,
        },
        corrigendumInfo: {
            type: Sequelize.STRING,
          },
          // user details
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
  
    console.log(CRMLeadsModel)
  
    return CRMLeadsModel;
  };
  

  // leadID: '',
    //   issueDate: '',
    //   tenderName: '',
    //   organisation: '',
    //   documentType: '',
    //   tenderType: '',
    //   emdInCrore: '',
    //   approxTenderValueCrore: '',
    //   lastDateSubmission: '',
    //   preBidDate: '',
    //   teamAssigned: '',
    //   remarks: '',
    //   corrigendumInfo: ''