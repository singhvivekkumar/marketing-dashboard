// src/pages/Dashboard/tabs/PipelineTab.jsx
import { Box, Grid, Typography, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer } from 'recharts';
import KPICard   from '../../../components/Common/KPICard';
import ChartCard from '../../../components/Common/ChartCard';
import { StatusChip } from '../../../components/Common/Modals';

const pipelineData = [
  { stage:'Identified',    count:12 },
  { stage:'In Prep',       count:9  },
  { stage:'Submitted',     count:11 },
  { stage:'Eval.',         count:6  },
  { stage:'Pre-bid',       count:4  },
];

const PIPE_COLORS = ['#dbeafe','#93c5fd','#3b82f6','#1d4ed8','#1e3a8a'];

const pipeDomData = [
  { domain:'Radar',   Civil:18, Defence:45 },
  { domain:'Telecom', Civil:24, Defence:18 },
  { domain:'CCTV',    Civil:32, Defence:12 },
  { domain:'Comms',   Civil:14, Defence:28 },
  { domain:'Power',   Civil:8,  Defence:10 },
];

const deadlines = [
  { tender:'Army Comms Upgrade',    customer:'MoD',          type:'Open',         value:'₹92.00', deadline:"22 Mar '26", owner:'Rajan K',  status:'In progress',  urgent:true },
  { tender:'Highway Surveillance',  customer:'NHAI',         type:'Limited',      value:'₹28.50', deadline:"28 Mar '26", owner:'Priya S',  status:'Pending docs', urgent:true },
  { tender:'Port Radar System',     customer:'Paradip Port', type:'Open',         value:'₹41.20', deadline:"05 Apr '26", owner:'Anil M',   status:'In progress',  urgent:false },
  { tender:'Airbase CCTV Upgrade',  customer:'IAF',          type:'Single Source',value:'₹15.80', deadline:"10 Apr '26", owner:'Rajan K',  status:'Draft ready',  urgent:false },
];

export default function PipelineTab() {
  return (
    <Box sx={{ display:'flex', flexDirection:'column', gap:2.5 }}>
      <Grid container spacing={1.5}>
        {[
          { label:'Open Leads',       value:'42',  delta:'Across 5 stages',   type:'neutral' },
          { label:'Pre-bid Pending',  value:'8',   delta:'This month',        type:'neutral' },
          { label:'Submissions Due',  value:'5',   delta:'Next 7 days',       type:'down' },
          { label:'Corrigendums',     value:'12',  delta:'Active tenders',    type:'neutral' },
          { label:'Consortium Deals', value:'11',  delta:'+3 vs last FY',    type:'up' },
          { label:'Expected Win (Cr)',value:'₹98', delta:'Weighted pipeline', type:'up' },
        ].map((k,i) => (
          <Grid item xs={2} key={i}>
            <KPICard label={k.label} value={k.value} delta={k.delta} deltaType={k.type} />
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={2}>
        <Grid item xs={8}>
          <ChartCard title="Pipeline by present status" subtitle="All open leads grouped by current stage"
            chip="Live" chipColor="blue" height={240}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={pipelineData} margin={{top:0,right:8,bottom:0,left:-20}}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e4e8ef" />
                <XAxis dataKey="stage" tick={{fontSize:11,fill:'#8892a4'}} />
                <YAxis tick={{fontSize:11,fill:'#8892a4'}} />
                <Tooltip />
                <Bar dataKey="count" radius={[5,5,0,0]}>
                  {pipelineData.map((_,i)=>(
                    <rect key={i} fill={PIPE_COLORS[i] || '#2563eb'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </Grid>
        <Grid item xs={4}>
          <ChartCard title="Pipeline value by domain (Cr)" subtitle="Expected value of open leads per domain"
            legend={[{color:'#2563eb',label:'Civil'},{color:'#7c3aed',label:'Defence'}]}
            height={240}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={pipeDomData} margin={{top:0,right:8,bottom:0,left:-10}}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e4e8ef" />
                <XAxis dataKey="domain" tick={{fontSize:10,fill:'#8892a4'}} />
                <YAxis tick={{fontSize:10,fill:'#8892a4'}} tickFormatter={v=>`₹${v}`} />
                <Tooltip formatter={v=>[`₹${v} Cr`]} />
                <Bar dataKey="Civil"   fill="#2563eb" radius={[3,3,0,0]} />
                <Bar dataKey="Defence" fill="#7c3aed" radius={[3,3,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </Grid>
      </Grid>

      {/* Deadlines table */}
      <Box sx={{ backgroundColor:'#fff', border:'1px solid #e4e8ef', borderRadius:'14px', overflow:'hidden' }}>
        <Box sx={{ px:2.5, py:2, borderBottom:'1px solid #e4e8ef' }}>
          <Typography sx={{ fontSize:13, fontWeight:500 }}>Upcoming submission deadlines</Typography>
          <Typography sx={{ fontSize:11, color:'#8892a4', mt:0.3 }}>Next 30 days — action required</Typography>
        </Box>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                {['Tender Name','Customer','Type','Value (Cr)','Deadline','Owner','Status'].map(h=>(
                  <TableCell key={h}>{h}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {deadlines.map((r,i)=>(
                <TableRow key={i}>
                  <TableCell sx={{fontWeight:500,color:'#0f1117'}}>{r.tender}</TableCell>
                  <TableCell>{r.customer}</TableCell>
                  <TableCell>{r.type}</TableCell>
                  <TableCell sx={{fontFamily:'"DM Mono",monospace',fontWeight:500}}>{r.value}</TableCell>
                  <TableCell sx={{fontFamily:'"DM Mono",monospace',color: r.urgent ? '#dc2626' : r.deadline.includes('28') ? '#d97706' : '#525868'}}>
                    {r.deadline}
                  </TableCell>
                  <TableCell>{r.owner}</TableCell>
                  <TableCell><StatusChip status={r.status} /></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
}
