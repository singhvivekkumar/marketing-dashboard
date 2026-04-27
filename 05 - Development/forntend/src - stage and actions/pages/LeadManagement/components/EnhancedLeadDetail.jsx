import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Tabs,
  Tab,
  Box,
  Grid,
  Typography,
  Card,
  CardContent,
  Chip,
  Button,
  Dialog,
  Alert,
  Divider,
  // Timeline,
  // TimelineItem,
  // TimelineSeparator,
  // TimelineConnector,
  // TimelineContent,
  // TimelineDot,
} from '@mui/material';
import {
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot
} from '@mui/lab';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import StageManagement from './StageManagement';
import LeadForm from './LeadForm';
import PreQualificationForm from './PreQualificationForm';
import TechnicalBidForm from './TechnicalBidForm';
import CommercialBidForm from './CommercialBidForm';
import EvaluationRoundForm from './EvaluationRoundForm';
import ResultForm from './ResultForm';

function EnhancedLeadDetail({ lead, onUpdate }) {
  const [tabValue, setTabValue] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState(lead);
  const [stageHistory, setStageHistory] = useState([]);

  useEffect(() => {
    // Fetch stage history
    if (lead?.biddingProcess?.id) {
      fetchStageHistory();
    }
  }, [lead?.id]);

  const fetchStageHistory = async () => {
    // Call API to get stage history
    // setStageHistory(history);
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    await onUpdate(lead.id, editData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditData(lead);
    setIsEditing(false);
  };

  const handleEditChange = (field, value) => {
    setEditData(prev => ({ ...prev, [field]: value }));
  };

  const handleStageUpdate = async (stageType, formData) => {
    // Call API to update stage data
    console.log(`Updating ${stageType}:`, formData);
  };

  const getOutcomeColor = (outcome) => {
    const colors = {
      'Won': 'success',
      'Lost': 'error',
      'Pending': 'warning',
      'Not-Participated': 'default',
    };
    return colors[outcome] || 'default';
  };

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      {/* Lead Header */}
      <Paper sx={{ p: 3, mb: 3, backgroundColor: '#1976d2', color: 'white' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Box>
            <Typography variant="h4" fontWeight="bold" sx={{ mb: 1 }}>
              {lead.tenderName}
            </Typography>
            <Typography variant="body2" sx={{ mb: 0.5 }}>
              <strong>Reference:</strong> {lead.tenderReferenceNo || 'N/A'}
            </Typography>
            <Typography variant="body2">
              <strong>Customer:</strong> {lead.customer?.companyName || 'N/A'}
            </Typography>
          </Box>
          <Box sx={{ textAlign: 'right' }}>
            <Chip
              label={lead.openClosed}
              color={lead.openClosed === 'Open' ? 'success' : 'default'}
              sx={{ mb: 1, backgroundColor: 'rgba(255,255,255,0.2)', color: 'white' }}
            />
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mt: 1 }}>
              {!isEditing ? (
                <Button
                  startIcon={<EditIcon />}
                  onClick={handleEdit}
                  sx={{ backgroundColor: 'rgba(255,255,255,0.2)' }}
                >
                  Edit
                </Button>
              ) : (
                <>
                  <Button
                    startIcon={<SaveIcon />}
                    onClick={handleSave}
                    sx={{ backgroundColor: '#4caf50' }}
                  >
                    Save
                  </Button>
                  <Button
                    onClick={handleCancel}
                    sx={{ backgroundColor: '#f44336' }}
                  >
                    Cancel
                  </Button>
                </>
              )}
            </Box>
          </Box>
        </Box>
      </Paper>

      {/* Quick Stats */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Estimated Value
              </Typography>
              <Typography variant="h6" fontWeight="bold">
                ₹{lead.estimatedValueCr} Cr
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Current Stage
              </Typography>
              <Chip
                label={lead.biddingProcess?.currentStage || 'Not Started'}
                color="primary"
                variant="filled"
              />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Outcome
              </Typography>
              <Chip
                label={lead.outcome || 'Pending'}
                color={getOutcomeColor(lead.outcome)}
                variant="outlined"
              />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Health Status
              </Typography>
              <Chip
                label={lead.biddingProcess?.healthStatus || 'Green'}
                color={
                  lead.biddingProcess?.healthStatus === 'Green'
                    ? 'success'
                    : lead.biddingProcess?.healthStatus === 'Amber'
                      ? 'warning'
                      : 'error'
                }
              />
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Tabs */}
      <Paper sx={{ mb: 2 }}>
        <Tabs value={tabValue} onChange={handleTabChange}>
          <Tab label="Tender Details" />
          <Tab label="Bidding Process" />
          <Tab label="Stage History" />
          <Tab label="Documents" />
          <Tab label="Timeline" />
        </Tabs>
      </Paper>

      {/* Tab Content */}
      <Box>
        {/* Tab 0: Tender Details */}
        {tabValue === 0 && (
          <Card>
            <CardContent>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="caption" color="textSecondary">
                    Tender Type
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 0.5 }}>
                    {lead.tenderType}
                  </Typography>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Typography variant="caption" color="textSecondary">
                    Document Type
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 0.5 }}>
                    {lead.documentType}
                  </Typography>
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
                    Business Domain
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 0.5 }}>
                    {lead.businessDomain}
                  </Typography>
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
                    Last Submission Date
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 0.5 }}>
                    {new Date(lead.lastSubmissionDate).toLocaleDateString()}
                  </Typography>
                </Grid>

                <Grid item xs={12}>
                  <Divider />
                </Grid>

                <Grid item xs={12}>
                  <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 1 }}>
                    Customer Information
                  </Typography>
                  <Grid container spacing={1}>
                    <Grid item xs={12}>
                      <Typography variant="caption" color="textSecondary">
                        Company Name
                      </Typography>
                      <Typography variant="body2">
                        {lead.customer?.companyName}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="caption" color="textSecondary">
                        Contact Person
                      </Typography>
                      <Typography variant="body2">
                        {lead.customer?.contactPerson}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="caption" color="textSecondary">
                        Email
                      </Typography>
                      <Typography variant="body2">
                        {lead.customer?.email}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="caption" color="textSecondary">
                        Phone
                      </Typography>
                      <Typography variant="body2">
                        {lead.customer?.phone}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="caption" color="textSecondary">
                        City
                      </Typography>
                      <Typography variant="body2">
                        {lead.customer?.city}
                      </Typography>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        )}

        {/* Tab 1: Bidding Process */}
        {tabValue === 1 && (
          <StageManagement
            lead={lead}
            biddingProcess={lead.biddingProcess}
            onStageUpdate={handleStageUpdate}
          />
        )}

        {/* Tab 2: Stage History */}
        {tabValue === 2 && (
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
                Stage Transition History
              </Typography>
              {stageHistory && stageHistory.length > 0 ? (
                <Timeline>
                  {stageHistory.map((entry, idx) => (
                    <TimelineItem key={idx}>
                      <TimelineSeparator>
                        <TimelineDot color="primary" />
                        {idx < stageHistory.length - 1 && <TimelineConnector />}
                      </TimelineSeparator>
                      <TimelineContent>
                        <Typography variant="subtitle2" fontWeight="bold">
                          {entry.toStage}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          {new Date(entry.transitionedAt).toLocaleString()}
                        </Typography>
                        <Typography variant="caption">
                          Days in previous stage: {entry.daysSpent}
                        </Typography>
                      </TimelineContent>
                    </TimelineItem>
                  ))}
                </Timeline>
              ) : (
                <Alert severity="info">No stage history available yet</Alert>
              )}
            </CardContent>
          </Card>
        )}

        {/* Tab 3: Documents */}
        {tabValue === 3 && (
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
                Documents
              </Typography>
              <Alert severity="info">
                Document management and file uploads to be configured
              </Alert>
            </CardContent>
          </Card>
        )}

        {/* Tab 4: Timeline View */}
        {tabValue === 4 && (
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
                Complete Lead Journey Timeline
              </Typography>
              <Timeline position="alternate">
                <TimelineItem>
                  <TimelineSeparator>
                    <TimelineDot color="primary" />
                    <TimelineConnector />
                  </TimelineSeparator>
                  <TimelineContent>
                    <Typography variant="subtitle2" fontWeight="bold">
                      Lead Created
                    </Typography>
                    <Typography variant="body2">
                      {new Date(lead.createdAt).toLocaleDateString()}
                    </Typography>
                  </TimelineContent>
                </TimelineItem>

                {lead.biddingProcess && (
                  <TimelineItem>
                    <TimelineSeparator>
                      <TimelineDot color={lead.biddingProcess.goNoGoDecision === 'Go' ? 'success' : 'warning'} />
                      <TimelineConnector />
                    </TimelineSeparator>
                    <TimelineContent>
                      <Typography variant="subtitle2" fontWeight="bold">
                        Go/No-Go Decision
                      </Typography>
                      <Typography variant="body2">
                        {lead.biddingProcess.goNoGoDecision}
                      </Typography>
                      {lead.biddingProcess.goNoGoReason && (
                        <Typography variant="caption">
                          Reason: {lead.biddingProcess.goNoGoReason}
                        </Typography>
                      )}
                    </TimelineContent>
                  </TimelineItem>
                )}

                <TimelineItem>
                  <TimelineSeparator>
                    <TimelineDot color={lead.outcome === 'Won' ? 'success' : lead.outcome === 'Lost' ? 'error' : 'warning'} />
                  </TimelineSeparator>
                  <TimelineContent>
                    <Typography variant="subtitle2" fontWeight="bold">
                      Final Outcome
                    </Typography>
                    <Typography variant="body2">
                      {lead.outcome || 'Pending'}
                    </Typography>
                  </TimelineContent>
                </TimelineItem>
              </Timeline>
            </CardContent>
          </Card>
        )}
      </Box>
    </Container>
  );
}

export default EnhancedLeadDetail;
