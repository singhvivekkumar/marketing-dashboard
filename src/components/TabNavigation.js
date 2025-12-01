import React from "react";
import { useForm, Controller } from "react-hook-form";
import { 
	Container, 
	Paper, 
	Typography, 
	TextField, 
	Button, 
	Grid, 
	Box,
	Divider,
	Alert,
	Snackbar,
	Card,
	CardContent,
	Tabs,
	Tab,
	MenuItem,
	Chip,
	CircularProgress,
	IconButton,
	AppBar,
	Toolbar
} from '@mui/material';
import FeatureSelectionCard from "./common/FeatureSelectionCard";
import BulkUpload from "./common/BulkUpload";
import DataTableView from "./common/DataTableView";
import { mockLostDomesticLeads } from "../utils/mockLostDomesticLeads";
import CreateForm from "./common/CreateForm";


// Tab Panel Component
function TabPanel({ children, value, index }) {
	return (
		<div role="tabpanel" hidden={value !== index}>
			{value === index && <Box sx={{ py: 3 }}>{children}</Box>}
		</div>
	);
}

// Main App Component
const TabNavigation = () => {
	// const [currentTab, setCurrentTab] = React.useState(0);
	const [submitSuccess, setSubmitSuccess] = React.useState(false);
	const [submittedData, setSubmittedData] = React.useState(null);
	const [totalSubmissions, setTotalSubmissions] = React.useState(0);
	const [loading, setLoading] = React.useState(false);
	const [currentTab, setCurrentTab] = React.useState(0);
  const [tabStates, setTabStates] = React.useState({});
  const [tableData, setTableData] = React.useState(mockLostDomesticLeads);
  const [snackbar, setSnackbar] = React.useState({ open: false, message: '', severity: 'success' });

	// Form data state for all 7 forms
	const [formData, setFormData] = React.useState({
		budgetaryQuotation: null,
		leadSubmitted: null,
		domesticLeadsV2: null,
		exportLeads: null,
		crmLeads: null,
		domesticOrder: null,
		lostDomesticLeads: null,
	});

	// const handleTabChange = (event, newValue) => {
	// 	setCurrentTab(newValue);
	// };

	// const handleFormSubmit = (formType, data) => {
	// 	setLoading(true);
	// 	setTimeout(() => {
	// 		const timestamp = new Date().toISOString();
	// 		const formattedData = { ...data, submittedAt: timestamp };
			
	// 		setFormData(prev => ({ ...prev, [formType]: formattedData }));
	// 		setSubmittedData(formattedData);
	// 		setSubmitSuccess(true);
	// 		setTotalSubmissions(prev => prev + 1);
	// 		setLoading(false);
			
	// 		console.log(`${formType} Data:`, JSON.stringify(formattedData, null, 2));
	// 	}, 500);
	// };

	const tabsConfig = [
		{ label: 'Budgetary Quotation', icon: '💵', formType: 'budgetaryQuotation' },
		{ label: 'Lead Submitted', icon: '✅', formType: 'leadSubmitted' },
		{ label: 'Domestic Leads', icon: '🏢', formType: 'domesticLeads' },
		{ label: 'Export Leads', icon: '🌍', formType: 'exportLeads' },
		{ label: 'CRM Leads', icon: '📞', formType: 'crmLeads' },
		{ label: 'Order Received', icon: '🧾', formType: 'orderReceived' },
		{ label: 'Lost Leads', icon: '📉', formType: 'lostLeads' },
	];

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
		setCurrentMode('select');
  };

  const getCurrentMode = () => {
    return tabStates[currentTab] || 'select';
  };

  const setCurrentMode = (mode) => {
    setTabStates(prev => ({ ...prev, [currentTab]: mode }));
  };

  const handleFeatureSelect = (feature) => {
    setCurrentMode(feature);
  };

  const handleBack = () => {
    setCurrentMode('select');
  };

  const handleFormSubmit = (data) => {
    const newRecord = {
      id: tableData.length + 1,
      ...data,
      createdAt: new Date().toISOString().slice(0, 10)
    };
    setTableData(prev => [...prev, newRecord]);
    setSnackbar({ open: true, message: 'Record added successfully!', severity: 'success' });
    setCurrentMode('view');
  };
 
  const handleDeleteRecord = (id) => {
    setTableData(prev => prev.filter(record => record.id !== id));
    setSnackbar({ open: true, message: 'Record deleted successfully!', severity: 'success' });
  };

  const handleUploadSuccess = (count) => {
    setSnackbar({ open: true, message: `Successfully uploaded ${count} records!`, severity: 'success' });
  };

  const currentMode = getCurrentMode();

	return (
		<Box sx={{ backgroundColor: '#f5f5f5', minHeight: '100vh', pb: 4 }}>
			{/* Header */}
			<AppBar position="static" elevation={2} sx={{ backgroundColor: '#1976d2' }}>
				<Toolbar>
					<Typography variant="h5" component="h1" sx={{ fontWeight: 700, flexGrow: 1 }}>
						📊 Multi-Form Dashboard - CRM &amp; Leads Management
					</Typography>
					{totalSubmissions > 0 && (
						<Chip 
							label={`Total Submissions: ${totalSubmissions}`} 
							color="secondary" 
							sx={{ fontWeight: 600, fontSize: '0.95rem' }}
						/>
					)}
				</Toolbar>
			</AppBar>

			<Container maxWidth="lg" sx={{ mt: 3 }}>
				<Paper elevation={3} sx={{ backgroundColor: '#ffffff' }}>
					{/* Tabs Navigation */}
					<Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
						<Tabs 
							value={currentTab} 
							onChange={handleTabChange}
							variant="scrollable"
							scrollButtons="auto"
							sx={{
								'& .MuiTab-root': {
									minHeight: 64,
									textTransform: 'none',
									fontSize: '0.95rem',
									fontWeight: 500
								}
							}}
						>
							{tabsConfig.map((tab, index) => (
								<Tab 
									key={index}
									label={
										<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
											<span>{tab.icon}</span>
											<span>{tab.label}</span>
										</Box>
									}
								/>
							))}
						</Tabs>
					</Box>

					{/* Tab Panels */}
					{/* <Box sx={{ p: { xs: 2, md: 4 } }}>
						<TabPanel value={currentTab} index={0}>
							<BudgetaryQuotationForm onSubmit={(data) => handleFormSubmit('budgetaryQuotation', data)} loading={loading} />
						</TabPanel>
						<TabPanel value={currentTab} index={1}>
							<LeadSubmittedForm onSubmit={(data) => handleFormSubmit('leadSubmitted', data)} loading={loading} />
						</TabPanel>
						<TabPanel value={currentTab} index={2}>
							<DomesticLeadsV2Form onSubmit={(data) => handleFormSubmit('domesticLeadsV2', data)} loading={loading} />
						</TabPanel>
						<TabPanel value={currentTab} index={3}>
							<ExportLeadsForm onSubmit={(data) => handleFormSubmit('exportLeads', data)} loading={loading} />
						</TabPanel>
						<TabPanel value={currentTab} index={4}>
							<CRMLeadsForm onSubmit={(data) => handleFormSubmit('crmLeads', data)} loading={loading} />
						</TabPanel>
						<TabPanel value={currentTab} index={5}>
							<DomesticOrderForm onSubmit={(data) => handleFormSubmit('domesticOrder', data)} loading={loading} />
						</TabPanel>
						<TabPanel value={currentTab} index={6}>
							<LostDomesticLeadsForm onSubmit={(data) => handleFormSubmit('lostDomesticLeads', data)} loading={loading} />
						</TabPanel>
					</Box> */}
					<Box sx={{ p: { xs: 2, md: 4 } }}>
            {currentMode === 'select' && (
              <FeatureSelectionCard onSelectFeature={handleFeatureSelect} />
            )}
            {currentMode === 'view' && (
              <DataTableView 
                data={tableData} 
                onBack={handleBack}
                onDeleteRecord={handleDeleteRecord}
              />
            )}
            {currentMode === 'add' && (
              <CreateForm
							  currentTab={currentTab}
                onSubmit={handleFormSubmit}
                onBack={handleBack}
								loading={loading}
              />
            )}
            {currentMode === 'upload' && (
              <BulkUpload
                onBack={handleBack}
                onUploadSuccess={handleUploadSuccess}
              />
            )}
          </Box>
				</Paper>

				{/* Success Snackbar */}
				<Snackbar
					open={submitSuccess}
					autoHideDuration={4000}
					onClose={() => setSubmitSuccess(false)}
					anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
				>
					<Alert severity="success" variant="filled" sx={{ width: '100%', fontSize: '1rem' }}>
						✅ Form submitted successfully!
					</Alert>
				</Snackbar>

				{/* Submitted Data Display */}
				{submittedData && (
					<Paper elevation={3} sx={{ mt: 4, p: 3 }}>
						<Typography variant="h5" sx={{ fontWeight: 600, mb: 2, color: '#1976d2' }}>
							📊 Last Submitted Data (JSON Format)
						</Typography>
						<Paper 
							elevation={1} 
							sx={{ 
								p: 3, 
								backgroundColor: '#1e1e1e',
								color: '#d4d4d4',
								maxHeight: 500, 
								overflow: 'auto',
								fontFamily: 'monospace',
								fontSize: '0.85rem',
								borderRadius: 2
							}}
						>
							<pre style={{ margin: 0, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
								{JSON.stringify(submittedData, null, 2)}
							</pre>
						</Paper>
					</Paper>
				)}
			</Container>
		</Box>
	);
};

// Form 1: Budgetary Quotation
function BudgetaryQuotationForm({ onSubmit, loading }) {
	const { control, handleSubmit, reset, formState: { errors } } = useForm({
		defaultValues: {
			serialNumber: '', bqTitle: '', customer: '', leadOwner: '', classification: '',
			estimatedValueWithoutGST: '', estimatedValueWithGST: '', dateLetterSubmission: '',
			referenceNumber: '', competitor: '', presentStatus: ''
		}
	});

	const handleFormSubmit = (data) => {
		onSubmit({
			...data,
			estimatedValueWithoutGST: parseFloat(data.estimatedValueWithoutGST),
			estimatedValueWithGST: parseFloat(data.estimatedValueWithGST)
		});
	};

	return (
		<form onSubmit={handleSubmit(handleFormSubmit)}>
			<Typography variant="h5" sx={{ fontWeight: 600, mb: 3, color: '#388e3c' }}>
				💵 Budgetary Quotation Form
			</Typography>
			
			<Card sx={{ mb: 3, backgroundColor: '#e8f5e9' }}>
				<CardContent>
					<Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>Quotation Details</Typography>
					<Grid container spacing={2}>
						<Grid item xs={12} md={4}>
							<Controller name="serialNumber" control={control} rules={{ required: 'Required' }}
								render={({ field }) => (
									<TextField {...field} label="Serial Number" fullWidth required error={!!errors.serialNumber} helperText={errors.serialNumber?.message} />
								)}
							/>
						</Grid>
						<Grid item xs={12} md={4}>
							<Controller name="bqTitle" control={control} rules={{ required: 'Required' }}
								render={({ field }) => (
									<TextField {...field} label="BQ Title" fullWidth required error={!!errors.bqTitle} helperText={errors.bqTitle?.message} />
								)}
							/>
						</Grid>
						<Grid item xs={12} md={4}>
							<Controller name="customer" control={control} rules={{ required: 'Required' }}
								render={({ field }) => (
									<TextField {...field} label="Customer" fullWidth required error={!!errors.customer} helperText={errors.customer?.message} />
								)}
							/>
						</Grid>
					</Grid>
				</CardContent>
			</Card>

			<Card sx={{ mb: 3, backgroundColor: '#e3f2fd' }}>
				<CardContent>
					<Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>Classification</Typography>
					<Grid container spacing={2}>
						<Grid item xs={12} md={4}>
							<Controller name="leadOwner" control={control} rules={{ required: 'Required' }}
								render={({ field }) => (
									<TextField {...field} label="Lead Owner" fullWidth required error={!!errors.leadOwner} helperText={errors.leadOwner?.message} />
								)}
							/>
						</Grid>
						<Grid item xs={12} md={4}>
							<Controller name="classification" control={control} rules={{ required: 'Required' }}
								render={({ field }) => (
									<TextField {...field} select label="Classification" fullWidth required error={!!errors.classification}>
										{['Defence', 'Non-Defence'].map(opt => <MenuItem key={opt} value={opt}>{opt}</MenuItem>)}
									</TextField>
								)}
							/>
						</Grid>
						<Grid item xs={12} md={4}>
							<Controller name="referenceNumber" control={control} rules={{ required: 'Required' }}
								render={({ field }) => (
									<TextField {...field} label="Reference Number" fullWidth required error={!!errors.referenceNumber} helperText={errors.referenceNumber?.message} />
								)}
							/>
						</Grid>
					</Grid>
				</CardContent>
			</Card>

			<Card sx={{ mb: 3, backgroundColor: '#fff3e0' }}>
				<CardContent>
					<Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>Financial Details</Typography>
					<Grid container spacing={2}>
						<Grid item xs={12} md={6}>
							<Controller name="estimatedValueWithoutGST" control={control} rules={{ required: 'Required', min: { value: 0, message: 'Must be positive' } }}
								render={({ field }) => (
									<TextField {...field} label="Estimated Value Without GST (Crore)" type="number" fullWidth required error={!!errors.estimatedValueWithoutGST} helperText={errors.estimatedValueWithoutGST?.message} inputProps={{ step: '0.01' }} />
								)}
							/>
						</Grid>
						<Grid item xs={12} md={6}>
							<Controller name="estimatedValueWithGST" control={control} rules={{ required: 'Required', min: { value: 0, message: 'Must be positive' } }}
								render={({ field }) => (
									<TextField {...field} label="Estimated Value With GST (Crore)" type="number" fullWidth required error={!!errors.estimatedValueWithGST} helperText={errors.estimatedValueWithGST?.message} inputProps={{ step: '0.01' }} />
								)}
							/>
						</Grid>
					</Grid>
				</CardContent>
			</Card>

			<Card sx={{ mb: 3, backgroundColor: '#f3e5f5' }}>
				<CardContent>
					<Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>Status</Typography>
					<Grid container spacing={2}>
						<Grid item xs={12} md={4}>
							<Controller name="dateLetterSubmission" control={control} rules={{ required: 'Required' }}
								render={({ field }) => (
									<TextField {...field} label="Date of Letter Submission" type="date" fullWidth required InputLabelProps={{ shrink: true }} error={!!errors.dateLetterSubmission} helperText={errors.dateLetterSubmission?.message} />
								)}
							/>
						</Grid>
						<Grid item xs={12} md={4}>
							<Controller name="competitor" control={control}
								render={({ field }) => (
									<TextField {...field} label="Competitor" fullWidth />
								)}
							/>
						</Grid>
						<Grid item xs={12} md={4}>
							<Controller name="presentStatus" control={control} rules={{ required: 'Required' }}
								render={({ field }) => (
									<TextField {...field} select label="Present Status" fullWidth required error={!!errors.presentStatus}>
										{['Draft', 'Submitted', 'In Progress', 'Under Review', 'Won', 'Lost', 'On Hold'].map(opt => <MenuItem key={opt} value={opt}>{opt}</MenuItem>)}
									</TextField>
								)}
							/>
						</Grid>
					</Grid>
				</CardContent>
			</Card>

			<Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', mt: 3 }}>
				<Button type="submit" variant="contained" size="large" disabled={loading} sx={{ minWidth: 150 }}>
					{loading ? <CircularProgress size={24} /> : 'Submit'}
				</Button>
				<Button type="button" variant="outlined" size="large" onClick={() => reset()} sx={{ minWidth: 150 }}>Reset</Button>
			</Box>
		</form>
	);
}

// Form 2: Lead Submitted
function LeadSubmittedForm({ onSubmit, loading }) {
	const { control, handleSubmit, reset, formState: { errors } } = useForm({
		defaultValues: {
			serialNumber: '', tenderName: '', customer: '', tenderDate: '', bidOwner: '',
			rfpReceivedOn: '', valueEMDCrore: '', rfpDueDate: '', dmktgApprovalRxdOn: '',
			sellingPriceApprovalInitiatedOn: '', bidSubmittedOn: '', approvalSBUFinanceOn: '',
			approvalGMOn: '', sentToFinanceGMOn: '', dmktgApprovalRxdOnFinal: '',
			tenderReferenceNo: '', tenderType: '', website: '', presentStatus: ''
		}
	});

	const handleFormSubmit = (data) => {
		onSubmit({
			...data,
			valueEMDCrore: parseFloat(data.valueEMDCrore)
		});
	};

	return (
		<form onSubmit={handleSubmit(handleFormSubmit)}>
			<Typography variant="h5" sx={{ fontWeight: 600, mb: 3, color: '#0288d1' }}>
				✅ Lead Submitted Form
			</Typography>
			
			<Card sx={{ mb: 3, backgroundColor: '#e3f2fd' }}>
				<CardContent>
					<Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>Basic Information</Typography>
					<Grid container spacing={2}>
						<Grid item xs={12} md={4}>
							<Controller name="serialNumber" control={control} rules={{ required: 'Required' }}
								render={({ field }) => (
									<TextField {...field} label="Serial Number" fullWidth required error={!!errors.serialNumber} helperText={errors.serialNumber?.message} />
								)}
							/>
						</Grid>
						<Grid item xs={12} md={4}>
							<Controller name="tenderName" control={control} rules={{ required: 'Required' }}
								render={({ field }) => (
									<TextField {...field} label="Tender Name" fullWidth required error={!!errors.tenderName} helperText={errors.tenderName?.message} />
								)}
							/>
						</Grid>
						<Grid item xs={12} md={4}>
							<Controller name="customer" control={control} rules={{ required: 'Required' }}
								render={({ field }) => (
									<TextField {...field} label="Customer" fullWidth required error={!!errors.customer} helperText={errors.customer?.message} />
								)}
							/>
						</Grid>
						<Grid item xs={12} md={4}>
							<Controller name="tenderDate" control={control} rules={{ required: 'Required' }}
								render={({ field }) => (
									<TextField {...field} label="Tender Date" type="date" fullWidth required InputLabelProps={{ shrink: true }} error={!!errors.tenderDate} helperText={errors.tenderDate?.message} />
								)}
							/>
						</Grid>
						<Grid item xs={12} md={4}>
							<Controller name="bidOwner" control={control} rules={{ required: 'Required' }}
								render={({ field }) => (
									<TextField {...field} label="Bid Owner" fullWidth required error={!!errors.bidOwner} helperText={errors.bidOwner?.message} />
								)}
							/>
						</Grid>
						<Grid item xs={12} md={4}>
							<Controller name="valueEMDCrore" control={control} rules={{ required: 'Required', min: { value: 0, message: 'Must be positive' } }}
								render={({ field }) => (
									<TextField {...field} label="EMD Value (Crore)" type="number" fullWidth required error={!!errors.valueEMDCrore} helperText={errors.valueEMDCrore?.message} inputProps={{ step: '0.01' }} />
								)}
							/>
						</Grid>
					</Grid>
				</CardContent>
			</Card>

			<Card sx={{ mb: 3, backgroundColor: '#e8f5e9' }}>
				<CardContent>
					<Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>RFP Timeline</Typography>
					<Grid container spacing={2}>
						<Grid item xs={12} md={6}>
							<Controller name="rfpReceivedOn" control={control} rules={{ required: 'Required' }}
								render={({ field }) => (
									<TextField {...field} label="RFP Received On" type="date" fullWidth required InputLabelProps={{ shrink: true }} error={!!errors.rfpReceivedOn} helperText={errors.rfpReceivedOn?.message} />
								)}
							/>
						</Grid>
						<Grid item xs={12} md={6}>
							<Controller name="rfpDueDate" control={control} rules={{ required: 'Required' }}
								render={({ field }) => (
									<TextField {...field} label="RFP Due Date" type="date" fullWidth required InputLabelProps={{ shrink: true }} error={!!errors.rfpDueDate} helperText={errors.rfpDueDate?.message} />
								)}
							/>
						</Grid>
					</Grid>
				</CardContent>
			</Card>

			<Card sx={{ mb: 3, backgroundColor: '#fff3e0' }}>
				<CardContent>
					<Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>Approval Workflow</Typography>
					<Grid container spacing={2}>
						<Grid item xs={12} md={4}>
							<Controller name="dmktgApprovalRxdOn" control={control} rules={{ required: 'Required' }}
								render={({ field }) => (
									<TextField {...field} label="Dmktg Approval Rxd On" type="date" fullWidth required InputLabelProps={{ shrink: true }} error={!!errors.dmktgApprovalRxdOn} helperText={errors.dmktgApprovalRxdOn?.message} />
								)}
							/>
						</Grid>
						<Grid item xs={12} md={4}>
							<Controller name="sellingPriceApprovalInitiatedOn" control={control} rules={{ required: 'Required' }}
								render={({ field }) => (
									<TextField {...field} label="Selling Price Approval Initiated" type="date" fullWidth required InputLabelProps={{ shrink: true }} error={!!errors.sellingPriceApprovalInitiatedOn} helperText={errors.sellingPriceApprovalInitiatedOn?.message} />
								)}
							/>
						</Grid>
						<Grid item xs={12} md={4}>
							<Controller name="bidSubmittedOn" control={control} rules={{ required: 'Required' }}
								render={({ field }) => (
									<TextField {...field} label="Bid Submitted On" type="date" fullWidth required InputLabelProps={{ shrink: true }} error={!!errors.bidSubmittedOn} helperText={errors.bidSubmittedOn?.message} />
								)}
							/>
						</Grid>
						<Grid item xs={12} md={4}>
							<Controller name="approvalSBUFinanceOn" control={control} rules={{ required: 'Required' }}
								render={({ field }) => (
									<TextField {...field} label="Approval SBU Finance On" type="date" fullWidth required InputLabelProps={{ shrink: true }} error={!!errors.approvalSBUFinanceOn} helperText={errors.approvalSBUFinanceOn?.message} />
								)}
							/>
						</Grid>
						<Grid item xs={12} md={4}>
							<Controller name="approvalGMOn" control={control} rules={{ required: 'Required' }}
								render={({ field }) => (
									<TextField {...field} label="Approval GM On" type="date" fullWidth required InputLabelProps={{ shrink: true }} error={!!errors.approvalGMOn} helperText={errors.approvalGMOn?.message} />
								)}
							/>
						</Grid>
						<Grid item xs={12} md={4}>
							<Controller name="sentToFinanceGMOn" control={control} rules={{ required: 'Required' }}
								render={({ field }) => (
									<TextField {...field} label="Sent to Finance GM On" type="date" fullWidth required InputLabelProps={{ shrink: true }} error={!!errors.sentToFinanceGMOn} helperText={errors.sentToFinanceGMOn?.message} />
								)}
							/>
						</Grid>
						<Grid item xs={12} md={4}>
							<Controller name="dmktgApprovalRxdOnFinal" control={control} rules={{ required: 'Required' }}
								render={({ field }) => (
									<TextField {...field} label="Dmktg Approval Rxd On (Final)" type="date" fullWidth required InputLabelProps={{ shrink: true }} error={!!errors.dmktgApprovalRxdOnFinal} helperText={errors.dmktgApprovalRxdOnFinal?.message} />
								)}
							/>
						</Grid>
					</Grid>
				</CardContent>
			</Card>

			<Card sx={{ mb: 3, backgroundColor: '#f3e5f5' }}>
				<CardContent>
					<Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>Additional Details</Typography>
					<Grid container spacing={2}>
						<Grid item xs={12} md={4}>
							<Controller name="tenderReferenceNo" control={control} rules={{ required: 'Required' }}
								render={({ field }) => (
									<TextField {...field} label="Tender Reference No" fullWidth required error={!!errors.tenderReferenceNo} helperText={errors.tenderReferenceNo?.message} />
								)}
							/>
						</Grid>
						<Grid item xs={12} md={4}>
							<Controller name="tenderType" control={control} rules={{ required: 'Required' }}
								render={({ field }) => (
									<TextField {...field} label="Tender Type" fullWidth required error={!!errors.tenderType} helperText={errors.tenderType?.message} />
								)}
							/>
						</Grid>
						<Grid item xs={12} md={4}>
							<Controller name="website" control={control}
								render={({ field }) => (
									<TextField {...field} label="Website" fullWidth />
								)}
							/>
						</Grid>
						<Grid item xs={12} md={4}>
							<Controller name="presentStatus" control={control} rules={{ required: 'Required' }}
								render={({ field }) => (
									<TextField {...field} select label="Present Status" fullWidth required error={!!errors.presentStatus}>
										{['Draft', 'Submitted', 'In Progress', 'Under Review', 'Won', 'Lost', 'On Hold'].map(opt => <MenuItem key={opt} value={opt}>{opt}</MenuItem>)}
									</TextField>
								)}
							/>
						</Grid>
					</Grid>
				</CardContent>
			</Card>

			<Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', mt: 3 }}>
				<Button type="submit" variant="contained" size="large" disabled={loading} sx={{ minWidth: 150 }}>
					{loading ? <CircularProgress size={24} /> : 'Submit'}
				</Button>
				<Button type="button" variant="outlined" size="large" onClick={() => reset()} sx={{ minWidth: 150 }}>Reset</Button>
			</Box>
		</form>
	);
}

// Form 2: Order Received
function DomesticOrderForm({ onSubmit, loading }) {
	const { control, handleSubmit, reset, formState: { errors } } = useForm({
		defaultValues: {
			serialNumber: '', contractName: '', customerName: '', customerAddress: '',
			orderReceivedDate: '', poNumber: '', orderType: '', valueWithoutGST: '',
			valueWithGST: '', competitors: '', remarks: ''
		}
	});

	const handleFormSubmit = (data) => {
		onSubmit({
			...data,
			valueWithoutGST: parseFloat(data.valueWithoutGST),
			valueWithGST: parseFloat(data.valueWithGST)
		});
	};

	return (
		<form onSubmit={handleSubmit(handleFormSubmit)}>
			<Typography variant="h5" sx={{ fontWeight: 600, mb: 3, color: '#1976d2' }}>
				🧾 Domestic Order Form
			</Typography>
			
			<Card sx={{ mb: 3, backgroundColor: '#e8f5e9' }}>
				<CardContent>
					<Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>Order Details</Typography>
					<Grid container spacing={2}>
						<Grid item xs={12} md={4}>
							<Controller name="serialNumber" control={control} rules={{ required: 'Required' }}
								render={({ field }) => (
									<TextField {...field} label="Serial Number" fullWidth required error={!!errors.serialNumber} helperText={errors.serialNumber?.message} />
								)}
							/>
						</Grid>
						<Grid item xs={12} md={4}>
							<Controller name="contractName" control={control} rules={{ required: 'Required' }}
								render={({ field }) => (
									<TextField {...field} label="Contract Name" fullWidth required error={!!errors.contractName} helperText={errors.contractName?.message} />
								)}
							/>
						</Grid>
						<Grid item xs={12} md={4}>
							<Controller name="poNumber" control={control} rules={{ required: 'Required' }}
								render={({ field }) => (
									<TextField {...field} label="PO Number" fullWidth required error={!!errors.poNumber} helperText={errors.poNumber?.message} />
								)}
							/>
						</Grid>
					</Grid>
				</CardContent>
			</Card>

			<Card sx={{ mb: 3, backgroundColor: '#e3f2fd' }}>
				<CardContent>
					<Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>Customer Information</Typography>
					<Grid container spacing={2}>
						<Grid item xs={12} md={6}>
							<Controller name="customerName" control={control} rules={{ required: 'Required' }}
								render={({ field }) => (
									<TextField {...field} label="Customer Name" fullWidth required error={!!errors.customerName} helperText={errors.customerName?.message} />
								)}
							/>
						</Grid>
						<Grid item xs={12} md={6}>
							<Controller name="customerAddress" control={control} rules={{ required: 'Required' }}
								render={({ field }) => (
									<TextField {...field} label="Customer Address" multiline rows={2} fullWidth required error={!!errors.customerAddress} helperText={errors.customerAddress?.message} />
								)}
							/>
						</Grid>
					</Grid>
				</CardContent>
			</Card>

			<Card sx={{ mb: 3, backgroundColor: '#fff3e0' }}>
				<CardContent>
					<Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>Order Information</Typography>
					<Grid container spacing={2}>
						<Grid item xs={12} md={3}>
							<Controller name="orderReceivedDate" control={control} rules={{ required: 'Required' }}
								render={({ field }) => (
									<TextField {...field} label="Order Received Date" type="date" fullWidth required InputLabelProps={{ shrink: true }} error={!!errors.orderReceivedDate} helperText={errors.orderReceivedDate?.message} />
								)}
							/>
						</Grid>
						<Grid item xs={12} md={3}>
							<Controller name="orderType" control={control} rules={{ required: 'Required' }}
								render={({ field }) => (
									<TextField {...field} select label="Order Type" fullWidth required error={!!errors.orderType}>
										{['Single Order', 'Multiple Order'].map(opt => <MenuItem key={opt} value={opt}>{opt}</MenuItem>)}
									</TextField>
								)}
							/>
						</Grid>
						<Grid item xs={12} md={3}>
							<Controller name="valueWithoutGST" control={control} rules={{ required: 'Required', min: { value: 0, message: 'Must be positive' } }}
								render={({ field }) => (
									<TextField {...field} label="Value Without GST (Crore)" type="number" fullWidth required error={!!errors.valueWithoutGST} helperText={errors.valueWithoutGST?.message} inputProps={{ step: '0.01' }} />
								)}
							/>
						</Grid>
						<Grid item xs={12} md={3}>
							<Controller name="valueWithGST" control={control} rules={{ required: 'Required', min: { value: 0, message: 'Must be positive' } }}
								render={({ field }) => (
									<TextField {...field} label="Value With GST (Crore)" type="number" fullWidth required error={!!errors.valueWithGST} helperText={errors.valueWithGST?.message} inputProps={{ step: '0.01' }} />
								)}
							/>
						</Grid>
					</Grid>
				</CardContent>
			</Card>

			<Card sx={{ mb: 3, backgroundColor: '#f3e5f5' }}>
				<CardContent>
					<Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>Additional Information</Typography>
					<Grid container spacing={2}>
						<Grid item xs={12} md={6}>
							<Controller name="competitors" control={control}
								render={({ field }) => (
									<TextField {...field} label="Competitors" multiline rows={3} fullWidth />
								)}
							/>
						</Grid>
						<Grid item xs={12} md={6}>
							<Controller name="remarks" control={control}
								render={({ field }) => (
									<TextField {...field} label="Remarks" multiline rows={3} fullWidth />
								)}
							/>
						</Grid>
					</Grid>
				</CardContent>
			</Card>

			<Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', mt: 3 }}>
				<Button type="submit" variant="contained" size="large" disabled={loading} sx={{ minWidth: 150 }}>
					{loading ? <CircularProgress size={24} /> : 'Submit'}
				</Button>
				<Button type="button" variant="outlined" size="large" onClick={() => reset()} sx={{ minWidth: 150 }}>Reset</Button>
			</Box>
		</form>
	);
}

// Form 3: Domestic Leads
function DomesticLeadsV2Form({ onSubmit, loading }) {
	const { control, handleSubmit, reset, formState: { errors } } = useForm({
		defaultValues: {
			serialNumber: '', tenderName: '', customer: '', location: '', tenderType: '',
			documentType: '', leadOwner: '', civilDefence: '', businessDomain: '',
			valueEMDCrore: '', estimatedValueWithoutGSTCrore: '', submittedValueWithGSTCrore: '',
			tenderDated: '', lastDateSubmission: '', soleConsortium: '', preBidMeetingDateTime: '',
			competitorsInfo: '', participationStatus: '', openClosed: '',
			orderWonValueWithoutGSTCrore: '', presentStatus: '', reasonNote: '', corrigendumInfo: ''
		}
	});

	const handleFormSubmit = (data) => {
		onSubmit({
			...data,
			valueEMDCrore: data.valueEMDCrore ? parseFloat(data.valueEMDCrore) : 0,
			estimatedValueWithoutGSTCrore: data.estimatedValueWithoutGSTCrore ? parseFloat(data.estimatedValueWithoutGSTCrore) : 0,
			submittedValueWithGSTCrore: data.submittedValueWithGSTCrore ? parseFloat(data.submittedValueWithGSTCrore) : 0,
			orderWonValueWithoutGSTCrore: data.orderWonValueWithoutGSTCrore ? parseFloat(data.orderWonValueWithoutGSTCrore) : 0
		});
	};

	return (
		<form onSubmit={handleSubmit(handleFormSubmit)}>
			<Typography variant="h5" sx={{ fontWeight: 600, mb: 3, color: '#5e35b1' }}>
				🏢 Domestic Leads V2 Form
			</Typography>
			
			<Card sx={{ mb: 3, backgroundColor: '#e8eaf6' }}>
				<CardContent>
					<Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>Basic Information</Typography>
					<Grid container spacing={2}>
						<Grid item xs={12} md={3}>
							<Controller name="serialNumber" control={control} rules={{ required: 'Required' }}
								render={({ field }) => (
									<TextField {...field} label="Serial Number" fullWidth required error={!!errors.serialNumber} helperText={errors.serialNumber?.message} />
								)}
							/>
						</Grid>
						<Grid item xs={12} md={3}>
							<Controller name="tenderName" control={control} rules={{ required: 'Required' }}
								render={({ field }) => (
									<TextField {...field} label="Tender Name" fullWidth required error={!!errors.tenderName} helperText={errors.tenderName?.message} />
								)}
							/>
						</Grid>
						<Grid item xs={12} md={3}>
							<Controller name="customer" control={control} rules={{ required: 'Required' }}
								render={({ field }) => (
									<TextField {...field} label="Customer" fullWidth required error={!!errors.customer} helperText={errors.customer?.message} />
								)}
							/>
						</Grid>
						<Grid item xs={12} md={3}>
							<Controller name="location" control={control} rules={{ required: 'Required' }}
								render={({ field }) => (
									<TextField {...field} label="Location" fullWidth required error={!!errors.location} helperText={errors.location?.message} />
								)}
							/>
						</Grid>
					</Grid>
				</CardContent>
			</Card>

			<Card sx={{ mb: 3, backgroundColor: '#e0f2f1' }}>
				<CardContent>
					<Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>Tender Classification</Typography>
					<Grid container spacing={2}>
						<Grid item xs={12} md={3}>
							<Controller name="tenderType" control={control} rules={{ required: 'Required' }}
								render={({ field }) => (
									<TextField {...field} select label="Tender Type" fullWidth required error={!!errors.tenderType}>
										{['Single Tender', 'EOI', 'RFI', 'RFP', 'BQ', 'Other'].map(opt => <MenuItem key={opt} value={opt}>{opt}</MenuItem>)}
									</TextField>
								)}
							/>
						</Grid>
						<Grid item xs={12} md={3}>
							<Controller name="documentType" control={control} rules={{ required: 'Required' }}
								render={({ field }) => (
									<TextField {...field} label="Document Type" fullWidth required error={!!errors.documentType} helperText={errors.documentType?.message} />
								)}
							/>
						</Grid>
						<Grid item xs={12} md={3}>
							<Controller name="civilDefence" control={control} rules={{ required: 'Required' }}
								render={({ field }) => (
									<TextField {...field} select label="Civil/Defence" fullWidth required error={!!errors.civilDefence}>
										{['Civil', 'Defence'].map(opt => <MenuItem key={opt} value={opt}>{opt}</MenuItem>)}
									</TextField>
								)}
							/>
						</Grid>
						<Grid item xs={12} md={3}>
							<Controller name="soleConsortium" control={control} rules={{ required: 'Required' }}
								render={({ field }) => (
									<TextField {...field} select label="Sole/Consortium" fullWidth required error={!!errors.soleConsortium}>
										{['Sole', 'Consortium'].map(opt => <MenuItem key={opt} value={opt}>{opt}</MenuItem>)}
									</TextField>
								)}
							/>
						</Grid>
						<Grid item xs={12} md={4}>
							<Controller name="leadOwner" control={control} rules={{ required: 'Required' }}
								render={({ field }) => (
									<TextField {...field} label="Lead Owner" fullWidth required error={!!errors.leadOwner} helperText={errors.leadOwner?.message} />
								)}
							/>
						</Grid>
						<Grid item xs={12} md={4}>
							<Controller name="businessDomain" control={control} rules={{ required: 'Required' }}
								render={({ field }) => (
									<TextField {...field} label="Business Domain" fullWidth required error={!!errors.businessDomain} helperText={errors.businessDomain?.message} />
								)}
							/>
						</Grid>
					</Grid>
				</CardContent>
			</Card>

			<Card sx={{ mb: 3, backgroundColor: '#fff3e0' }}>
				<CardContent>
					<Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>Financial Information</Typography>
					<Grid container spacing={2}>
						<Grid item xs={12} md={3}>
							<Controller name="valueEMDCrore" control={control}
								render={({ field }) => (
									<TextField {...field} label="EMD (Crore)" type="number" fullWidth inputProps={{ step: '0.01' }} />
								)}
							/>
						</Grid>
						<Grid item xs={12} md={3}>
							<Controller name="estimatedValueWithoutGSTCrore" control={control}
								render={({ field }) => (
									<TextField {...field} label="Est. Value Without GST (Cr)" type="number" fullWidth inputProps={{ step: '0.01' }} />
								)}
							/>
						</Grid>
						<Grid item xs={12} md={3}>
							<Controller name="submittedValueWithGSTCrore" control={control}
								render={({ field }) => (
									<TextField {...field} label="Submitted Value With GST (Cr)" type="number" fullWidth inputProps={{ step: '0.01' }} />
								)}
							/>
						</Grid>
						<Grid item xs={12} md={3}>
							<Controller name="orderWonValueWithoutGSTCrore" control={control}
								render={({ field }) => (
									<TextField {...field} label="Order Won Value (Cr)" type="number" fullWidth inputProps={{ step: '0.01' }} />
								)}
							/>
						</Grid>
					</Grid>
				</CardContent>
			</Card>

			<Card sx={{ mb: 3, backgroundColor: '#f3e5f5' }}>
				<CardContent>
					<Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>Dates &amp; Timeline</Typography>
					<Grid container spacing={2}>
						<Grid item xs={12} md={4}>
							<Controller name="tenderDated" control={control} rules={{ required: 'Required' }}
								render={({ field }) => (
									<TextField {...field} label="Tender Dated" type="date" fullWidth required InputLabelProps={{ shrink: true }} error={!!errors.tenderDated} helperText={errors.tenderDated?.message} />
								)}
							/>
						</Grid>
						<Grid item xs={12} md={4}>
							<Controller name="lastDateSubmission" control={control} rules={{ required: 'Required' }}
								render={({ field }) => (
									<TextField {...field} label="Last Date of Submission" type="date" fullWidth required InputLabelProps={{ shrink: true }} error={!!errors.lastDateSubmission} helperText={errors.lastDateSubmission?.message} />
								)}
							/>
						</Grid>
						<Grid item xs={12} md={4}>
							<Controller name="preBidMeetingDateTime" control={control}
								render={({ field }) => (
									<TextField {...field} label="Pre-Bid Meeting Date/Time" type="datetime-local" fullWidth InputLabelProps={{ shrink: true }} />
								)}
							/>
						</Grid>
					</Grid>
				</CardContent>
			</Card>

			<Card sx={{ mb: 3, backgroundColor: '#e8f5e9' }}>
				<CardContent>
					<Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>Status &amp; Competition</Typography>
					<Grid container spacing={2}>
						<Grid item xs={12} md={3}>
							<Controller name="participationStatus" control={control} rules={{ required: 'Required' }}
								render={({ field }) => (
									<TextField {...field} select label="Participation Status" fullWidth required error={!!errors.participationStatus}>
										{['Won', 'Lost', 'Participated', 'Not-Participated'].map(opt => <MenuItem key={opt} value={opt}>{opt}</MenuItem>)}
									</TextField>
								)}
							/>
						</Grid>
						<Grid item xs={12} md={3}>
							<Controller name="openClosed" control={control} rules={{ required: 'Required' }}
								render={({ field }) => (
									<TextField {...field} select label="Open/Closed" fullWidth required error={!!errors.openClosed}>
										{['Open', 'Closed'].map(opt => <MenuItem key={opt} value={opt}>{opt}</MenuItem>)}
									</TextField>
								)}
							/>
						</Grid>
						<Grid item xs={12} md={3}>
							<Controller name="presentStatus" control={control} rules={{ required: 'Required' }}
								render={({ field }) => (
									<TextField {...field} select label="Present Status" fullWidth required error={!!errors.presentStatus}>
										{['Draft', 'Submitted', 'In Progress', 'Under Review', 'Won', 'Lost', 'On Hold'].map(opt => <MenuItem key={opt} value={opt}>{opt}</MenuItem>)}
									</TextField>
								)}
							/>
						</Grid>
						<Grid item xs={12} md={6}>
							<Controller name="competitorsInfo" control={control}
								render={({ field }) => (
									<TextField {...field} label="Competitors Info" multiline rows={2} fullWidth />
								)}
							/>
						</Grid>
						<Grid item xs={12} md={6}>
							<Controller name="reasonNote" control={control}
								render={({ field }) => (
									<TextField {...field} label="Reason/Note" multiline rows={2} fullWidth />
								)}
							/>
						</Grid>
						<Grid item xs={12} md={6}>
							<Controller name="corrigendumInfo" control={control}
								render={({ field }) => (
									<TextField {...field} label="Corrigendum Info" multiline rows={2} fullWidth />
								)}
							/>
						</Grid>
					</Grid>
				</CardContent>
			</Card>

			<Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', mt: 3 }}>
				<Button type="submit" variant="contained" size="large" disabled={loading} sx={{ minWidth: 150 }}>
					{loading ? <CircularProgress size={24} /> : 'Submit'}
				</Button>
				<Button type="button" variant="outlined" size="large" onClick={() => reset()} sx={{ minWidth: 150 }}>Reset</Button>
			</Box>
		</form>
	);
}

// Form 6: Export Leads (Similar structure to Domestic Leads)
function ExportLeadsForm({ onSubmit, loading }) {
	const { control, handleSubmit, reset, formState: { errors } } = useForm({
		defaultValues: {
			serialNumber: '', tenderName: '', customer: '', location: '', tenderType: '',
			documentType: '', leadOwner: '', civilDefence: '', businessDomain: '',
			valueEMDCrore: '', estimatedValueWithoutGSTCrore: '', submittedValueWithGSTCrore: '',
			tenderDated: '', lastDateSubmission: '', soleConsortium: '', preBidMeetingDateTime: '',
			competitorsInfo: '', participationStatus: '', openClosed: '',
			orderWonValueWithoutGSTCrore: '', presentStatus: '', reasonNote: '', corrigendumInfo: ''
		}
	});

	const handleFormSubmit = (data) => {
		onSubmit({
			...data,
			valueEMDCrore: data.valueEMDCrore ? parseFloat(data.valueEMDCrore) : 0,
			estimatedValueWithoutGSTCrore: data.estimatedValueWithoutGSTCrore ? parseFloat(data.estimatedValueWithoutGSTCrore) : 0,
			submittedValueWithGSTCrore: data.submittedValueWithGSTCrore ? parseFloat(data.submittedValueWithGSTCrore) : 0,
			orderWonValueWithoutGSTCrore: data.orderWonValueWithoutGSTCrore ? parseFloat(data.orderWonValueWithoutGSTCrore) : 0
		});
	};

	return (
		<form onSubmit={handleSubmit(handleFormSubmit)}>
			<Typography variant="h5" sx={{ fontWeight: 600, mb: 3, color: '#00796b' }}>
				🌍 Export Leads Form
			</Typography>
			
			<Card sx={{ mb: 3, backgroundColor: '#e0f2f1' }}>
				<CardContent>
					<Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>Basic Information</Typography>
					<Grid container spacing={2}>
						<Grid item xs={12} md={3}>
							<Controller name="serialNumber" control={control} rules={{ required: 'Required' }}
								render={({ field }) => (
									<TextField {...field} label="Serial Number" fullWidth required error={!!errors.serialNumber} helperText={errors.serialNumber?.message} />
								)}
							/>
						</Grid>
						<Grid item xs={12} md={3}>
							<Controller name="tenderName" control={control} rules={{ required: 'Required' }}
								render={({ field }) => (
									<TextField {...field} label="Tender Name" fullWidth required error={!!errors.tenderName} helperText={errors.tenderName?.message} />
								)}
							/>
						</Grid>
						<Grid item xs={12} md={3}>
							<Controller name="customer" control={control} rules={{ required: 'Required' }}
								render={({ field }) => (
									<TextField {...field} label="Customer" fullWidth required error={!!errors.customer} helperText={errors.customer?.message} />
								)}
							/>
						</Grid>
						<Grid item xs={12} md={3}>
							<Controller name="location" control={control} rules={{ required: 'Required' }}
								render={({ field }) => (
									<TextField {...field} label="Location (Country)" fullWidth required error={!!errors.location} helperText={errors.location?.message} />
								)}
							/>
						</Grid>
					</Grid>
				</CardContent>
			</Card>

			<Card sx={{ mb: 3, backgroundColor: '#e3f2fd' }}>
				<CardContent>
					<Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>Tender Classification</Typography>
					<Grid container spacing={2}>
						<Grid item xs={12} md={3}>
							<Controller name="tenderType" control={control} rules={{ required: 'Required' }}
								render={({ field }) => (
									<TextField {...field} select label="Tender Type" fullWidth required error={!!errors.tenderType}>
										{['Single Tender', 'EOI', 'RFI', 'RFP', 'BQ', 'Other'].map(opt => <MenuItem key={opt} value={opt}>{opt}</MenuItem>)}
									</TextField>
								)}
							/>
						</Grid>
						<Grid item xs={12} md={3}>
							<Controller name="documentType" control={control} rules={{ required: 'Required' }}
								render={({ field }) => (
									<TextField {...field} label="Document Type" fullWidth required error={!!errors.documentType} helperText={errors.documentType?.message} />
								)}
							/>
						</Grid>
						<Grid item xs={12} md={3}>
							<Controller name="civilDefence" control={control} rules={{ required: 'Required' }}
								render={({ field }) => (
									<TextField {...field} select label="Civil/Defence" fullWidth required error={!!errors.civilDefence}>
										{['Civil', 'Defence'].map(opt => <MenuItem key={opt} value={opt}>{opt}</MenuItem>)}
									</TextField>
								)}
							/>
						</Grid>
						<Grid item xs={12} md={3}>
							<Controller name="soleConsortium" control={control} rules={{ required: 'Required' }}
								render={({ field }) => (
									<TextField {...field} select label="Sole/Consortium" fullWidth required error={!!errors.soleConsortium}>
										{['Sole', 'Consortium'].map(opt => <MenuItem key={opt} value={opt}>{opt}</MenuItem>)}
									</TextField>
								)}
							/>
						</Grid>
						<Grid item xs={12} md={4}>
							<Controller name="leadOwner" control={control} rules={{ required: 'Required' }}
								render={({ field }) => (
									<TextField {...field} label="Lead Owner" fullWidth required error={!!errors.leadOwner} helperText={errors.leadOwner?.message} />
								)}
							/>
						</Grid>
						<Grid item xs={12} md={4}>
							<Controller name="businessDomain" control={control} rules={{ required: 'Required' }}
								render={({ field }) => (
									<TextField {...field} label="Business Domain" fullWidth required error={!!errors.businessDomain} helperText={errors.businessDomain?.message} />
								)}
							/>
						</Grid>
					</Grid>
				</CardContent>
			</Card>

			<Card sx={{ mb: 3, backgroundColor: '#fffde7' }}>
				<CardContent>
					<Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>Financial Information</Typography>
					<Grid container spacing={2}>
						<Grid item xs={12} md={3}>
							<Controller name="valueEMDCrore" control={control}
								render={({ field }) => (
									<TextField {...field} label="EMD (Crore)" type="number" fullWidth inputProps={{ step: '0.01' }} />
								)}
							/>
						</Grid>
						<Grid item xs={12} md={3}>
							<Controller name="estimatedValueWithoutGSTCrore" control={control}
								render={({ field }) => (
									<TextField {...field} label="Est. Value Without GST (Cr)" type="number" fullWidth inputProps={{ step: '0.01' }} />
								)}
							/>
						</Grid>
						<Grid item xs={12} md={3}>
							<Controller name="submittedValueWithGSTCrore" control={control}
								render={({ field }) => (
									<TextField {...field} label="Submitted Value With GST (Cr)" type="number" fullWidth inputProps={{ step: '0.01' }} />
								)}
							/>
						</Grid>
						<Grid item xs={12} md={3}>
							<Controller name="orderWonValueWithoutGSTCrore" control={control}
								render={({ field }) => (
									<TextField {...field} label="Order Won Value (Cr)" type="number" fullWidth inputProps={{ step: '0.01' }} />
								)}
							/>
						</Grid>
					</Grid>
				</CardContent>
			</Card>

			<Card sx={{ mb: 3, backgroundColor: '#f3e5f5' }}>
				<CardContent>
					<Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>Dates &amp; Timeline</Typography>
					<Grid container spacing={2}>
						<Grid item xs={12} md={4}>
							<Controller name="tenderDated" control={control} rules={{ required: 'Required' }}
								render={({ field }) => (
									<TextField {...field} label="Tender Dated" type="date" fullWidth required InputLabelProps={{ shrink: true }} error={!!errors.tenderDated} helperText={errors.tenderDated?.message} />
								)}
							/>
						</Grid>
						<Grid item xs={12} md={4}>
							<Controller name="lastDateSubmission" control={control} rules={{ required: 'Required' }}
								render={({ field }) => (
									<TextField {...field} label="Last Date of Submission" type="date" fullWidth required InputLabelProps={{ shrink: true }} error={!!errors.lastDateSubmission} helperText={errors.lastDateSubmission?.message} />
								)}
							/>
						</Grid>
						<Grid item xs={12} md={4}>
							<Controller name="preBidMeetingDateTime" control={control}
								render={({ field }) => (
									<TextField {...field} label="Pre-Bid Meeting Date/Time" type="datetime-local" fullWidth InputLabelProps={{ shrink: true }} />
								)}
							/>
						</Grid>
					</Grid>
				</CardContent>
			</Card>

			<Card sx={{ mb: 3, backgroundColor: '#ffebee' }}>
				<CardContent>
					<Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>Status &amp; Competition</Typography>
					<Grid container spacing={2}>
						<Grid item xs={12} md={3}>
							<Controller name="participationStatus" control={control} rules={{ required: 'Required' }}
								render={({ field }) => (
									<TextField {...field} select label="Participation Status" fullWidth required error={!!errors.participationStatus}>
										{['Won', 'Lost', 'Participated', 'Not-Participated'].map(opt => <MenuItem key={opt} value={opt}>{opt}</MenuItem>)}
									</TextField>
								)}
							/>
						</Grid>
						<Grid item xs={12} md={3}>
							<Controller name="openClosed" control={control} rules={{ required: 'Required' }}
								render={({ field }) => (
									<TextField {...field} select label="Open/Closed" fullWidth required error={!!errors.openClosed}>
										{['Open', 'Closed'].map(opt => <MenuItem key={opt} value={opt}>{opt}</MenuItem>)}
									</TextField>
								)}
							/>
						</Grid>
						<Grid item xs={12} md={3}>
							<Controller name="presentStatus" control={control} rules={{ required: 'Required' }}
								render={({ field }) => (
									<TextField {...field} select label="Present Status" fullWidth required error={!!errors.presentStatus}>
										{['Draft', 'Submitted', 'In Progress', 'Under Review', 'Won', 'Lost', 'On Hold'].map(opt => <MenuItem key={opt} value={opt}>{opt}</MenuItem>)}
									</TextField>
								)}
							/>
						</Grid>
						<Grid item xs={12} md={6}>
							<Controller name="competitorsInfo" control={control}
								render={({ field }) => (
									<TextField {...field} label="Competitors Info" multiline rows={2} fullWidth />
								)}
							/>
						</Grid>
						<Grid item xs={12} md={6}>
							<Controller name="reasonNote" control={control}
								render={({ field }) => (
									<TextField {...field} label="Reason/Note" multiline rows={2} fullWidth />
								)}
							/>
						</Grid>
						<Grid item xs={12} md={6}>
							<Controller name="corrigendumInfo" control={control}
								render={({ field }) => (
									<TextField {...field} label="Corrigendum Info" multiline rows={2} fullWidth />
								)}
							/>
						</Grid>
					</Grid>
				</CardContent>
			</Card>

			<Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', mt: 3 }}>
				<Button type="submit" variant="contained" size="large" disabled={loading} sx={{ minWidth: 150 }}>
					{loading ? <CircularProgress size={24} /> : 'Submit'}
				</Button>
				<Button type="button" variant="outlined" size="large" onClick={() => reset()} sx={{ minWidth: 150 }}>Reset</Button>
			</Box>
		</form>
	);
}

// Form 7: CRM Leads
function CRMLeadsForm({ onSubmit, loading }) {
	const { control, handleSubmit, reset, formState: { errors } } = useForm({
		defaultValues: {
			serialNumber: '', leadID: '', issueDate: '', tenderName: '', organisation: '',
			documentType: '', tenderType: '', emdCrore: '', approxTenderValueCrore: '',
			lastDateSubmission: '', preBidDate: '', teamAssigned: '', remarks: '', corrigendumInfo: ''
		}
	});

	const handleFormSubmit = (data) => {
		onSubmit({
			...data,
			emdCrore: parseFloat(data.emdCrore),
			approxTenderValueCrore: parseFloat(data.approxTenderValueCrore)
		});
	};

	return (
		<form onSubmit={handleSubmit(handleFormSubmit)}>
			<Typography variant="h5" sx={{ fontWeight: 600, mb: 3, color: '#e91e63' }}>
				📞 CRM Leads Form
			</Typography>
			
			<Card sx={{ mb: 3, backgroundColor: '#fce4ec' }}>
				<CardContent>
					<Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>Lead Identification</Typography>
					<Grid container spacing={2}>
						<Grid item xs={12} md={4}>
							<Controller name="serialNumber" control={control} rules={{ required: 'Required' }}
								render={({ field }) => (
									<TextField {...field} label="Serial Number" fullWidth required error={!!errors.serialNumber} helperText={errors.serialNumber?.message} />
								)}
							/>
						</Grid>
						<Grid item xs={12} md={4}>
							<Controller name="leadID" control={control} rules={{ required: 'Required' }}
								render={({ field }) => (
									<TextField {...field} label="Lead ID" fullWidth required error={!!errors.leadID} helperText={errors.leadID?.message} />
								)}
							/>
						</Grid>
						<Grid item xs={12} md={4}>
							<Controller name="issueDate" control={control} rules={{ required: 'Required' }}
								render={({ field }) => (
									<TextField {...field} label="Issue Date" type="date" fullWidth required InputLabelProps={{ shrink: true }} error={!!errors.issueDate} helperText={errors.issueDate?.message} />
								)}
							/>
						</Grid>
					</Grid>
				</CardContent>
			</Card>

			<Card sx={{ mb: 3, backgroundColor: '#e8f5e9' }}>
				<CardContent>
					<Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>Tender Details</Typography>
					<Grid container spacing={2}>
						<Grid item xs={12} md={4}>
							<Controller name="tenderName" control={control} rules={{ required: 'Required' }}
								render={({ field }) => (
									<TextField {...field} label="Tender Name" fullWidth required error={!!errors.tenderName} helperText={errors.tenderName?.message} />
								)}
							/>
						</Grid>
						<Grid item xs={12} md={4}>
							<Controller name="organisation" control={control} rules={{ required: 'Required' }}
								render={({ field }) => (
									<TextField {...field} label="Organisation" fullWidth required error={!!errors.organisation} helperText={errors.organisation?.message} />
								)}
							/>
						</Grid>
						<Grid item xs={12} md={4}>
							<Controller name="documentType" control={control} rules={{ required: 'Required' }}
								render={({ field }) => (
									<TextField {...field} label="Document Type" fullWidth required error={!!errors.documentType} helperText={errors.documentType?.message} placeholder="RFP, RFQ, EOI" />
								)}
							/>
						</Grid>
						<Grid item xs={12} md={4}>
							<Controller name="tenderType" control={control} rules={{ required: 'Required' }}
								render={({ field }) => (
									<TextField {...field} label="Tender Type" fullWidth required error={!!errors.tenderType} helperText={errors.tenderType?.message} placeholder="Open, Limited" />
								)}
							/>
						</Grid>
					</Grid>
				</CardContent>
			</Card>

			<Card sx={{ mb: 3, backgroundColor: '#fff3e0' }}>
				<CardContent>
					<Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>Financial Information</Typography>
					<Grid container spacing={2}>
						<Grid item xs={12} md={6}>
							<Controller name="emdCrore" control={control} rules={{ required: 'Required', min: { value: 0, message: 'Must be positive' } }}
								render={({ field }) => (
									<TextField {...field} label="EMD in Crore" type="number" fullWidth required error={!!errors.emdCrore} helperText={errors.emdCrore?.message} inputProps={{ step: '0.01' }} />
								)}
							/>
						</Grid>
						<Grid item xs={12} md={6}>
							<Controller name="approxTenderValueCrore" control={control} rules={{ required: 'Required', min: { value: 0, message: 'Must be positive' } }}
								render={({ field }) => (
									<TextField {...field} label="Approx Tender Value in Crore" type="number" fullWidth required error={!!errors.approxTenderValueCrore} helperText={errors.approxTenderValueCrore?.message} inputProps={{ step: '0.01' }} />
								)}
							/>
						</Grid>
					</Grid>
				</CardContent>
			</Card>

			<Card sx={{ mb: 3, backgroundColor: '#e3f2fd' }}>
				<CardContent>
					<Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>Key Dates</Typography>
					<Grid container spacing={2}>
						<Grid item xs={12} md={6}>
							<Controller name="lastDateSubmission" control={control} rules={{ required: 'Required' }}
								render={({ field }) => (
									<TextField {...field} label="Last Date of Submission" type="date" fullWidth required InputLabelProps={{ shrink: true }} error={!!errors.lastDateSubmission} helperText={errors.lastDateSubmission?.message} />
								)}
							/>
						</Grid>
						<Grid item xs={12} md={6}>
							<Controller name="preBidDate" control={control} rules={{ required: 'Required' }}
								render={({ field }) => (
									<TextField {...field} label="Pre-bid Date" type="date" fullWidth required InputLabelProps={{ shrink: true }} error={!!errors.preBidDate} helperText={errors.preBidDate?.message} />
								)}
							/>
						</Grid>
					</Grid>
				</CardContent>
			</Card>

			<Card sx={{ mb: 3, backgroundColor: '#f3e5f5' }}>
				<CardContent>
					<Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>Team &amp; Notes</Typography>
					<Grid container spacing={2}>
						<Grid item xs={12} md={4}>
							<Controller name="teamAssigned" control={control} rules={{ required: 'Required' }}
								render={({ field }) => (
									<TextField {...field} label="Team Assigned" fullWidth required error={!!errors.teamAssigned} helperText={errors.teamAssigned?.message} />
								)}
							/>
						</Grid>
						<Grid item xs={12} md={4}>
							<Controller name="remarks" control={control}
								render={({ field }) => (
									<TextField {...field} label="Remarks (Optional)" multiline rows={3} fullWidth />
								)}
							/>
						</Grid>
						<Grid item xs={12} md={4}>
							<Controller name="corrigendumInfo" control={control}
								render={({ field }) => (
									<TextField {...field} label="Corrigendum Info (Optional)" multiline rows={3} fullWidth />
								)}
							/>
						</Grid>
					</Grid>
				</CardContent>
			</Card>

			<Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', mt: 3 }}>
				<Button type="submit" variant="contained" size="large" disabled={loading} sx={{ minWidth: 150 }}>
					{loading ? <CircularProgress size={24} /> : 'Submit'}
				</Button>
				<Button type="button" variant="outlined" size="large" onClick={() => reset()} sx={{ minWidth: 150 }}>Reset</Button>
			</Box>
		</form>
	);
}

// Form 1: Lost Domestic Leads
function LostDomesticLeadsForm({ onSubmit, loading }) {
	const { control, handleSubmit, reset, formState: { errors } } = useForm({
		defaultValues: {
			serialNumber: '', tenderName: '', customer: '', tenderType: '', typeBid: '',
			valueWithoutGST: '', valueWithGST: '', reasonLosing: '', year: '',
			partner: '', competitors: '', technicalScores: '', quotedPrices: ''
		}
	});

	const handleFormSubmit = (data) => {
		onSubmit({
			...data,
			valueWithoutGST: parseFloat(data.valueWithoutGST),
			valueWithGST: parseFloat(data.valueWithGST)
		});
	};

	return (
		<form onSubmit={handleSubmit(handleFormSubmit)}>
			<Typography variant="h5" sx={{ fontWeight: 600, mb: 3, color: '#d32f2f' }}>
				📉 Lost Domestic Leads Form
			</Typography>
			
			<Card sx={{ mb: 3, backgroundColor: '#e3f2fd' }}>
				<CardContent>
					<Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>Basic Information</Typography>
					<Grid container spacing={2}>
						<Grid item xs={12} md={4}>
							<Controller name="serialNumber" control={control} rules={{ required: 'Required' }}
								render={({ field }) => (
									<TextField {...field} label="Serial Number" fullWidth required error={!!errors.serialNumber} helperText={errors.serialNumber?.message} />
								)}
							/>
						</Grid>
						<Grid item xs={12} md={4}>
							<Controller name="tenderName" control={control} rules={{ required: 'Required' }}
								render={({ field }) => (
									<TextField {...field} label="Tender Name" fullWidth required error={!!errors.tenderName} helperText={errors.tenderName?.message} />
								)}
							/>
						</Grid>
						<Grid item xs={12} md={4}>
							<Controller name="customer" control={control} rules={{ required: 'Required' }}
								render={({ field }) => (
									<TextField {...field} label="Customer" fullWidth required error={!!errors.customer} helperText={errors.customer?.message} />
								)}
							/>
						</Grid>
					</Grid>
				</CardContent>
			</Card>

			<Card sx={{ mb: 3, backgroundColor: '#fff3e0' }}>
				<CardContent>
					<Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>Tender Details</Typography>
					<Grid container spacing={2}>
						<Grid item xs={12} md={3}>
							<Controller name="tenderType" control={control} rules={{ required: 'Required' }}
								render={({ field }) => (
									<TextField {...field} select label="Tender Type" fullWidth required error={!!errors.tenderType}>
										{['Single Tender', 'EOI', 'RFI', 'RFP', 'BQ', 'Other'].map(opt => <MenuItem key={opt} value={opt}>{opt}</MenuItem>)}
									</TextField>
								)}
							/>
						</Grid>
						<Grid item xs={12} md={3}>
							<Controller name="typeBid" control={control} rules={{ required: 'Required' }}
								render={({ field }) => (
									<TextField {...field} label="Type of Bid" fullWidth required error={!!errors.typeBid} helperText={errors.typeBid?.message} />
								)}
							/>
						</Grid>
						<Grid item xs={12} md={3}>
							<Controller name="year" control={control} rules={{ required: 'Required' }}
								render={({ field }) => (
									<TextField {...field} label="Year" type="number" fullWidth required error={!!errors.year} helperText={errors.year?.message} />
								)}
							/>
						</Grid>
						<Grid item xs={12} md={3}>
							<Controller name="partner" control={control}
								render={({ field }) => (
									<TextField {...field} label="Partner (Optional)" fullWidth />
								)}
							/>
						</Grid>
					</Grid>
				</CardContent>
			</Card>

			<Card sx={{ mb: 3, backgroundColor: '#f3e5f5' }}>
				<CardContent>
					<Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>Financial Information</Typography>
					<Grid container spacing={2}>
						<Grid item xs={12} md={6}>
							<Controller name="valueWithoutGST" control={control} rules={{ required: 'Required', min: { value: 0, message: 'Must be positive' } }}
								render={({ field }) => (
									<TextField {...field} label="Value Without GST (Crore)" type="number" fullWidth required error={!!errors.valueWithoutGST} helperText={errors.valueWithoutGST?.message} inputProps={{ step: '0.01' }} />
								)}
							/>
						</Grid>
						<Grid item xs={12} md={6}>
							<Controller name="valueWithGST" control={control} rules={{ required: 'Required', min: { value: 0, message: 'Must be positive' } }}
								render={({ field }) => (
									<TextField {...field} label="Value With GST (Crore)" type="number" fullWidth required error={!!errors.valueWithGST} helperText={errors.valueWithGST?.message} inputProps={{ step: '0.01' }} />
								)}
							/>
						</Grid>
					</Grid>
				</CardContent>
			</Card>

			<Card sx={{ mb: 3, backgroundColor: '#ffebee' }}>
				<CardContent>
					<Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>Competitor &amp; Loss Analysis</Typography>
					<Grid container spacing={2}>
						<Grid item xs={12} md={6}>
							<Controller name="reasonLosing" control={control} rules={{ required: 'Required' }}
								render={({ field }) => (
									<TextField {...field} label="Reason for Losing" multiline rows={3} fullWidth required error={!!errors.reasonLosing} helperText={errors.reasonLosing?.message} />
								)}
							/>
						</Grid>
						<Grid item xs={12} md={6}>
							<Controller name="competitors" control={control}
								render={({ field }) => (
									<TextField {...field} label="Competitors" multiline rows={3} fullWidth />
								)}
							/>
						</Grid>
						<Grid item xs={12} md={6}>
							<Controller name="technicalScores" control={control}
								render={({ field }) => (
									<TextField {...field} label="Technical Scores" fullWidth />
								)}
							/>
						</Grid>
						<Grid item xs={12} md={6}>
							<Controller name="quotedPrices" control={control}
								render={({ field }) => (
									<TextField {...field} label="Quoted Prices" fullWidth />
								)}
							/>
						</Grid>
					</Grid>
				</CardContent>
			</Card>

			<Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', mt: 3 }}>
				<Button type="submit" variant="contained" size="large" disabled={loading} sx={{ minWidth: 150 }}>
					{loading ? <CircularProgress size={24} /> : 'Submit'}
				</Button>
				<Button type="button" variant="outlined" size="large" onClick={() => reset()} sx={{ minWidth: 150 }}>Reset</Button>
			</Box>
		</form>
	);
}

export default TabNavigation;