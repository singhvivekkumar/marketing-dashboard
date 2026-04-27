import React, { useState } from 'react';
import { Box, Grid, Card, CardContent, Typography, Button, Divider } from '@mui/material';
import TenderLifecycleDetail from './TenderLifecycleDetail';
import { tenderLifecycle } from '../mockData';

function KPICard({label, value}){
  return (
    <Card variant="outlined" sx={{borderRadius:2}}>
      <CardContent>
        <Typography sx={{fontSize:11,color:'#8892a4'}}>{label}</Typography>
        <Typography sx={{fontSize:18,fontWeight:600}}>{value}</Typography>
      </CardContent>
    </Card>
  );
}

export default function TenderLifecycleOverview(){
  const [selected, setSelected] = useState(null);

  const stageCounts = {}; tenderLifecycle.forEach(t=>{ stageCounts[t.current_stage] = (stageCounts[t.current_stage]||0)+1; });
  const total = tenderLifecycle.length;

  if (selected) return <TenderLifecycleDetail tender={selected} onBack={() => setSelected(null)} />;

  return (
    <Box sx={{display:'flex',flexDirection:'column',gap:2}}>
      <Typography sx={{fontSize:18,fontWeight:700}}>Tender Lifecycle</Typography>

      <Grid container spacing={1}>
        <Grid item xs={3}><KPICard label="Total Tenders" value={total} /></Grid>
        <Grid item xs={3}><KPICard label="At Document Study" value={stageCounts['Document Study']||0} /></Grid>
        <Grid item xs={3}><KPICard label="At Bid Submission" value={stageCounts['Bid Submission']||0} /></Grid>
        <Grid item xs={3}><KPICard label="Overdue" value={tenderLifecycle.filter(t=>t.is_overdue).length} /></Grid>
      </Grid>

      <Box sx={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:12}}>
        {tenderLifecycle.map(t => (
          <Card key={t.id} variant="outlined" sx={{ cursor:'pointer' }} onClick={() => setSelected(t)}>
            <CardContent>
              <Box sx={{display:'flex',justifyContent:'space-between',alignItems:'center',mb:0.5}}>
                <Typography sx={{fontSize:14,fontWeight:600}}>{t.tenderName}</Typography>
                <Typography sx={{fontSize:12,color:'#8892a4'}}>{t.current_stage}</Typography>
              </Box>
              <Typography sx={{fontSize:12,color:'#525868'}}>{t.customer}</Typography>
              <Divider sx={{my:1}} />
              <Box sx={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                <Typography sx={{fontSize:12,fontFamily:'DM Mono'}}>{t.estimated_cost_cr ? `₹${t.estimated_cost_cr} Cr` : '—'}</Typography>
                <Button size="small" variant="contained" onClick={() => setSelected(t)}>Open</Button>
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>
    </Box>
  );
}
