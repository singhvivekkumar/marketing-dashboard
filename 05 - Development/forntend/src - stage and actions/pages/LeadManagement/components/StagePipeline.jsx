import React from 'react';
import {
  Box,
  Card,
  CardContent,
  CardActions,
  Typography,
  Chip,
  Grid,
  Button,
  Paper,
  Avatar,
  AvatarGroup,
} from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';

const StagePipeline = ({ leads, onSelectLead }) => {
  const stages = [
    'Pre-Qualification',
    'Technical Qualification',
    'Commercial Qualification',
    'Evaluation',
    'Result',
    'Closed',
  ];

  const getLeadsByStage = (stage) => {
    return leads.filter(lead => lead.biddingProcess?.currentStage === stage);
  };

  const getTotalValue = (leadsInStage) => {
    return leadsInStage.reduce((sum, lead) => sum + (parseFloat(lead.estimatedValueCr) || 0), 0);
  };

  const getStageColor = (stage) => {
    const colors = {
      'Pre-Qualification': { bg: '#e3f2fd', border: '#1976d2' },
      'Technical Qualification': { bg: '#fff3e0', border: '#f57c00' },
      'Commercial Qualification': { bg: '#f3e5f5', border: '#7b1fa2' },
      'Evaluation': { bg: '#e8f5e9', border: '#388e3c' },
      'Result': { bg: '#fce4ec', border: '#c2185b' },
      'Closed': { bg: '#f5f5f5', border: '#616161' },
    };
    return colors[stage] || { bg: '#ffffff', border: '#9e9e9e' };
  };

  const renderLeadCard = (lead) => (
    <Card
      key={lead.id}
      sx={{
        mb: 1.5,
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        '&:hover': {
          boxShadow: 3,
          transform: 'translateY(-4px)',
        },
      }}
      onClick={() => onSelectLead(lead)}
    >
      <CardContent sx={{ pb: 1 }}>
        <Typography variant="subtitle2" fontWeight="bold" noWrap>
          {lead.tenderName}
        </Typography>
        <Typography variant="caption" color="textSecondary" sx={{ display: 'block', mb: 1 }}>
          Ref: {lead.tenderReferenceNo || 'N/A'}
        </Typography>

        <Box sx={{ display: 'flex', gap: 0.5, mb: 1, flexWrap: 'wrap' }}>
          <Chip
            label={lead.businessDomain}
            size="small"
            variant="outlined"
            sx={{ height: 20 }}
          />
          <Chip
            label={lead.leadSubtype}
            size="small"
            variant="filled"
            color="primary"
            sx={{ height: 20 }}
          />
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="body2" fontWeight="bold" color="success.main">
            ₹{lead.estimatedValueCr} Cr
          </Typography>
          <Chip
            label={lead.outcome || 'Pending'}
            size="small"
            variant="outlined"
            color={lead.outcome === 'Won' ? 'success' : 'default'}
          />
        </Box>
      </CardContent>
      <CardActions sx={{ pt: 0 }}>
        <Button size="small" onClick={() => onSelectLead(lead)}>
          View Details
        </Button>
      </CardActions>
    </Card>
  );

  return (
    <Box sx={{ overflow: 'auto', pb: 2 }}>
      <Grid container spacing={2} sx={{ minWidth: '100%' }}>
        {stages.map(stage => {
          const leadsInStage = getLeadsByStage(stage);
          const totalValue = getTotalValue(leadsInStage);
          const colors = getStageColor(stage);

          return (
            <Grid item xs={12} sm={6} md={4} lg={2} key={stage}>
              <Paper
                sx={{
                  backgroundColor: colors.bg,
                  border: `2px solid ${colors.border}`,
                  minHeight: 600,
                  p: 1.5,
                  borderRadius: 2,
                }}
              >
                {/* Stage Header */}
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" fontWeight="bold">
                    {stage}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
                    <Chip
                      label={leadsInStage.length}
                      size="small"
                      color="primary"
                      variant="filled"
                      sx={{ height: 22 }}
                    />
                    <TrendingUpIcon
                      sx={{ fontSize: 16, color: 'text.secondary' }}
                    />
                  </Box>
                  <Typography variant="caption" color="textSecondary" sx={{ display: 'block', mt: 0.5 }}>
                    Total: ₹{totalValue.toFixed(2)} Cr
                  </Typography>
                </Box>

                {/* Leads in Stage */}
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  {leadsInStage.length > 0 ? (
                    leadsInStage.map(lead => renderLeadCard(lead))
                  ) : (
                    <Paper
                      sx={{
                        p: 2,
                        textAlign: 'center',
                        backgroundColor: 'rgba(0,0,0,0.02)',
                        border: '1px dashed rgba(0,0,0,0.1)',
                      }}
                    >
                      <Typography variant="body2" color="textSecondary">
                        No leads
                      </Typography>
                    </Paper>
                  )}
                </Box>
              </Paper>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
};

export default StagePipeline;
