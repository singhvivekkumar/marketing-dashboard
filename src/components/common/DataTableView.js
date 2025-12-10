// Data Table Component
import React from "react";
import { 
  Paper, 
  Typography, 
  TextField, 
  Button, 
  Grid, 
  Box,
  Chip,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TableSortLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  InputAdornment,
} from '@mui/material';

function DataTableView({ data, onBack, onAddRecord, onDeleteRecord }) {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [orderBy, setOrderBy] = React.useState('serialNumber');
  const [order, setOrder] = React.useState('asc');
  const [detailsOpen, setDetailsOpen] = React.useState(false);
  const [selectedRecord, setSelectedRecord] = React.useState(null);

  const handleSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const filteredData = React.useMemo(() => {
    return data.filter(row => {
      const searchLower = searchQuery.toLowerCase();
      return Object.values(row).some(val => 
        String(val).toLowerCase().includes(searchLower)
      );
    });
  }, [data, searchQuery]);

  const sortedData = React.useMemo(() => {
    return [...filteredData].sort((a, b) => {
      const aVal = a[orderBy];
      const bVal = b[orderBy];
      if (aVal < bVal) return order === 'asc' ? -1 : 1;
      if (aVal > bVal) return order === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filteredData, orderBy, order]);

  const paginatedData = sortedData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(value);
  };

  const exportToCSV = () => {
    const headers = ['Serial Number', 'Tender Name', 'Customer', 'Tender Type', 'Value (Ex. GST)', 'Value (Inc. GST)', 'Year', 'Status', 'Created Date'];
    const csvData = sortedData.map(row => [
      row.serialNumber,
      row.tenderName,
      row.customer,
      row.tenderType,
      row.valueWithoutGST,
      row.valueWithGST,
      row.year,
      row.status,
      row.createdAt
    ]);
    
    const csvContent = [
      headers.join(','),
      ...csvData.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `tender-data-${new Date().toISOString().slice(0,10)}.csv`;
    a.click();
  };

  return (
    <Box>
      {/* buttons for back to menu and download */}
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
        {/* back to menu */}
        <Button
          variant="outlined"
          startIcon={<span className="material-icons">arrow_back</span>}
          onClick={onBack}
        >
          Back to Menu
        </Button>
        {/* download CSV data */}
        <Button
          variant="contained"
          color="success"
          startIcon={<span className="material-icons">download</span>}
          onClick={exportToCSV}
        >
          Export to CSV
        </Button>
      </Box>

    {/* search across all fields */}
      <Box sx={{ mb: 3 }}>
        <TextField
          fullWidth
          placeholder="Search across all fields..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: <InputAdornment position="start"><span className="material-icons">search</span></InputAdornment>
          }}
        />
      </Box>

          {/* now the table has started with tablecontainer */}
      <TableContainer component={Paper} elevation={2}>
        <Table>
          <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
            <TableRow>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'serialNumber'}
                  direction={orderBy === 'serialNumber' ? order : 'asc'}
                  onClick={() => handleSort('serialNumber')}
                >
                  Serial Number
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'tenderName'}
                  direction={orderBy === 'tenderName' ? order : 'asc'}
                  onClick={() => handleSort('tenderName')}
                >
                  Tender Name
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'customer'}
                  direction={orderBy === 'customer' ? order : 'asc'}
                  onClick={() => handleSort('customer')}
                >
                  Customer
                </TableSortLabel>
              </TableCell>
              <TableCell>Tender Type</TableCell>
              <TableCell align="right">
                <TableSortLabel
                  active={orderBy === 'valueWithoutGST'}
                  direction={orderBy === 'valueWithoutGST' ? order : 'asc'}
                  onClick={() => handleSort('valueWithoutGST')}
                >
                  Value (Ex. GST)
                </TableSortLabel>
              </TableCell>
              <TableCell align="right">
                <TableSortLabel
                  active={orderBy === 'valueWithGST'}
                  direction={orderBy === 'valueWithGST' ? order : 'asc'}
                  onClick={() => handleSort('valueWithGST')}
                >
                  Value (Inc. GST)
                </TableSortLabel>
              </TableCell>
              <TableCell align="center">
                <TableSortLabel
                  active={orderBy === 'year'}
                  direction={orderBy === 'year' ? order : 'asc'}
                  onClick={() => handleSort('year')}
                >
                  Year
                </TableSortLabel>
              </TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="center">
                <TableSortLabel
                  active={orderBy === 'createdAt'}
                  direction={orderBy === 'createdAt' ? order : 'asc'}
                  onClick={() => handleSort('createdAt')}
                >
                  Created Date
                </TableSortLabel>
              </TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedData.map((row) => (
              <TableRow key={row.id} hover>
                <TableCell>{row.serialNumber}</TableCell>
                <TableCell>{row.tenderName}</TableCell>
                <TableCell>{row.customer}</TableCell>
                <TableCell>{row.tenderType}</TableCell>
                <TableCell align="right">{formatCurrency(row.valueWithoutGST)}</TableCell>
                <TableCell align="right">{formatCurrency(row.valueWithGST)}</TableCell>
                <TableCell align="center">{row.year}</TableCell>
                <TableCell>
                  <Chip
                    label={row.status}
                    color={row.status === 'Won' ? 'success' : row.status === 'Lost' ? 'error' : 'default'}
                    size="small"
                  />
                </TableCell>
                <TableCell align="center">{row.createdAt}</TableCell>
                <TableCell align="center">
                  <IconButton
                    size="small"
                    color="primary"
                    onClick={() => { setSelectedRecord(row); setDetailsOpen(true); }}
                  >
                    <span className="material-icons" style={{ fontSize: 20 }}>visibility</span>
                  </IconButton>
                  <IconButton
                    size="small"
                    color="error"
                    onClick={() => onDeleteRecord(row.id)}
                  >
                    <span className="material-icons" style={{ fontSize: 20 }}>delete</span>
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>


      <TablePagination
        component="div"
        count={filteredData.length}
        page={page}
        onPageChange={(e, newPage) => setPage(newPage)}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={(e) => { setRowsPerPage(parseInt(e.target.value, 10)); setPage(0); }}
        rowsPerPageOptions={[5, 10, 25, 50]}
      />

            {/* to show a row in details */}
      <Dialog open={detailsOpen} onClose={() => setDetailsOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Record Details</DialogTitle>
        <DialogContent>
          {selectedRecord && (
            <Box sx={{ pt: 2 }}>
              <Grid container spacing={2}>
                {Object.entries(selectedRecord).map(([key, value]) => (
                  key !== 'id' && (
                    <Grid item xs={12} sm={6} key={key}>
                      <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
                        {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                      </Typography>
                      <Typography variant="body1">
                        {typeof value === 'number' && key.includes('value') ? formatCurrency(value) : String(value)}
                      </Typography>
                    </Grid>
                  )
                ))}
              </Grid>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDetailsOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>


    </Box>
  );
}

export default DataTableView;