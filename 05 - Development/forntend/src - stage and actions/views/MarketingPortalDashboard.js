import React from 'react';
import { Box, Card, CardContent, Typography, Grid, Stack, Paper } from '@mui/material';
import { styled } from '@mui/material/styles';

const ModuleCard = styled(Card)(({ moduleColor }) => ({
  position: 'relative',
  overflow: 'hidden',
  cursor: 'pointer',
  transition: 'all 0.15s',
  backgroundColor: '#13161e',
  borderColor: '#2a3045',
  
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '2px',
    backgroundColor: moduleColor,
  },

  '&:hover': {
    borderColor: '#3a4560',
    backgroundColor: '#1a1e29',
  },
}));

const ModuleIcon = styled(Box)(({ bgColor }) => ({
  width: '36px',
  height: '36px',
  borderRadius: '8px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '16px',
  backgroundColor: bgColor,
}));

const StatBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: '2px',
}));

const StatNumber = styled(Typography)(({ color }) => ({
  fontFamily: "'IBM Plex Mono', monospace",
  fontSize: '18px',
  fontWeight: 600,
  color: color || '#d4daf0',
}));

const StatLabel = styled(Typography)(({ theme }) => ({
  fontSize: '10px',
  color: theme.palette.text.disabled,
}));

const modules = [
  {
    id: 'lead',
    number: '01',
    name: 'Lead Creation',
    desc: 'Capture enquiries — EOI, RFI, customer input. Manage go/no-go decisions and internal approvals.',
    icon: '📋',
    iconBg: 'rgba(79, 156, 249, 0.1)',
    color: '#4f9cf9',
    stats: [
      { value: 24, label: 'Total leads', color: '#4f9cf9' },
      { value: 8, label: 'Under review', color: '#f59e0b' },
      { value: 11, label: 'Go decision', color: '#22c55e' },
    ],
  },
  {
    id: 'bq',
    number: '02',
    name: 'Budgetary Quotation',
    desc: 'Prepare indicative cost estimates. Fetch lead data by reference ID for pre-bid budgeting.',
    icon: '📊',
    iconBg: 'rgba(167, 139, 250, 0.1)',
    color: '#a78bfa',
    stats: [
      { value: 9, label: 'Active BQs', color: '#a78bfa' },
      { value: 3, label: 'Pending review', color: '#f59e0b' },
      { value: 6, label: 'Submitted', color: '#22c55e' },
    ],
  },
  {
    id: 'tender',
    number: '03',
    name: 'Tender Management',
    desc: 'Track tender lifecycle from RFP receipt through submission. Manage corrigenda and document deadlines.',
    icon: '📄',
    iconBg: 'rgba(34, 211, 238, 0.1)',
    color: '#22d3ee',
    stats: [
      { value: 7, label: 'Active tenders', color: '#22d3ee' },
      { value: 2, label: 'Due this week', color: '#ef4444' },
      { value: 4, label: 'Submitted', color: '#22c55e' },
    ],
  },
  {
    id: 'bidding',
    number: '04',
    name: 'Bidding',
    desc: 'Manage commercial bid preparation, pricing strategy, L1 analysis and negotiation tracking.',
    icon: '⚖️',
    iconBg: 'rgba(245, 158, 11, 0.1)',
    color: '#f59e0b',
    stats: [
      { value: 5, label: 'Active bids', color: '#f59e0b' },
      { value: 2, label: 'Negotiating', color: '#22d3ee' },
      { value: 3, label: 'L1 position', color: '#22c55e' },
    ],
  },
  {
    id: 'acquisition',
    number: '05',
    name: 'Order Acquisition',
    desc: 'Track LOI, LOA and final purchase order receipt. Manage pre-order milestones and contract closure.',
    icon: '🎯',
    iconBg: 'rgba(34, 197, 94, 0.1)',
    color: '#22c55e',
    stats: [
      { value: 4, label: 'LOI received', color: '#22c55e' },
      { value: 2, label: 'Negotiation', color: '#f59e0b' },
      { value: 2, label: 'PO received', color: '#22c55e' },
    ],
  },
  {
    id: 'order',
    number: '06',
    name: 'Order Received',
    desc: 'Post-award delivery tracking. Manage milestones, inspections, invoicing and project completion.',
    icon: '📦',
    iconBg: 'rgba(251, 146, 60, 0.1)',
    color: '#fb923c',
    stats: [
      { value: 6, label: 'Active orders', color: '#fb923c' },
      { value: 1, label: 'Delayed', color: '#f59e0b' },
      { value: 5, label: 'On track', color: '#22c55e' },
    ],
  },
  {
    id: 'future',
    number: '07',
    name: 'Future Initiatives',
    desc: 'Track strategic opportunities, R&D programmes, and long-horizon defence technology initiatives.',
    icon: '🔭',
    iconBg: 'rgba(244, 114, 182, 0.1)',
    color: '#f472b6',
    stats: [
      { value: 12, label: 'Initiatives tracked', color: '#f472b6' },
      { value: 4, label: 'Early engagement', color: '#a78bfa' },
      { value: 5, label: 'Watch list', color: '#22d3ee' },
    ],
    fullWidth: true,
  },
];

export default function DashboardModulesView({ onModuleSelect }) {
  return (
    <Box sx={{ padding: '20px 24px' }}>
      <Box sx={{ marginBottom: '24px' }}>
        <Typography sx={{ fontSize: '16px', fontWeight: 600, color: 'text.primary', marginBottom: '3px' }}>
          Module Overview
        </Typography>
        <Typography sx={{ fontSize: '11px', color: 'text.disabled', fontFamily: "'IBM Plex Mono', monospace" }}>
          FY 2025–26 · Defence &amp; Civil Procurement
        </Typography>
      </Box>

      <Grid container spacing={2}>
        {modules.map((module) => (
          <Grid item xs={12} sm={6} md={module.fullWidth ? 12 : 4} key={module.id}>
            <ModuleCard
              moduleColor={module.color}
              onClick={() => onModuleSelect(module.id)}
              variant="outlined"
            >
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                  <ModuleIcon bgColor={module.iconBg}>{module.icon}</ModuleIcon>
                  <Typography sx={{ fontSize: '10px', color: 'text.disabled', fontFamily: "'IBM Plex Mono', monospace" }}>
                    MODULE {module.number}
                  </Typography>
                </Box>

                <Typography sx={{ fontSize: '14px', fontWeight: 600, color: 'text.primary', marginBottom: '4px' }}>
                  {module.name}
                </Typography>

                <Typography sx={{ fontSize: '11.5px', color: 'text.disabled', lineHeight: 1.5, marginBottom: '14px' }}>
                  {module.desc}
                </Typography>

                <Stack direction="row" spacing={3}>
                  {module.stats.map((stat, idx) => (
                    <StatBox key={idx}>
                      <StatNumber color={stat.color}>{stat.value}</StatNumber>
                      <StatLabel>{stat.label}</StatLabel>
                    </StatBox>
                  ))}
                </Stack>
              </CardContent>
            </ModuleCard>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
