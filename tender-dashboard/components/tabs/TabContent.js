// components/tabs/TabContent.jsx - Main Tab Content Wrapper

import { useState } from 'react';
import { Box, Button, CircularProgress } from '@mui/material';
import FeatureSelectionCard from '../cards/FeatureSelectionCard';
import DataTable from '../tables/DataTable';
import ExcelUpload from '../upload/ExcelUpload';

const TabContent = ({
  formType,
  formName,
  tableComponent: TableComponent,
  formComponent: FormComponent,
  tableColumns = [],
  tableData = [],
  formFields = [],
  onFormSubmit,
  onTableDataDelete,
  loading = false
}) => {
  const [mode, setMode] = useState('select'); // 'select', 'view', 'form', 'upload'
  const [refreshKey, setRefreshKey] = useState(0);

  const handleBackToSelection = () => {
    setMode('select');
    setRefreshKey(prev => prev + 1);
  };

  const handleFormSubmit = async (data) => {
    if (onFormSubmit) {
      await onFormSubmit(data);
    }
    handleBackToSelection();
  };

  return (
    <Box sx={{ width: '100%', mb: 4 }}>
      {/* Back Button - Show when not in selection mode */}
      {mode !== 'select' && (
        <Box sx={{ mb: 2 }}>
          <Button
            variant="outlined"
            onClick={handleBackToSelection}
            sx={{ mb: 2 }}
          >
            ← Back to Selection
          </Button>
        </Box>
      )}

      {/* Content Based on Mode */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          {mode === 'select' && (
            <FeatureSelectionCard
              formName={formName}
              onSelectView={() => setMode('view')}
              onSelectForm={() => setMode('form')}
              onSelectUpload={() => setMode('upload')}
            />
          )}

          {mode === 'view' && TableComponent && (
            <TableComponent
              data={tableData}
              columns={tableColumns}
              onDelete={onTableDataDelete}
              onBack={handleBackToSelection}
            />
          )}

          {mode === 'form' && FormComponent && (
            <FormComponent
              fields={formFields}
              onSubmit={handleFormSubmit}
              onCancel={handleBackToSelection}
            />
          )}

          {mode === 'upload' && (
            <ExcelUpload
              fields={formFields}
              formType={formType}
              title={`Bulk Upload - ${formName}`}
              onUpload={async (data) => {
                if (onFormSubmit) {
                  for (const record of data) {
                    await onFormSubmit(record);
                  }
                }
                handleBackToSelection();
              }}
            />
          )}
        </>
      )}
    </Box>
  );
};

export default TabContent;
