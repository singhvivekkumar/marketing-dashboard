import React from "react";
import { useForm, Controller } from "react-hook-form";
import { 
	Typography, 
	Button, 
	Grid, 
	Box,
	Card,
	CardContent
} from '@mui/material';

function FeatureSelectionCard({ onSelectFeature }) {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
      <Card elevation={4} sx={{ maxWidth: 600, width: '100%', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h4" sx={{ color: 'white', fontWeight: 700, mb: 1, textAlign: 'center' }}>
            Select Action
          </Typography>
          <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.9)', mb: 4, textAlign: 'center' }}>
            Choose what you'd like to do
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Button
                fullWidth
                variant="contained"
                size="large"
                onClick={() => onSelectFeature('view')}
                sx={{
                  backgroundColor: '#1976d2',
                  color: 'white',
                  py: 2,
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  '&:hover': { backgroundColor: '#1565c0' }
                }}
                startIcon={<span className="material-icons">table_view</span>}
              >
                View Data
              </Button>
            </Grid>
            <Grid item xs={12}>
              <Button
                fullWidth
                variant="contained"
                size="large"
                onClick={() => onSelectFeature('add')}
                sx={{
                  backgroundColor: '#2e7d32',
                  color: 'white',
                  py: 2,
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  '&:hover': { backgroundColor: '#1b5e20' }
                }}
                startIcon={<span className="material-icons">add_circle</span>}
              >
                Add Entry
              </Button>
            </Grid>
            <Grid item xs={12}>
              <Button
                fullWidth
                variant="contained"
                size="large"
                onClick={() => onSelectFeature('upload')}
                sx={{
                  backgroundColor: '#ed6c02',
                  color: 'white',
                  py: 2,
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  '&:hover': { backgroundColor: '#e65100' }
                }}
                startIcon={<span className="material-icons">upload_file</span>}
              >
                Bulk Upload
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
}

export default FeatureSelectionCard;