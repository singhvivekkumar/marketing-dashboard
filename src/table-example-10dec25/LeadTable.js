// src/components/LeadTable/LeadTable.js

import { useState } from "react";
import {
  Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow, Paper, TablePagination, TextField, IconButton,
  Checkbox, Menu, MenuItem, Button
} from "@mui/material";
import ViewColumnIcon from "@mui/icons-material/ViewColumn";
import { leadColumns } from "./columns";

const LeadTable = ({ rows, onAdd }) => {
  const [search, setSearch] = useState("");
  const [visibleColumns, setVisibleColumns] = useState(
    leadColumns.reduce((acc, col) => ({ ...acc, [col.id]: true }), {})
  );
  const [anchorEl, setAnchorEl] = useState(null);

  const handleColumnToggle = (id) => {
    setVisibleColumns((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const filteredRows = rows.filter((row) =>
    Object.values(row).some((value) =>
      String(value).toLowerCase().includes(search.toLowerCase())
    )
  );

  return (
    <>
      {/* Top Bar */}
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
        {/* <TextField
          label="Search"
          variant="outlined"
          size="small"
          onChange={(e) => setSearch(e.target.value)}
        /> */}
 
        <div>
          <IconButton onClick={(e) => setAnchorEl(e.currentTarget)}>
            <ViewColumnIcon />
          </IconButton>

          <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}>
            {leadColumns.map((col) => (
              <MenuItem key={col.id}>
                <Checkbox
                  checked={visibleColumns[col.id]}
                  onChange={() => handleColumnToggle(col.id)}
                />
                {col.label}
              </MenuItem>
            ))}
          </Menu>
        </div>
      </div>

      {/* Table */}
      <TableContainer component={Paper}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              {leadColumns.map(
                (col) =>
                  visibleColumns[col.id] && (
                    <TableCell key={col.id}>{col.label}</TableCell>
                  )
              )}
            </TableRow>
          </TableHead>

          <TableBody>
            {filteredRows.map((row, idx) => (
              <TableRow hover key={idx}>
                {leadColumns.map(
                  (col) =>
                    visibleColumns[col.id] && (
                      <TableCell key={col.id}>{row[col.id]}</TableCell>
                    )
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default LeadTable;
