import React, { useState } from 'react';
import {
  Box,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Button,
  Typography,
  Card,
  CardContent,
  Grid,
  Chip,
  Dialog,
  Alert,
  Divider,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ScheduleIcon from '@mui/icons-material/Schedule';
import ErrorIcon from '@mui/icons-material/Error';

import PreQualificationForm from './PreQualificationForm';
import TechnicalBidForm from './TechnicalBidForm';
import CommercialBidForm from './CommercialBidForm';
import EvaluationRoundForm from './EvaluationRoundForm';
import ResultForm from './ResultForm';

function StageManagement({ lead, biddingProcess, onStageUpdate }) {
  const [activeStep, setActiveStep] = useState(0);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState(null);
  const [evaluationRounds, setEvaluationRounds] = useState([]);
  const [newRoundNumber, setNewRoundNumber] = useState(1);

  const stages = [
    {
      name: 'Pre-Qualification',
      type: 'prequalification',
      description: 'Verify eligibility criteria and submit documents',
      icon: '✓',
    },
    {
      name: 'Technical Qualification',
      type: 'techbid',
      description: 'Submit technical proposal and handle clarifications',
      icon: '📋',
    },
    {
      name: 'Commercial Qualification',
      type: 'commbid',
      description: 'Submit commercial bid with pricing and terms',
      icon: '💰',
    },
    {
      name: 'Evaluation',
      type: 'evaluation',
      description: 'Participate in evaluation rounds and negotiations',
      icon: '📊',
    },
    {
      name: 'Result',
      type: 'result',
      description: 'Final result and outcome tracking',
      icon: '🏆',
    },
  ];

  const currentStage = biddingProcess?.currentStage || 'Pre-Qualification';
  const currentStageIndex = stages.findIndex(s => s.name === currentStage);

  const getStageStatus = (stageName) => {
    const stageIndex = stages.findIndex(s => s.name === stageName);
    if (stageIndex < currentStageIndex) return 'completed';
    if (stageIndex === currentStageIndex) return 'active';
    return 'pending';
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircleIcon sx={{ color: 'green' }} />;
      case 'active':
        return <ScheduleIcon sx={{ color: 'orange' }} />;
      default:
        return <ScheduleIcon sx={{ color: 'lightgray' }} />;
    }
  };

  const getStatusChip = (status) => {
    const colors = {
      completed: 'success',
      active: 'warning',
      pending: 'default',
    };
    const labels = {
      completed: 'Completed',
      active: 'In Progress',
      pending: 'Pending',
    };
    return <Chip label={labels[status]} color={colors[status]} size="small" />;
  };

  const handleOpenDialog = (stageType) => {
    setDialogType(stageType);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setDialogType(null);
  };

  const handleFormSubmit = async (formData) => {
    // Call API to save stage data
    console.log('Submitting stage data:', formData);
    await onStageUpdate(dialogType, formData);
    handleCloseDialog();
  };

  const handleAddEvaluationRound = () => {
    setNewRoundNumber(evaluationRounds.length + 1);
    handleOpenDialog('evaluation');
  };

  const renderFormDialog = () => {
    if (!dialogOpen) return null;

    const props = {
      bidId: lead.id,
      onSubmit: handleFormSubmit,
      onCancel: handleCloseDialog,
    };

    switch (dialogType) {
      case 'prequalification':
        return <PreQualificationForm {...props} />;
      case 'techbid':
        return <TechnicalBidForm {...props} />;
      case 'commbid':
        return <CommercialBidForm {...props} />;
      case 'evaluation':
        return <EvaluationRoundForm {...props} roundNumber={newRoundNumber} />;
      case 'result':
        return <ResultForm {...props} />;
      default:
        return null;
    }
  };

  return (
    <Box sx={{ mt: 2 }}>
      {/* Stage Progress Overview */}
      <Card sx={{ mb: 3, backgroundColor: '#f9f9f9' }}>
        <CardContent>
          <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
            Bidding Journey
          </Typography>
          <Grid container spacing={1}>
            {stages.map((stage, index) => {
              const status = getStageStatus(stage.name);
              return (
                <Grid item xs={12} sm={6} md={2.4} key={stage.name}>
                  <Box
                    sx={{
                      p: 1.5,
                      border: '1px solid #ddd',
                      borderRadius: 1,
                      textAlign: 'center',
                      backgroundColor:
                        status === 'active' ? '#fff3e0' : status === 'completed' ? '#e8f5e9' : '#fafafa',
                      opacity: status === 'pending' ? 0.6 : 1,
                    }}
                  >
                    <Box sx={{ mb: 1, fontSize: '1.5rem' }}>{stage.icon}</Box>
                    <Typography variant="caption" fontWeight="bold">
                      {stage.name}
                    </Typography>
                    <Box sx={{ mt: 1 }}>{getStatusChip(status)}</Box>
                  </Box>
                </Grid>
              );
            })}
          </Grid>
        </CardContent>
      </Card>

      {/* Current Stage Status */}
      {biddingProcess && (
        <Card sx={{ mb: 3, backgroundColor: '#e3f2fd' }}>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box>
                <Typography variant="body2" color="textSecondary">
                  Current Stage
                </Typography>
                <Typography variant="h6" fontWeight="bold">
                  {currentStage}
                </Typography>
                <Typography variant="caption" sx={{ mt: 1, display: 'block' }}>
                  Days in stage: {biddingProcess.daysInCurrentStage || 0}
                </Typography>
              </Box>
              <Box>
                <Chip
                  label={biddingProcess.healthStatus}
                  color={
                    biddingProcess.healthStatus === 'Green'
                      ? 'success'
                      : biddingProcess.healthStatus === 'Amber'
                        ? 'warning'
                        : 'error'
                  }
                  sx={{ mr: 1 }}
                />
                <Chip
                  label={biddingProcess.goNoGoDecision}
                  color={
                    biddingProcess.goNoGoDecision === 'Go'
                      ? 'success'
                      : biddingProcess.goNoGoDecision === 'No-Go'
                        ? 'error'
                        : 'warning'
                  }
                />
              </Box>
            </Box>
            {biddingProcess.isOverdue && (
              <Alert severity="error" sx={{ mt: 2 }}>
                <ErrorIcon sx={{ mr: 1, fontSize: '1rem' }} />
                This stage is overdue!
              </Alert>
            )}
          </CardContent>
        </Card>
      )}

      {/* Detailed Stage Workflow */}
      <Stepper activeStep={currentStageIndex} orientation="vertical">
        {stages.map((stage, index) => (
          <Step key={stage.name} completed={index < currentStageIndex}>
            <StepLabel
              icon={getStatusIcon(getStageStatus(stage.name))}
              sx={{
                '& .MuiStepLabel-label': {
                  fontSize: '1rem !important',
                  fontWeight: index === currentStageIndex ? 'bold' : 'normal',
                },
              }}
            >
              {stage.name}
            </StepLabel>
            <StepContent>
              <Typography variant="body2" sx={{ mb: 1, color: 'textSecondary' }}>
                {stage.description}
              </Typography>

              {/* Stage-specific content */}
              {stage.type === 'evaluation' && (
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 1 }}>
                    Evaluation Rounds ({evaluationRounds.length})
                  </Typography>
                  {evaluationRounds.map((round, idx) => (
                    <Card key={idx} sx={{ mb: 1, backgroundColor: '#f5f5f5' }}>
                      <CardContent sx={{ py: 1.5 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Box>
                            <Typography variant="subtitle2">
                              Round {round.roundNumber}: {round.roundType}
                            </Typography>
                            <Typography variant="caption" color="textSecondary">
                              Status: {round.status}
                            </Typography>
                          </Box>
                          <Button
                            size="small"
                            startIcon={<EditIcon />}
                            onClick={() => handleOpenDialog('evaluation')}
                          >
                            Edit
                          </Button>
                        </Box>
                      </CardContent>
                    </Card>
                  ))}
                  {index === currentStageIndex && (
                    <Button
                      size="small"
                      variant="contained"
                      onClick={handleAddEvaluationRound}
                      sx={{ mt: 1 }}
                    >
                      Add Evaluation Round
                    </Button>
                  )}
                </Box>
              )}

              <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                {index === currentStageIndex && (
                  <Button
                    variant="contained"
                    startIcon={<EditIcon />}
                    onClick={() => handleOpenDialog(stage.type)}
                  >
                    {stage.type === 'evaluation' ? 'Manage Rounds' : 'Enter Data'}
                  </Button>
                )}
                {index < currentStageIndex && (
                  <Button
                    size="small"
                    variant="outlined"
                    startIcon={<EditIcon />}
                    onClick={() => handleOpenDialog(stage.type)}
                  >
                    View / Edit
                  </Button>
                )}
              </Box>
            </StepContent>
          </Step>
        ))}
      </Stepper>

      {/* Form Dialog */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        {renderFormDialog()}
      </Dialog>
    </Box>
  );
}

export default StageManagement;
