import React from 'react';
import { Box, Button, Chip, Typography, Stack } from '@mui/material';
import { styled } from '@mui/material/styles';

const TopBarContainer = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  borderBottom: `1px solid ${theme.palette.divider}`,
  padding: '0 24px',
  height: '52px',
  display: 'flex',
  alignItems: 'center',
  gap: '16px',
  flexShrink: 0,
}));

const ModuleTag = styled(Chip)(({ theme, variant }) => {
  const variantStyles = {
    lead: {
      backgroundColor: 'rgba(79, 156, 249, 0.15)',
      color: '#4f9cf9',
      borderColor: 'rgba(79, 156, 249, 0.3)',
    },
    bq: {
      backgroundColor: 'rgba(167, 139, 250, 0.15)',
      color: '#a78bfa',
      borderColor: 'rgba(167, 139, 250, 0.3)',
    },
    tender: {
      backgroundColor: 'rgba(34, 211, 238, 0.15)',
      color: '#22d3ee',
      borderColor: 'rgba(34, 211, 238, 0.3)',
    },
    bidding: {
      backgroundColor: 'rgba(245, 158, 11, 0.15)',
      color: '#f59e0b',
      borderColor: 'rgba(245, 158, 11, 0.3)',
    },
    acquisition: {
      backgroundColor: 'rgba(34, 197, 94, 0.15)',
      color: '#22c55e',
      borderColor: 'rgba(34, 197, 94, 0.3)',
    },
    order: {
      backgroundColor: 'rgba(251, 146, 60, 0.15)',
      color: '#fb923c',
      borderColor: 'rgba(251, 146, 60, 0.3)',
    },
    future: {
      backgroundColor: 'rgba(244, 114, 182, 0.15)',
      color: '#f472b6',
      borderColor: 'rgba(244, 114, 182, 0.3)',
    },
    default: {
      backgroundColor: 'rgba(79, 156, 249, 0.15)',
      color: '#4f9cf9',
      borderColor: 'rgba(79, 156, 249, 0.3)',
    },
  };

  return {
    ...variantStyles[variant || 'default'],
    fontFamily: "'IBM Plex Mono', monospace",
    fontSize: '10px',
    fontWeight: 600,
    letterSpacing: '0.08em',
    border: '1px solid',
    padding: '3px 8px',
    height: 'auto',
  };
});

const moduleTagConfig = {
  dashboard: { label: 'PORTAL', variant: 'lead' },
  lead: { label: 'LEAD', variant: 'lead' },
  bq: { label: 'BQ', variant: 'bq' },
  tender: { label: 'TENDER', variant: 'tender' },
  bidding: { label: 'BIDDING', variant: 'bidding' },
  acquisition: { label: 'ACQ', variant: 'acquisition' },
  order: { label: 'ORDER', variant: 'order' },
  future: { label: 'FUTURE', variant: 'future' },
};

const moduleTitleConfig = {
  dashboard: 'Dashboard Overview',
  lead: 'Lead Creation',
  bq: 'Budgetary Quotation',
  tender: 'Tender Management',
  bidding: 'Bidding',
  acquisition: 'Order Acquisition',
  order: 'Order Received',
  future: 'Future Initiatives',
};

export default function MarketingPortalTopBar({ activeModule, onNewLead, onExport }) {
  const tagConfig = moduleTagConfig[activeModule] || moduleTagConfig.dashboard;
  const title = moduleTitleConfig[activeModule] || 'Dashboard Overview';

  return (
    <TopBarContainer>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <ModuleTag label={tagConfig.label} variant={tagConfig.variant} />
        <Typography sx={{ fontSize: '14px', fontWeight: 600, color: 'text.primary' }}>
          {title}
        </Typography>
      </Box>

      <Stack direction="row" gap={1} sx={{ marginLeft: 'auto', display: 'flex', alignItems: 'center' }}>
        <Button 
          size="small" 
          variant="outlined" 
          onClick={onNewLead}
          sx={{ padding: '4px 10px', fontSize: '11px' }}
        >
          + New Lead
        </Button>
        <Button 
          size="small" 
          variant="contained"
          onClick={onExport}
          sx={{ padding: '4px 10px', fontSize: '11px' }}
        >
          Export
        </Button>
      </Stack>
    </TopBarContainer>
  );
}
