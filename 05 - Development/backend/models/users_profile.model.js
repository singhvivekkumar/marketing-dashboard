export const userProfileModel= (sequelize, Sequelize) => {
    const userProfile = sequelize.define("userProfile", {
      userID: {
        type: Sequelize.STRING,
        primaryKey: true
      },
      username: {
        type: Sequelize.STRING
      },
      password: {
        type: Sequelize.STRING
      },
      userRole: {
        type: Sequelize.STRING
      },
      admin: {
        type: Sequelize.STRING
      },
      description: {
        type: Sequelize.STRING
      }
    });
    return userProfile;
  };