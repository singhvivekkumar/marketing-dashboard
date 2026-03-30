export const TPCRFormModel = (sequelize, Sequelize) => {
    const TPCRFormModel = sequelize.define("TPCRFormModel", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      tpcrSlno: {
        type: Sequelize.STRING,
      },
      tpcrSource: {
        type: Sequelize.STRING,
      },
      domain: {
        type: Sequelize.STRING,
      },
      projectName: {
        type: Sequelize.STRING,
      },
      isYourSBULeadSBU: {
        type: Sequelize.STRING,
      },
      leadSBUName: {
        type: Sequelize.STRING,
      },
      qty: {
        type: Sequelize.STRING,
      },
      sOrSsUnderThisProject: {
        type: Sequelize.STRING,
      },
      businessValue: {
        type: Sequelize.STRING,
      },
      technologyParameters: {
        type: Sequelize.TEXT,
      },
      drdoRemarks: {
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

      // field
      FileName: {
        type: Sequelize.JSON
      },
      FilePath: {
        type: Sequelize.JSON
      },
      HardDiskFileName: {
        type: Sequelize.JSON
      },
  
    });
  
    // console.log(TPCRFormModel)
  
    return TPCRFormModel;
  };
  
  