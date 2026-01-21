import { DataTypes } from "sequelize";

export default (sequelize) => {
  const OperationHistory = sequelize.define(
    "OperationHistory",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      model_name: {
        type: DataTypes.STRING,
        allowNull: false,
        index: true,
      },
      record_id: {
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
        comment: "Object showing what changed: {fieldName: {old: value, new: value}}",
      },
      timestamp: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        index: true,
      },
    },
    {
      tableName: "operation_history",
      timestamps: false,
      indexes: [
        {
          fields: ["model_name", "record_id"],
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

  return OperationHistory;
};
