import { DataTypes } from "sequelize";

export default (sequelize) => {
  const ExportLeadsHistoryModel = sequelize.define(
    "ExportLeadsHistoryModel",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      export_leads_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        index: true,
      },
      status: {
        type: DataTypes.ENUM("ADDED", "UPDATED", "DELETED"),
        allowNull: false,
        index: true,
      },
      operator_id: {
        type: DataTypes.STRING,
        allowNull: false,
        index: true,
      },
      operator_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      previous_data: {
        type: DataTypes.JSONB,
        allowNull: true,
      },
      new_data: {
        type: DataTypes.JSONB,
        allowNull: true,
      },
      changes: {
        type: DataTypes.JSONB,
        allowNull: true,
      },
      timestamp: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        index: true,
      },
    },
    {
      tableName: "_history_export_leads",
      timestamps: false,
      indexes: [
        {
          fields: ["export_leads_id"],
        },
        {
          fields: ["operator_id", "timestamp"],
        },
        {
          fields: ["status", "timestamp"],
        },
      ],
    }
  );

  return ExportLeadsHistoryModel;
};
