import React from 'react';
import { Grid, Card, CardContent, Typography, Box } from '@mui/material';
import { TrendingUp, TrendingDown } from '@mui/icons-material';

export default function KPIGrid({ kpis }) {
  return (
    <Grid container spacing={1.5}> 
      {kpis.map((kpi, idx) => (
        <Grid item xs={12} sm={6} md={4} lg={2} key={idx}>
          <Card
            sx={{
              height: '100%',
              border: '1px solid #e4e8ef',
              borderRadius: '14px',
              padding: '14px 16px',
              backgroundColor: '#ffffff',
              transition: 'all 0.2s',
              '&:hover': {
                boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
              },
            }}
          >
            <CardContent sx={{ padding: 0 }}>
              <Typography
                sx={{
                  fontSize: '11px',
                  color: '#8892a4',
                  fontWeight: 500,
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                  marginBottom: '6px',
                }}
              >
                {kpi.label}
              </Typography>

              <Typography
                sx={{
                  fontSize: '22px',
                  fontWeight: 600,
                  color: '#0f1117',
                  fontFamily: '"DM Mono", monospace',
                  letterSpacing: '-0.5px',
                }}
              >
                {kpi.value}
              </Typography>

              {kpi.delta && (
                <Box
                  sx={{
                    fontSize: '11px',
                    marginTop: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '3px',
                    fontFamily: '"DM Mono", monospace',
                    color:
                      kpi.deltaType === 'up'
                        ? '#16a34a'
                        : kpi.deltaType === 'down'
                          ? '#dc2626'
                          : '#8892a4',
                  }}
                >
                  {kpi.deltaType === 'up' && <TrendingUp sx={{ fontSize: '14px' }} />}
                  {kpi.deltaType === 'down' && <TrendingDown sx={{ fontSize: '14px' }} />}
                  {kpi.delta}
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}
