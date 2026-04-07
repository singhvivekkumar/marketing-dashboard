// src/pages/Monitoring/Monitoring.jsx
import { Box, Grid, Typography } from '@mui/material';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell,
} from 'recharts';
import PageShell from '../../components/Layout/PageShell';
import ChartCard from '../../components/Common/ChartCard';

// Generate last-30-days labels
const last30 = Array.from({ length: 30 }, (_, i) => {
  const d = new Date();
  d.setDate(d.getDate() - 29 + i);
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' });
});

const activityData = last30.map(day => ({
  day,
  BQ:     Math.floor(Math.random() * 4),
  Leads:  Math.floor(Math.random() * 6) + 1,
  Orders: Math.floor(Math.random() * 3),
}));

const moduleData = [
  { name: 'Lead Mgmt', value: 48, color: '#2563eb' },
  { name: 'Orders',    value: 28, color: '#0d9488' },
  { name: 'BQ',        value: 18, color: '#7c3aed' },
  { name: 'R&D',       value: 6,  color: '#d97706' },
];

function MonitorCard({ label, value, valueColor, sub, badge, badgeColor }) {
  const bColors = {
    blue:   { bg: '#eff4ff', color: '#2563eb' },
    green:  { bg: '#f0fdf4', color: '#16a34a' },
    amber:  { bg: '#fffbeb', color: '#d97706' },
  };
  const bc = bColors[badgeColor] || bColors.blue;

  return (
    <Box sx={{ backgroundColor: '#fff', border: '1px solid #e4e8ef', borderRadius: '14px', p: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
        <Typography sx={{ fontSize: 11, color: '#8892a4', fontWeight: 500 }}>{label}</Typography>
        {badge && (
          <Box sx={{ fontSize: 10, fontWeight: 500, px: 0.875, py: 0.25, borderRadius: '4px', fontFamily: '"DM Mono",monospace', ...bc }}>
            {badge}
          </Box>
        )}
      </Box>
      <Typography sx={{ fontSize: 26, fontWeight: 600, fontFamily: '"DM Mono",monospace', letterSpacing: '-0.5px', color: valueColor || '#0f1117' }}>
        {value}
      </Typography>
      <Typography sx={{ fontSize: 11, color: '#8892a4', mt: 0.25 }}>{sub}</Typography>
    </Box>
  );
}

export default function Monitoring() {
  return (
    <PageShell title="System Monitoring">
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
        <Typography sx={{ fontSize: 12, fontWeight: 500, color: '#8892a4', textTransform: 'uppercase', letterSpacing: '0.08em', pb: 0.5, borderBottom: '2px solid #e4e8ef' }}>
          Live system monitoring
        </Typography>

        {/* Monitor cards */}
        <Grid container spacing={1.5}>
          <Grid item xs={3}>
            <MonitorCard label="System Status" value="Online" valueColor="#16a34a" sub="All systems operational" badge="Live" badgeColor="green" />
          </Grid>
          <Grid item xs={3}>
            <MonitorCard label="Active Users" value="7" sub="Marketing team online" badge="Live" badgeColor="blue" />
          </Grid>
          <Grid item xs={3}>
            <MonitorCard label="Records Today" value="12" sub="New entries added today" badge="+12" badgeColor="green" />
          </Grid>
          <Grid item xs={3}>
            <MonitorCard label="Docs Uploaded" value="5" sub="PDF files stored today" badge="Today" badgeColor="amber" />
          </Grid>
        </Grid>

        {/* Activity charts */}
        <Grid container spacing={2}>
          <Grid item xs={8}>
            <ChartCard
              title="Data entry activity — last 30 days"
              subtitle="Records added per day across all modules"
              legend={[
                { color: '#2563eb', label: 'BQ' },
                { color: '#0d9488', label: 'Leads' },
                { color: '#7c3aed', label: 'Orders' },
              ]}
              height={240}
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={activityData} margin={{ top: 0, right: 8, bottom: 0, left: -20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e4e8ef" />
                  <XAxis
                    dataKey="day"
                    tick={{ fontSize: 9, fill: '#8892a4' }}
                    interval={4}
                    angle={-35}
                    textAnchor="end"
                    height={36}
                  />
                  <YAxis tick={{ fontSize: 10, fill: '#8892a4' }} />
                  <Tooltip />
                  <Bar dataKey="BQ"     stackId="a" fill="rgba(37,99,235,0.75)"  />
                  <Bar dataKey="Leads"  stackId="a" fill="rgba(13,148,136,0.75)" />
                  <Bar dataKey="Orders" stackId="a" fill="rgba(124,58,237,0.75)" radius={[2, 2, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>
          </Grid>
          <Grid item xs={4}>
            <ChartCard
              title="Module usage breakdown"
              subtitle="Record count per module this month"
              legend={moduleData.map(d => ({ color: d.color, label: `${d.name} ${d.value}%` }))}
              height={240}
            >
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={moduleData}
                    cx="50%" cy="50%"
                    innerRadius={52} outerRadius={82}
                    dataKey="value"
                    paddingAngle={2}
                  >
                    {moduleData.map((d, i) => <Cell key={i} fill={d.color} />)}
                  </Pie>
                  <Tooltip formatter={(v, n) => [`${v}%`, n]} />
                </PieChart>
              </ResponsiveContainer>
            </ChartCard>
          </Grid>
        </Grid>
      </Box>
    </PageShell>
  );
}
