import {
  Box,
  Paper,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Tabs,
} from "@mui/material";
import { useState } from "react";
import crmData from "../utils/CrmData";
import {  } from "xlsx";


const ViewTabs = () => {

  const table2Data = [
    { id: 4, name: "Product X", quantity: 5 },
    { id: 5, name: "Product Y", quantity: 10 },
    { id: 6, name: "Product Z", quantity: 15 },
  ];

  const [value, setValue] = useState(0); //  Manage the active tab

  const handleChange = (event, newValue) => {
    console.log("------------------", newValue);
    setValue(newValue);
  };

  return (
    <Box sx={{ borderBottom: 1, width: "100%" }} style={{}}>
      <Tabs value={value} onChange={handleChange} aria-label="tab examples">
        <Tab label="CRM Leads" value="0" />
        <Tab label="Table 2" value="1" />
      </Tabs>

      {value === "0" && (
        <Paper elevation={3} sx={{ mt: 2, padding: 2 }}>
          <Table aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Serial No.</TableCell>
                <TableCell>Lead Id</TableCell>
                <TableCell>Issue Date</TableCell>
                <TableCell>Tender Name</TableCell>
                <TableCell>Organisation</TableCell>
                <TableCell>BQ/ EOI/ RFP/ RFQ/NIT/RFI </TableCell>
                <TableCell>ST/MT/Nom/LT </TableCell>
                <TableCell>EMD in lakhs</TableCell>
                <TableCell>Tender Value in lakhs"</TableCell>
                <TableCell>Last Date of Submission </TableCell>
                <TableCell>Pre - Bid Date</TableCell>
                <TableCell>Team Assigned</TableCell>
                <TableCell>Remarks</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {crmData.map((row) => (
                <TableRow key={row.id}>
                  <TableCell>{row.srNo}</TableCell>
                  <TableCell>{row.leadID}</TableCell>
                  <TableCell>{new Date(row.issueDate).toLocaleDateString('en-US')}</TableCell>
                  <TableCell>{row.tenderName}</TableCell>
                  <TableCell>{row.organisation}</TableCell>
                  <TableCell>{row.bqEoiRfpRfqNitRfi}</TableCell>
                  <TableCell>{row.stMtNomLt}</TableCell>
                  <TableCell>{row.emd}</TableCell>
                  <TableCell>{row.tenderValue}</TableCell>
                  <TableCell>{new Date(row.lastDateOfSubmission).toLocaleDateString()}</TableCell>
                  <TableCell>{new Date(row.pr).toLocaleDateString()}</TableCell>
                  <TableCell>{row.teamAssigned}</TableCell>
                  <TableCell>{row.remarks}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      )}

      {value === "1" && (
        <Paper elevation={3} sx={{ mt: 2, padding: 2 }}>
          <Table aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Quantity</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {table2Data.map((row) => (
                <TableRow key={row.id}>
                  <TableCell>{row.id}</TableCell>
                  <TableCell>{row.name}</TableCell>
                  <TableCell>{row.quantity}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      )}
    </Box>
  );
};

export default ViewTabs;
