import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Select,
  MenuItem,
  Button,
  Chip,
  Stack,
  Tabs,
  Tab,
  Paper,
  Grid,
  Breadcrumbs,
  Link,
  TextareaAutosize,
  FormControlLabel,
  RadioGroup,
  Radio,
} from '@mui/material';
import { styled } from '@mui/material/styles';

const StagePipeline = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'flex-start',
  gap: 0,
  overflowX: 'auto',
  paddingBottom: '4px',
  marginBottom: '20px',
}));

const StageStep = styled(Box)(({ done, current }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  position: 'relative',
  minWidth: '90px',
  
  '&:not(:last-child)::after': {
    content: '""',
    position: 'absolute',
    top: '14px',
    left: '50%',
    width: '100%',
    height: '2px',
    backgroundColor: done ? '#2563eb' : '#2a3045',
    zIndex: 0,
  },
}));

const StageCircle = styled(Box)(({ done, current }) => {
  let bgColor = '#1a1e29';
  let borderColor = '#2a3045';
  let textColor = '#4a567a';

  if (done) {
    bgColor = '#2563eb';
    borderColor = '#4f9cf9';
    textColor = '#fff';
  } else if (current) {
    bgColor = 'transparent';
    borderColor = '#4f9cf9';
    textColor = '#4f9cf9';
    // boxShadow = '0 0 0 3px rgba(79, 156, 249, 0.15)';
  }

  return {
    width: '28px',
    height: '28px',
    borderRadius: '50%',
    border: `2px solid ${borderColor}`,
    backgroundColor: bgColor,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: "'IBM Plex Mono', monospace",
    fontSize: '10px',
    color: textColor,
    position: 'relative',
    zIndex: 1,
    flexShrink: 0,
    ...(current && { boxShadow: '0 0 0 3px rgba(79, 156, 249, 0.15)' }),
  };
});

const StageLabel = styled(Typography)(({ done, current, theme }) => ({
  fontSize: '9.5px',
  fontFamily: "'IBM Plex Mono', monospace",
  color: done ? theme.palette.text.secondary : theme.palette.text.disabled,
  marginTop: '6px',
  textAlign: 'center',
  lineHeight: 1.3,
  maxWidth: '80px',
  ...(current && { color: '#4f9cf9' }),
}));

const FilterBar = styled(Box)(({ theme }) => ({
  padding: '14px 24px',
  display: 'flex',
  gap: '8px',
  flexWrap: 'wrap',
  alignItems: 'center',
  borderBottom: `1px solid ${theme.palette.divider}`,
}));

const TabPanel = styled(Box)(({ theme }) => ({
  padding: '18px',
  display: 'none',
  '&.active': {
    display: 'block',
  },
}));

const sampleLeads = [
  {
    id: 'L-2526-001',
    project: 'Radar Integration System',
    customer: 'BEL, Bengaluru',
    type: 'EOI',
    sector: 'Defence',
    market: 'Domestic',
    domain: 'Electronics',
    stage: 'Tech Analysis',
    status: 'Go',
    owner: 'Ravi Kumar',
    created: '12 Apr 26',
  },
  {
    id: 'L-2526-002',
    project: 'ERP Upgrade — DRDO Labs',
    customer: 'DRDO, Delhi',
    type: 'RFI',
    sector: 'Non-Def',
    market: 'Domestic',
    domain: 'Software',
    stage: 'Exec Summary',
    status: 'Reviewing',
    owner: 'Sunita Menon',
    created: '08 Apr 26',
  },
  {
    id: 'L-2526-003',
    project: 'Comms System Upgrade',
    customer: 'HAL, Bengaluru',
    type: 'EOI',
    sector: 'Defence',
    market: 'Domestic',
    domain: 'Comms',
    stage: 'Go/No-Go',
    status: 'Decision Pending',
    owner: 'Amit Shah',
    created: '02 Apr 26',
  },
];

const getChipColor = (value) => {
  const colorMap = {
    'EOI': 'primary',
    'RFI': 'secondary',
    'Defence': 'error',
    'Non-Def': 'default',
    'Domestic': 'default',
    'Go': 'success',
    'Reviewing': 'warning',
    'Decision Pending': 'warning',
  };
  return colorMap[value] || 'default';
};

export default function LeadsModule({ onBack }) {
  const [viewMode, setViewMode] = useState('list');
  const [selectedLead, setSelectedLead] = useState(null);
  const [tabValue, setTabValue] = useState(0);

  const handleLeadSelect = (lead) => {
    setSelectedLead(lead);
    setViewMode('detail');
  };

  if (viewMode === 'detail' && selectedLead) {
    return (
      <Box>
        <Box sx={{ padding: '0 24px', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: 'text.disabled', fontFamily: "'IBM Plex Mono', monospace", height: '36px', borderBottom: '1px solid', borderColor: 'divider' }}>
          <Link onClick={() => setViewMode('list')} sx={{ cursor: 'pointer' }}>Dashboard</Link>
          <span> › </span>
          <Link onClick={() => setViewMode('list')} sx={{ cursor: 'pointer' }}>Lead Creation</Link>
          <span> › </span>
          <span sx={{ color: 'text.secondary' }}>{selectedLead.id} — {selectedLead.project}</span>
        </Box>

        <Box sx={{ padding: '20px 24px', display: 'grid', gridTemplateColumns: '1fr 320px', gap: '20px' }}>
          {/* Main Content */}
          <Card variant="outlined">
            <Box sx={{ padding: '14px 18px', borderBottom: '1px solid', borderColor: 'divider', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Chip label={selectedLead.type} color={getChipColor(selectedLead.type)} size="small" />
              <Chip label={selectedLead.sector} color={getChipColor(selectedLead.sector)} size="small" />
              <Chip label={selectedLead.status} color={getChipColor(selectedLead.status)} size="small" />
              <Typography sx={{ fontSize: '11px', color: 'text.disabled', fontFamily: "'IBM Plex Mono', monospace", marginLeft: 'auto' }}>
                {selectedLead.id}
              </Typography>
            </Box>

            <Box sx={{ padding: '18px' }}>
              <Typography sx={{ fontSize: '18px', fontWeight: 600, color: 'text.primary', marginBottom: '4px' }}>
                {selectedLead.project}
              </Typography>
              <Typography sx={{ fontSize: '12px', color: 'text.disabled' }}>
                {selectedLead.customer} · {selectedLead.domain} · {selectedLead.market}
              </Typography>
            </Box>

            <Tabs value={tabValue} onChange={(e, val) => setTabValue(val)} sx={{ borderBottom: '1px solid', borderColor: 'divider' }}>
              <Tab label="Overview" />
              <Tab label="Stage & Actions" />
              <Tab label="Tech Analysis" />
              <Tab label="Approvals" />
              <Tab label="Audit Log" />
            </Tabs>

            <TabPanel className={'active'} sx={{ paddingTop: '18px' }}>
              <Grid container spacing={2}>
                {[
                  { label: 'Project Name', value: selectedLead.project },
                  { label: 'Reference #', value: selectedLead.id },
                  { label: 'Customer Name', value: selectedLead.customer },
                  { label: 'Lead Owner', value: selectedLead.owner },
                  { label: 'Lead Type', value: selectedLead.type },
                  { label: 'Sector', value: selectedLead.sector },
                  { label: 'Market', value: selectedLead.market },
                  { label: 'Business Domain', value: selectedLead.domain },
                ].map((field, idx) => (
                  <Grid item xs={12} sm={6} key={idx}>
                    <Box>
                      <Typography sx={{ fontSize: '9.5px', color: 'text.disabled', fontFamily: "'IBM Plex Mono', monospace", textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '4px' }}>
                        {field.label}
                      </Typography>
                      <Typography sx={{ fontSize: '13px', color: 'text.primary' }}>
                        {field.value}
                      </Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>
              <Box sx={{ marginTop: '12px', display: 'flex', gap: '8px' }}>
                <Button variant="outlined" size="small">Update Stage ↗</Button>
                <Button variant="contained" size="small">Edit Details</Button>
                <Button sx={{ marginLeft: 'auto', color: '#22c55e', borderColor: '#15532d' }} variant="outlined" size="small">
                  Pass to Tender →
                </Button>
              </Box>
            </TabPanel>
          </Card>

          {/* Right Sidebar */}
          <Box>
            <Card variant="outlined" sx={{ marginBottom: '16px' }}>
              <Box sx={{ padding: '14px 18px', borderBottom: '1px solid', borderColor: 'divider' }}>
                <Typography sx={{ fontSize: '12px', fontWeight: 600, color: 'text.primary', fontFamily: "'IBM Plex Mono', monospace", letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                  Lead Info
                </Typography>
              </Box>
              <Box sx={{ padding: '16px 18px' }}>
                {[
                  { key: 'Status', value: selectedLead.status },
                  { key: 'Stage', value: selectedLead.stage },
                  { key: 'Owner', value: selectedLead.owner },
                  { key: 'Created', value: selectedLead.created },
                ].map((info, idx) => (
                  <Box key={idx} sx={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: idx < 3 ? '1px solid' : 'none', borderColor: 'divider', fontSize: '12px' }}>
                    <Typography sx={{ fontSize: '11px', color: 'text.disabled', fontFamily: "'IBM Plex Mono', monospace" }}>
                      {info.key}
                    </Typography>
                    <Typography sx={{ fontSize: '12px', color: 'text.primary' }}>
                      {info.value}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Card>

            <Card variant="outlined">
              <Box sx={{ padding: '14px 18px', borderBottom: '1px solid', borderColor: 'divider' }}>
                <Typography sx={{ fontSize: '12px', fontWeight: 600, color: 'text.primary', fontFamily: "'IBM Plex Mono', monospace", letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                  Quick Actions
                </Typography>
              </Box>
              <Box sx={{ padding: '16px 18px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <Button variant="outlined" fullWidth size="small">Change Lead Owner</Button>
                <Button variant="outlined" fullWidth size="small">Edit Key Dates</Button>
                <Button variant="contained" fullWidth size="small" sx={{ color: '#22c55e' }}>Pass to Tender</Button>
                <Button variant="outlined" fullWidth size="small" sx={{ color: '#ef4444' }}>Mark No-Go</Button>
              </Box>
            </Card>
          </Box>
        </Box>
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ padding: '20px 24px 0', display: 'flex', alignItems: 'center', gap: '12px', borderBottom: '1px solid', borderColor: 'divider', paddingBottom: '20px' }}>
        <Typography sx={{ fontSize: '16px', fontWeight: 600, color: 'text.primary' }}>
          Leads
        </Typography>
        <Chip label="24 total" size="small" variant="outlined" />
        <Button variant="contained" size="small" sx={{ marginLeft: 'auto' }}>+ New Lead</Button>
      </Box>

      <FilterBar>
        <TextField
          placeholder="Search project, customer, ref…"
          size="small"
          variant="outlined"
          sx={{ width: '200px' }}
        />
        <Select defaultValue="all" size="small" sx={{ width: '150px' }}>
          <MenuItem value="all">All Sectors</MenuItem>
          <MenuItem value="defence">Defence</MenuItem>
          <MenuItem value="non-def">Non-Defence</MenuItem>
        </Select>
        <Select defaultValue="all" size="small" sx={{ width: '150px' }}>
          <MenuItem value="all">All Types</MenuItem>
          <MenuItem value="eoi">EOI</MenuItem>
          <MenuItem value="rfi">RFI</MenuItem>
        </Select>
        <Select defaultValue="all" size="small" sx={{ width: '150px' }}>
          <MenuItem value="all">All Status</MenuItem>
          <MenuItem value="go">Go Decision</MenuItem>
          <MenuItem value="reviewing">Reviewing</MenuItem>
        </Select>
      </FilterBar>

      <Box sx={{ padding: '0 24px 24px', overflowX: 'auto' }}>
        <Table sx={{ fontSize: '12.5px' }}>
          <TableHead>
            <TableRow>
              <TableCell>Ref #</TableCell>
              <TableCell>Project Name</TableCell>
              <TableCell>Customer</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Sector</TableCell>
              <TableCell>Market</TableCell>
              <TableCell>Domain</TableCell>
              <TableCell>Stage</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Lead Owner</TableCell>
              <TableCell>Created</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sampleLeads.map((lead) => (
              <TableRow key={lead.id} onClick={() => handleLeadSelect(lead)} sx={{ cursor: 'pointer' }}>
                <TableCell sx={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '11px' }}>{lead.id}</TableCell>
                <TableCell sx={{ color: 'text.primary', fontWeight: 500 }}>{lead.project}</TableCell>
                <TableCell>{lead.customer}</TableCell>
                <TableCell><Chip label={lead.type} color={getChipColor(lead.type)} size="small" /></TableCell>
                <TableCell><Chip label={lead.sector} color={getChipColor(lead.sector)} size="small" /></TableCell>
                <TableCell>{lead.market}</TableCell>
                <TableCell>{lead.domain}</TableCell>
                <TableCell><Chip label={lead.stage} variant="outlined" size="small" /></TableCell>
                <TableCell><Chip label={lead.status} color={getChipColor(lead.status)} size="small" /></TableCell>
                <TableCell>{lead.owner}</TableCell>
                <TableCell sx={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '10px' }}>{lead.created}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Box>
    </Box>
  );
}
