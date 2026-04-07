// src/pages/Reports/MonthlyReports.jsx
import { useState, useEffect, useCallback } from 'react';
import { Box, Grid, Typography, CircularProgress, Alert } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import PageShell        from '../../components/Layout/PageShell';
import ChartCard        from '../../components/Common/ChartCard';
import { analyticsAPI } from '../../api';

// FY months in order: Apr(4)→Mar(3)
const FY_MONTHS = [
  {num:4,label:'Apr'},{num:5,label:'May'},{num:6,label:'Jun'},
  {num:7,label:'Jul'},{num:8,label:'Aug'},{num:9,label:'Sep'},
  {num:10,label:'Oct'},{num:11,label:'Nov'},{num:12,label:'Dec'},
  {num:1,label:'Jan'},{num:2,label:'Feb'},{num:3,label:'Mar'},
];

export default function MonthlyReports() {
  const currentMonth = new Date().getMonth() + 1; // 1-12
  const currentYear  = new Date().getFullYear();
  // Default to current month in the FY
  const defaultIdx = FY_MONTHS.findIndex(m => m.num === currentMonth);

  const [selIdx,      setSelIdx]      = useState(defaultIdx >= 0 ? defaultIdx : 9);
  const [monthData,   setMonthData]   = useState(Array(12).fill(null));
  const [chartValData,setChartValData]= useState([]);
  const [chartLBData, setChartLBData] = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [error,       setError]       = useState('');

  // Financial year: determine from current date
  const fyYear = currentMonth >= 4 ? currentYear + 1 : currentYear;

  const fetchAllMonths = useCallback(async () => {
    setLoading(true); setError('');
    try {
      // Fetch all 12 months in parallel
      const promises = FY_MONTHS.map(m => {
        const year = m.num >= 4 ? fyYear - 1 : fyYear;
        return analyticsAPI.monthlyReport({ year, month: m.num })
          .then(r => r.data.data)
          .catch(() => ({ orders:0, leads:0, bqs:0, won:0, lost:0, order_value:'0.00', win_rate:0 }));
      });
      const results = await Promise.all(promises);
      setMonthData(results);

      setChartValData(FY_MONTHS.map((m, i) => ({ month:m.label, value:parseFloat(results[i]?.order_value||0) })));
      setChartLBData(FY_MONTHS.map((m, i) => ({ month:m.label, leads:results[i]?.leads||0, bqs:results[i]?.bqs||0 })));
    } catch {
      setError('Failed to load monthly data.');
    } finally {
      setLoading(false);
    }
  }, [fyYear]);

  useEffect(() => { fetchAllMonths(); }, [fetchAllMonths]);

  const maxVal = Math.max(...monthData.map(m => parseFloat(m?.order_value||0)), 1);
  const d      = monthData[selIdx] || {};

  const detailItems = [
    { label:'Orders',        value:d.orders||0,                              sub:`Received in ${FY_MONTHS[selIdx].label}` },
    { label:'Order Value',   value:`₹${parseFloat(d.order_value||0).toFixed(2)} Cr`, sub:'Excl. GST' },
    { label:'Leads',         value:d.leads||0,                               sub:'New this month' },
    { label:'BQs Submitted', value:d.bqs||0,                                 sub:'Budgetary quotations' },
    { label:'Won',           value:d.won||0,                                 sub:'Leads won',    color:'#16a34a' },
    { label:'Lost',          value:d.lost||0,                                sub:'Leads lost',   color:'#dc2626' },
    { label:'Win Rate',      value:`${d.win_rate||0}%`,                      sub:'This month',   color:'#2563eb' },
    { label:'Month',         value:FY_MONTHS[selIdx].label,                  sub:`FY ${String(fyYear-1).slice(2)}-${String(fyYear).slice(2)}` },
  ];

  return (
    <PageShell title="Monthly Reports">
      <Box sx={{ display:'flex', flexDirection:'column', gap:2.5 }}>
        {error && <Alert severity="error" onClose={() => setError('')}>{error}</Alert>}

        {loading ? (
          <Box sx={{ display:'flex', justifyContent:'center', alignItems:'center', height:300 }}>
            <CircularProgress size={32} />
          </Box>
        ) : (
          <>
            {/* Month selector card */}
            <Box sx={{ backgroundColor:'#fff', border:'1px solid #e4e8ef', borderRadius:'14px', overflow:'hidden' }}>
              <Box sx={{ px:2.5, py:2, borderBottom:'1px solid #e4e8ef' }}>
                <Typography sx={{ fontSize:13, fontWeight:500 }}>
                  FY {fyYear-1}–{fyYear} monthly breakdown
                </Typography>
                <Typography sx={{ fontSize:11, color:'#8892a4', mt:0.3 }}>
                  Click any month to see detailed report
                </Typography>
              </Box>

              {/* Month grid */}
              <Box sx={{ display:'grid', gridTemplateColumns:'repeat(12, 1fr)', borderBottom:'1px solid #e4e8ef' }}>
                {FY_MONTHS.map((m, i) => {
                  const val = parseFloat(monthData[i]?.order_value || 0);
                  return (
                    <Box key={m.label} onClick={() => setSelIdx(i)}
                      sx={{ py:1.25, px:1, textAlign:'center', cursor:'pointer',
                        borderRight: i<11 ? '1px solid #e4e8ef' : 'none',
                        backgroundColor: i === selIdx ? '#eff4ff' : 'transparent',
                        '&:hover':{ backgroundColor: i===selIdx ? '#eff4ff' : '#f1f3f7' },
                        transition:'background .12s',
                      }}>
                      <Typography sx={{ fontSize:10, fontWeight:500, textTransform:'uppercase', letterSpacing:'0.04em', color:i===selIdx?'#2563eb':'#8892a4' }}>
                        {m.label}
                      </Typography>
                      <Typography sx={{ fontSize:13, fontWeight:600, fontFamily:'"DM Mono",monospace', mt:0.25 }}>
                        {monthData[i]?.orders || 0}
                      </Typography>
                      <Box sx={{ height:4, borderRadius:2, mt:0.75, mx:'auto',
                        width:`${Math.round((val/maxVal)*100)}%`,
                        backgroundColor: i===selIdx ? '#2563eb' : '#93c5fd',
                        minWidth:4 }} />
                    </Box>
                  );
                })}
              </Box>

              {/* Month detail */}
              <Box sx={{ p:2.5, display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:2 }}>
                {detailItems.map((item, i) => (
                  <Box key={i} sx={{ p:'12px 14px', backgroundColor:'#f1f3f7', borderRadius:'8px' }}>
                    <Typography sx={{ fontSize:10, fontWeight:500, textTransform:'uppercase', letterSpacing:'0.06em', color:'#8892a4' }}>
                      {item.label}
                    </Typography>
                    <Typography sx={{ fontSize:18, fontWeight:600, fontFamily:'"DM Mono",monospace', mt:0.375, color:item.color||'#0f1117' }}>
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
                  legend={[{color:'#2563eb',label:'Leads'},{color:'#7c3aed',label:'BQs'}]} height={240}>
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
          </>
        )}
      </Box>
    </PageShell>
  );
}
