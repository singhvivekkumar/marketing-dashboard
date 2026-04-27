import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Button,
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Chip,
  Dialog,
  Tabs,
  Tab,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import LeadList from './components/LeadList';
import LeadForm from './components/LeadForm';
import StagePipeline from './components/StagePipeline';
import LeadDetail from './components/LeadDetail';

function LeadDashboard() {
  const [leads, setLeads] = useState([]);
  const [openForm, setOpenForm] = useState(false);
  const [selectedLead, setSelectedLead] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(false);

  // Fetch leads on component mount
  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/leads');
      const data = await response.json();
      setLeads(data);
    } catch (error) {
      console.error('Error fetching leads:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateLead = async (formData) => {
    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        const newLead = await response.json();
        setLeads([...leads, newLead]);
        setOpenForm(false);
      }
    } catch (error) {
      console.error('Error creating lead:', error);
    }
  };

  const handleEditLead = async (leadId, formData) => {
    try {
      const response = await fetch(`/api/leads/${leadId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        const updatedLead = await response.json();
        setLeads(leads.map(l => l.id === leadId ? updatedLead : l));
        setSelectedLead(null);
      }
    } catch (error) {
      console.error('Error updating lead:', error);
    }
  };

  const handleSelectLead = (lead) => {
    setSelectedLead(lead);
    setTabValue(1);
  };

  const getStageStats = () => {
    const stages = [
      'Pre-Qualification',
      'Technical Qualification',
      'Commercial Qualification',
      'Evaluation',
      'Result',
    ];
    const stats = {};
    stages.forEach(stage => {
      stats[stage] = leads.filter(l => l.biddingProcess?.currentStage === stage).length;
    });
    return stats;
  };

  const stageStats = getStageStats();
  const totalLeads = leads.length;
  const activeLeads = leads.filter(l => l.openClosed === 'Open').length;

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" fontWeight="bold">
          Lead Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpenForm(true)}
        >
          Create Lead
        </Button>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Leads
              </Typography>
              <Typography variant="h5">{totalLeads}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Active Leads
              </Typography>
              <Typography variant="h5">{activeLeads}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                In Qualification
              </Typography>
              <Typography variant="h5">
                {(stageStats['Pre-Qualification'] || 0) + (stageStats['Technical Qualification'] || 0)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Under Evaluation
              </Typography>
              <Typography variant="h5">{stageStats['Evaluation'] || 0}</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
        <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)}>
          <Tab label="Pipeline View" />
          <Tab label="Lead Details" disabled={!selectedLead} />
          <Tab label="List View" />
        </Tabs>
      </Box>

      {/* Tab Content */}
      <Box sx={{ mt: 2 }}>
        {tabValue === 0 && <StagePipeline leads={leads} onSelectLead={handleSelectLead} />}
        {tabValue === 1 && selectedLead && (
          <LeadDetail lead={selectedLead} onUpdate={handleEditLead} />
        )}
        {tabValue === 2 && (
          <LeadList
            leads={leads}
            loading={loading}
            onSelectLead={handleSelectLead}
          />
        )}
      </Box>

      {/* Create Lead Dialog */}
      <Dialog
        open={openForm}
        onClose={() => setOpenForm(false)}
        maxWidth="md"
        fullWidth
      >
        <LeadForm
          onSubmit={handleCreateLead}
          onCancel={() => setOpenForm(false)}
        />
      </Dialog>
    </Container>
  );
}

export default LeadDashboard;
