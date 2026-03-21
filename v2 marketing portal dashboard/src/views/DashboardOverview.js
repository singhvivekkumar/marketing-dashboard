import React from 'react';
import { Box, Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Chip, Button } from '@mui/material';
import KPIGrid from '../components/KPIGrid';
import ChartCard from '../components/ChartCard';
import {
  FiveYearChart,
  LeadOutcomesChart,
  MonthlyTrendChart,
  CivilDefenceChart,
  LeadSubTypesChart,
  DomainWinLossChart,
  Top10Chart,
} from '../components/Charts';
import * as mockData from '../mockData';

const overviewKpis = [
  { label: 'Leads in Queue', value: 42, delta: '+8 vs last FY', deltaType: 'up' },
  { label: 'Total Orders', value: 128, delta: '+23 vs last FY', deltaType: 'up' },
  { label: 'Order Value (Cr)', value: '₹247', delta: '+₹38 vs last FY', deltaType: 'up' },
  { label: 'BQs Submitted', value: 67, delta: 'same as last FY', deltaType: 'neutral' },
  { label: 'Win Rate', value: '34%', delta: '+6% vs last FY', deltaType: 'up' },
  { label: 'Lost Leads', value: 38, delta: '+5 vs last FY', deltaType: 'down' },
];

export default function DashboardOverview() {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* KPIs */}
      <KPIGrid kpis={overviewKpis} />

      {/* Charts Grid 1 */}
      <Grid container spacing={2}>
        <Grid item xs={12} md={8}>
          <ChartCard
            title="5-year order history"
            subtitle="Order count & value (Cr) by financial year"
            chip={{ label: '5 years', type: 'blue' }}
            legend={[
              { label: 'Orders (count)', color: '#2563eb' },
              { label: 'Value (Cr)', color: '#7c3aed' },
            ]}
          >
            <FiveYearChart data={mockData.fiveYearData} />
          </ChartCard>
        </Grid>
        <Grid item xs={12} md={4}>
          <ChartCard
            title="Lead outcomes"
            subtitle="All-time distribution"
            chip={{ label: 'Current FY', type: 'green' }}
            legend={[
              { label: 'Won 34%', color: '#16a34a' },
              { label: 'Lost 22%', color: '#dc2626' },
              { label: 'Participated 30%', color: '#2563eb' },
              { label: 'Not-Part. 14%', color: '#d97706' },
            ]}
          >
            <LeadOutcomesChart data={mockData.leadOutcomesData} />
          </ChartCard>
        </Grid>
      </Grid>

      {/* Charts Grid 2 */}
      <Grid container spacing={2}>
        <Grid item xs={12} md={4}>
          <ChartCard
            title="Monthly order trend"
            subtitle="Count + cumulative value (Cr)"
            chip={{ label: '2 years', type: 'blue' }}
            legend={[
              { label: 'FY 25-26', color: '#2563eb' },
              { label: 'FY 24-25', color: '#d1d5db' },
            ]}
          >
            <MonthlyTrendChart data={mockData.monthlyTrendData} />
          </ChartCard>
        </Grid>
        <Grid item xs={12} md={4}>
          <ChartCard
            title="Civil vs. Defence"
            subtitle="Lead & order split"
            chip={{ label: 'Mix', type: 'amber' }}
            legend={[
              { label: 'Civil', color: '#2563eb' },
              { label: 'Defence', color: '#7c3aed' },
            ]}
          >
            <CivilDefenceChart data={mockData.civilDefenceData} />
          </ChartCard>
        </Grid>
        <Grid item xs={12} md={4}>
          <ChartCard
            title="Lead sub-types"
            subtitle="Distribution this FY"
            chip={{ label: '5 types', type: 'blue' }}
            legend={[
              { label: 'Submitted', color: '#2563eb' },
              { label: 'Domestic', color: '#0d9488' },
              { label: 'Export', color: '#7c3aed' },
            ]}
          >
            <LeadSubTypesChart data={mockData.leadSubTypesData} />
          </ChartCard>
        </Grid>
      </Grid>

      {/* Charts Grid 3 */}
      <Grid container spacing={2}>
        <Grid item xs={12} md={8}>
          <ChartCard
            title="Win / loss by business domain"
            subtitle="Stacked by outcome"
            chip={{ label: 'Domain view', type: 'green' }}
            legend={[
              { label: 'Won', color: '#16a34a' },
              { label: 'Lost', color: '#dc2626' },
            ]}
          >
            <DomainWinLossChart data={mockData.domainWinLossData} />
          </ChartCard>
        </Grid>
        <Grid item xs={12} md={4}>
          <ChartCard
            title="Top 10 customers"
            subtitle="By total order value (Cr)"
            chip={{ label: 'All-time', type: 'blue' }}
          >
            <Top10Chart data={mockData.top10CustomersData} />
          </ChartCard>
        </Grid>
      </Grid>

      {/* Lost Leads Table */}
      <Paper sx={{ border: '1px solid #e4e8ef', borderRadius: '14px', overflow: 'hidden' }}>
        <Box sx={{ padding: '16px 20px', borderBottom: '1px solid #e4e8ef', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <div style={{ fontSize: '13px', fontWeight: 500, color: '#0f1117' }}>
              Lost lead analysis
            </div>
            <div style={{ fontSize: '11px', color: '#8892a4', marginTop: '2px' }}>
              Detailed breakdown of all lost opportunities
            </div>
          </Box>
          <Button
            variant="outlined"
            size="small"
            sx={{
              fontSize: '12px',
              padding: '6px 12px',
              border: '1px solid #d0d5e0',
              borderRadius: '7px',
              backgroundColor: '#ffffff',
              color: '#525868',
              textTransform: 'none',
            }}
          >
            Analyse with AI ↗
          </Button>
        </Box>
        <TableContainer>
          <Table sx={{ fontSize: '12px' }}>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#f1f3f7' }}>
                <TableCell sx={{ fontSize: '10px', fontWeight: 500, textTransform: 'uppercase', color: '#8892a4', borderColor: '#e4e8ef' }}>
                  Tender Name
                </TableCell>
                <TableCell sx={{ fontSize: '10px', fontWeight: 500, textTransform: 'uppercase', color: '#8892a4', borderColor: '#e4e8ef' }}>
                  Customer
                </TableCell>
                <TableCell sx={{ fontSize: '10px', fontWeight: 500, textTransform: 'uppercase', color: '#8892a4', borderColor: '#e4e8ef' }}>
                  Domain
                </TableCell>
                <TableCell sx={{ fontSize: '10px', fontWeight: 500, textTransform: 'uppercase', color: '#8892a4', borderColor: '#e4e8ef' }}>
                  Value (Cr)
                </TableCell>
                <TableCell sx={{ fontSize: '10px', fontWeight: 500, textTransform: 'uppercase', color: '#8892a4', borderColor: '#e4e8ef' }}>
                  Competitor
                </TableCell>
                <TableCell sx={{ fontSize: '10px', fontWeight: 500, textTransform: 'uppercase', color: '#8892a4', borderColor: '#e4e8ef' }}>
                  Reason
                </TableCell>
                <TableCell sx={{ fontSize: '10px', fontWeight: 500, textTransform: 'uppercase', color: '#8892a4', borderColor: '#e4e8ef' }}>
                  Date
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {mockData.lostLeadsTableData.map((row, idx) => (
                <TableRow
                  key={idx}
                  sx={{
                    borderColor: '#e4e8ef',
                    '&:hover': { backgroundColor: '#f1f3f7' },
                  }}
                >
                  <TableCell sx={{ color: '#525868', borderColor: '#e4e8ef' }}>{row.tenderName}</TableCell>
                  <TableCell sx={{ color: '#525868', borderColor: '#e4e8ef' }}>{row.customer}</TableCell>
                  <TableCell sx={{ color: '#525868', borderColor: '#e4e8ef' }}>{row.domain}</TableCell>
                  <TableCell
                    sx={{
                      fontFamily: '"DM Mono", monospace',
                      fontWeight: 500,
                      color: '#0f1117',
                      borderColor: '#e4e8ef',
                    }}
                  >
                    {row.value}
                  </TableCell>
                  <TableCell sx={{ color: '#525868', borderColor: '#e4e8ef' }}>{row.competitor}</TableCell>
                  <TableCell sx={{ color: '#525868', borderColor: '#e4e8ef' }}>{row.reason}</TableCell>
                  <TableCell
                    sx={{
                      fontFamily: '"DM Mono", monospace',
                      fontWeight: 500,
                      color: '#0f1117',
                      borderColor: '#e4e8ef',
                    }}
                  >
                    {row.date}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
}
