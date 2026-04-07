// src/pages/Yearly/YearlyAnalysis.jsx
import { useState, useEffect } from 'react';
import {
  Box, Grid, Typography, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, CircularProgress, Alert, Chip,
} from '@mui/material';
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer, Cell,
} from 'recharts';
import PageShell        from '../../components/Layout/PageShell';
import KPICard          from '../../components/Common/KPICard';
import ChartCard        from '../../components/Common/ChartCard';
import { analyticsAPI } from '../../api';

export default function YearlyAnalysis() {
  const [data,    setData]    = useState([]);
  const [summary, setSummary] = useState({});
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState('');

  useEffect(() => {
    analyticsAPI.yearlyReport({})
      .then(res => { setData(res.data.data); setSummary(res.data.summary || {}); })
      .catch(() => setError('Failed to load yearly data.'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <PageShell title="Yearly Analysis">
      <Box sx={{ display:'flex', justifyContent:'center', alignItems:'center', height:400 }}>
        <CircularProgress size={32} />
      </Box>
    </PageShell>
  );

  if (error) return (
    <PageShell title="Yearly Analysis">
      <Alert severity="error">{error}</Alert>
    </PageShell>
  );

  // Chart data
  const BAR_OPACITY = ['0.25','0.4','0.55','0.75','1'];
  const yoyValData  = data.map((r, i) => ({ year:r.fy_label, value:parseFloat(r.order_value_cr), opacity:BAR_OPACITY[i] || '0.7' }));
  const yoyWRData   = data.map(r => ({ year:r.fy_label, wr:r.win_rate_pct }));

  // KPI values from summary
  const kpis = [
    { label:'Best Year (Orders)', value:summary.best_year_by_orders || '—', delta:'By order count', type:'neutral' },
    { label:'Best Year (Value)',  value:summary.best_year_by_value  || '—', delta:'By order value', type:'neutral' },
    { label:'5-yr CAGR',          value:summary.cagr_pct != null ? `${summary.cagr_pct}%` : '—', delta:'Order value growth', type:'up' },
    { label:'Total Value (Cr)',   value:`₹${parseFloat(summary.total_value_all_years||0).toFixed(0)}`, delta:'All years combined', type:'neutral' },
    { label:'Peak Win Rate',      value:summary.peak_win_rate != null ? `${summary.peak_win_rate}%` : '—', delta:'Best FY', type:'up' },
    { label:'Avg Orders/Year',    value:summary.avg_orders_per_year || 0, delta:`Over ${data.length} years`, type:'neutral' },
  ];

  // Growth chip style
  const growthStyle = (pct) => {
    if (pct == null) return { label:'Baseline', bg:'#fffbeb', color:'#d97706' };
    if (pct > 0)     return { label:`+${pct}%`,  bg:'#f0fdf4', color:'#16a34a' };
    return              { label:`${pct}%`,   bg:'#fef2f2', color:'#dc2626' };
  };

  return (
    <PageShell title="Yearly Analysis">
      <Box sx={{ display:'flex', flexDirection:'column', gap:2.5 }}>
        {/* KPIs */}
        <Grid container spacing={1.5}>
          {kpis.map((k, i) => (
            <Grid item xs={2} key={i}>
              <KPICard label={k.label} value={k.value} delta={k.delta} deltaType={k.type} />
            </Grid>
          ))}
        </Grid>

        {/* Charts */}
        <Grid container spacing={2}>
          <Grid item xs={7}>
            <ChartCard title="Year-on-year order value growth" subtitle="Value in Crores — all financial years"
              chip={summary.cagr_pct ? `CAGR ${summary.cagr_pct}%` : 'All years'} chipColor="green" height={260}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={yoyValData} margin={{top:0,right:8,bottom:0,left:-10}}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e4e8ef" />
                  <XAxis dataKey="year" tick={{fontSize:10,fill:'#8892a4'}} />
                  <YAxis tick={{fontSize:10,fill:'#8892a4'}} tickFormatter={v=>`₹${v}`} />
                  <Tooltip formatter={v=>[`₹${v} Cr`,'Order Value']} />
                  <Bar dataKey="value" radius={[5,5,0,0]}>
                    {yoyValData.map((d, i) => (
                      <Cell key={i} fill={`rgba(37,99,235,${d.opacity})`} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>
          </Grid>
          <Grid item xs={5}>
            <ChartCard title="Win rate trend" subtitle="Percentage of leads won per year" height={260}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={yoyWRData} margin={{top:0,right:8,bottom:0,left:-10}}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e4e8ef" />
                  <XAxis dataKey="year" tick={{fontSize:10,fill:'#8892a4'}} />
                  <YAxis domain={[0,60]} tick={{fontSize:10,fill:'#8892a4'}} tickFormatter={v=>`${v}%`} />
                  <Tooltip formatter={v=>[`${v}%`,'Win Rate']} />
                  <Line type="monotone" dataKey="wr" name="Win Rate" stroke="#16a34a" strokeWidth={2.5}
                    dot={{ fill:'#16a34a', r:5, strokeWidth:2, stroke:'#fff' }} />
                </LineChart>
              </ResponsiveContainer>
            </ChartCard>
          </Grid>
        </Grid>

        {/* Summary table */}
        <Box sx={{ backgroundColor:'#fff', border:'1px solid #e4e8ef', borderRadius:'14px', overflow:'hidden' }}>
          <Box sx={{ px:2.5, py:2, borderBottom:'1px solid #e4e8ef' }}>
            <Typography sx={{ fontSize:13, fontWeight:500 }}>Year-on-year summary table</Typography>
            <Typography sx={{ fontSize:11, color:'#8892a4', mt:0.3 }}>All key metrics by financial year</Typography>
          </Box>
          {data.length === 0 ? (
            <Box sx={{ p:3, textAlign:'center' }}>
              <Typography sx={{ color:'#8892a4', fontSize:13 }}>No data available. Start entering records to see yearly analytics.</Typography>
            </Box>
          ) : (
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    {['Financial Year','BQs','Leads','Orders','Order Value (Cr)','Win Rate','Lost Leads','Growth'].map(h=>(
                      <TableCell key={h}>{h}</TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {[...data].reverse().map((r, i) => {
                    const g = growthStyle(r.growth_pct);
                    return (
                      <TableRow key={i}>
                        <TableCell sx={{ fontFamily:'"DM Mono",monospace', fontWeight:500, color:'#0f1117' }}>{r.fy_label}</TableCell>
                        <TableCell sx={{ fontFamily:'"DM Mono",monospace' }}>{r.bqs}</TableCell>
                        <TableCell sx={{ fontFamily:'"DM Mono",monospace' }}>{r.leads}</TableCell>
                        <TableCell sx={{ fontFamily:'"DM Mono",monospace' }}>{r.orders}</TableCell>
                        <TableCell sx={{ fontFamily:'"DM Mono",monospace', fontWeight:500, color:'#0f1117' }}>₹{r.order_value_cr}</TableCell>
                        <TableCell sx={{ fontFamily:'"DM Mono",monospace' }}>{r.win_rate_pct}%</TableCell>
                        <TableCell sx={{ fontFamily:'"DM Mono",monospace' }}>{r.lost_leads}</TableCell>
                        <TableCell>
                          <Chip label={g.label} size="small"
                            sx={{ fontSize:10, height:20, backgroundColor:g.bg, color:g.color, fontFamily:'"DM Mono",monospace' }} />
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Box>
      </Box>
    </PageShell>
  );
}
