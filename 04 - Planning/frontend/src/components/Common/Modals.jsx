// src/components/Common/DeleteModal.jsx
import { Dialog, DialogTitle, DialogContent, DialogContentText,
         DialogActions, Button, Typography } from '@mui/material';
import { WarningAmberOutlined } from '@mui/icons-material';

export function DeleteModal({ open, onClose, onConfirm, recordName, loading }) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <WarningAmberOutlined sx={{ color: '#dc2626', fontSize: 20 }} />
        Confirm Delete
      </DialogTitle>
      <DialogContent>
        <DialogContentText sx={{ fontSize: 14 }}>
          Are you sure you want to delete{' '}
          <Typography component="span" sx={{ fontWeight: 600, color: '#0f1117' }}>
            "{recordName}"
          </Typography>
          ? This action cannot be undone.
        </DialogContentText>
      </DialogContent>
      <DialogActions sx={{ px: 2.5, pb: 2.5 }}>
        <Button onClick={onClose} disabled={loading} variant="outlined" size="small">
          Cancel
        </Button>
        <Button
          onClick={onConfirm}
          disabled={loading}
          variant="contained"
          color="error"
          size="small"
        >
          {loading ? 'Deleting...' : 'Delete'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

// src/components/Common/StatusChip.jsx
export function StatusChip({ status }) {
  const map = {
    Won:              { bg: '#f0fdf4', color: '#16a34a' },
    Lost:             { bg: '#fef2f2', color: '#dc2626' },
    Active:           { bg: '#eff4ff', color: '#2563eb' },
    Open:             { bg: '#eff4ff', color: '#2563eb' },
    Closed:           { bg: '#f1f3f7', color: '#525868' },
    Participated:     { bg: '#f0fdfa', color: '#0d9488' },
    'Not-Participated':{ bg: '#fffbeb', color: '#d97706' },
    Submitted:        { bg: '#f5f3ff', color: '#7c3aed' },
    'In progress':    { bg: '#eff4ff', color: '#2563eb' },
    'Pending docs':   { bg: '#fffbeb', color: '#d97706' },
    'Draft ready':    { bg: '#f0fdf4', color: '#16a34a' },
    Delivered:        { bg: '#f0fdf4', color: '#16a34a' },
    Cancelled:        { bg: '#fef2f2', color: '#dc2626' },
  };
  const s = map[status] || { bg: '#f1f3f7', color: '#525868' };

  return (
    <Typography
      component="span"
      sx={{
        display: 'inline-flex', alignItems: 'center',
        fontSize: 10, fontWeight: 500,
        px: 0.875, py: 0.25, borderRadius: '4px',
        backgroundColor: s.bg, color: s.color,
      }}
    >
      {status}
    </Typography>
  );
}
