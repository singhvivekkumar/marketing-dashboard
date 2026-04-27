import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Chip,
  Box,
  CircularProgress,
  TablePagination,
  TextField,
  InputAdornment,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';

const LeadList = ({ leads, loading, onSelectLead, onEdit }) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const filteredLeads = leads.filter(lead =>
    lead.tenderName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lead.tenderReferenceNo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lead.businessDomain?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const paginatedLeads = filteredLeads.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const getStageColor = (stage) => {
    const colors = {
      'Pre-Qualification': 'info',
      'Technical Qualification': 'warning',
      'Commercial Qualification': 'primary',
      'Evaluation': 'secondary',
      'Result': 'success',
      'Closed': 'default',
    };
    return colors[stage] || 'default';
  };

  const getOutcomeChip = (outcome) => {
    const colors = {
      'Won': 'success',
      'Lost': 'error',
      'Pending': 'warning',
      'Not-Participated': 'default',
    };
    return colors[outcome] || 'default';
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 5 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      {/* Search Bar */}
      <Box sx={{ mb: 2 }}>
        <TextField
          fullWidth
          placeholder="Search by tender name, reference, or domain..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      {/* Table */}
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="leads table">
          <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
            <TableRow>
              <TableCell fontWeight="bold">Tender Name</TableCell>
              <TableCell align="center">Reference No</TableCell>
              <TableCell align="center">Domain</TableCell>
              <TableCell align="center">Sector</TableCell>
              <TableCell align="center">Type</TableCell>
              <TableCell align="center">Value (Cr)</TableCell>
              <TableCell align="center">Stage</TableCell>
              <TableCell align="center">Outcome</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedLeads.length > 0 ? (
              paginatedLeads.map((lead) => (
                <TableRow key={lead.id} hover>
                  <TableCell sx={{ fontWeight: 500 }}>{lead.tenderName}</TableCell>
                  <TableCell align="center" sx={{ fontSize: '0.85rem' }}>
                    {lead.tenderReferenceNo || '—'}
                  </TableCell>
                  <TableCell align="center" sx={{ fontSize: '0.85rem' }}>
                    {lead.businessDomain}
                  </TableCell>
                  <TableCell align="center">
                    <Chip
                      label={lead.civilDefence}
                      variant="outlined"
                      size="small"
                      color={lead.civilDefence === 'Civil' ? 'primary' : 'secondary'}
                    />
                  </TableCell>
                  <TableCell align="center" sx={{ fontSize: '0.85rem' }}>
                    {lead.tenderType}
                  </TableCell>
                  <TableCell align="center" sx={{ fontWeight: 500 }}>
                    ₹{lead.estimatedValueCr}
                  </TableCell>
                  <TableCell align="center">
                    <Chip
                      label={lead.biddingProcess?.currentStage || 'Not Started'}
                      size="small"
                      color={getStageColor(lead.biddingProcess?.currentStage)}
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell align="center">
                    <Chip
                      label={lead.outcome || 'Pending'}
                      size="small"
                      color={getOutcomeChip(lead.outcome)}
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell align="center">
                    <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                      <Button
                        size="small"
                        startIcon={<VisibilityIcon />}
                        onClick={() => onSelectLead(lead)}
                        variant="outlined"
                      >
                        View
                      </Button>
                      {onEdit && (
                        <Button
                          size="small"
                          startIcon={<EditIcon />}
                          onClick={() => onEdit(lead)}
                          variant="outlined"
                        >
                          Edit
                        </Button>
                      )}
                    </Box>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={9} align="center" sx={{ py: 3 }}>
                  No leads found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={filteredLeads.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Box>
  );
};

export default LeadList;
