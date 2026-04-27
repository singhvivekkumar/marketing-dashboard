import React from "react";
import FeatureSelectionCard from "../dec2/common/FeatureSelectionCard";
import BulkUpload from "../dec2/common/BulkUpload";
import DataTableView from "../dec2/common/DataTableView";
import CreateForm from "../dec2/common/CreateForm";
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

import { useForm, Controller } from "react-hook-form";
import OrderReceivedForm from  "./orderReceived/OrderReceivedForm";
import { mockLostDomesticLeads } from "../utils/mockLostDomesticLeads";

// Tab Panel Component
function TabPanel({ children, value, index }) {
  return (
    <div role="tabpanel" hidden={value !== index}>
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

// Options select ViewData || CreateData || UploadData


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
    lostLeads: null,
    orderReceived: null,
    budgetaryQuotation: null,
    leadSubmitted: null,
    domesticLeads: null,
    exportLeads: null,
    crmLeads: null
  });

  // const handleTabChange = (event, newValue) => {
  //   setCurrentTab(newValue);
  // };

  const handleFormSubmit = (formType, data) => {
    setLoading(true);
    setTimeout(() => {
      const timestamp = new Date().toISOString();
      const formattedData = { ...data, submittedAt: timestamp };
      
      setFormData(prev => ({ ...prev, [formType]: formattedData }));
      setSubmittedData(formattedData);
      setSubmitSuccess(true);
      setTotalSubmissions(prev => prev + 1);
      setLoading(false);
      
      console.log(`${formType} Data:`, JSON.stringify(formattedData, null, 2));
    }, 500);
  };

  const tabsConfig = [
    { label: 'Budgetary Quotation', icon: '💵', formType: 'budgetaryQuotation' },
    { label: 'Lead Submitted', icon: '✅', formType: 'leadSubmitted' },
    { label: 'Domestic Leads', icon: '🏢', formType: 'domesticLeads' },
    { label: 'Export Leads', icon: '🌍', formType: 'exportLeads' },
    { label: 'CRM Leads', icon: '📞', formType: 'crmLeads' },
    { label: 'Order Received', icon: '🧾', formType: 'orderReceived' },
    { label: 'Lost Domestic Leads', icon: '📉', formType: 'lostLeads' },
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

      <Container maxWidth="xl" sx={{ mt: 3 }}>
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
          {/* Tab Panels */}
          {/* <Box sx={{ p: { xs: 2, md: 4 } }}> */}
            {/* <TabPanel value={currentTab} index={0}>
              <LostDomesticLeadsForm onSubmit={(data) => handleFormSubmit('lostDomesticLeads', data)} loading={loading} />
            </TabPanel> */}
            {/* <TabPanel value={currentTab} index={1}> 
              <SelectOperation currentView={currentTab} /> */}
              {/* <OrderReceivedForm onSubmit={(data) => handleFormSubmit('orderReceived', data)} loading={loading} /> */}
            {/* </TabPanel> */}
            {/* <TabPanel value={currentTab} index={2}>
              <BudgetaryQuotationForm onSubmit={(data) => handleFormSubmit('budgetaryQuotation', data)} loading={loading} />
            </TabPanel>
            <TabPanel value={currentTab} index={3}>
              <LeadSubmittedForm onSubmit={(data) => handleFormSubmit('leadSubmitted', data)} loading={loading} />
            </TabPanel>
            <TabPanel value={currentTab} index={4}>
              <DomesticLeadsV2Form onSubmit={(data) => handleFormSubmit('domesticLeadsV2', data)} loading={loading} />
            </TabPanel>
            <TabPanel value={currentTab} index={5}>
              <ExportLeadsForm onSubmit={(data) => handleFormSubmit('exportLeads', data)} loading={loading} />
            </TabPanel>
            <TabPanel value={currentTab} index={6}>
              <CRMLeadsForm onSubmit={(data) => handleFormSubmit('crmLeads', data)} loading={loading} />
            </TabPanel> */}
          {/* </Box> */}
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

// Form 1: Lost Domestic Leads

// Form 2: Order Received

// Form 3: Budgetary Quotation

// Form 4: Lead Submitted

// Form 5: Domestic Leads V2

// Form 6: Export Leads (Similar structure to Domestic Leads V2)

// Form 7: CRM Leads

// Render App
export default TabNavigation;