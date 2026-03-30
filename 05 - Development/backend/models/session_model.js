export const sessionManagement= (sequelize, Sequelize) => {
    const sessionMngt = sequelize.define("user_Session", {
      userID: {
        type: Sequelize.STRING,
        primaryKey: true
      },
      token:{
        type: Sequelize.STRING
      },
    //   password: {
    //     type: Sequelize.STRING
    //   },
    //   userRole: {
    //     type: Sequelize.STRING
    //   },
    //   admin: {
    //     type: Sequelize.STRING
    //   },
    //   description: {
    //     type: Sequelize.STRING
    //   }
    });
    return sessionMngt;
  };