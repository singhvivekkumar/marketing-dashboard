// src/pages/Yearly/YearlyAnalysis.jsx
import { Box, Grid, Typography, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow } from '@mui/material';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import PageShell from '../../components/Layout/PageShell';
import KPICard   from '../../components/Common/KPICard';
import ChartCard from '../../components/Common/ChartCard';
import { StatusChip } from '../../components/Common/Modals';

const yoyValData = [
  { year:'FY 21-22', value:148 },
  { year:'FY 22-23', value:162 },
  { year:'FY 23-24', value:182 },
  { year:'FY 24-25', value:208 },
  { year:'FY 25-26', value:247 },
];
const BAR_OPACITY = ['0.25','0.4','0.55','0.75','1'];

const yoyWRData = [
  { year:'FY 21-22', wr:27 },
  { year:'FY 22-23', wr:29 },
  { year:'FY 23-24', wr:38 },
  { year:'FY 24-25', wr:31 },
  { year:'FY 25-26', wr:34 },
];

const yearlyTable = [
  { fy:'FY 2025–26', bqs:67, leads:112, orders:128, value:'₹247', wr:'34%', lost:38, growth:'+18.7%', gtype:'up' },
  { fy:'FY 2024–25', bqs:58, leads:98,  orders:105, value:'₹208', wr:'31%', lost:33, growth:'+14.3%', gtype:'up' },
  { fy:'FY 2023–24', bqs:52, leads:89,  orders:92,  value:'₹182', wr:'38%', lost:28, growth:'+12.1%', gtype:'up' },
  { fy:'FY 2022–23', bqs:45, leads:76,  orders:82,  value:'₹162', wr:'29%', lost:31, growth:'+9.5%',  gtype:'neutral' },
  { fy:'FY 2021–22', bqs:38, leads:64,  orders:75,  value:'₹148', wr:'27%', lost:26, growth:'Baseline',gtype:'neutral' },
];

export default function YearlyAnalysis() {
  return (
    <PageShell title="Yearly Analysis">
      <Box sx={{ display:'flex', flexDirection:'column', gap:2.5 }}>
        <Grid container spacing={1.5}>
          {[
            { label:'Best Year (Orders)', value:'FY 24-25', delta:'128 orders',  type:'up' },
            { label:'Best Year (Value)',  value:'FY 25-26', delta:'₹247 Cr',     type:'up' },
            { label:'5-yr CAGR',          value:'18.4%',    delta:'Order value', type:'up' },
            { label:'Total 5-yr Value',   value:'₹892 Cr',  delta:'All orders',  type:'neutral' },
            { label:'Peak Win Rate',      value:'38%',       delta:'FY 23-24',   type:'neutral' },
            { label:'Avg Orders/Year',    value:'102',       delta:'+15% trend', type:'up' },
          ].map((k,i)=>(
            <Grid item xs={2} key={i}>
              <KPICard label={k.label} value={k.value} delta={k.delta} deltaType={k.type} />
            </Grid>
          ))}
        </Grid>

        <Grid container spacing={2}>
          <Grid item xs={7}>
            <ChartCard title="Year-on-year order value growth" subtitle="Value in Crores — 5 financial years"
              chip="CAGR 18.4%" chipColor="green" height={260}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={yoyValData} margin={{top:0,right:8,bottom:0,left:-10}}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e4e8ef" />
                  <XAxis dataKey="year" tick={{fontSize:10,fill:'#8892a4'}} />
                  <YAxis tick={{fontSize:10,fill:'#8892a4'}} tickFormatter={v=>`₹${v}`} />
                  <Tooltip formatter={v=>[`₹${v} Cr`,'Order Value']} />
                  <Bar dataKey="value" radius={[5,5,0,0]}>
                    {yoyValData.map((_,i)=>(
                      <Cell key={i} fill={`rgba(37,99,235,${BAR_OPACITY[i]})`} />
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
                  <YAxis domain={[20,45]} tick={{fontSize:10,fill:'#8892a4'}} tickFormatter={v=>`${v}%`} />
                  <Tooltip formatter={v=>[`${v}%`,'Win Rate']} />
                  <Line type="monotone" dataKey="wr" name="Win Rate" stroke="#16a34a" strokeWidth={2.5}
                    dot={{ fill:'#16a34a', r:5, strokeWidth:2, stroke:'#fff' }} />
                </LineChart>
              </ResponsiveContainer>
            </ChartCard>
          </Grid>
        </Grid>

        {/* Yearly summary table */}
        <Box sx={{ backgroundColor:'#fff', border:'1px solid #e4e8ef', borderRadius:'14px', overflow:'hidden' }}>
          <Box sx={{ px:2.5, py:2, borderBottom:'1px solid #e4e8ef' }}>
            <Typography sx={{ fontSize:13, fontWeight:500 }}>Year-on-year summary table</Typography>
            <Typography sx={{ fontSize:11, color:'#8892a4', mt:0.3 }}>All key metrics by financial year</Typography>
          </Box>
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
                {yearlyTable.map((r,i)=>(
                  <TableRow key={i}>
                    <TableCell sx={{fontFamily:'"DM Mono",monospace',fontWeight:500,color:'#0f1117'}}>{r.fy}</TableCell>
                    <TableCell sx={{fontFamily:'"DM Mono",monospace'}}>{r.bqs}</TableCell>
                    <TableCell sx={{fontFamily:'"DM Mono",monospace'}}>{r.leads}</TableCell>
                    <TableCell sx={{fontFamily:'"DM Mono",monospace'}}>{r.orders}</TableCell>
                    <TableCell sx={{fontFamily:'"DM Mono",monospace',fontWeight:500,color:'#0f1117'}}>{r.value}</TableCell>
                    <TableCell sx={{fontFamily:'"DM Mono",monospace'}}>{r.wr}</TableCell>
                    <TableCell sx={{fontFamily:'"DM Mono",monospace'}}>{r.lost}</TableCell>
                    <TableCell><StatusChip status={r.growth} /></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Box>
    </PageShell>
  );
}
