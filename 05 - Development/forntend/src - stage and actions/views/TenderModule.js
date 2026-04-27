import React, { useState } from 'react';
import {
  Box,
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
  Typography,
} from '@mui/material';

const sampleTenders = [
  {
    leadRef: 'L-2526-001',
    tenderRef: 'T-2526-007',
    project: 'Radar Integration',
    customer: 'BEL',
    stage: 'Bid Preparation',
    submissionDate: '30 Apr 26',
    daysLeft: '5',
    value: '95',
    owner: 'Ravi K.',
  },
  {
    leadRef: 'L-2526-004',
    tenderRef: 'T-2526-006',
    project: 'Naval IRST — UK MoD',
    customer: 'UK MoD',
    stage: 'Pre-Bid Query',
    submissionDate: '15 May 26',
    daysLeft: '20',
    value: '240',
    owner: 'Ravi K.',
  },
  {
    leadRef: 'L-2526-009',
    tenderRef: 'T-2526-005',
    project: 'Border Surveillance',
    customer: 'MHA',
    stage: 'Submitted',
    submissionDate: '18 Mar 26',
    daysLeft: 'Done',
    value: '180',
    owner: 'Amit S.',
  },
];

const getChipColor = (value) => {
  const colorMap = {
    'Bid Preparation': 'info',
    'Pre-Bid Query': 'secondary',
    'Submitted': 'success',
    'BEL': 'default',
  };
  return colorMap[value] || 'default';
};

export default function TenderModule() {
  return (
    <Box>
      <Box sx={{ padding: '20px 24px 0', display: 'flex', alignItems: 'center', gap: '12px', borderBottom: '1px solid', borderColor: 'divider', paddingBottom: '20px' }}>
        <Typography sx={{ fontSize: '16px', fontWeight: 600, color: 'text.primary' }}>
          Tenders
        </Typography>
        <Chip label="7 active" size="small" variant="outlined" />
      </Box>

      <Box sx={{ padding: '14px 24px', display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center', borderBottom: '1px solid', borderColor: 'divider' }}>
        <TextField
          placeholder="Search tender, customer…"
          size="small"
          variant="outlined"
          sx={{ width: '200px' }}
        />
        <Select defaultValue="all" size="small" sx={{ width: '150px' }}>
          <MenuItem value="all">All Stages</MenuItem>
          <MenuItem value="rfp">RFP Received</MenuItem>
          <MenuItem value="prebiid">Pre-Bid Query</MenuItem>
        </Select>
        <Select defaultValue="all" size="small" sx={{ width: '150px' }}>
          <MenuItem value="all">All Sectors</MenuItem>
          <MenuItem value="defence">Defence</MenuItem>
        </Select>
      </Box>

      <Box sx={{ padding: '0 24px 24px', overflowX: 'auto' }}>
        <Table sx={{ fontSize: '12.5px', marginTop: '12px' }}>
          <TableHead>
            <TableRow>
              <TableCell>Lead Ref</TableCell>
              <TableCell>Tender Ref</TableCell>
              <TableCell>Project</TableCell>
              <TableCell>Customer</TableCell>
              <TableCell>Stage</TableCell>
              <TableCell>Submission Date</TableCell>
              <TableCell>Days Left</TableCell>
              <TableCell>Value (₹ Cr)</TableCell>
              <TableCell>Owner</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sampleTenders.map((tender, idx) => (
              <TableRow key={idx}>
                <TableCell sx={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '11px' }}>{tender.leadRef}</TableCell>
                <TableCell sx={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '11px' }}>{tender.tenderRef}</TableCell>
                <TableCell sx={{ color: 'text.primary', fontWeight: 500 }}>{tender.project}</TableCell>
                <TableCell>{tender.customer}</TableCell>
                <TableCell><Chip label={tender.stage} color={getChipColor(tender.stage)} size="small" /></TableCell>
                <TableCell sx={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '11px', color: '#f59e0b' }}>
                  {tender.submissionDate}
                </TableCell>
                <TableCell sx={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '12px', color: parseInt(tender.daysLeft) < 10 && tender.daysLeft !== 'Done' ? '#f59e0b' : 'inherit' }}>
                  {tender.daysLeft}
                </TableCell>
                <TableCell sx={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '12px' }}>{tender.value}</TableCell>
                <TableCell>{tender.owner}</TableCell>
                <TableCell>
                  <Button variant="outlined" size="small">Update →</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Box>
    </Box>
  );
}
