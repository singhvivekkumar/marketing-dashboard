// database.js - Main Database Setup
import { Sequelize } from 'sequelize';
import { dbConfig } from "../config/database.js";
import { MarketingOrderReceivedDomExp } from './marketing_order_received_dom_exp.js';
import { BudgetaryQuotationModel } from './budgetary_quotation_model.js';
import { LeadSubmittedModel } from './lead_submitted_model.js';
import { DomesticLeadsModel } from './domestic_leads_model.js';
import { ExportLeadsModel } from './export_leads_model.js';
import { CRMLeadsModel } from './crm_leads_model.js';
import { LostFormModel } from './lost_form_model.js';
import { TPCRFormModel } from './tpcr_form_model.js';
import { CPDSFormModel } from './cpds_form_model.js';
import { InHouseRDModel } from './inhouserd_model.js';
import { OrderReceivedDocumentModel } from './order_received_document_model.js';
import { TpcrDocumentModel } from './tpcr_document_models.js';
import { CpdsDocumentModel } from './cpds_document_model.js';

// Initialize Sequelize
export const sequelize = new Sequelize(
    dbConfig.DB,
    dbConfig.USER,
    dbConfig.PASSWORD,
    {
        host: dbConfig.HOST,
        dialect: dbConfig.dialect,
        operatorsAliases: 0,
        pool: {
            max: dbConfig.pool.max,
            min: dbConfig.pool.min,
            acquire: dbConfig.pool.acquire,
            idle: dbConfig.pool.idle
        }
    }
);

// Define database models
const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.MarketingOrderReceivedDomExp = MarketingOrderReceivedDomExp(sequelize, Sequelize);
db.BudgetaryQuotationModel = BudgetaryQuotationModel(sequelize, Sequelize);
db.LeadSubmittedModel = LeadSubmittedModel(sequelize, Sequelize);
db.DomesticLeadsModel = DomesticLeadsModel(sequelize, Sequelize);
db.ExportLeadsModel = ExportLeadsModel(sequelize, Sequelize);
db.CRMLeadsModel = CRMLeadsModel(sequelize, Sequelize);
db.LostFormModel = LostFormModel(sequelize, Sequelize);
db.TPCRFormModel = TPCRFormModel(sequelize, Sequelize);
db.CPDSFormModel = CPDSFormModel(sequelize, Sequelize);
db.InHouseRDModel = InHouseRDModel(sequelize, Sequelize);
db.OrderReceivedDocumentModel = OrderReceivedDocumentModel(sequelize, Sequelize);
db.TpcrDocumentModel = TpcrDocumentModel(sequelize, Sequelize);
db.CpdsDocumentModel = CpdsDocumentModel(sequelize, Sequelize);

// Relationships (commented out for now - include if needed)
// db.role.belongsToMany(db.user, {
//     through: "user_roles",
//     foreignKey: "roleId",
//     otherKey: "userId",
// });
// db.user.belongsToMany(db.role, {
//     through: "user_roles",
//     foreignKey: "userId",
//     otherKey: "roleId",
// });
// db.ROLES = ["user", "admin", "moderator"];

export default db;