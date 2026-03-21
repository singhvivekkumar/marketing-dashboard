import React from 'react';
import { Box, Grid } from '@mui/material';
import KPIGrid from '../components/KPIGrid';
import ChartCard from '../components/ChartCard';
import {
  ConversionFunnelChart,
  ValueDistributionChart,
  QuarterlyChart,
  TenderTypeChart,
  OwnerPerformanceChart,
} from '../components/Charts';
import * as mockData from '../mockData';

const analysisKpis = [
  { label: 'Avg Deal Size (Cr)', value: '₹19.3', delta: '+₹2.1 vs last FY', deltaType: 'up' },
  { label: 'BQ Conversion', value: '48%', delta: '+4% vs last FY', deltaType: 'up' },
  { label: 'Pipeline Value (Cr)', value: '₹312', delta: 'Active leads', deltaType: 'neutral' },
  { label: 'Avg Lead Age (days)', value: 47, delta: '+6 vs last FY', deltaType: 'down' },
  { label: 'Export Leads', value: 18, delta: '+5 vs last FY', deltaType: 'up' },
  { label: 'Sole Bidding', value: '62%', delta: '+8% vs last FY', deltaType: 'up' },
];

export default function DashboardAnalysis() {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* KPIs */}
      <KPIGrid kpis={analysisKpis} />

      {/* Charts Grid 1 */}
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <ChartCard
            title="BQ conversion funnel"
            subtitle="BQs submitted → Leads → Orders won"
            chip={{ label: 'Funnel', type: 'blue' }}
          >
            <ConversionFunnelChart data={mockData.bqConversionFunnelData} />
          </ChartCard>
        </Grid>
        <Grid item xs={12} md={6}>
          <ChartCard
            title="Order value distribution"
            subtitle="By deal size band (Cr)"
            chip={{ label: 'Distribution', type: 'amber' }}
          >
            <ValueDistributionChart data={mockData.orderValueDistributionData} />
          </ChartCard>
        </Grid>
      </Grid>

      {/* Charts Grid 2 */}
      <Grid container spacing={2}>
        <Grid item xs={12} md={4}>
          <ChartCard
            title="Quarter-on-quarter orders"
            subtitle="Q1–Q4 current vs previous FY"
          >
            <QuarterlyChart data={mockData.quarterlyData} />
          </ChartCard>
        </Grid>
        <Grid item xs={12} md={4}>
          <ChartCard
            title="Tender type breakdown"
            subtitle="Open / Limited / Single Source etc."
          >
            <TenderTypeChart data={mockData.tenderTypeData} />
          </ChartCard>
        </Grid>
        <Grid item xs={12} md={4}>
          <ChartCard
            title="Lead owner performance"
            subtitle="Won value per team member (Cr)"
          >
            <OwnerPerformanceChart data={mockData.leadOwnerData} />
          </ChartCard>
        </Grid>
      </Grid>
    </Box>
  );
}
