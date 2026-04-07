// src/components/Common/KPICard.jsx
import { Box, Typography } from '@mui/material';
import { TrendingUp, TrendingDown, TrendingFlat } from '@mui/icons-material';

export default function KPICard({ label, value, delta, deltaType = 'neutral' }) {
  const deltaColors = { up: '#16a34a', down: '#dc2626', neutral: '#8892a4' };
  const DeltaIcon = deltaType === 'up' ? TrendingUp
    : deltaType === 'down' ? TrendingDown : TrendingFlat;

  return (
    <Box
      sx={{
        backgroundColor: '#ffffff',
        border: '1px solid #e4e8ef',
        borderRadius: '14px',
        p: '14px 16px',
      }}
    >
      <Typography
        sx={{
          fontSize: 10, fontWeight: 500, color: '#8892a4',
          textTransform: 'uppercase', letterSpacing: '0.06em', mb: 0.75,
        }}
      >
        {label}
      </Typography>
      <Typography
        sx={{
          fontSize: 22, fontWeight: 600, color: '#0f1117',
          fontFamily: '"DM Mono", monospace', letterSpacing: '-0.5px', lineHeight: 1.2,
        }}
      >
        {value}
      </Typography>
      {delta && (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.4, mt: 0.5 }}>
          <DeltaIcon sx={{ fontSize: 12, color: deltaColors[deltaType] }} />
          <Typography
            sx={{
              fontSize: 11, color: deltaColors[deltaType],
              fontFamily: '"DM Mono", monospace',
            }}
          >
            {delta}
          </Typography>
        </Box>
      )}
    </Box>
  );
}
