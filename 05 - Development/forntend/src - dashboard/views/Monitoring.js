import React from 'react';
import { Box, Grid, Card, CardContent, Typography, Stack, Chip } from '@mui/material';
import ChartCard from '../components/ChartCard';
import { ActivityChart, ModuleUsageChart } from '../components/Charts';
import * as mockData from '../mockData';

export default function Monitoring() {
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
        Live system monitoring
      </Typography>

      {/* Monitoring Cards */}
      <Grid container spacing={1.5}>
        {/* System Status */}
        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={{
              border: '1px solid #e4e8ef',
              borderRadius: '14px',
              padding: '16px',
              backgroundColor: '#ffffff',
            }}
          >
            <CardContent sx={{ padding: 0 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                <Typography sx={{ fontSize: '11px', color: '#8892a4' }}>System Status</Typography>
                <Box
                  sx={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    backgroundColor: '#16a34a',
                    boxShadow: '0 0 0 3px rgba(22,163,74,0.2)',
                  }}
                />
              </Box>
              <Typography sx={{ fontSize: '26px', fontWeight: 600, fontFamily: '"DM Mono", monospace', color: '#16a34a' }}>
                Online
              </Typography>
              <Typography sx={{ fontSize: '11px', color: '#8892a4', marginTop: '2px' }}>
                All systems operational
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Active Users */}
        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={{
              border: '1px solid #e4e8ef',
              borderRadius: '14px',
              padding: '16px',
              backgroundColor: '#ffffff',
            }}
          >
            <CardContent sx={{ padding: 0 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                <Typography sx={{ fontSize: '11px', color: '#8892a4' }}>Active Users</Typography>
                <Chip
                  label="Live"
                  size="small"
                  sx={{
                    fontSize: '10px',
                    fontWeight: 500,
                    backgroundColor: '#eff4ff',
                    color: '#2563eb',
                    height: 'auto',
                    padding: '2px 6px',
                  }}
                />
              </Box>
              <Typography sx={{ fontSize: '26px', fontWeight: 600, fontFamily: '"DM Mono", monospace', color: '#0f1117' }}>
                7
              </Typography>
              <Typography sx={{ fontSize: '11px', color: '#8892a4', marginTop: '2px' }}>
                Marketing team online
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Records Today */}
        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={{
              border: '1px solid #e4e8ef',
              borderRadius: '14px',
              padding: '16px',
              backgroundColor: '#ffffff',
            }}
          >
            <CardContent sx={{ padding: 0 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                <Typography sx={{ fontSize: '11px', color: '#8892a4' }}>Records Today</Typography>
                <Chip
                  label="+12"
                  size="small"
                  sx={{
                    fontSize: '10px',
                    fontWeight: 500,
                    backgroundColor: '#f0fdf4',
                    color: '#16a34a',
                    height: 'auto',
                    padding: '2px 6px',
                  }}
                />
              </Box>
              <Typography sx={{ fontSize: '26px', fontWeight: 600, fontFamily: '"DM Mono", monospace', color: '#0f1117' }}>
                12
              </Typography>
              <Typography sx={{ fontSize: '11px', color: '#8892a4', marginTop: '2px' }}>
                New entries added today
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Docs Uploaded */}
        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={{
              border: '1px solid #e4e8ef',
              borderRadius: '14px',
              padding: '16px',
              backgroundColor: '#ffffff',
            }}
          >
            <CardContent sx={{ padding: 0 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                <Typography sx={{ fontSize: '11px', color: '#8892a4' }}>Docs Uploaded</Typography>
                <Chip
                  label="Today"
                  size="small"
                  sx={{
                    fontSize: '10px',
                    fontWeight: 500,
                    backgroundColor: '#fffbeb',
                    color: '#d97706',
                    height: 'auto',
                    padding: '2px 6px',
                  }}
                />
              </Box>
              <Typography sx={{ fontSize: '26px', fontWeight: 600, fontFamily: '"DM Mono", monospace', color: '#0f1117' }}>
                5
              </Typography>
              <Typography sx={{ fontSize: '11px', color: '#8892a4', marginTop: '2px' }}>
                PDF files stored
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Activity Charts */}
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <ChartCard
            title="Data entry activity — last 30 days"
            subtitle="Records added per day across all modules"
            legend={[
              { label: 'BQ', color: '#2563eb' },
              { label: 'Leads', color: '#0d9488' },
              { label: 'Orders', color: '#7c3aed' },
            ]}
          >
            <ActivityChart data={mockData.monthlyTrendData} />
          </ChartCard>
        </Grid>
        <Grid item xs={12} md={6}>
          <ChartCard
            title="Module usage breakdown"
            subtitle="Record count per module this month"
          >
            <ModuleUsageChart data={mockData.moduleUsageData} />
          </ChartCard>
        </Grid>
      </Grid>
    </Box>
  );
}
