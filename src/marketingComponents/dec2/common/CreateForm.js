import React from 'react'
import { Box, Button } from '@mui/material';
import { ArrowBack } from "@mui/icons-material";

import BudgetaryQuotationForm from '../../components/budgetaryQuotation/BudgetaryQuotationForm';
import LeadSubmittedForm from '../../components/leadSubmitted/LeadSubmittedForm';
import DomesticLeadForm from '../../extraComponents/DomesticLeadForm1';
import ExportLeadForm from '../../components/exportLead/ExportLeadForm';
import CRMLeadForm from '../../components/crmLeads/CRMLeadForm';
import OrderReceivedForm from '../../components/orderReceived/OrderReceivedForm';
import LostLeadForm from '../../components/lostLeads/LostDomesticLead';


// Tab Panel Component
function TabPanel({ children, value, index }) {
	return (
		<div role="tabpanel" hidden={value !== index}>
			{value === index && <Box sx={{ py: 3 }}>{children}</Box>}
		</div>
	);
}

function CreateForm({ currentTab, onBack, handleFormSubmit, loading, }) {
	console.log("value of currentTab", currentTab);
	return (
		<Box>
			<Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
				<Button
					variant="outlined"
					
					onClick={onBack}
				>
					Back to Menu
				</Button>
			</Box>

			<Box sx={{ p: { xs: 2, md: 4 } }}>
				<TabPanel value={currentTab} index={0}>
					<BudgetaryQuotationForm onSubmit={(data) => handleFormSubmit('budgetaryQuotation', data)} loading={loading} />
				</TabPanel>
				<TabPanel value={currentTab} index={1}>
					<LeadSubmittedForm onSubmit={(data) => handleFormSubmit('leadSubmitted', data)} loading={loading} />
				</TabPanel>
				<TabPanel value={currentTab} index={2}>
					<DomesticLeadForm onSubmit={(data) => handleFormSubmit('domesticLeads', data)} loading={loading} />
				</TabPanel>
				<TabPanel value={currentTab} index={3}>
					<ExportLeadForm onSubmit={(data) => handleFormSubmit('exportLeads', data)} loading={loading} />
				</TabPanel>
				<TabPanel value={currentTab} index={4}>
					<CRMLeadForm onSubmit={(data) => handleFormSubmit('crmLeads', data)} loading={loading} />
				</TabPanel>
				<TabPanel value={currentTab} index={5}>
					<OrderReceivedForm onSubmit={(data) => handleFormSubmit('domesticOrder', data)} loading={loading} />
				</TabPanel>
				<TabPanel value={currentTab} index={6}>
					<LostLeadForm onSubmit={(data) => handleFormSubmit('lostLeadForm', data)} loading={loading} />
				</TabPanel>
			</Box>
		</Box>
	)
}

export default CreateForm;