import React from 'react';
import { Box, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Typography, Divider, Chip } from '@mui/material';
import { styled } from '@mui/material/styles';

const SidebarContainer = styled(Box)(({ theme }) => ({
  width: 220,
  minHeight: '100vh',
  backgroundColor: theme.palette.background.paper,
  borderRight: `1px solid ${theme.palette.divider}`,
  display: 'flex',
  flexDirection: 'column',
  flexShrink: 0,
}));

const LogoBadge = styled(Chip)(({ theme }) => ({
  fontFamily: "'IBM Plex Mono', monospace",
  fontSize: '10px',
  fontWeight: 600,
  letterSpacing: '0.15em',
  backgroundColor: 'rgba(79, 156, 249, 0.1)',
  color: theme.palette.primary.main,
  border: `1px solid rgba(79, 156, 249, 0.25)`,
  padding: '3px 8px',
  borderRadius: '3px',
  marginBottom: '8px',
  height: 'auto',
}));

const NavModuleLabel = styled(Typography)(({ theme }) => ({
  fontFamily: "'IBM Plex Mono', monospace",
  fontSize: '9px',
  letterSpacing: '0.12em',
  color: theme.palette.text.disabled,
  padding: '10px 18px 6px',
  textTransform: 'uppercase',
  fontWeight: 600,
}));

const ModuleNavItem = styled(ListItemButton)(({ theme, active }) => ({
  padding: '9px 18px',
  fontSize: '12.5px',
  color: theme.palette.text.secondary,
  borderLeft: `2px solid ${active ? theme.palette.primary.main : 'transparent'}`,
  backgroundColor: active ? 'rgba(79, 156, 249, 0.08)' : 'transparent',
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
    color: theme.palette.text.primary,
  },
  ...(active && {
    color: theme.palette.primary.main,
  }),
}));

const NavDot = styled(Box)(({ color }) => ({
  width: '7px',
  height: '7px',
  borderRadius: '50%',
  backgroundColor: color || '#4a567a',
  flexShrink: 0,
}));

const ModuleList = styled(Box)(({ theme }) => ({
  flex: 1,
  padding: '12px 0',
  overflowY: 'auto',
}));

const SidebarFooter = styled(Box)(({ theme }) => ({
  padding: '14px 18px',
  borderTop: `1px solid ${theme.palette.divider}`,
  fontSize: '11px',
  color: theme.palette.text.disabled,
  fontFamily: "'IBM Plex Mono', monospace",
}));

const moduleColors = {
  lead: '#4f9cf9',
  bq: '#a78bfa',
  tender: '#22d3ee',
  bidding: '#f59e0b',
  acquisition: '#22c55e',
  order: '#fb923c',
  future: '#f472b6',
};

const moduleConfig = [
  { id: 'lead', label: 'Lead Creation', number: '01', color: moduleColors.lead },
  { id: 'bq', label: 'Budgetary Quotation', number: '02', color: moduleColors.bq },
  { id: 'tender', label: 'Tender Management', number: '03', color: moduleColors.tender },
  { id: 'bidding', label: 'Bidding', number: '04', color: moduleColors.bidding },
  { id: 'acquisition', label: 'Order Acquisition', number: '05', color: moduleColors.acquisition },
  { id: 'order', label: 'Order Received', number: '06', color: moduleColors.order },
  { id: 'future', label: 'Future Initiatives', number: '07', color: moduleColors.future },
];

export default function MarketingPortalSidebar({ activeModule, onModuleChange, onNewLead }) {
  return (
    <SidebarContainer>
      <Box sx={{ padding: '20px 18px 16px', borderBottom: '1px solid', borderColor: 'divider' }}>
        <LogoBadge label="BMS v2.0" variant="outlined" />
        <Typography sx={{ fontSize: '13px', fontWeight: 600, color: 'text.primary', marginBottom: '2px' }}>
          Marketing Portal
        </Typography>
        <Typography sx={{ fontSize: '10px', color: 'text.disabled', fontFamily: "'IBM Plex Mono', monospace" }}>
          Bidding Management System
        </Typography>
      </Box>

      <ModuleList>
        <NavModuleLabel>Modules</NavModuleLabel>
        <ModuleNavItem
          onClick={() => onModuleChange('dashboard')}
          active={activeModule === 'dashboard' ? 1 : 0}
          sx={{ display: 'flex', alignItems: 'center', gap: '10px' }}
        >
          <NavDot color="#4a567a" />
          <ListItemText primary="Dashboard" primaryTypographyProps={{ sx: { fontSize: '12.5px' } }} />
        </ModuleNavItem>

        {moduleConfig.map((module) => (
          <ModuleNavItem
            key={module.id}
            onClick={() => onModuleChange(module.id)}
            active={activeModule === module.id ? 1 : 0}
            sx={{ display: 'flex', alignItems: 'center', gap: '10px', justifyContent: 'space-between' }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1 }}>
              <NavDot color={module.color} />
              <ListItemText
                primary={module.label}
                primaryTypographyProps={{ sx: { fontSize: '12.5px', flex: 1 } }}
              />
            </Box>
            <Typography sx={{ fontSize: '9px', color: 'text.disabled', fontFamily: "'IBM Plex Mono', monospace" }}>
              {module.number}
            </Typography>
          </ModuleNavItem>
        ))}

        <NavModuleLabel sx={{ marginTop: '8px' }}>Quick Actions</NavModuleLabel>
        <ModuleNavItem
          onClick={onNewLead}
          sx={{ display: 'flex', alignItems: 'center', gap: '10px' }}
        >
          <NavDot color="#2563eb" />
          <ListItemText primary="+ New Lead" primaryTypographyProps={{ sx: { fontSize: '12.5px' } }} />
        </ModuleNavItem>
      </ModuleList>

      <SidebarFooter>BDG-TEAM · FY 2025–26</SidebarFooter>
    </SidebarContainer>
  );
}
