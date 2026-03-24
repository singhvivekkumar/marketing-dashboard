import React, { useState } from 'react';
import { Box, Grid, Card, CardContent, Typography, Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import ChartCard from '../components/ChartCard';
import * as mockData from '../mockData';

// Simple bar chart for monthly value
function MonthlyValueChart({ data, selectedMonth }) {
  const maxValue = Math.max(...mockData.monthData.map(m => m.value));
  
  return (
    <Box sx={{ width: '100%', height: '240px', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-around', gap: '8px', paddingBottom: '20px' }}>
      {mockData.MONTHS.map((month, idx) => (
        <Box key={idx} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
          <Box
            sx={{
              width: '100%',
              height: `${(mockData.monthData[idx].value / maxValue) * 180}px`,
              backgroundColor: idx === selectedMonth ? '#2563eb' : 'rgba(37,99,235,0.35)',
              borderRadius: '5px 5px 0 0',
              transition: 'all 0.2s',
              cursor: 'pointer',
              '&:hover': {
                opacity: 0.8,
              },
            }}
          />
          <Typography sx={{ fontSize: '10px', color: '#8892a4', marginTop: '8px', textAlign: 'center' }}>
            {month}
          </Typography>
        </Box>
      ))}
    </Box>
  );
}

// Simple bar chart for leads vs BQs
function LeadsVsBQsChart({ data }) {
  const maxValue = Math.max(...mockData.monthData.map(m => Math.max(m.leads, m.bqs)));
  
  return (
    <Box sx={{ width: '100%', height: '240px', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-around', gap: '6px', paddingBottom: '20px' }}>
      {mockData.MONTHS.map((month, idx) => (
        <Box key={idx} sx={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'center', gap: '3px', flex: 1 }}>
          <Box
            sx={{
              width: '45%',
              height: `${(mockData.monthData[idx].leads / maxValue) * 180}px`,
              backgroundColor: 'rgba(37,99,235,0.8)',
              borderRadius: '4px 4px 0 0',
            }}
          />
          <Box
            sx={{
              width: '45%',
              height: `${(mockData.monthData[idx].bqs / maxValue) * 180}px`,
              backgroundColor: 'rgba(124,58,237,0.8)',
              borderRadius: '4px 4px 0 0',
            }}
          />
        </Box>
      ))}
    </Box>
  );
}

export default function MonthlyReports() {
  const [selectedMonth, setSelectedMonth] = useState(9); // Jan (index 9)
  const monthData = mockData.monthData[selectedMonth];

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
        Monthly reports — select a month
      </Typography>

      {/* Month Report Card */}
      <Paper sx={{ border: '1px solid #e4e8ef', borderRadius: '14px', overflow: 'hidden' }}>
        <Box sx={{ padding: '16px 20px', borderBottom: '1px solid #e4e8ef', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography sx={{ fontSize: '13px', fontWeight: 500, color: '#0f1117' }}>
              FY 2025–26 monthly breakdown
            </Typography>
            <Typography sx={{ fontSize: '11px', color: '#8892a4', marginTop: '2px' }}>
              Click any month to see detailed report
            </Typography>
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
            Generate Report ↗
          </Button>
        </Box>

        {/* Month Grid */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(12, minmax(0, 1fr))',
            borderBottom: '1px solid #e4e8ef',
          }}
        >
          {mockData.MONTHS.map((month, idx) => (
            <Box
              key={idx}
              onClick={() => setSelectedMonth(idx)}
              sx={{
                padding: '10px 8px',
                textAlign: 'center',
                borderRight: idx < 11 ? '1px solid #e4e8ef' : 'none',
                cursor: 'pointer',
                transition: 'background 0.12s',
                backgroundColor: idx === selectedMonth ? '#eff4ff' : 'transparent',
                '&:hover': {
                  backgroundColor: '#f1f3f7',
                },
              }}
            >
              <Typography
                sx={{
                  fontSize: '10px',
                  color: idx === selectedMonth ? '#2563eb' : '#8892a4',
                  fontWeight: 500,
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                }}
              >
                {month}
              </Typography>
              <Typography
                sx={{
                  fontSize: '13px',
                  fontWeight: 600,
                  color: '#0f1117',
                  fontFamily: '"DM Mono", monospace',
                  marginTop: '2px',
                }}
              >
                {mockData.monthData[idx].orders}
              </Typography>
              <Box
                sx={{
                  height: '4px',
                  borderRadius: '2px',
                  marginTop: '6px',
                  backgroundColor: idx === selectedMonth ? '#2563eb' : '#93c5fd',
                  width: `${(mockData.monthData[idx].value / 32.5) * 100}%`,
                }}
              />
            </Box>
          ))}
        </Box>

        {/* Month Detail */}
        <Box
          sx={{
            padding: '16px 20px',
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '16px',
          }}
        >
          <Box sx={{ padding: '12px 14px', backgroundColor: '#f1f3f7', borderRadius: '8px' }}>
            <Typography sx={{ fontSize: '10px', color: '#8892a4', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Orders
            </Typography>
            <Typography sx={{ fontSize: '18px', fontWeight: 600, color: '#0f1117', fontFamily: '"DM Mono", monospace', marginTop: '3px' }}>
              {monthData.orders}
            </Typography>
            <Typography sx={{ fontSize: '11px', color: '#8892a4', marginTop: '2px' }}>
              Received in {mockData.MONTHS[selectedMonth]}
            </Typography>
          </Box>

          <Box sx={{ padding: '12px 14px', backgroundColor: '#f1f3f7', borderRadius: '8px' }}>
            <Typography sx={{ fontSize: '10px', color: '#8892a4', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Order Value
            </Typography>
            <Typography sx={{ fontSize: '18px', fontWeight: 600, color: '#0f1117', fontFamily: '"DM Mono", monospace', marginTop: '3px' }}>
              ₹{monthData.value} Cr
            </Typography>
            <Typography sx={{ fontSize: '11px', color: '#8892a4', marginTop: '2px' }}>
              Excl. GST
            </Typography>
          </Box>

          <Box sx={{ padding: '12px 14px', backgroundColor: '#f1f3f7', borderRadius: '8px' }}>
            <Typography sx={{ fontSize: '10px', color: '#8892a4', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Leads
            </Typography>
            <Typography sx={{ fontSize: '18px', fontWeight: 600, color: '#0f1117', fontFamily: '"DM Mono", monospace', marginTop: '3px' }}>
              {monthData.leads}
            </Typography>
            <Typography sx={{ fontSize: '11px', color: '#8892a4', marginTop: '2px' }}>
              New this month
            </Typography>
          </Box>

          <Box sx={{ padding: '12px 14px', backgroundColor: '#f1f3f7', borderRadius: '8px' }}>
            <Typography sx={{ fontSize: '10px', color: '#8892a4', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              BQs Submitted
            </Typography>
            <Typography sx={{ fontSize: '18px', fontWeight: 600, color: '#0f1117', fontFamily: '"DM Mono", monospace', marginTop: '3px' }}>
              {monthData.bqs}
            </Typography>
            <Typography sx={{ fontSize: '11px', color: '#8892a4', marginTop: '2px' }}>
              Budgetary quotations
            </Typography>
          </Box>

          <Box sx={{ padding: '12px 14px', backgroundColor: '#f1f3f7', borderRadius: '8px' }}>
            <Typography sx={{ fontSize: '10px', color: '#8892a4', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Won
            </Typography>
            <Typography sx={{ fontSize: '18px', fontWeight: 600, color: '#16a34a', fontFamily: '"DM Mono", monospace', marginTop: '3px' }}>
              {monthData.won}
            </Typography>
            <Typography sx={{ fontSize: '11px', color: '#8892a4', marginTop: '2px' }}>
              Leads won
            </Typography>
          </Box>

          <Box sx={{ padding: '12px 14px', backgroundColor: '#f1f3f7', borderRadius: '8px' }}>
            <Typography sx={{ fontSize: '10px', color: '#8892a4', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Lost
            </Typography>
            <Typography sx={{ fontSize: '18px', fontWeight: 600, color: '#dc2626', fontFamily: '"DM Mono", monospace', marginTop: '3px' }}>
              {monthData.lost}
            </Typography>
            <Typography sx={{ fontSize: '11px', color: '#8892a4', marginTop: '2px' }}>
              Leads lost
            </Typography>
          </Box>

          <Box sx={{ padding: '12px 14px', backgroundColor: '#f1f3f7', borderRadius: '8px' }}>
            <Typography sx={{ fontSize: '10px', color: '#8892a4', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Win Rate
            </Typography>
            <Typography sx={{ fontSize: '18px', fontWeight: 600, color: '#0f1117', fontFamily: '"DM Mono", monospace', marginTop: '3px' }}>
              {monthData.leads > 0 ? Math.round((monthData.won / monthData.leads) * 100) : 0}%
            </Typography>
            <Typography sx={{ fontSize: '11px', color: '#8892a4', marginTop: '2px' }}>
              This month
            </Typography>
          </Box>

          <Box sx={{ padding: '12px 14px', backgroundColor: '#f1f3f7', borderRadius: '8px' }}>
            <Typography sx={{ fontSize: '10px', color: '#8892a4', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Month
            </Typography>
            <Typography sx={{ fontSize: '18px', fontWeight: 600, color: '#0f1117', fontFamily: '"DM Mono", monospace', marginTop: '3px' }}>
              {mockData.MONTHS[selectedMonth]}
            </Typography>
            <Typography sx={{ fontSize: '11px', color: '#8892a4', marginTop: '2px' }}>
              FY 2025–26
            </Typography>
          </Box>
        </Box>
      </Paper>

      {/* Charts */}
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <ChartCard
            title="Monthly order value (Cr)"
            subtitle="This financial year — month by month"
          >
            <MonthlyValueChart data={mockData.monthData} selectedMonth={selectedMonth} />
          </ChartCard>
        </Grid>
        <Grid item xs={12} md={6}>
          <ChartCard
            title="Monthly leads vs BQs"
            subtitle="Comparison this financial year"
            legend={[
              { label: 'Leads', color: '#2563eb' },
              { label: 'BQs', color: '#7c3aed' },
            ]}
          >
            <LeadsVsBQsChart data={mockData.monthData} />
          </ChartCard>
        </Grid>
      </Grid>
    </Box>
  );
}
