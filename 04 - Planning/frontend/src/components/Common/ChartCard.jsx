// src/components/Common/ChartCard.jsx
import { Box, Typography, Chip } from '@mui/material';

// Small coloured legend dot + label
export function LegendItem({ color, label }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.6 }}>
      <Box sx={{ width: 9, height: 9, borderRadius: '2px', backgroundColor: color, flexShrink: 0 }} />
      <Typography sx={{ fontSize: 11, color: '#525868' }}>{label}</Typography>
    </Box>
  );
}

// Card wrapper used for every chart panel
export default function ChartCard({
  title, subtitle, chip, chipColor = 'primary',
  legend = [], height = 240, children,
}) {
  const chipColors = {
    blue:   { bg: '#eff4ff', color: '#2563eb' },
    green:  { bg: '#f0fdf4', color: '#16a34a' },
    amber:  { bg: '#fffbeb', color: '#d97706' },
    red:    { bg: '#fef2f2', color: '#dc2626' },
    purple: { bg: '#f5f3ff', color: '#7c3aed' },
    teal:   { bg: '#f0fdfa', color: '#0d9488' },
    primary:{ bg: '#eff4ff', color: '#2563eb' },
  };
  const cc = chipColors[chipColor] || chipColors.primary;

  return (
    <Box
      sx={{
        backgroundColor: '#ffffff',
        border: '1px solid #e4e8ef',
        borderRadius: '14px',
        p: '18px 20px',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: legend.length ? 1 : 2 }}>
        <Box>
          <Typography sx={{ fontSize: 13, fontWeight: 500, color: '#0f1117' }}>{title}</Typography>
          {subtitle && (
            <Typography sx={{ fontSize: 11, color: '#8892a4', mt: 0.3 }}>{subtitle}</Typography>
          )}
        </Box>
        {chip && (
          <Box
            sx={{
              fontSize: 10, fontWeight: 500, px: 1, py: 0.375,
              borderRadius: '5px', fontFamily: '"DM Mono", monospace',
              backgroundColor: cc.bg, color: cc.color, flexShrink: 0,
            }}
          >
            {chip}
          </Box>
        )}
      </Box>

      {/* Legend */}
      {legend.length > 0 && (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5, mb: 1.5 }}>
          {legend.map((l, i) => <LegendItem key={i} color={l.color} label={l.label} />)}
        </Box>
      )}

      {/* Chart area */}
      <Box sx={{ flexGrow: 1, height, minHeight: height }}>
        {children}
      </Box>
    </Box>
  );
}
