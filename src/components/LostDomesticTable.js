import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Box,
} from "@mui/material";

function LostDomesticTable({ leads }) {
  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h5" gutterBottom fontWeight="bold">
        Lost Domestic Leads — Table View
      </Typography>

      <TableContainer component={Paper} elevation={3}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Serial No</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Customer</TableCell>
              <TableCell>Tender Type</TableCell>
              <TableCell>Bid Type</TableCell>
              <TableCell>Value W/O GST</TableCell>
              <TableCell>Value With GST</TableCell>
              <TableCell>Reason</TableCell>
              <TableCell>Year</TableCell>
              <TableCell>Partner</TableCell>
              <TableCell>Competitors</TableCell>
              <TableCell>Technical Scores</TableCell>
              <TableCell>Quoted Prices</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {leads.map((row, index) => (
              <TableRow key={index}>
                <TableCell>{row.serialNumber}</TableCell>
                <TableCell>{row.tenderDescription}</TableCell>
                <TableCell>{row.customer}</TableCell>
                <TableCell>{row.tenderType}</TableCell>
                <TableCell>{row.bidType}</TableCell>
                <TableCell>{row.valueWithoutGST}</TableCell>
                <TableCell>{row.valueWithGST}</TableCell>
                <TableCell>{row.reasonForLosing}</TableCell>
                <TableCell>{row.year}</TableCell>
                <TableCell>{row.partner}</TableCell>

                {/* Competitors */}
                <TableCell>
                  {row.competitors?.map((comp, i) => (
                    <div key={i}>
                      <strong>{comp.name}</strong>
                      <br />
                      {comp.address}
                      <hr />
                    </div>
                  ))}
                </TableCell>

                {/* Technical Scores */}
                <TableCell>
                  {row.technicalScores?.map((tech, i) => (
                    <div key={i}>
                      <strong>{tech.competitor}</strong>: {tech.score}
                      <hr />
                    </div>
                  ))}
                </TableCell>

                {/* Quoted Prices */}
                <TableCell>
                  {row.quotedPrices?.map((qp, i) => (
                    <div key={i}>
                      <strong>{qp.competitor}</strong>: {qp.price}
                      <hr />
                    </div>
                  ))}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>

        </Table>
      </TableContainer>
    </Box>
  );
}


export default LostDomesticTable;