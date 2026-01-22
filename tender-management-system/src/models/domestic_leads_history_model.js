import { DataTypes } from "sequelize";

export default (sequelize) => {
  const DomesticLeadsHistory = sequelize.define(
    "DomesticLeadsHistory",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      domestic_leads_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        index: true,
      },
      status: {
        type: DataTypes.ENUM("added", "updated", "deleted"),
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
      tableName: "domestic_leads_history",
      timestamps: false,
      indexes: [
        {
          fields: ["domestic_leads_id"],
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

  return DomesticLeadsHistory;
};
