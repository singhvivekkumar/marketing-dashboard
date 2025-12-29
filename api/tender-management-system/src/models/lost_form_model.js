export const LostFormModel = (sequelize, Sequelize) => {
  const LostFormModel = sequelize.define("LostFormModel", {
    // //      defaultValues: {
    //   tenderName: "",
    //   tenderReferenceNo: "",
    //   customerName: "",
    //   customerAddress: "",
    //   tenderType: "",
    //   documentType: "",
    //   valueInCrWithoutGST: "",
    //   valueInCrWithGST: "",
    //   reasonForLossing: "",
    //   yearWeLost: "",
    //   partners: "",
    //   competitors: "",
    //   competitorstechnicalScore: "",
    //   competitorsquotedPrice: "",
    //   beltechnicalScore: "",
    //   belquotedPrice: "",
    // ------------------------------------------------
    // 

    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    tenderName: {
      type: Sequelize.TEXT,
    },
    tenderReferenceNo: {
      type: Sequelize.STRING,
    },
    customerName: {
      type: Sequelize.TEXT,
    },

    customerAddress: {
      type: Sequelize.TEXT,
    },
    tenderType: {
      type: Sequelize.STRING,
    },
    documentType: {
      type: Sequelize.STRING,
    },
    valueInCrWithoutGST: {
      type: Sequelize.STRING,
    },
    valueInCrWithGST: {
      type: Sequelize.STRING,
    },
    reasonForLossing: {
      type: Sequelize.STRING,
      primaryKey: true,
    },
    yearWeLost: {
      type: Sequelize.STRING,
    },
    partners: {
      type: Sequelize.STRING,
    },
    competitors: {
      type: Sequelize.TEXT,
      
    },
    competitorstechnicalScore: {
      type: Sequelize.STRING,
    },
    competitorsquotedPrice: {
      type: Sequelize.STRING,
    },
    beltechnicalScore: {
      type: Sequelize.STRING,
    },
    belquotedPrice: {
      type: Sequelize.STRING,
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

  console.log(LostFormModel);

  return LostFormModel;
};
