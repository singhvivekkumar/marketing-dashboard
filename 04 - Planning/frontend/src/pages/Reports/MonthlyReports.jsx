// src/pages/Reports/MonthlyReports.jsx
import { useState } from 'react';
import { Box, Grid, Typography, Paper } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer } from 'recharts';
import PageShell from '../../components/Layout/PageShell';
import ChartCard from '../../components/Common/ChartCard';

const MONTHS = ['Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec','Jan','Feb','Mar'];

const monthData = [
  {orders:8, leads:9, bqs:5, value:18.2, won:3, lost:2},
  {orders:6, leads:7, bqs:4, value:14.5, won:2, lost:2},
  {orders:10,leads:11,bqs:6, value:22.8, won:4, lost:3},
  {orders:9, leads:10,bqs:5, value:19.4, won:3, lost:2},
  {orders:12,leads:13,bqs:7, value:28.1, won:5, lost:3},
  {orders:8, leads:9, bqs:5, value:16.9, won:3, lost:2},
  {orders:11,leads:12,bqs:6, value:24.3, won:4, lost:3},
  {orders:13,leads:14,bqs:8, value:30.2, won:5, lost:4},
  {orders:9, leads:10,bqs:5, value:18.7, won:3, lost:2},
  {orders:14,leads:15,bqs:8, value:32.5, won:6, lost:4},
  {orders:10,leads:11,bqs:6, value:21.4, won:4, lost:3},
  {orders:18,leads:1, bqs:8, value:0,    won:0, lost:0},
];

const maxVal = Math.max(...monthData.map(m => m.value));

const chartValData = MONTHS.map((m,i) => ({ month:m, value: monthData[i].value }));
const chartLBData  = MONTHS.map((m,i) => ({ month:m, leads: monthData[i].leads, bqs: monthData[i].bqs }));

export default function MonthlyReports() {
  const [selMonth, setSelMonth] = useState(9);
  const d = monthData[selMonth];

  const detailItems = [
    { label:'Orders',       value: d.orders,      sub: `Received in ${MONTHS[selMonth]}` },
    { label:'Order Value',  value: `₹${d.value} Cr`, sub: 'Excl. GST' },
    { label:'Leads',        value: d.leads,       sub: 'New this month' },
    { label:'BQs Submitted',value: d.bqs,         sub: 'Budgetary quotations' },
    { label:'Won',          value: d.won,         sub: 'Leads won', color:'#16a34a' },
    { label:'Lost',         value: d.lost,        sub: 'Leads lost', color:'#dc2626' },
    { label:'Win Rate',     value: d.leads > 0 ? `${Math.round(d.won/d.leads*100)}%` : '0%', sub:'This month', color:'#2563eb' },
    { label:'Month',        value: MONTHS[selMonth], sub:'FY 2025–26' },
  ];

  return (
    <PageShell title="Monthly Reports">
      <Box sx={{ display:'flex', flexDirection:'column', gap:2.5 }}>
        {/* Month selector card */}
        <Box sx={{ backgroundColor:'#fff', border:'1px solid #e4e8ef', borderRadius:'14px', overflow:'hidden' }}>
          <Box sx={{ px:2.5, py:2, borderBottom:'1px solid #e4e8ef', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
            <Box>
              <Typography sx={{ fontSize:13, fontWeight:500 }}>FY 2025–26 monthly breakdown</Typography>
              <Typography sx={{ fontSize:11, color:'#8892a4', mt:0.3 }}>Click any month to see detailed report</Typography>
            </Box>
          </Box>

          {/* Month grid */}
          <Box sx={{ display:'grid', gridTemplateColumns:'repeat(12, 1fr)', borderBottom:'1px solid #e4e8ef' }}>
            {MONTHS.map((m, i) => (
              <Box
                key={m}
                onClick={() => setSelMonth(i)}
                sx={{
                  py:1.25, px:1, textAlign:'center', cursor:'pointer',
                  borderRight: i<11 ? '1px solid #e4e8ef' : 'none',
                  backgroundColor: i === selMonth ? '#eff4ff' : 'transparent',
                  '&:hover': { backgroundColor: i === selMonth ? '#eff4ff' : '#f1f3f7' },
                  transition:'background .12s',
                }}
              >
                <Typography sx={{ fontSize:10, fontWeight:500, textTransform:'uppercase', letterSpacing:'0.04em', color: i===selMonth ? '#2563eb' : '#8892a4' }}>
                  {m}
                </Typography>
                <Typography sx={{ fontSize:13, fontWeight:600, fontFamily:'"DM Mono",monospace', mt:0.25 }}>
                  {monthData[i].orders}
                </Typography>
                <Box sx={{
                  height:4, borderRadius:2, mt:0.75, mx:'auto',
                  width: `${Math.round(monthData[i].value / maxVal * 100)}%`,
                  backgroundColor: i===selMonth ? '#2563eb' : '#93c5fd',
                  minWidth:4,
                }} />
              </Box>
            ))}
          </Box>

          {/* Month detail */}
          <Box sx={{ p:2.5, display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:2 }}>
            {detailItems.map((item, i) => (
              <Box key={i} sx={{ p:'12px 14px', backgroundColor:'#f1f3f7', borderRadius:'8px' }}>
                <Typography sx={{ fontSize:10, fontWeight:500, textTransform:'uppercase', letterSpacing:'0.06em', color:'#8892a4' }}>
                  {item.label}
                </Typography>
                <Typography sx={{ fontSize:18, fontWeight:600, fontFamily:'"DM Mono",monospace', mt:0.375, color: item.color || '#0f1117' }}>
                  {item.value}
                </Typography>
                <Typography sx={{ fontSize:11, color:'#8892a4', mt:0.25 }}>{item.sub}</Typography>
              </Box>
            ))}
          </Box>
        </Box>

        {/* Charts */}
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <ChartCard title="Monthly order value (Cr)" subtitle="This financial year — month by month" height={240}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartValData} margin={{top:0,right:8,bottom:0,left:-10}}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e4e8ef" />
                  <XAxis dataKey="month" tick={{fontSize:10,fill:'#8892a4'}} />
                  <YAxis tick={{fontSize:10,fill:'#8892a4'}} tickFormatter={v=>`₹${v}`} />
                  <Tooltip formatter={v=>[`₹${v} Cr`,'Order Value']} />
                  <Bar dataKey="value" fill="#2563eb" radius={[4,4,0,0]}
                    label={{position:'top',fontSize:9,fill:'#8892a4',formatter:v=>v>0?`₹${v}`:''}} />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>
          </Grid>
          <Grid item xs={6}>
            <ChartCard title="Monthly leads vs BQs" subtitle="Comparison this financial year"
              legend={[{color:'#2563eb',label:'Leads'},{color:'#7c3aed',label:'BQs'}]}
              height={240}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartLBData} margin={{top:0,right:8,bottom:0,left:-20}}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e4e8ef" />
                  <XAxis dataKey="month" tick={{fontSize:10,fill:'#8892a4'}} />
                  <YAxis tick={{fontSize:10,fill:'#8892a4'}} />
                  <Tooltip />
                  <Bar dataKey="leads" name="Leads" fill="#2563eb" radius={[3,3,0,0]} />
                  <Bar dataKey="bqs"   name="BQs"   fill="#7c3aed" radius={[3,3,0,0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>
          </Grid>
        </Grid>
      </Box>
    </PageShell>
  );
}
