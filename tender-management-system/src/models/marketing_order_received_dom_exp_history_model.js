import { DataTypes } from "sequelize";

export default (sequelize) => {
  const MarketingOrderReceivedDomExpHistory = sequelize.define(
    "MarketingOrderReceivedDomExpHistory",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      marketing_order_received_dom_exp_id: {
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
      tableName: "marketing_order_received_dom_exp_history",
      timestamps: false,
      indexes: [
        {
          fields: ["marketing_order_received_dom_exp_id"],
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

  return MarketingOrderReceivedDomExpHistory;
};
