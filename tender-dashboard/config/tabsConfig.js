// config/tabsConfig.js - Tab Configurations

export const TABS_CONFIG = [
   {
    id: 1,
    label: 'Budgetary Quotation',
    icon: 'PriceCheckIcon',
    formType: 'budgetary-quotation',
    component: 'BudgetaryQuotationTab'
  },
  {
    id: 2,
    label: 'Lead Submitted',
    icon: 'CheckCircleIcon',
    formType: 'lead-submitted',
    component: 'LeadSubmittedTab'
  },
  {
    id: 3,
    label: 'Domestic Leads',
    icon: 'HomeWorkIcon',
    formType: 'domestic-leads',
    component: 'DomesticLeadsTab'
  },
  {
    id: 4,
    label: 'Export Leads',
    icon: 'PublicIcon',
    formType: 'export-leads',
    component: 'ExportLeadsTab'
  },
  {
    id: 5,
    label: 'CRM Leads',
    icon: 'ContactsIcon',
    formType: 'crm-leads',
    component: 'CRMLeadsTab'
  },
  {
    id: 6,
    label: 'Domestic Order',
    icon: 'ReceiptIcon',
    formType: 'domestic-order',
    component: 'DomesticOrderTab'
  },
  {
    id: 7,
    label: 'Lost Leads',
    icon: 'TrendingDownIcon',
    formType: 'lost-leads',
    component: 'LostLeadsTab'
  },
];
