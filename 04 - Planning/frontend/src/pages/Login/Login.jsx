// src/pages/Login/Login.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, Card, CardContent, TextField, Button,
  Typography, Alert, InputAdornment, IconButton,
} from '@mui/material';
import { VisibilityOutlined, VisibilityOffOutlined } from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';

export default function Login() {
  const { login }  = useAuth();
  const navigate   = useNavigate();
  const [form, setForm]       = useState({ username:'', password:'' });
  const [error, setError]     = useState('');
  const [loading, setLoading] = useState(false);
  const [showPwd, setShowPwd] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.username.trim() || !form.password.trim()) {
      setError('Username and password are required.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      await login(form.username.trim(), form.password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Invalid username or password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundColor: '#f7f8fa',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 2,
      }}
    >
      <Box sx={{ width: '100%', maxWidth: 380 }}>
        {/* Logo */}
        <Box sx={{ textAlign:'center', mb: 4 }}>
          <Box
            sx={{
              width: 48, height: 48, borderRadius: 3,
              backgroundColor: '#2563eb',
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              mb: 2,
            }}
          >
            <Typography sx={{ color:'#fff', fontWeight:700, fontSize:18 }}>M</Typography>
          </Box>
          <Typography sx={{ fontSize:20, fontWeight:600, color:'#0f1117' }}>
            Marketing Portal
          </Typography>
          <Typography sx={{ fontSize:13, color:'#8892a4', mt:0.5 }}>
            Sign in to your account
          </Typography>
        </Box>

        <Card elevation={0}>
          <CardContent sx={{ p: '28px !important' }}>
            <Box component="form" onSubmit={handleSubmit} sx={{ display:'flex', flexDirection:'column', gap:2 }}>
              {error && (
                <Alert severity="error" sx={{ fontSize:13, borderRadius:2 }}>
                  {error}
                </Alert>
              )}

              <TextField
                label="Username"
                value={form.username}
                onChange={e => setForm(p => ({ ...p, username: e.target.value }))}
                autoComplete="username"
                autoFocus
                fullWidth
              />

              <TextField
                label="Password"
                type={showPwd ? 'text' : 'password'}
                value={form.password}
                onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                autoComplete="current-password"
                fullWidth
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton size="small" onClick={() => setShowPwd(v => !v)} edge="end">
                        {showPwd
                          ? <VisibilityOffOutlined sx={{ fontSize:18 }} />
                          : <VisibilityOutlined sx={{ fontSize:18 }} />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <Button
                type="submit"
                variant="contained"
                fullWidth
                disabled={loading}
                sx={{ mt:0.5, py:1.25, fontSize:14, fontWeight:500 }}
              >
                {loading ? 'Signing in...' : 'Login'}
              </Button>
            </Box>
          </CardContent>
        </Card>

        <Typography sx={{ textAlign:'center', fontSize:12, color:'#8892a4', mt:2 }}>
          Marketing Portal v2.0 — Internal Use Only
        </Typography>
      </Box>
    </Box>
  );
}
