// frontend/src/pages/TenderLifecycle/LifecycleDashboard.js
import { useState, useEffect } from 'react';
import { Box, Grid, Typography, Chip, CircularProgress, Alert } from '@mui/material';
import {
  BarChart, Bar, FunnelChart, Funnel, LabelList,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, Cell, PieChart, Pie,
} from 'recharts';
import { useNavigate } from 'react-router-dom';
import PageShell from '../../components/Layout/PageShell';
import ChartCard from '../../components/Common/ChartCard';
import KPICard from '../../components/Common/KPICard';
import { lifecycleAPI } from '../../api/lifecycle.api';

const HEALTH_COLORS = { Green: '#16a34a', Amber: '#d97706', Red: '#dc2626' };
const STAGE_COLORS_CHART = [
  '#dbeafe', '#bfdbfe', '#93c5fd', '#60a5fa', '#3b82f6', '#2563eb', '#1d4ed8', '#1e3a8a',
];

const CustomFunnelTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <Box sx={{ bgcolor: '#fff', border: '1px solid #e4e8ef', borderRadius: 1.5, p: 1.25 }}>
      <Typography sx={{ fontSize: 12, fontWeight: 500 }}>{d.stage}</Typography>
      <Typography sx={{ fontSize: 11, color: '#525868' }}>{d.total} tender(s)</Typography>
      <Typography sx={{ fontSize: 11, color: '#2563eb' }}>₹{parseFloat(d.total_value_cr || 0).toFixed(1)} Cr</Typography>
    </Box>
  );
};

export default function LifecycleDashboard() {
  const navigate = useNavigate();
  const [summary, setSummary] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([lifecycleAPI.dashboardSummary(), lifecycleAPI.analytics({})])
      .then(([s, a]) => { setSummary(s.data.data); setAnalytics(a.data.data); })
      .catch(() => setError('Failed to load lifecycle analytics.'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <PageShell title="Lifecycle Analytics"><Box sx={{ display: 'flex', justifyContent: 'center', pt: 8 }}><CircularProgress size={32} /></Box></PageShell>;
  if (error) return <PageShell title="Lifecycle Analytics"><Alert severity="error">{error}</Alert></PageShell>;

  const pipeline = summary?.pipeline || {};
  const stageCounts = summary?.stage_counts || [];
  const healthCounts = summary?.health_counts || [];
  const overdue = summary?.overdue_tenders || [];
  const topPriority = summary?.top_priority || [];
  const activity = summary?.recent_activity || [];
  const stageFunnel = analytics?.stageFunnel || [];
  const timeInStage = analytics?.timeInStage || [];
  const lossReasons = analytics?.outcomeReasons || [];
  const compWins = analytics?.competitorWins || [];

  const greenCount = healthCounts.find(h => h.health_status === 'Green')?.count || 0;
  const amberCount = healthCounts.find(h => h.health_status === 'Amber')?.count || 0;
  const redCount = healthCounts.find(h => h.health_status === 'Red')?.count || 0;

  return (
    <PageShell title="Lifecycle Analytics">
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>

        {/* KPI Row */}
        <Grid container spacing={1.5}>
          {[
            { label: 'Active Tenders', value: stageCounts.reduce((s, r) => s + parseInt(r.count), 0), delta: 'In progress', type: 'neutral' },
            { label: 'Pipeline Value (Cr)', value: `₹${parseFloat(pipeline.total_pipeline_cr || 0).toFixed(1)}`, delta: 'Estimated', type: 'neutral' },
            { label: 'Weighted Pipeline', value: `₹${parseFloat(pipeline.weighted_pipeline_cr || 0).toFixed(1)}`, delta: 'By win probability', type: 'neutral' },
            { label: 'Overdue Tenders', value: overdue.length, delta: 'Action needed', type: overdue.length > 0 ? 'down' : 'neutral' },
            { label: 'Health: Green', value: greenCount, delta: 'On track', type: 'up' },
            { label: 'Health: Red', value: redCount, delta: 'At risk', type: redCount > 0 ? 'down' : 'neutral' },
          ].map((k, i) => (
            <Grid item xs={2} key={i}><KPICard label={k.label} value={k.value} delta={k.delta} deltaType={k.type} /></Grid>
          ))}
        </Grid>

        {/* Stage funnel + Time in stage */}
        <Grid container spacing={2}>
          <Grid item xs={7}>
            <ChartCard title="Active tender pipeline by stage" subtitle="Count and value at each stage" chip="Funnel" chipColor="blue"
              legend={[{ color: '#16a34a', label: 'Green' }, { color: '#d97706', label: 'Amber' }, { color: '#dc2626', label: 'Red' }]}
              height={260}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stageFunnel} margin={{ top: 0, right: 8, bottom: 0, left: -10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e4e8ef" />
                  <XAxis dataKey="stage" tick={{ fontSize: 9, fill: '#8892a4' }} angle={-20} textAnchor="end" height={40} />
                  <YAxis tick={{ fontSize: 10, fill: '#8892a4' }} />
                  <Tooltip content={<CustomFunnelTooltip />} />
                  <Bar dataKey="green" name="Green" stackId="a" fill="#16a34a" radius={[0, 0, 0, 0]} />
                  <Bar dataKey="amber" name="Amber" stackId="a" fill="#d97706" />
                  <Bar dataKey="red" name="Red" stackId="a" fill="#dc2626" radius={[3, 3, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>
          </Grid>
          <Grid item xs={5}>
            <ChartCard title="Average time per stage (days)" subtitle="How long tenders spend at each stage" height={260}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={timeInStage} layout="vertical" margin={{ top: 0, right: 40, bottom: 0, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e4e8ef" horizontal={false} />
                  <XAxis type="number" tick={{ fontSize: 10, fill: '#8892a4' }} tickFormatter={v => `${v}d`} />
                  <YAxis type="category" dataKey="stage" tick={{ fontSize: 9, fill: '#8892a4' }} width={88} />
                  <Tooltip formatter={v => [`${Math.round(v)} days`, 'Avg time']} />
                  <Bar dataKey="avg_days" fill="rgba(37,99,235,0.2)" stroke="#2563eb" strokeWidth={1.5} radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>
          </Grid>
        </Grid>

        {/* Loss reasons + Competitor wins */}
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <ChartCard title="Loss reason analysis" subtitle="Why tenders are being lost"
              legend={[{ color: '#dc2626', label: 'Loss reason distribution' }]} height={220}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={lossReasons} layout="vertical" margin={{ top: 0, right: 40, bottom: 0, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e4e8ef" horizontal={false} />
                  <XAxis type="number" tick={{ fontSize: 10, fill: '#8892a4' }} />
                  <YAxis type="category" dataKey="reason" tick={{ fontSize: 9, fill: '#8892a4' }} width={110} />
                  <Tooltip />
                  <Bar dataKey="count" fill="rgba(220,38,38,0.15)" stroke="#dc2626" strokeWidth={1.5} radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>
          </Grid>
          <Grid item xs={6}>
            <ChartCard title="Top competitor wins" subtitle="Who beats us most often"
              height={220}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={compWins.slice(0, 8)} layout="vertical" margin={{ top: 0, right: 40, bottom: 0, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e4e8ef" horizontal={false} />
                  <XAxis type="number" tick={{ fontSize: 10, fill: '#8892a4' }} />
                  <YAxis type="category" dataKey="competitor_name" tick={{ fontSize: 9, fill: '#8892a4' }} width={90} />
                  <Tooltip formatter={(v, n) => [v, n === 'wins' ? 'Wins' : 'Appearances']} />
                  <Bar dataKey="wins" name="wins" fill="rgba(220,38,38,0.15)" stroke="#dc2626" strokeWidth={1.5} radius={[0, 0, 0, 0]} />
                  <Bar dataKey="appearances" name="appearances" fill="rgba(37,99,235,0.1)" stroke="#2563eb" strokeWidth={1} radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>
          </Grid>
        </Grid>

        {/* Overdue tenders + Recent activity */}
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Box sx={{ backgroundColor: '#fff', border: '1px solid #e4e8ef', borderRadius: '14px', overflow: 'hidden' }}>
              <Box sx={{ px: 2.5, py: 2, borderBottom: '1px solid #e4e8ef' }}>
                <Typography sx={{ fontSize: 13, fontWeight: 500 }}>Overdue tenders</Typography>
                <Typography sx={{ fontSize: 11, color: '#8892a4', mt: 0.3 }}>Require immediate action</Typography>
              </Box>
              {overdue.length === 0 ? (
                <Box sx={{ p: 3, textAlign: 'center' }}><Typography sx={{ color: '#16a34a', fontSize: 13 }}>No overdue tenders!</Typography></Box>
              ) : overdue.map((t, i) => (
                <Box key={i} onClick={() => navigate(`/lifecycle/${t.id}`)}
                  sx={{
                    px: 2.5, py: 1.5, borderBottom: '1px solid #f1f3f7', cursor: 'pointer',
                    '&:hover': { backgroundColor: '#f7f8fa' }, display: 'flex', alignItems: 'center', gap: 2
                  }}>
                  <Box sx={{ flex: 1 }}>
                    <Typography sx={{ fontSize: 12, fontWeight: 500 }}>{t.tender_name}</Typography>
                    <Typography sx={{ fontSize: 11, color: '#8892a4' }}>{t.customer_name} · {t.current_stage}</Typography>
                  </Box>
                  <Box sx={{ textAlign: 'right', flexShrink: 0 }}>
                    <Typography sx={{ fontSize: 11, fontFamily: '"DM Mono",monospace', color: '#dc2626' }}>
                      {t.days_in_current_stage} days overdue
                    </Typography>
                    <Chip label={t.priority} size="small" sx={{
                      fontSize: 9, height: 16,
                      backgroundColor: ({ Critical: '#fef2f2', High: '#fff7ed' })[t.priority] || '#f1f3f7',
                      color: ({ Critical: '#dc2626', High: '#c2410c' })[t.priority] || '#525868'
                    }} />
                  </Box>
                </Box>
              ))}
            </Box>
          </Grid>
          <Grid item xs={6}>
            <Box sx={{ backgroundColor: '#fff', border: '1px solid #e4e8ef', borderRadius: '14px', overflow: 'hidden' }}>
              <Box sx={{ px: 2.5, py: 2, borderBottom: '1px solid #e4e8ef' }}>
                <Typography sx={{ fontSize: 13, fontWeight: 500 }}>Recent stage activity</Typography>
                <Typography sx={{ fontSize: 11, color: '#8892a4', mt: 0.3 }}>Latest lifecycle transitions</Typography>
              </Box>
              {activity.map((a, i) => (
                <Box key={i} onClick={() => navigate(`/lifecycle/${a.lifecycle_id}`)}
                  sx={{
                    px: 2.5, py: 1.25, borderBottom: '1px solid #f1f3f7', cursor: 'pointer',
                    '&:hover': { backgroundColor: '#f7f8fa' }, display: 'flex', gap: 1.5, alignItems: 'center'
                  }}>
                  <Box sx={{
                    width: 8, height: 8, borderRadius: '50%', flexShrink: 0,
                    backgroundColor: '#2563eb'
                  }} />
                  <Box sx={{ flex: 1 }}>
                    <Typography sx={{ fontSize: 12 }}>
                      <Typography component="span" sx={{ fontWeight: 500 }}>{a.tender_name}</Typography>
                      {a.from_stage ? ` moved from ${a.from_stage} → ` : ' started at '}
                      <Typography component="span" sx={{ fontWeight: 500, color: '#2563eb' }}>{a.to_stage}</Typography>
                    </Typography>
                    <Typography sx={{ fontSize: 10, color: '#8892a4' }}>
                      {a.actor || 'System'} · {new Date(a.transitioned_at).toLocaleDateString('en-IN')}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Box>
          </Grid>
        </Grid>
      </Box>
    </PageShell>
  );
}
