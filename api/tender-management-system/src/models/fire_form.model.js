export const fireFormModel = (sequelize, Sequelize) => {
  const fireFormModel = sequelize.define("fireFormModel", {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    formName: {
      type: Sequelize.STRING
    },
    formData: {
      type: Sequelize.JSON
    },
    submissionDate: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW
    }
  });
  return fireFormModel;
};
