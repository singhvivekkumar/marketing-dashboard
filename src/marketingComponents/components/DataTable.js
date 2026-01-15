import React, { useState } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Pagination from '@mui/material/Pagination';

function DataTable({ data, sheetName }) {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleChangePage = (event, newValue) => {
    setPage(newValue);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); // Reset to first page when rows per page changes
  };

  const startIndex = page * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const slicedData = data.slice(startIndex, endIndex);

  return (
    <div>
      <Table aria-label="Table for Sheet: {sheetName}">
        <TableHead>
          <TableRow>
            {data.length > 0 && Object.keys(data[0]).map((key, index) => (
              <TableCell key={index}>{key}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {slicedData.map((row, index) => (
            <TableRow key={index}>
              {Object.values(row).map((cell, cellIndex) => (
                <TableCell key={cellIndex}>{cell}</TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Pagination
        count={Math.ceil(data.length / rowsPerPage)}
        page={page + 1}
        onChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </div>
  );
}

export default DataTable;