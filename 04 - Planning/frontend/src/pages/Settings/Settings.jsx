// src/pages/Settings/Settings.jsx
import { useState, useEffect } from 'react';
import {
  Box, Typography, Card, CardContent, Grid, TextField,
  Button, Divider, Alert, CircularProgress, Switch,
  FormControlLabel, Chip,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { AddOutlined } from '@mui/icons-material';
import PageShell    from '../../components/Layout/PageShell';
import { usersAPI } from '../../api';
import { useAuth }  from '../../context/AuthContext';
import { DeleteModal } from '../../components/Common/Modals';

const ROLE_COLORS = {
  admin:     { bg:'#eff4ff', color:'#2563eb' },
  head:      { bg:'#f5f3ff', color:'#7c3aed' },
  manager:   { bg:'#f0fdfa', color:'#0d9488' },
  executive: { bg:'#fffbeb', color:'#d97706' },
};

export default function Settings() {
  const { user }  = useAuth();
  const [users,   setUsers]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState('');
  const [success, setSuccess] = useState('');

  const [newUser, setNewUser] = useState({ username:'', email:'', full_name:'', password:'', role:'executive' });
  const [saving,  setSaving]  = useState(false);
  const [nuErr,   setNuErr]   = useState('');

  const [deactOpen, setDeactOpen] = useState(false);
  const [deactRec,  setDeactRec]  = useState(null);

  const fetchUsers = async () => {
    try {
      const r = await usersAPI.list();
      setUsers(r.data.data);
    } catch { setError('Failed to load users.'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleCreate = async () => {
    if (!newUser.username || !newUser.email || !newUser.full_name || !newUser.password) {
      setNuErr('All fields are required.'); return;
    }
    setSaving(true); setNuErr('');
    try {
      await usersAPI.create(newUser);
      setNewUser({ username:'', email:'', full_name:'', password:'', role:'executive' });
      setSuccess('User created successfully.');
      fetchUsers();
    } catch (e) { setNuErr(e.response?.data?.error || 'Failed to create user.'); }
    finally { setSaving(false); }
  };

  const handleDeactivate = async () => {
    try {
      await usersAPI.deactivate(deactRec.id);
      setDeactOpen(false); setDeactRec(null);
      setSuccess('User deactivated.');
      fetchUsers();
    } catch { setError('Deactivation failed.'); }
  };

  const columns = [
    { field:'full_name',  headerName:'Name',     flex:1, minWidth:160,
      renderCell: p => <Typography sx={{ fontSize:13, fontWeight:500, color:'#0f1117' }}>{p.value}</Typography> },
    { field:'username',   headerName:'Username', width:140,
      renderCell: p => <Typography sx={{ fontFamily:'"DM Mono",monospace', fontSize:12 }}>{p.value}</Typography> },
    { field:'email',      headerName:'Email',    flex:1, minWidth:200 },
    { field:'role',       headerName:'Role',     width:110,
      renderCell: p => { const c = ROLE_COLORS[p.value] || {}; return (
        <Chip label={p.value} size="small" sx={{ fontSize:10, height:20, textTransform:'capitalize', backgroundColor:c.bg, color:c.color }} />
      ); } },
    { field:'is_active',  headerName:'Active',   width:80,
      renderCell: p => <Chip label={p.value ? 'Active':'Inactive'} size="small"
        sx={{ fontSize:10, height:20, backgroundColor: p.value ? '#f0fdf4':'#fef2f2', color: p.value ? '#16a34a':'#dc2626' }} /> },
    { field:'actions',    headerName:'Actions',  width:110, sortable:false,
      renderCell: p => p.row.id !== user?.id ? (
        <Button size="small" variant="outlined" color="error" sx={{ fontSize:11, height:26 }}
          onClick={() => { setDeactRec(p.row); setDeactOpen(true); }}>
          {p.row.is_active ? 'Deactivate' : 'Reactivate'}
        </Button>
      ) : <Typography sx={{ fontSize:11, color:'#8892a4' }}>You</Typography>,
    },
  ];

  return (
    <PageShell title="Settings">
      <Box sx={{ display:'flex', flexDirection:'column', gap:3, maxWidth:900 }}>
        {error   && <Alert severity="error"   onClose={() => setError('')}>{error}</Alert>}
        {success && <Alert severity="success" onClose={() => setSuccess('')}>{success}</Alert>}

        {/* Create User */}
        <Card>
          <CardContent>
            <Typography sx={{ fontSize:14, fontWeight:500, mb:2 }}>Create New User</Typography>
            {nuErr && <Alert severity="error" sx={{ mb:2, fontSize:13, borderRadius:2 }}>{nuErr}</Alert>}
            <Grid container spacing={2}>
              {[['Full Name','full_name'],['Username','username'],['Email','email'],['Password','password']].map(([label, field]) => (
                <Grid item xs={6} key={field}>
                  <TextField label={label} value={newUser[field]}
                    onChange={e => setNewUser(p => ({ ...p, [field]: e.target.value }))}
                    fullWidth size="small" type={field==='password'?'password':'text'} />
                </Grid>
              ))}
              <Grid item xs={6}>
                <TextField select label="Role" value={newUser.role}
                  onChange={e => setNewUser(p => ({ ...p, role: e.target.value }))}
                  fullWidth size="small">
                  {['executive','manager','head','admin'].map(r => (
                    <option key={r} value={r} style={{ padding:'8px 12px', textTransform:'capitalize' }}>{r}</option>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={6} sx={{ display:'flex', alignItems:'center' }}>
                <Button variant="contained" size="small" startIcon={<AddOutlined sx={{ fontSize:16 }} />}
                  onClick={handleCreate} disabled={saving} sx={{ px:3 }}>
                  {saving ? 'Creating...' : 'Create User'}
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Users list */}
        <Card>
          <CardContent>
            <Typography sx={{ fontSize:14, fontWeight:500, mb:2 }}>Team Members ({users.length})</Typography>
            <Box sx={{ '& .MuiDataGrid-root':{ border:'none' },
              '& .MuiDataGrid-columnHeaders':{ backgroundColor:'#f1f3f7', fontSize:10, fontWeight:500, textTransform:'uppercase', letterSpacing:'0.06em', color:'#8892a4' },
              '& .MuiDataGrid-cell':{ borderBottom:'1px solid #e4e8ef', fontSize:13 },
              '& .MuiDataGrid-row:hover':{ backgroundColor:'#f7f8fa' } }}>
              <DataGrid rows={users} columns={columns} loading={loading} autoHeight
                pageSizeOptions={[10,25]} disableRowSelectionOnClick disableColumnMenu />
            </Box>
          </CardContent>
        </Card>

        {/* App info */}
        <Card>
          <CardContent>
            <Typography sx={{ fontSize:14, fontWeight:500, mb:1.5 }}>Application Info</Typography>
            {[['Version','2.0.0'],['Stack','React.js + Node.js + Express + PostgreSQL'],
              ['File Storage','Local On-Premises'],['Hosting','On-Premises Server']].map(([k,v]) => (
              <Box key={k} sx={{ display:'flex', gap:2, py:0.75, borderBottom:'1px solid #f1f3f7' }}>
                <Typography sx={{ fontSize:12, color:'#8892a4', width:140 }}>{k}</Typography>
                <Typography sx={{ fontSize:12, color:'#525868', fontFamily: k==='Version'?'"DM Mono",monospace':undefined }}>{v}</Typography>
              </Box>
            ))}
          </CardContent>
        </Card>
      </Box>

      <DeleteModal open={deactOpen} onClose={() => { setDeactOpen(false); setDeactRec(null); }}
        onConfirm={handleDeactivate} recordName={deactRec?.full_name} loading={false} />
    </PageShell>
  );
}
