import React, { useState } from 'react';
import {
  Box,
  Paper,
  Tabs,
  Tab,
  Grid,
  Typography,
  Card,
  CardContent,
  Button,
  Chip,
  Divider,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';

function LeadDetail({ lead, onUpdate }) {
  const [tabValue, setTabValue] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState(lead);
  const [stageDialogOpen, setStageDialogOpen] = useState(false);
  const [selectedStage, setSelectedStage] = useState('');

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleEditChange = (field, value) => {
    setEditData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    await onUpdate(lead.id, editData);
    setIsEditing(false);
  };

  const handleStageChange = async () => {
    const updatedLead = {
      ...editData,
      biddingProcess: { ...lead.biddingProcess, currentStage: selectedStage },
    };
    await onUpdate(lead.id, updatedLead);
    setStageDialogOpen(false);
    setSelectedStage('');
  };

  const stages = [
    'Pre-Qualification',
    'Technical Qualification',
    'Commercial Qualification',
    'Evaluation',
    'Result',
    'Closed',
  ];

  const currentStage = lead.biddingProcess?.currentStage || 'Not Started';
  const stageIndex = stages.indexOf(currentStage);

  return (
    <Box>
      {/* Header with Actions */}
      <Paper sx={{ p: 2, mb: 2, backgroundColor: '#f5f5f5' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Box>
            <Typography variant="h5" fontWeight="bold">
              {lead.tenderName}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Ref: {lead.tenderReferenceNo}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 1 }}>
            {!isEditing ? (
              <Button
                startIcon={<EditIcon />}
                variant="contained"
                onClick={() => setIsEditing(true)}
              >
                Edit
              </Button>
            ) : (
              <>
                <Button
                  startIcon={<SaveIcon />}
                  variant="contained"
                  color="success"
                  onClick={handleSave}
                >
                  Save
                </Button>
                <Button
                  startIcon={<CancelIcon />}
                  variant="outlined"
                  onClick={() => setIsEditing(false)}
                >
                  Cancel
                </Button>
              </>
            )}
          </Box>
        </Box>

        {/* Quick Stats */}
        <Grid container spacing={2}>
          <Grid item xs={6} sm={3}>
            <Box>
              <Typography variant="caption" color="textSecondary">
                Status
              </Typography>
              <Chip
                label={lead.openClosed}
                size="small"
                color={lead.openClosed === 'Open' ? 'success' : 'default'}
                sx={{ mt: 0.5 }}
              />
            </Box>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Box>
              <Typography variant="caption" color="textSecondary">
                Outcome
              </Typography>
              <Chip
                label={lead.outcome || 'Pending'}
                size="small"
                sx={{ mt: 0.5 }}
              />
            </Box>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Box>
              <Typography variant="caption" color="textSecondary">
                Value
              </Typography>
              <Typography variant="body2" fontWeight="bold" sx={{ mt: 0.5 }}>
                ₹{lead.estimatedValueCr} Cr
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Box>
              <Typography variant="caption" color="textSecondary">
                Domain
              </Typography>
              <Typography variant="body2" fontWeight="bold" sx={{ mt: 0.5 }}>
                {lead.businessDomain}
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Tabs */}
      <Paper sx={{ mb: 2 }}>
        <Tabs value={tabValue} onChange={handleTabChange}>
          <Tab label="Lead Information" />
          <Tab label="Bidding Stage" />
          <Tab label="Pre-Qualification" />
          <Tab label="Technical Bid" />
          <Tab label="Commercial Bid" />
          <Tab label="Evaluation" />
        </Tabs>
      </Paper>

      {/* Tab Content */}
      <Box>
        {/* Tab 0: Lead Information */}
        {tabValue === 0 && (
          <Card>
            <CardContent>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="caption" color="textSecondary">
                    Tender Type
                  </Typography>
                  {isEditing ? (
                    <TextField
                      fullWidth
                      select
                      value={editData.tenderType}
                      onChange={(e) => handleEditChange('tenderType', e.target.value)}
                      size="small"
                      sx={{ mt: 0.5 }}
                    >
                      <MenuItem value="Open">Open</MenuItem>
                      <MenuItem value="Limited">Limited</MenuItem>
                      <MenuItem value="Single Source">Single Source</MenuItem>
                    </TextField>
                  ) : (
                    <Typography variant="body2" sx={{ mt: 0.5 }}>
                      {lead.tenderType}
                    </Typography>
                  )}
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Typography variant="caption" color="textSecondary">
                    Document Type
                  </Typography>
                  {isEditing ? (
                    <TextField
                      fullWidth
                      select
                      value={editData.documentType}
                      onChange={(e) => handleEditChange('documentType', e.target.value)}
                      size="small"
                      sx={{ mt: 0.5 }}
                    >
                      <MenuItem value="RFP">RFP</MenuItem>
                      <MenuItem value="RFQ">RFQ</MenuItem>
                      <MenuItem value="NIT">NIT</MenuItem>
                      <MenuItem value="EOI">EOI</MenuItem>
                    </TextField>
                  ) : (
                    <Typography variant="body2" sx={{ mt: 0.5 }}>
                      {lead.documentType}
                    </Typography>
                  )}
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Typography variant="caption" color="textSecondary">
                    Portal
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 0.5 }}>
                    {lead.portalName}
                  </Typography>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Typography variant="caption" color="textSecondary">
                    Sector
                  </Typography>
                  <Chip label={lead.civilDefence} size="small" sx={{ mt: 0.5 }} />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Typography variant="caption" color="textSecondary">
                    Lead Subtype
                  </Typography>
                  <Chip label={lead.leadSubtype} size="small" sx={{ mt: 0.5 }} />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Typography variant="caption" color="textSecondary">
                    Participation
                  </Typography>
                  <Chip label={lead.soleConsortium} size="small" sx={{ mt: 0.5 }} />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Typography variant="caption" color="textSecondary">
                    Submission Date
                  </Typography>
                  {isEditing ? (
                    <TextField
                      fullWidth
                      type="date"
                      value={editData.lastSubmissionDate}
                      onChange={(e) => handleEditChange('lastSubmissionDate', e.target.value)}
                      size="small"
                      InputLabelProps={{ shrink: true }}
                      sx={{ mt: 0.5 }}
                    />
                  ) : (
                    <Typography variant="body2" sx={{ mt: 0.5 }}>
                      {new Date(lead.lastSubmissionDate).toLocaleDateString()}
                    </Typography>
                  )}
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Typography variant="caption" color="textSecondary">
                    Estimated Value (Cr)
                  </Typography>
                  {isEditing ? (
                    <TextField
                      fullWidth
                      type="number"
                      value={editData.estimatedValueCr}
                      onChange={(e) => handleEditChange('estimatedValueCr', e.target.value)}
                      size="small"
                      sx={{ mt: 0.5 }}
                    />
                  ) : (
                    <Typography variant="body2" sx={{ mt: 0.5 }}>
                      ₹{lead.estimatedValueCr}
                    </Typography>
                  )}
                </Grid>

                <Grid item xs={12}>
                  <Divider />
                </Grid>

                <Grid item xs={12}>
                  <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 1 }}>
                    Customer Details
                  </Typography>
                  <Grid container spacing={1}>
                    <Grid item xs={12}>
                      <Typography variant="caption" color="textSecondary">
                        Customer Name
                      </Typography>
                      <Typography variant="body2">
                        {lead.customer?.companyName || 'N/A'}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="caption" color="textSecondary">
                        Contact Person
                      </Typography>
                      <Typography variant="body2">
                        {lead.customer?.contactPerson || 'N/A'}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="caption" color="textSecondary">
                        Email
                      </Typography>
                      <Typography variant="body2">
                        {lead.customer?.email || 'N/A'}
                      </Typography>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        )}

        {/* Tab 1: Bidding Stage */}
        {tabValue === 1 && (
          <Card>
            <CardContent>
              <Box sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6" fontWeight="bold">
                    Bidding Process
                  </Typography>
                  <Button
                    variant="contained"
                    onClick={() => setStageDialogOpen(true)}
                  >
                    Change Stage
                  </Button>
                </Box>
                <Typography variant="body1" sx={{ mb: 1 }}>
                  Current Stage: <Chip label={currentStage} color="primary" />
                </Typography>
              </Box>

              <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 2 }}>
                Stage Progress
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                {stages.map((stage, index) => (
                  <Box key={stage} sx={{ display: 'flex', alignItems: 'center' }}>
                    <Chip
                      label={stage}
                      color={index <= stageIndex ? 'primary' : 'default'}
                      variant={index === stageIndex ? 'filled' : 'outlined'}
                    />
                    {index < stages.length - 1 && (
                      <Box sx={{ mx: 1, color: 'text.secondary' }}>→</Box>
                    )}
                  </Box>
                ))}
              </Box>

              {lead.biddingProcess && (
                <>
                  <Divider sx={{ my: 2 }} />
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="caption" color="textSecondary">
                        Status
                      </Typography>
                      <Typography variant="body2" sx={{ mt: 0.5 }}>
                        {lead.biddingProcess.goNGoDecision}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="caption" color="textSecondary">
                        Health
                      </Typography>
                      <Chip
                        label={lead.biddingProcess.healthStatus}
                        color={
                          lead.biddingProcess.healthStatus === 'Green'
                            ? 'success'
                            : lead.biddingProcess.healthStatus === 'Amber'
                              ? 'warning'
                              : 'error'
                        }
                        size="small"
                        sx={{ mt: 0.5 }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="caption" color="textSecondary">
                        Days in Current Stage
                      </Typography>
                      <Typography variant="body2" sx={{ mt: 0.5 }}>
                        {lead.biddingProcess.daysInCurrentStage} days
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="caption" color="textSecondary">
                        Is Overdue
                      </Typography>
                      <Chip
                        label={lead.biddingProcess.isOverdue ? 'Yes' : 'No'}
                        color={lead.biddingProcess.isOverdue ? 'error' : 'success'}
                        size="small"
                        sx={{ mt: 0.5 }}
                      />
                    </Grid>
                  </Grid>
                </>
              )}
            </CardContent>
          </Card>
        )}

        {/* Tabs 2-5: Other Stages */}
        {[2, 3, 4, 5].includes(tabValue) && (
          <Alert severity="info">
            Stage details will be populated from the database. Configure forms for Pre-Qualification, Technical Bid, Commercial Bid, and Evaluation in separate components.
          </Alert>
        )}
      </Box>

      {/* Stage Change Dialog */}
      <Dialog open={stageDialogOpen} onClose={() => setStageDialogOpen(false)}>
        <DialogTitle>Change Bidding Stage</DialogTitle>
        <DialogContent sx={{ minWidth: 400, mt: 2 }}>
          <FormControl fullWidth>
            <InputLabel>Select Stage</InputLabel>
            <Select
              value={selectedStage}
              onChange={(e) => setSelectedStage(e.target.value)}
              label="Select Stage"
            >
              {stages.map(stage => (
                <MenuItem key={stage} value={stage}>
                  {stage}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setStageDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleStageChange}
            variant="contained"
            disabled={!selectedStage}
          >
            Change Stage
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default LeadDetail;
