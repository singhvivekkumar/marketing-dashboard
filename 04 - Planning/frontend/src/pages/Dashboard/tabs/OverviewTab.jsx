// src/pages/Dashboard/tabs/OverviewTab.jsx
import { Box, Grid, Typography, Table, TableBody,
         TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, ComposedChart,
} from 'recharts';
import KPICard   from '../../../components/Common/KPICard';
import ChartCard from '../../../components/Common/ChartCard';
import { StatusChip } from '../../../components/Common/Modals';

const MONTHS = ['Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec','Jan','Feb','Mar'];

// ── Static data (replace with API calls from analyticsAPI) ──────────────────
const data5yr = [
  { year:'FY 21-22', orders:75,  value:148 },
  { year:'FY 22-23', orders:82,  value:162 },
  { year:'FY 23-24', orders:92,  value:182 },
  { year:'FY 24-25', orders:105, value:208 },
  { year:'FY 25-26', orders:128, value:247 },
];

const outcomeData = [
  { name:'Won',              value:34, color:'#16a34a' },
  { name:'Lost',             value:22, color:'#dc2626' },
  { name:'Participated',     value:30, color:'#2563eb' },
  { name:'Not-Participated', value:14, color:'#d97706' },
];

const trendData = MONTHS.map((m,i) => ({
  month: m,
  'FY 25-26': [8,6,10,9,12,8,11,13,9,14,10,18][i],
  'FY 24-25': [6,5,8,7,9,6,9,10,7,11,8,14][i],
}));

const civDefData = [
  { name:'Leads',  Civil:68, Defence:44 },
  { name:'Orders', Civil:78, Defence:50 },
  { name:'BQs',    Civil:55, Defence:30 },
];

const subtypesData = [
  { name:'Submitted',  value:28, color:'#2563eb' },
  { name:'Domestic',   value:35, color:'#0d9488' },
  { name:'Export',     value:18, color:'#7c3aed' },
  { name:'CRM Lead',   value:14, color:'#d97706' },
  { name:'Lost Lead',  value:17, color:'#dc2626' },
];

const domainData = [
  { domain:'Radar',   Won:12, Lost:5  },
  { domain:'Telecom', Won:8,  Lost:4  },
  { domain:'CCTV',    Won:15, Lost:7  },
  { domain:'Comms',   Won:6,  Lost:3  },
  { domain:'Power',   Won:5,  Lost:2  },
  { domain:'IT',      Won:9,  Lost:4  },
];

const top10Data = [
  { name:'MoD',        value:82 },
  { name:'BEL',        value:68 },
  { name:'ONGC',       value:54 },
  { name:'DRDO',       value:48 },
  { name:'NHAI',       value:42 },
  { name:'BSF',        value:38 },
  { name:'AAI',        value:34 },
  { name:'BSNL',       value:28 },
  { name:'RVNL',       value:22 },
  { name:'GAIL',       value:18 },
];

const lostLeads = [
  { tender:'Coastal Radar Network',  customer:'Indian Navy',     domain:'Defence', value:'₹45.20', competitor:'DRDO Pvt',  reason:'Higher price quoted',                  date:"Jan '26" },
  { tender:'Urban CCTV Phase 3',     customer:'Delhi Police',    domain:'Civil',   value:'₹12.80', competitor:'TechVision',reason:'Technical spec mismatch',              date:"Dec '25" },
  { tender:'Border Telecom Grid',    customer:'BSF',             domain:'Defence', value:'₹78.50', competitor:'BEL',       reason:'L2 — price difference ₹3.2Cr',        date:"Nov '25" },
  { tender:'Port Surveillance',      customer:'Mumbai Port Trust',domain:'Civil',  value:'₹22.40', competitor:'Honeywell', reason:'Not participated — resource constraint',date:"Oct '25" },
  { tender:'Airfield Security NIT',  customer:'AAI',             domain:'Civil',   value:'₹18.90', competitor:'G4S',       reason:'Lost on delivery timeline',            date:"Sep '25" },
];

// Custom tooltip for dual-axis chart
const DualTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <Box sx={{ bgcolor:'#fff', border:'1px solid #e4e8ef', borderRadius:1.5, p:1.25 }}>
      <Typography sx={{ fontSize:11, fontWeight:500, mb:0.5 }}>{label}</Typography>
      {payload.map((p,i) => (
        <Typography key={i} sx={{ fontSize:11, color:p.color }}>
          {p.name}: {p.name==='Value (Cr)' ? '₹'+p.value+'Cr' : p.value}
        </Typography>
      ))}
    </Box>
  );
};

export default function OverviewTab({ kpi }) {
  return (
    <Box sx={{ display:'flex', flexDirection:'column', gap:2.5 }}>

      {/* ── KPI Row ─────────────────────────────────────────────────────── */}
      <Grid container spacing={1.5}>
        {[
          { label:'Leads in Queue',  value: kpi.queue,  delta:'+8 vs last FY',  type:'up' },
          { label:'Total Orders',    value: kpi.orders, delta:'+23 vs last FY', type:'up' },
          { label:'Order Value (Cr)',value: kpi.value,  delta:'+₹38 vs last FY',type:'up' },
          { label:'BQs Submitted',   value: kpi.bq,     delta:'same as last FY', type:'neutral' },
          { label:'Win Rate',        value: kpi.wr,     delta:'+6% vs last FY', type:'up' },
          { label:'Lost Leads',      value: kpi.lost,   delta:'+5 vs last FY',  type:'down' },
        ].map((k,i) => (
          <Grid item xs={2} key={i}>
            <KPICard label={k.label} value={k.value} delta={k.delta} deltaType={k.type} />
          </Grid>
        ))}
      </Grid>

      {/* ── 5-Year History + Outcome ─────────────────────────────────────── */}
      <Grid container spacing={2}>
        <Grid item xs={8}>
          <ChartCard
            title="5-year order history"
            subtitle="Order count & value (Cr) by financial year"
            chip="5 years" chipColor="blue"
            legend={[{color:'#2563eb',label:'Orders (count)'},{color:'#7c3aed',label:'Value (Cr)'}]}
            height={240}
          >
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={data5yr} margin={{ top:0, right:40, bottom:0, left:0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e4e8ef" />
                <XAxis dataKey="year" tick={{ fontSize:11, fill:'#8892a4' }} />
                <YAxis yAxisId="left"  tick={{ fontSize:11, fill:'#8892a4' }} />
                <YAxis yAxisId="right" orientation="right" tick={{ fontSize:11, fill:'#7c3aed' }} tickFormatter={v=>`₹${v}`} />
                <Tooltip content={<DualTooltip />} />
                <Bar yAxisId="left" dataKey="orders" name="Orders (count)" fill="#2563eb" radius={[4,4,0,0]} />
                <Line yAxisId="right" type="monotone" dataKey="value" name="Value (Cr)" stroke="#7c3aed" strokeWidth={2} dot={{ fill:'#7c3aed', r:4 }} />
              </ComposedChart>
            </ResponsiveContainer>
          </ChartCard>
        </Grid>
        <Grid item xs={4}>
          <ChartCard
            title="Lead outcomes" subtitle="All-time distribution"
            chip="Current FY" chipColor="green"
            legend={outcomeData.map(d=>({color:d.color,label:`${d.name} ${d.value}%`}))}
            height={240}
          >
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={outcomeData} cx="50%" cy="50%" innerRadius={55} outerRadius={90}
                  dataKey="value" paddingAngle={2}>
                  {outcomeData.map((d,i)=><Cell key={i} fill={d.color} />)}
                </Pie>
                <Tooltip formatter={(v,n)=>[`${v}%`,n]} />
              </PieChart>
            </ResponsiveContainer>
          </ChartCard>
        </Grid>
      </Grid>

      {/* ── Trend + Civil/Defence + Subtypes ─────────────────────────────── */}
      <Grid container spacing={2}>
        <Grid item xs={4}>
          <ChartCard
            title="Monthly order trend" subtitle="Count + cumulative value (Cr)"
            chip="2 years" chipColor="blue"
            legend={[{color:'#2563eb',label:'FY 25-26'},{color:'#d1d5db',label:'FY 24-25'}]}
            height={200}
          >
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
          <ChartCard
            title="Civil vs. Defence" subtitle="Lead & order split"
            chip="Mix" chipColor="amber"
            legend={[{color:'#2563eb',label:'Civil'},{color:'#7c3aed',label:'Defence'}]}
            height={200}
          >
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
          <ChartCard
            title="Lead sub-types" subtitle="Distribution this FY"
            chip="5 types" chipColor="blue"
            legend={subtypesData.map(d=>({color:d.color,label:d.name}))}
            height={200}
          >
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={subtypesData} cx="50%" cy="50%" innerRadius={45} outerRadius={75}
                  dataKey="value" paddingAngle={2}>
                  {subtypesData.map((d,i)=><Cell key={i} fill={d.color} />)}
                </Pie>
                <Tooltip formatter={(v,n)=>[`${v}`,n]} />
              </PieChart>
            </ResponsiveContainer>
          </ChartCard>
        </Grid>
      </Grid>

      {/* ── Win/Loss by Domain + Top 10 ──────────────────────────────────── */}
      <Grid container spacing={2}>
        <Grid item xs={7}>
          <ChartCard
            title="Win / loss by business domain" subtitle="Stacked by outcome"
            chip="Domain view" chipColor="green"
            legend={[{color:'#16a34a',label:'Won'},{color:'#dc2626',label:'Lost'}]}
            height={220}
          >
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
          <ChartCard
            title="Top 10 customers" subtitle="By total order value (Cr)"
            chip="All-time" chipColor="blue"
            height={220}
          >
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

      {/* ── Lost Lead Analysis Table ──────────────────────────────────────── */}
      <Box sx={{ backgroundColor:'#fff', border:'1px solid #e4e8ef', borderRadius:'14px', overflow:'hidden' }}>
        <Box sx={{ px:2.5, py:2, borderBottom:'1px solid #e4e8ef', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <Box>
            <Typography sx={{ fontSize:13, fontWeight:500 }}>Lost lead analysis</Typography>
            <Typography sx={{ fontSize:11, color:'#8892a4', mt:0.3 }}>Detailed breakdown of all lost opportunities</Typography>
          </Box>
        </Box>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                {['Tender Name','Customer','Domain','Value (Cr)','Competitor','Reason','Date'].map(h=>(
                  <TableCell key={h}>{h}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {lostLeads.map((row,i)=>(
                <TableRow key={i}>
                  <TableCell sx={{fontWeight:500,color:'#0f1117'}}>{row.tender}</TableCell>
                  <TableCell>{row.customer}</TableCell>
                  <TableCell><StatusChip status={row.domain} /></TableCell>
                  <TableCell sx={{fontFamily:'"DM Mono",monospace',fontWeight:500,color:'#0f1117'}}>{row.value}</TableCell>
                  <TableCell>{row.competitor}</TableCell>
                  <TableCell sx={{maxWidth:220,color:'#525868'}}>{row.reason}</TableCell>
                  <TableCell sx={{fontFamily:'"DM Mono",monospace',color:'#8892a4'}}>{row.date}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
}
