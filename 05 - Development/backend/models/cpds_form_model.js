export const CPDSFormModel = (sequelize, Sequelize) => {
    const CPDSFormModel = sequelize.define("CPDSFormModel", {
  
      id:{
        type: Sequelize.INTEGER,
        autoIncrement:true,
        primaryKey:true
      },
      pdsNo: {
        type: Sequelize.STRING,
      },
      title: {
        type: Sequelize.TEXT,
      },
      remarks: {
        type: Sequelize.TEXT,
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
  
    return CPDSFormModel;
  };
  