import React from 'react'
import { Box, Button } from '@mui/material';
import { ArrowBack } from "@mui/icons-material";

import BudgetaryQuotationForm from '../BudgetaryQuotationForm';
import LeadSubmittedForm from '../LeadSubmittedForm';
import DomesticLeadForm from '../DomesticLeadForm';
import ExportLeadForm from '../ExportLeadForm';
import CRMLeadForm from '../CRMLeadForm';
import OrderReceivedForm from '../OrderReceiveForm';
import LostLeadForm from '../LostLeadForm';


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