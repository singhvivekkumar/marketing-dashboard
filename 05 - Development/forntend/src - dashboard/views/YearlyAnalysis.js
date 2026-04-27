import React from 'react';
import { Box, Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, Typography } from '@mui/material';
import KPIGrid from '../components/KPIGrid';
import ChartCard from '../components/ChartCard';
import { YearlyValueChart, WinRateTrendChart } from '../components/Charts';
import * as mockData from '../mockData';

const yearlyKpis = [
  { label: 'Best Year (Orders)', value: 'FY 24-25', delta: '128 orders', deltaType: 'up' },
  { label: 'Best Year (Value)', value: 'FY 25-26', delta: '₹247 Cr', deltaType: 'up' },
  { label: '5-yr CAGR', value: '18.4%', delta: 'Order value', deltaType: 'up' },
  { label: 'Total 5-yr Value', value: '₹892 Cr', delta: 'All orders', deltaType: 'neutral' },
  { label: 'Peak Win Rate', value: '38%', delta: 'FY 23-24', deltaType: 'neutral' },
  { label: 'Avg Orders/Year', value: 102, delta: '+15% trend', deltaType: 'up' },
];

export default function YearlyAnalysis() {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Section Title */}
      <Typography
        sx={{
          fontSize: '12px',
          fontWeight: 500,
          color: '#8892a4',
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          paddingBottom: '4px',
          borderBottom: '2px solid #e4e8ef',
          marginBottom: '16px',
        }}
      >
        Yearly analysis — all financial years
      </Typography>

      {/* KPIs */}
      <KPIGrid kpis={yearlyKpis} />

      {/* Charts */}
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <ChartCard
            title="Year-on-year order value growth"
            subtitle="Value in Crores — 5 financial years"
            chip={{ label: 'CAGR 18.4%', type: 'green' }}
          >
            <YearlyValueChart data={mockData.yearlyValueData} />
          </ChartCard>
        </Grid>
        <Grid item xs={12} md={6}>
          <ChartCard
            title="Win rate trend"
            subtitle="Percentage of leads won per year"
          >
            <WinRateTrendChart data={mockData.winRateTrendData} />
          </ChartCard>
        </Grid>
      </Grid>

      {/* Year-on-Year Summary Table */}
      <Paper sx={{ border: '1px solid #e4e8ef', borderRadius: '14px', overflow: 'hidden' }}>
        <Box sx={{ padding: '16px 20px', borderBottom: '1px solid #e4e8ef' }}>
          <Typography sx={{ fontSize: '13px', fontWeight: 500, color: '#0f1117' }}>
            Year-on-year summary table
          </Typography>
          <Typography sx={{ fontSize: '11px', color: '#8892a4', marginTop: '2px' }}>
            All key metrics by financial year
          </Typography>
        </Box>
        <TableContainer>
          <Table sx={{ fontSize: '12px' }}>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#f1f3f7' }}>
                <TableCell sx={{ fontSize: '10px', fontWeight: 500, textTransform: 'uppercase', color: '#8892a4', borderColor: '#e4e8ef' }}>
                  Financial Year
                </TableCell>
                <TableCell sx={{ fontSize: '10px', fontWeight: 500, textTransform: 'uppercase', color: '#8892a4', borderColor: '#e4e8ef' }}>
                  BQs
                </TableCell>
                <TableCell sx={{ fontSize: '10px', fontWeight: 500, textTransform: 'uppercase', color: '#8892a4', borderColor: '#e4e8ef' }}>
                  Leads
                </TableCell>
                <TableCell sx={{ fontSize: '10px', fontWeight: 500, textTransform: 'uppercase', color: '#8892a4', borderColor: '#e4e8ef' }}>
                  Orders
                </TableCell>
                <TableCell sx={{ fontSize: '10px', fontWeight: 500, textTransform: 'uppercase', color: '#8892a4', borderColor: '#e4e8ef' }}>
                  Order Value (Cr)
                </TableCell>
                <TableCell sx={{ fontSize: '10px', fontWeight: 500, textTransform: 'uppercase', color: '#8892a4', borderColor: '#e4e8ef' }}>
                  Win Rate
                </TableCell>
                <TableCell sx={{ fontSize: '10px', fontWeight: 500, textTransform: 'uppercase', color: '#8892a4', borderColor: '#e4e8ef' }}>
                  Lost Leads
                </TableCell>
                <TableCell sx={{ fontSize: '10px', fontWeight: 500, textTransform: 'uppercase', color: '#8892a4', borderColor: '#e4e8ef' }}>
                  Growth
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {mockData.yearSummaryData.map((row, idx) => (
                <TableRow key={idx} sx={{ borderColor: '#e4e8ef', '&:hover': { backgroundColor: '#f1f3f7' } }}>
                  <TableCell
                    sx={{
                      fontFamily: '"DM Mono", monospace',
                      fontWeight: 500,
                      color: '#0f1117',
                      borderColor: '#e4e8ef',
                    }}
                  >
                    {row.fy}
                  </TableCell>
                  <TableCell
                    sx={{
                      fontFamily: '"DM Mono", monospace',
                      fontWeight: 500,
                      color: '#0f1117',
                      borderColor: '#e4e8ef',
                    }}
                  >
                    {row.bqs}
                  </TableCell>
                  <TableCell
                    sx={{
                      fontFamily: '"DM Mono", monospace',
                      fontWeight: 500,
                      color: '#0f1117',
                      borderColor: '#e4e8ef',
                    }}
                  >
                    {row.leads}
                  </TableCell>
                  <TableCell
                    sx={{
                      fontFamily: '"DM Mono", monospace',
                      fontWeight: 500,
                      color: '#0f1117',
                      borderColor: '#e4e8ef',
                    }}
                  >
                    {row.orders}
                  </TableCell>
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
                  <TableCell
                    sx={{
                      fontFamily: '"DM Mono", monospace',
                      fontWeight: 500,
                      color: '#0f1117',
                      borderColor: '#e4e8ef',
                    }}
                  >
                    {row.winRate}
                  </TableCell>
                  <TableCell
                    sx={{
                      fontFamily: '"DM Mono", monospace',
                      fontWeight: 500,
                      color: '#0f1117',
                      borderColor: '#e4e8ef',
                    }}
                  >
                    {row.lost}
                  </TableCell>
                  <TableCell sx={{ borderColor: '#e4e8ef' }}>
                    <Chip
                      label={row.growth}
                      size="small"
                      sx={{
                        fontSize: '10px',
                        fontWeight: 500,
                        backgroundColor:
                          row.growth === 'Baseline'
                            ? '#f1f3f7'
                            : row.growth.includes('+')
                              ? '#f0fdf4'
                              : '#fef2f2',
                        color:
                          row.growth === 'Baseline'
                            ? '#525868'
                            : row.growth.includes('+')
                              ? '#16a34a'
                              : '#dc2626',
                        height: 'auto',
                        padding: '2px 7px',
                        border: 'none',
                      }}
                    />
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
