export const InHouseRDModel = (sequelize, Sequelize) => {
    const InHouseRDModel = sequelize.define("InHouseRDModel", {
    // } = useForm({
    //   defaultValues: {
    //     projectName: "",
    //     teamMembers: "",
    //     dateOfInitiation: "",
    //     dateOfCompletion: "",
    //     description: "",
    //     projectValue: "",
    //   },
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      projectName: {
        type: Sequelize.TEXT,
      },
  
      dateOfInitiation: {
        type: Sequelize.STRING,
      },
      dateOfCompletion: {
        type: Sequelize.TEXT,
      },
      description: {
        type: Sequelize.STRING,
      },
      projectValue: {
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
  
    console.log(InHouseRDModel);
  
    return InHouseRDModel;
  };
  