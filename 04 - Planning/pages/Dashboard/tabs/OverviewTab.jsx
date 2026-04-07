// src/pages/Dashboard/tabs/OverviewTab.jsx
import { useState, useEffect, useCallback } from 'react';
import {
  Box, Grid, Typography, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, CircularProgress, Alert,
} from '@mui/material';
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ComposedChart,
} from 'recharts';
import KPICard   from '../../../components/Common/KPICard';
import ChartCard from '../../../components/Common/ChartCard';
import { StatusChip } from '../../../components/Common/Modals';
import { analyticsAPI } from '../../../api';

const OUTCOME_COLORS = { Won:'#16a34a', Lost:'#dc2626', Participated:'#2563eb', 'Not-Participated':'#d97706' };
const SUBTYPE_COLORS = { Submitted:'#2563eb', Domestic:'#0d9488', Export:'#7c3aed', CRM:'#d97706', Lost:'#dc2626' };

const DualTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <Box sx={{ bgcolor:'#fff', border:'1px solid #e4e8ef', borderRadius:1.5, p:1.25 }}>
      <Typography sx={{ fontSize:11, fontWeight:500, mb:0.5 }}>{label}</Typography>
      {payload.map((p, i) => (
        <Typography key={i} sx={{ fontSize:11, color:p.color }}>
          {p.name}: {p.name === 'Value (Cr)' ? `₹${p.value} Cr` : p.value}
        </Typography>
      ))}
    </Box>
  );
};

export default function OverviewTab({ kpi, fy }) {
  const [loading,      setLoading]      = useState(true);
  const [error,        setError]        = useState('');
  const [data5yr,      setData5yr]      = useState([]);
  const [outcomeData,  setOutcomeData]  = useState([]);
  const [trendData,    setTrendData]    = useState([]);
  const [civDefData,   setCivDefData]   = useState([]);
  const [subtypesData, setSubtypesData] = useState([]);
  const [domainData,   setDomainData]   = useState([]);
  const [top10Data,    setTop10Data]    = useState([]);
  const [lostLeads,    setLostLeads]    = useState([]);

  const fetchAll = useCallback(async () => {
    setLoading(true); setError('');
    const params = fy ? { financial_year: fy } : {};
    try {
      const [r5yr, rOut, rTrend, rCiv, rSub, rDom, rTop, rLost] = await Promise.all([
        analyticsAPI.orders5year({}),
        analyticsAPI.leadOutcomes(params),
        analyticsAPI.orderMonthly(params),
        analyticsAPI.civilDefence(params),
        analyticsAPI.leadSubtypes(params),
        analyticsAPI.winLossDomain(params),
        analyticsAPI.topCustomers({}),
        analyticsAPI.lostLeads({ ...params, limit:10 }),
      ]);

      setData5yr(r5yr.data.data.map(d => ({ year:d.label, orders:d.order_count, value:parseFloat(d.total_value_cr) })));
      setOutcomeData(rOut.data.data.map(d => ({ name:d.outcome, value:d.count, color:OUTCOME_COLORS[d.outcome]||'#8892a4' })));
      setTrendData(rTrend.data.data.map(d => ({ month:d.month, 'FY 25-26':d.current_fy, 'FY 24-25':d.prev_fy })));
      const cv = rCiv.data.data;
      setCivDefData([
        { name:'Leads', Civil:cv.leads.find(l=>l.name==='Civil')?.count||0,       Defence:cv.leads.find(l=>l.name==='Defence')?.count||0 },
        { name:'BQs',   Civil:cv.bqs.find(l=>l.name==='Non-Defence')?.count||0,   Defence:cv.bqs.find(l=>l.name==='Defence')?.count||0 },
      ]);
      setSubtypesData(rSub.data.data.map(d => ({ name:d.subtype, value:d.count, color:SUBTYPE_COLORS[d.subtype]||'#8892a4' })));
      setDomainData(rDom.data.data.map(d => ({ domain:d.domain, Won:d.won, Lost:d.lost })));
      setTop10Data(rTop.data.data.map(d => ({ name:d.customer_name, value:parseFloat(d.total_value_cr) })));
      setLostLeads(rLost.data.data);
    } catch (err) {
      setError('Failed to load dashboard data. Please refresh.');
    } finally {
      setLoading(false);
    }
  }, [fy]);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  if (loading) return <Box sx={{ display:'flex', justifyContent:'center', alignItems:'center', height:400 }}><CircularProgress size={32} /></Box>;
  if (error)   return <Alert severity="error" onClose={() => setError('')}>{error}</Alert>;

  return (
    <Box sx={{ display:'flex', flexDirection:'column', gap:2.5 }}>
      {/* KPIs */}
      <Grid container spacing={1.5}>
        {[
          { label:'Leads in Queue',   value:kpi.leads_in_queue,                       delta:'Open leads',   type:'neutral' },
          { label:'Total Orders',     value:kpi.total_orders,                          delta:'All time',     type:'neutral' },
          { label:'Order Value (Cr)', value:`₹${kpi.total_order_value_excl_gst}`,      delta:'Excl. GST',    type:'neutral' },
          { label:'BQs Submitted',    value:kpi.total_bqs,                             delta:'All time',     type:'neutral' },
          { label:'Win Rate',         value:`${kpi.win_rate_pct}%`,                    delta:'All leads',    type:kpi.win_rate_pct>=30?'up':'down' },
          { label:'Lost Leads',       value:kpi.total_lost_leads,                     delta:'All time',     type:'down' },
        ].map((k,i)=>(
          <Grid item xs={2} key={i}><KPICard label={k.label} value={k.value} delta={k.delta} deltaType={k.type} /></Grid>
        ))}
      </Grid>

      {/* 5yr + outcome */}
      <Grid container spacing={2}>
        <Grid item xs={8}>
          <ChartCard title="5-year order history" subtitle="Order count & value (Cr) by financial year"
            chip="5 years" chipColor="blue"
            legend={[{color:'#2563eb',label:'Orders (count)'},{color:'#7c3aed',label:'Value (Cr)'}]} height={240}>
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={data5yr} margin={{top:0,right:40,bottom:0,left:0}}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e4e8ef" />
                <XAxis dataKey="year" tick={{fontSize:11,fill:'#8892a4'}} />
                <YAxis yAxisId="left" tick={{fontSize:11,fill:'#8892a4'}} />
                <YAxis yAxisId="right" orientation="right" tick={{fontSize:11,fill:'#7c3aed'}} tickFormatter={v=>`₹${v}`} />
                <Tooltip content={<DualTooltip />} />
                <Bar yAxisId="left" dataKey="orders" name="Orders" fill="#2563eb" radius={[4,4,0,0]} />
                <Line yAxisId="right" type="monotone" dataKey="value" name="Value (Cr)" stroke="#7c3aed" strokeWidth={2} dot={{fill:'#7c3aed',r:4}} />
              </ComposedChart>
            </ResponsiveContainer>
          </ChartCard>
        </Grid>
        <Grid item xs={4}>
          <ChartCard title="Lead outcomes" subtitle="Distribution by outcome" chip="Current FY" chipColor="green"
            legend={outcomeData.map(d=>({color:d.color,label:`${d.name} (${d.value})`}))} height={240}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={outcomeData} cx="50%" cy="50%" innerRadius={55} outerRadius={90} dataKey="value" paddingAngle={2}>
                  {outcomeData.map((d,i)=><Cell key={i} fill={d.color} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </ChartCard>
        </Grid>
      </Grid>

      {/* trend + civil/def + subtypes */}
      <Grid container spacing={2}>
        <Grid item xs={4}>
          <ChartCard title="Monthly order trend" subtitle="Orders per month" chip="2 years" chipColor="blue"
            legend={[{color:'#2563eb',label:'Current FY'},{color:'#d1d5db',label:'Previous FY'}]} height={200}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData} margin={{top:0,right:8,bottom:0,left:-20}}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e4e8ef" />
                <XAxis dataKey="month" tick={{fontSize:10,fill:'#8892a4'}} />
                <YAxis tick={{fontSize:10,fill:'#8892a4'}} />
                <Tooltip />
                <Line type="monotone" dataKey="FY 25-26" stroke="#2563eb" strokeWidth={2} dot={{r:2}} />
                <Line type="monotone" dataKey="FY 24-25" stroke="#d1d5db" strokeWidth={1.5} strokeDasharray="4 3" dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>
        </Grid>
        <Grid item xs={4}>
          <ChartCard title="Civil vs. Defence" subtitle="Lead & BQ split" chip="Mix" chipColor="amber"
            legend={[{color:'#2563eb',label:'Civil'},{color:'#7c3aed',label:'Defence'}]} height={200}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={civDefData} margin={{top:0,right:8,bottom:0,left:-20}}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e4e8ef" />
                <XAxis dataKey="name" tick={{fontSize:10,fill:'#8892a4'}} />
                <YAxis tick={{fontSize:10,fill:'#8892a4'}} />
                <Tooltip />
                <Bar dataKey="Civil"   fill="#2563eb" radius={[3,3,0,0]} />
                <Bar dataKey="Defence" fill="#7c3aed" radius={[3,3,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </Grid>
        <Grid item xs={4}>
          <ChartCard title="Lead sub-types" subtitle="Distribution this FY" chip="5 types" chipColor="blue"
            legend={subtypesData.map(d=>({color:d.color,label:d.name}))} height={200}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={subtypesData} cx="50%" cy="50%" innerRadius={45} outerRadius={75} dataKey="value" paddingAngle={2}>
                  {subtypesData.map((d,i)=><Cell key={i} fill={d.color} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </ChartCard>
        </Grid>
      </Grid>

      {/* domain + top10 */}
      <Grid container spacing={2}>
        <Grid item xs={7}>
          <ChartCard title="Win / loss by business domain" subtitle="Grouped by outcome" chip="Domain view" chipColor="green"
            legend={[{color:'#16a34a',label:'Won'},{color:'#dc2626',label:'Lost'}]} height={220}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={domainData} margin={{top:0,right:8,bottom:0,left:-20}}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e4e8ef" />
                <XAxis dataKey="domain" tick={{fontSize:10,fill:'#8892a4'}} />
                <YAxis tick={{fontSize:10,fill:'#8892a4'}} />
                <Tooltip />
                <Bar dataKey="Won"  fill="#16a34a" radius={[3,3,0,0]} />
                <Bar dataKey="Lost" fill="#dc2626" radius={[3,3,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </Grid>
        <Grid item xs={5}>
          <ChartCard title="Top 10 customers" subtitle="By total order value (Cr)" chip="All-time" chipColor="blue" height={220}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={top10Data} layout="vertical" margin={{top:0,right:40,bottom:0,left:0}}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e4e8ef" horizontal={false} />
                <XAxis type="number" tick={{fontSize:10,fill:'#8892a4'}} tickFormatter={v=>`₹${v}`} />
                <YAxis type="category" dataKey="name" tick={{fontSize:10,fill:'#8892a4'}} width={36} />
                <Tooltip formatter={v=>[`₹${v} Cr`,'Order Value']} />
                <Bar dataKey="value" fill="rgba(37,99,235,0.15)" stroke="#2563eb" strokeWidth={1.5} radius={[0,4,4,0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </Grid>
      </Grid>

      {/* Lost leads table */}
      <Box sx={{ backgroundColor:'#fff', border:'1px solid #e4e8ef', borderRadius:'14px', overflow:'hidden' }}>
        <Box sx={{ px:2.5, py:2, borderBottom:'1px solid #e4e8ef' }}>
          <Typography sx={{ fontSize:13, fontWeight:500 }}>Lost lead analysis</Typography>
          <Typography sx={{ fontSize:11, color:'#8892a4', mt:0.3 }}>
            Detailed breakdown of lost opportunities ({lostLeads.length} records)
          </Typography>
        </Box>
        {lostLeads.length === 0 ? (
          <Box sx={{ p:3, textAlign:'center' }}><Typography sx={{ color:'#8892a4', fontSize:13 }}>No lost leads found.</Typography></Box>
        ) : (
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>{['Tender Name','Customer','Domain','Value (Cr)','Reason','Owner','Date'].map(h=><TableCell key={h}>{h}</TableCell>)}</TableRow>
              </TableHead>
              <TableBody>
                {lostLeads.map((row,i)=>(
                  <TableRow key={i}>
                    <TableCell sx={{fontWeight:500,color:'#0f1117',maxWidth:180}}>{row.tender_name}</TableCell>
                    <TableCell>{row.customer_name}</TableCell>
                    <TableCell><StatusChip status={row.civil_defence||row.business_domain} /></TableCell>
                    <TableCell sx={{fontFamily:'"DM Mono",monospace',fontWeight:500}}>
                      {row.submitted_value_cr?`₹${parseFloat(row.submitted_value_cr).toFixed(2)}`:'—'}
                    </TableCell>
                    <TableCell sx={{maxWidth:200,color:'#525868',fontSize:12}}>{row.reason_for_losing||'—'}</TableCell>
                    <TableCell sx={{fontSize:12}}>{row.lead_owner_name||'—'}</TableCell>
                    <TableCell sx={{fontFamily:'"DM Mono",monospace',color:'#8892a4',fontSize:11}}>
                      {row.created_at?new Date(row.created_at).toLocaleDateString('en-IN',{month:'short',year:'2-digit'}):'—'}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Box>
    </Box>
  );
}
