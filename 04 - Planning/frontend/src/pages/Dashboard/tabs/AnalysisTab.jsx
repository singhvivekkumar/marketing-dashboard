// src/pages/Dashboard/tabs/AnalysisTab.jsx
import { Box, Grid } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
         ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import KPICard   from '../../../components/Common/KPICard';
import ChartCard from '../../../components/Common/ChartCard';

const funnelData = [
  { stage:'BQs Submitted',       count:67, fill:'#dbeafe' },
  { stage:'Converted to Lead',   count:48, fill:'#93c5fd' },
  { stage:'Submitted to Tender', count:38, fill:'#3b82f6' },
  { stage:'Won Order',           count:26, fill:'#2563eb' },
];

const distData = [
  { band:'<5 Cr',    count:12 },
  { band:'5–20 Cr',  count:38 },
  { band:'20–50 Cr', count:45 },
  { band:'50–100 Cr',count:25 },
  { band:'>100 Cr',  count:8  },
];

const qoqData = [
  { q:'Q1', cur:24, prev:20 },
  { q:'Q2', cur:29, prev:24 },
  { q:'Q3', cur:33, prev:28 },
  { q:'Q4', cur:42, prev:33 },
];

const ttypeData = [
  { name:'Open',          value:38, color:'#2563eb' },
  { name:'Limited',       value:22, color:'#0d9488' },
  { name:'Single Source', value:18, color:'#7c3aed' },
  { name:'Nomination',    value:12, color:'#d97706' },
  { name:'Rate Contract', value:10, color:'#9ca3af' },
];

const ownerData = [
  { name:'Rajan K',  value:68 },
  { name:'Priya S',  value:52 },
  { name:'Anil M',   value:44 },
  { name:'Deepa R',  value:38 },
  { name:'Sanjay V', value:28 },
];

export default function AnalysisTab() {
  return (
    <Box sx={{ display:'flex', flexDirection:'column', gap:2.5 }}>
      <Grid container spacing={1.5}>
        {[
          { label:'Avg Deal Size (Cr)',   value:'₹19.3', delta:'+₹2.1 vs last FY', type:'up' },
          { label:'BQ Conversion',        value:'48%',   delta:'+4% vs last FY',   type:'up' },
          { label:'Pipeline Value (Cr)',  value:'₹312',  delta:'Active leads',      type:'neutral' },
          { label:'Avg Lead Age (days)',  value:'47',    delta:'+6 vs last FY',    type:'down' },
          { label:'Export Leads',         value:'18',    delta:'+5 vs last FY',    type:'up' },
          { label:'Sole Bidding',         value:'62%',   delta:'+8% vs last FY',   type:'up' },
        ].map((k,i) => (
          <Grid item xs={2} key={i}>
            <KPICard label={k.label} value={k.value} delta={k.delta} deltaType={k.type} />
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={2}>
        <Grid item xs={8}>
          <ChartCard title="BQ conversion funnel" subtitle="BQs submitted → Leads → Orders won"
            chip="Funnel" chipColor="blue" height={240}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={funnelData} margin={{top:0,right:8,bottom:0,left:-10}}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e4e8ef" />
                <XAxis dataKey="stage" tick={{fontSize:10,fill:'#8892a4'}} />
                <YAxis tick={{fontSize:10,fill:'#8892a4'}} />
                <Tooltip />
                <Bar dataKey="count" radius={[5,5,0,0]}>
                  {funnelData.map((d,i)=><Cell key={i} fill={d.fill} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </Grid>
        <Grid item xs={4}>
          <ChartCard title="Order value distribution" subtitle="By deal size band (Cr)"
            chip="Distribution" chipColor="amber" height={240}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={distData} margin={{top:0,right:8,bottom:0,left:-20}}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e4e8ef" />
                <XAxis dataKey="band" tick={{fontSize:10,fill:'#8892a4'}} />
                <YAxis tick={{fontSize:10,fill:'#8892a4'}} />
                <Tooltip />
                <Bar dataKey="count" fill="rgba(124,58,237,0.15)" stroke="#7c3aed" strokeWidth={1.5} radius={[4,4,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </Grid>
      </Grid>

      <Grid container spacing={2}>
        <Grid item xs={4}>
          <ChartCard title="Quarter-on-quarter orders" subtitle="Q1–Q4 current vs previous FY"
            legend={[{color:'#2563eb',label:'FY 25-26'},{color:'rgba(37,99,235,0.3)',label:'FY 24-25'}]}
            height={200}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={qoqData} margin={{top:0,right:8,bottom:0,left:-20}}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e4e8ef" />
                <XAxis dataKey="q" tick={{fontSize:11,fill:'#8892a4'}} />
                <YAxis tick={{fontSize:11,fill:'#8892a4'}} />
                <Tooltip />
                <Bar dataKey="cur"  name="FY 25-26" fill="#2563eb" radius={[3,3,0,0]} />
                <Bar dataKey="prev" name="FY 24-25" fill="rgba(37,99,235,0.3)" radius={[3,3,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </Grid>
        <Grid item xs={4}>
          <ChartCard title="Tender type breakdown" subtitle="Open / Limited / Single Source etc."
            legend={ttypeData.map(d=>({color:d.color,label:`${d.name} ${d.value}%`}))}
            height={200}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={ttypeData} cx="50%" cy="50%" innerRadius={40} outerRadius={70} dataKey="value" paddingAngle={2}>
                  {ttypeData.map((d,i)=><Cell key={i} fill={d.color} />)}
                </Pie>
                <Tooltip formatter={(v,n)=>[`${v}%`,n]} />
              </PieChart>
            </ResponsiveContainer>
          </ChartCard>
        </Grid>
        <Grid item xs={4}>
          <ChartCard title="Lead owner performance" subtitle="Won value per team member (Cr)" height={200}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ownerData} layout="vertical" margin={{top:0,right:40,bottom:0,left:10}}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e4e8ef" horizontal={false} />
                <XAxis type="number" tick={{fontSize:10,fill:'#8892a4'}} tickFormatter={v=>`₹${v}`} />
                <YAxis type="category" dataKey="name" tick={{fontSize:10,fill:'#8892a4'}} width={52} />
                <Tooltip formatter={v=>[`₹${v} Cr`,'Won Value']} />
                <Bar dataKey="value" fill="rgba(13,148,136,0.2)" stroke="#0d9488" strokeWidth={1.5} radius={[0,4,4,0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </Grid>
      </Grid>
    </Box>
  );
}
