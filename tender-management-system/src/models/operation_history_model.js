export const BudgetaryQuotationHistory = (sequelize, DataTypes) => {
	
	const BudgetaryQuotationHistory = sequelize.define("BudgetaryQuotationHistory", {
		id: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			primaryKey: true,
		},
		status: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		operator_id: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		operator_name: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		data: {
			type: DataTypes.JSON,
			allowNull: false,
		},
		timestamp: {
			type: DataTypes.DATE,
			defaultValue: DataTypes.NOW,
		},
	});

	return BudgetaryQuotationHistory;
};
