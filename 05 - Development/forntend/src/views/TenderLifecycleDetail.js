import React from 'react';
import { Box, Typography, Button, Card, CardContent, Divider, List, ListItem, ListItemText } from '@mui/material';

export default function TenderLifecycleDetail({ tender, onBack }){
  if (!tender) return null;

  return (
    <Box sx={{display:'flex',flexDirection:'column',gap:2}}>
      <Box sx={{display:'flex',alignItems:'center',justifyContent:'space-between'}}>
        <Box>
          <Typography sx={{fontSize:18,fontWeight:700}}>{tender.tenderName}</Typography>
          <Typography sx={{fontSize:13,color:'#525868'}}>{tender.customer} · {tender.tenderReference}</Typography>
        </Box>
        <Button variant="outlined" onClick={onBack}>Back to list</Button>
      </Box>

      <Card variant="outlined">
        <CardContent>
          <Box sx={{display:'flex',gap:2,flexWrap:'wrap'}}>
            <Typography sx={{fontSize:13}}>Stage: <strong>{tender.current_stage}</strong></Typography>
            <Typography sx={{fontSize:13}}>Owner: <strong>{tender.stage_owner}</strong></Typography>
            <Typography sx={{fontSize:13}}>Due: <strong>{tender.stage_due_date || '—'}</strong></Typography>
            <Typography sx={{fontSize:13}}>Health: <strong>{tender.health_status}</strong></Typography>
          </Box>
        </CardContent>
      </Card>

      <Box sx={{display:'grid',gridTemplateColumns:'1fr 360px',gap:2}}>
        <Box>
          <Card variant="outlined" sx={{mb:1}}>
            <CardContent>
              <Typography sx={{fontSize:14,fontWeight:600}}>Stage History</Typography>
              <List>
                {(tender.history||[]).map((h,i)=> (
                  <ListItem key={i} alignItems="flex-start">
                    <ListItemText primary={`${h.from ? h.from + ' → ' : ''}${h.to}`} secondary={`${new Date(h.at || h.transitioned_at).toLocaleDateString('en-IN')} · ${h.by || ''} ${h.notes?`· ${h.notes}`:''}`} />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>

          <Card variant="outlined">
            <CardContent>
              <Typography sx={{fontSize:14,fontWeight:600}}>Checklist / Actions</Typography>
              <List>
                {(tender.actions||[]).map(a => (
                  <ListItem key={a.id} sx={{display:'flex',justifyContent:'space-between'}}>
                    <ListItemText primary={a.title || a.action_title} secondary={a.assigned_to ? `Assigned to ${a.assigned_to}` : ''} />
                    <Box sx={{display:'flex',gap:1,alignItems:'center'}}>
                      <Typography sx={{fontSize:12,color:a.is_completed? '#16a34a' : '#d97706'}}>{a.is_completed ? 'Done' : 'Pending'}</Typography>
                      {!a.is_completed && <Button size="small">Mark</Button>}
                    </Box>
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>

          <Card variant="outlined" sx={{mt:1}}>
            <CardContent>
              <Typography sx={{fontSize:14,fontWeight:600}}>Corrigendums</Typography>
              <List>
                {(tender.corrigendums||tender.corrigendum||[]).map(c => (
                  <ListItem key={c.id}>
                    <ListItemText primary={`#${c.corrigendum_no || c.id} — ${c.description || c.impact}`} secondary={`Issued ${c.issued_date || c.uploaded_at} ${c.new_deadline ? `· New deadline: ${c.new_deadline}` : ''}`} />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Box>

        <Box>
          <Card variant="outlined" sx={{mb:1}}>
            <CardContent>
              <Typography sx={{fontSize:14,fontWeight:600}}>Competitors</Typography>
              <List>
                {(tender.competitors||[]).map(c => (
                  <ListItem key={c.id}>
                    <ListItemText primary={c.competitor_name} secondary={`Last known price: ${c.last_bid_price_cr?`₹${c.last_bid_price_cr} Cr`:'—'}`} />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>

          <Card variant="outlined">
            <CardContent>
              <Typography sx={{fontSize:14,fontWeight:600}}>Alerts</Typography>
              <List>
                {(tender.alerts||[]).map(a => (
                  <ListItem key={a.id}>
                    <ListItemText primary={a.title} secondary={`${a.message || ''} · Due ${a.due_date || ''}`} />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Box>
      </Box>

    </Box>
  );
}
