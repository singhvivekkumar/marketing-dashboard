export const TpcrDocumentModel = (sequelize, DataTypes) => {
  const TpcrDocumentModel = sequelize.define(
    "TpcrDocumentModel",
    {
      documentId: {
        // type: DataTypes.UUID,
        // defaultValue: DataTypes.UUIDV4,
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      tpcrId: {
        type: DataTypes.INTEGER,
        // type: DataTypes.UUID,
        // allowNull: false
      },
      documentType: {
        type: DataTypes.STRING(50),
        // allowNull: false
      },
      originalFileName: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      storedFileName: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      filePath: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      fileSize: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },
      checksum: {
        type: DataTypes.STRING(64),
      },
      uploadedBy: {
        type: DataTypes.STRING(100),
      },
      uploadedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    }
    // {
    //   tableName: "order_receive_document_model",
    //   timestamps: false
    // }
  );

  // LeadDocument.associate = (models) => {
  //   LeadDocument.belongsTo(models.Lead, {
  //     foreignKey: "lead_id",
  //     onDelete: "CASCADE"
  //   });
  // };

  return TpcrDocumentModel;
};
