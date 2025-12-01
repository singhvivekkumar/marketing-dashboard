// components/cards/FeatureSelectionCard.jsx - Selection Card Component

import {
  Card,
  CardContent,
  CardHeader,
  Button,
  Grid,
  Typography,
  Box,
  Paper
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import AddIcon from '@mui/icons-material/Add';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

const FeatureSelectionCard = ({ 
  onSelectView, 
  onSelectForm, 
  onSelectUpload,
  formName 
}) => {
  return (
    <Box sx={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center',
      minHeight: '400px',
      p: 2
    }}>
      <Card sx={{ 
        width: '100%', 
        maxWidth: 900,
        boxShadow: 3,
        borderRadius: 2
      }}>
        <CardHeader
          title={`${formName} Management`}
          subheader="Select an option to get started"
          sx={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            textAlign: 'center'
          }}
          titleTypographyProps={{ color: 'white', variant: 'h5' }}
          subheaderTypographyProps={{ color: 'rgba(255,255,255,0.8)' }}
        />
        
        <CardContent sx={{ p: 4 }}>
          <Grid container spacing={3}>
            {/* View Data Button */}
            <Grid item xs={12} sm={6} md={4}>
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  textAlign: 'center',
                  border: '2px solid #e0e0e0',
                  borderRadius: 2,
                  transition: 'all 0.3s ease',
                  cursor: 'pointer',
                  '&:hover': {
                    borderColor: '#667eea',
                    boxShadow: '0 8px 24px rgba(102, 126, 234, 0.2)',
                    transform: 'translateY(-4px)'
                  }
                }}
                onClick={onSelectView}
              >
                <VisibilityIcon sx={{ 
                  fontSize: 48, 
                  color: '#667eea',
                  mb: 2
                }} />
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                  View Data
                </Typography>
                <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                  View all records in a table format with sorting, filtering, and export options.
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<VisibilityIcon />}
                  onClick={onSelectView}
                  sx={{ 
                    backgroundColor: '#667eea',
                    '&:hover': { backgroundColor: '#5568d3' }
                  }}
                >
                  View
                </Button>
              </Paper>
            </Grid>

            {/* Add Form Button */}
            <Grid item xs={12} sm={6} md={4}>
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  textAlign: 'center',
                  border: '2px solid #e0e0e0',
                  borderRadius: 2,
                  transition: 'all 0.3s ease',
                  cursor: 'pointer',
                  '&:hover': {
                    borderColor: '#66bb6a',
                    boxShadow: '0 8px 24px rgba(102, 187, 106, 0.2)',
                    transform: 'translateY(-4px)'
                  }
                }}
              >
                <AddIcon sx={{ 
                  fontSize: 48, 
                  color: '#66bb6a',
                  mb: 2
                }} />
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                  Add New Entry
                </Typography>
                <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                  Fill out the form to add a new record with validation and confirmation.
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={onSelectForm}
                  sx={{ 
                    backgroundColor: '#66bb6a',
                    '&:hover': { backgroundColor: '#4caf50' }
                  }}
                >
                  Add Entry
                </Button>
              </Paper>
            </Grid>

            {/* Bulk Upload Button */}
            <Grid item xs={12} sm={6} md={4}>
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  textAlign: 'center',
                  border: '2px solid #e0e0e0',
                  borderRadius: 2,
                  transition: 'all 0.3s ease',
                  cursor: 'pointer',
                  '&:hover': {
                    borderColor: '#ffa726',
                    boxShadow: '0 8px 24px rgba(255, 167, 38, 0.2)',
                    transform: 'translateY(-4px)'
                  }
                }}
              >
                <CloudUploadIcon sx={{ 
                  fontSize: 48, 
                  color: '#ffa726',
                  mb: 2
                }} />
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                  Bulk Upload
                </Typography>
                <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                  Upload multiple records from an Excel file with sample template provided.
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<CloudUploadIcon />}
                  onClick={onSelectUpload}
                  sx={{ 
                    backgroundColor: '#ffa726',
                    '&:hover': { backgroundColor: '#fb8c00' }
                  }}
                >
                  Upload
                </Button>
              </Paper>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
};

export default FeatureSelectionCard;
