// components/tables/DataTable.jsx - Generic Reusable Table Component

import React, { useState, useMemo } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  TextField,
  Box,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  Tooltip
} from '@mui/material';
import {
  Delete as DeleteIcon,
  Edit as EditIcon,
  Download as DownloadIcon,
  Close as CloseIcon,
  Visibility as VisibilityIcon
} from '@mui/icons-material';

const DataTable = ({
  data = [],
  columns = [],
  onDelete,
  onEdit,
  onClose,
  title = 'Data Table',
  loading = false
}) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRow, setSelectedRow] = useState(null);
  const [openDetail, setOpenDetail] = useState(false);
  const [sortBy, setSortBy] = useState(null);
  const [sortOrder, setSortOrder] = useState('asc');

  // Filter data based on search
  const filteredData = useMemo(() => {
    return data.filter(row =>
      Object.values(row).some(val =>
        String(val).toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [data, searchTerm]);

  // Sort data
  const sortedData = useMemo(() => {
    if (!sortBy) return filteredData;
    
    return [...filteredData].sort((a, b) => {
      const aVal = a[sortBy];
      const bVal = b[sortBy];
      
      if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filteredData, sortBy, sortOrder]);

  // Paginate data
  const paginatedData = sortedData.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSort = (columnKey) => {
    if (sortBy === columnKey) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(columnKey);
      setSortOrder('asc');
    }
  };

  const handleExportCSV = () => {
    const csvContent = [
      columns.map(col => col.label).join(','),
      ...sortedData.map(row =>
        columns.map(col => {
          const value = row[col.key];
          return typeof value === 'string' && value.includes(',')
            ? `"${value}"`
            : value;
        }).join(',')
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title}-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const handleViewDetail = (row) => {
    setSelectedRow(row);
    setOpenDetail(true);
  };

  return (
    <Box sx={{ width: '100%' }}>
      {/* Header with Title and Export */}
      <Box sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        mb: 2,
        flexWrap: 'wrap',
        gap: 2
      }}>
        <h2>{title}</h2>
        <Button
          startIcon={<DownloadIcon />}
          onClick={handleExportCSV}
          variant="outlined"
          size="small"
        >
          Export CSV
        </Button>
      </Box>

      {/* Search Field */}
      <Box sx={{ mb: 2 }}>
        <TextField
          label="Search"
          variant="outlined"
          size="small"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setPage(0);
          }}
          placeholder="Search in all columns..."
          fullWidth
        />
      </Box>

      {/* Table */}
      <TableContainer component={Paper} sx={{ mb: 2 }}>
        <Table>
          <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
            <TableRow>
              {columns.map((col) => (
                <TableCell
                  key={col.key}
                  onClick={() => col.sortable && handleSort(col.key)}
                  sx={{
                    fontWeight: 'bold',
                    cursor: col.sortable ? 'pointer' : 'default',
                    '&:hover': col.sortable ? { backgroundColor: '#e0e0e0' } : {}
                  }}
                >
                  {col.label}
                  {sortBy === col.key && (
                    <span> {sortOrder === 'asc' ? '▲' : '▼'}</span>
                  )}
                </TableCell>
              ))}
              <TableCell sx={{ fontWeight: 'bold' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedData.map((row, idx) => (
              <TableRow key={idx} hover>
                {columns.map((col) => (
                  <TableCell key={col.key}>
                    {col.type === 'date'
                      ? new Date(row[col.key]).toLocaleDateString()
                      : col.type === 'currency'
                      ? `₹${Number(row[col.key]).toFixed(2)}`
                      : col.type === 'status'
                      ? <Chip label={row[col.key]} size="small" />
                      : String(row[col.key]).substring(0, 100)}
                  </TableCell>
                ))}
                <TableCell>
                  <Tooltip title="View Details">
                    <IconButton
                      size="small"
                      onClick={() => handleViewDetail(row)}
                      color="primary"
                    >
                      <VisibilityIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  {onEdit && (
                    <Tooltip title="Edit">
                      <IconButton
                        size="small"
                        onClick={() => onEdit(row)}
                        color="info"
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  )}
                  {onDelete && (
                    <Tooltip title="Delete">
                      <IconButton
                        size="small"
                        onClick={() => onDelete(row.id)}
                        color="error"
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      <TablePagination
        rowsPerPageOptions={[5, 10, 25, 50]}
        component="div"
        count={sortedData.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />

      {/* Detail Dialog */}
      <Dialog open={openDetail} onClose={() => setOpenDetail(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          Record Details
          <IconButton
            onClick={() => setOpenDetail(false)}
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          {selectedRow && (
            <Box sx={{ mt: 2 }}>
              {columns.map((col) => (
                <Box key={col.key} sx={{ mb: 2, pb: 1, borderBottom: '1px solid #eee' }}>
                  <strong>{col.label}:</strong>
                  <Typography variant="body2" sx={{ mt: 0.5 }}>
                    {col.type === 'date'
                      ? new Date(selectedRow[col.key]).toLocaleDateString()
                      : col.type === 'currency'
                      ? `₹${Number(selectedRow[col.key]).toFixed(2)}`
                      : String(selectedRow[col.key])}
                  </Typography>
                </Box>
              ))}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDetail(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default DataTable;
