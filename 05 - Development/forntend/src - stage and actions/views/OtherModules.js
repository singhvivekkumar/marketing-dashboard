import React from 'react';
import { Box, Table, TableBody, TableCell, TableHead, TableRow, Chip, Typography, TextField, Select, MenuItem, Button } from '@mui/material';

const sampleData = {
  bq: [
    { leadRef: 'L-2526-001', bqRef: 'BQ-2526-009', project: 'Radar Integration', customer: 'BEL', value: '102.50', stage: 'Under Review', date: '15 Apr 26', owner: 'Ravi K.' },
    { leadRef: 'L-2526-004', bqRef: 'BQ-2526-008', project: 'Naval IRST — UK MoD', customer: 'UK MoD', value: '258.00', stage: 'Submitted', date: '02 Apr 26', owner: 'Ravi K.' },
  ],
  bidding: [
    { leadRef: 'L-2526-009', tenderRef: 'T-2526-005', project: 'Border Surveillance', customer: 'MHA', price: '178.20', stage: 'L1 Negotiation', l1Status: 'L1 Position', owner: 'Amit S.' },
    { leadRef: 'L-2526-004', tenderRef: 'T-2526-006', project: 'Naval IRST', customer: 'UK MoD', price: '241.00', stage: 'Bid Submitted', l1Status: 'Awaited', owner: 'Ravi K.' },
  ],
  acquisition: [
    { leadRef: 'L-2526-009', project: 'Border Surveillance', customer: 'MHA', value: '178.20', stage: 'PO Received', loiDate: '10 Jan 26', poDate: '15 Mar 26', owner: 'Amit S.' },
  ],
  order: [
    { leadRef: 'L-2526-009', poNum: 'MHA/PO/26/1204', project: 'Border Surveillance', customer: 'MHA', value: '178.20', stage: 'Manufacturing', deliveryDate: 'Dec 2026', status: 'On Track', owner: 'Amit S.' },
  ],
  future: [
    { initRef: 'FI-001', programme: 'MRFA Avionics Suite', customer: 'IAF / HAL', domain: 'Avionics', value: '2,400', horizon: 'FY 2027–28', category: 'Early Engagement', owner: 'Ravi K.' },
    { initRef: 'FI-002', programme: 'Army Next-Gen Comms', customer: 'Army HQ', domain: 'Comms', value: '800', horizon: 'FY 2028+', category: 'Watch List', owner: 'Sunita M.' },
  ],
};

const ModuleTable = ({ title, subtitle, badgeCount, columns, data, leadRefField = 'leadRef' }) => (
  <Box>
    <Box sx={{ padding: '20px 24px 0', display: 'flex', alignItems: 'center', gap: '12px', borderBottom: '1px solid', borderColor: 'divider', paddingBottom: '20px' }}>
      <Typography sx={{ fontSize: '16px', fontWeight: 600, color: 'text.primary' }}>
        {title}
      </Typography>
      <Chip label={badgeCount} size="small" variant="outlined" />
    </Box>
    <Box sx={{ padding: '14px 24px', display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center', borderBottom: '1px solid', borderColor: 'divider' }}>
      <TextField placeholder={`Search ${title.toLowerCase()}…`} size="small" variant="outlined" sx={{ width: '200px' }} />
      <Select defaultValue="all" size="small" sx={{ width: '150px' }}>
        <MenuItem value="all">All Stages</MenuItem>
      </Select>
    </Box>
    <Box sx={{ padding: '0 24px 24px', overflowX: 'auto' }}>
      <Table sx={{ fontSize: '12.5px', marginTop: '12px' }}>
        <TableHead>
          <TableRow>
            {columns.map((col) => (
              <TableCell key={col}>{col}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row, idx) => (
            <TableRow key={idx}>
              {columns.map((col) => {
                const value = row[col.toLowerCase().replace(/\s+/g, '').replace(/\(.*\)/, '').replace(/₹.*/, '')] || row[col.toLowerCase().replace(/\s+/g, '')] || '';
                const colLower = col.toLowerCase();
                
                if (colLower.includes('stage') || colLower.includes('category') || colLower.includes('status')) {
                  return <TableCell key={col}><Chip label={value} size="small" variant="outlined" /></TableCell>;
                }
                if (colLower.includes('value') || colLower.includes('price')) {
                  return <TableCell key={col} sx={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '12px' }}>{value}</TableCell>;
                }
                if (colLower.includes('date') || colLower.includes('ref')) {
                  return <TableCell key={col} sx={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '11px' }}>{value}</TableCell>;
                }
                if (colLower.includes('project') && value) {
                  return <TableCell key={col} sx={{ color: 'text.primary', fontWeight: 500 }}>{value}</TableCell>;
                }
                return <TableCell key={col}>{value}</TableCell>;
              })}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
  </Box>
);

export const BQModule = () => (
  <ModuleTable
    title="Budgetary Quotations"
    badgeCount="9 active"
    columns={['Lead Ref', 'BQ Ref', 'Project', 'Customer', 'BQ Value (₹ Cr)', 'Stage', 'Submitted Date', 'Owner']}
    data={sampleData.bq}
  />
);

export const BiddingModule = () => (
  <ModuleTable
    title="Bidding"
    badgeCount="5 active bids"
    columns={['Lead Ref', 'Tender Ref', 'Project', 'Customer', 'Our Price (₹ Cr)', 'Stage', 'L1 Status', 'Owner']}
    data={sampleData.bidding}
  />
);

export const AcquisitionModule = () => (
  <ModuleTable
    title="Order Acquisition"
    badgeCount="4 LOIs received"
    columns={['Lead Ref', 'Project', 'Customer', 'Order Value (₹ Cr)', 'Stage', 'LOI Date', 'PO Date', 'Owner']}
    data={sampleData.acquisition}
  />
);

export const OrderModule = () => (
  <ModuleTable
    title="Orders Received"
    badgeCount="6 active orders"
    columns={['Lead Ref', 'PO Number', 'Project', 'Customer', 'PO Value (₹ Cr)', 'Current Stage', 'Delivery Date', 'Status']}
    data={sampleData.order}
  />
);

export const FutureModule = () => (
  <ModuleTable
    title="Future Initiatives"
    badgeCount="12 tracked"
    columns={['Init. Ref', 'Programme', 'Customer / Agency', 'Domain', 'Est. Value (₹ Cr)', 'Horizon', 'Category', 'Owner']}
    data={sampleData.future}
  />
);
