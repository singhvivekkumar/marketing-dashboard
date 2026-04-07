// src/pages/Dashboard/Dashboard.jsx
import { useState } from 'react';
import { Box, Tabs, Tab, Select, MenuItem, FormControl } from '@mui/material';
import PageShell from '../../components/Layout/PageShell';
import OverviewTab  from './tabs/OverviewTab';
import AnalysisTab  from './tabs/AnalysisTab';
import PipelineTab  from './tabs/PipelineTab';

const FY_OPTIONS = [
  { value: '2026', label: 'FY 2025–26' },
  { value: '2025', label: 'FY 2024–25' },
  { value: '2024', label: 'FY 2023–24' },
  { value: '2023', label: 'FY 2022–23' },
  { value: '2022', label: 'FY 2021–22' },
];

const FY_DATA = {
  '2026': { queue: 42, orders: 128, value: '₹247', bq: 67, wr: '34%', lost: 38 },
  '2025': { queue: 35, orders: 105, value: '₹208', bq: 58, wr: '31%', lost: 33 },
  '2024': { queue: 28, orders:  92, value: '₹182', bq: 52, wr: '38%', lost: 28 },
  '2023': { queue: 22, orders:  82, value: '₹162', bq: 45, wr: '29%', lost: 31 },
  '2022': { queue: 18, orders:  75, value: '₹148', bq: 38, wr: '27%', lost: 26 },
};

export default function Dashboard() {
  const [tab, setTab] = useState(0);
  const [fy,  setFy]  = useState('2026');

  const kpi = FY_DATA[fy];

  const topBarActions = (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flex: 1, justifyContent: 'flex-end' }}>
      {/* Tab switcher */}
      <Tabs
        value={tab}
        onChange={(_, v) => setTab(v)}
        sx={{
          minHeight: 36,
          backgroundColor: '#f1f3f7',
          borderRadius: 2,
          p: '3px',
          '& .MuiTabs-indicator': {
            height: '100%', borderRadius: '6px',
            backgroundColor: '#ffffff',
            boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
            zIndex: 0,
          },
          '& .MuiTab-root': {
            minHeight: 30, py: 0, px: 1.75,
            fontSize: 12.5, fontWeight: 400,
            color: '#525868', zIndex: 1,
            '&.Mui-selected': { fontWeight: 500, color: '#0f1117' },
          },
        }}
      >
        <Tab label="Overview"  disableRipple />
        <Tab label="Analysis"  disableRipple />
        <Tab label="Pipeline"  disableRipple />
      </Tabs>

      {/* FY selector */}
      <FormControl size="small">
        <Select
          value={fy}
          onChange={e => setFy(e.target.value)}
          sx={{
            fontSize: 12.5, borderRadius: 1.75,
            '& .MuiOutlinedInput-notchedOutline': { borderColor: '#e4e8ef' },
            height: 34,
          }}
        >
          {FY_OPTIONS.map(o => (
            <MenuItem key={o.value} value={o.value} sx={{ fontSize: 12.5 }}>{o.label}</MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );

  return (
    <PageShell title="Analytics Dashboard" actions={topBarActions}>
      {tab === 0 && <OverviewTab  kpi={kpi} fy={fy} />}
      {tab === 1 && <AnalysisTab  fy={fy} />}
      {tab === 2 && <PipelineTab  fy={fy} />}
    </PageShell>
  );
}
