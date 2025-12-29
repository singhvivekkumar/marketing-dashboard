export const CPDSFormModel = (sequelize, Sequelize) => {
    const CPDSFormModel = sequelize.define("CPDSFormModel", {
  
        // defaultValues: {
        //     pdsNo: "",
        //     title: "",
        //     remarks: "",
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
    });
  
    return CPDSFormModel;
  };
  