import { useState } from "react";
import {
  Box,
  Button,
  Container,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import DatePicker from "react-datepicker";

const OrderReceivedDomestic = () => {
  const [orderReceived, setOrderReceived] = useState({
    slNo: "",
    contractName: "",
    customerName: "",
    customerAddress: "",
    orderReceivedDate: null,
    poWoNo: "",
    typeStMt: "",
    valueWithoutGST: "",
    valueWithGST: "",
    competitorsName: "",
    remarks: "",
    documentType: "", //for contract copy/work order doc
  });

  const {
    slNo,
    contractName,
    customerName,
    customerAddress,
    orderReceivedDate,
    poWoNo,
    typeStMt,
    valueWithoutGST,
    valueWithGST,
    competitorsName,
    remarks,
    documentType,
  } = orderReceived;

  const types = [
    { value: "ST", label: "ST" },
    { value: "MT", label: "MT" },
  ];

  const contractCopyOptions = [
    { value: "Contract", label: "Contract" },
    { value: "Work Order", label: "Work Order" },
    { value: "LOI", label: "LOI" },
    { value: "", label: "None" }, //added none to drop down
  ];

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setOrderReceived({
      ...orderReceived,
      [name]: value,
    });
  };

  const handleDateChange = (newValue) => {
    setOrderReceived({ ...orderReceived, orderReceivedDate: newValue });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // Logic to handle form submission (e.g., send data to server)
    console.log("Form Data:", orderReceived);
  };

  return (
    <Container>
      <form>
        <Typography variant="h6" gutterBottom>
          Domestic Orders
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Sl. No."
              name="slNo"
              fullWidth
              value={slNo}
              onChange={handleInputChange}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label="Contract Name"
              name="contractName"
              fullWidth
              value={contractName}
              onChange={handleInputChange}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label="Customer Name"
              name="customerName"
              value={customerName}
              onChange={handleInputChange}
              fullWidth
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label="Customer Address"
              name="customerAddress"
              fullWidth
              value={customerAddress}
              onChange={handleInputChange}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label="Order Received Date"
              name="orderReceivedDate"
              fullWidth
              value={orderReceivedDate}
            onChange={handleDateChange}
            format="yyyy-MM-dd"
            type="date"
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label="PO/WO No"
              name="poWoNo"
              fullWidth
              value={poWoNo}
              onChange={handleInputChange}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel htmlFor="type">Type</InputLabel>
              <Select
                name="type"
                label="Type"
                value={typeStMt}
                onChange={handleInputChange}
              >
                {types.map((type) => (
                  <MenuItem key={type.value} value={type.value}>
                    {type.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label="Value in Cr. without GST"
              name="valueWithoutGST"
              fullWidth
              value={valueWithoutGST}
              onChange={handleInputChange}
              type="number"
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label="Value in Cr. with GST"
              name="valueWithGST"
              value={valueWithGST}
              onChange={handleInputChange}
              fullWidth
              type="number"
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label="Competitors Name"
              name="competitorsName"
              fullWidth
              value={competitorsName}
              onChange={handleInputChange}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label="Remarks"
              name="remarks"
              fullWidth
              value={typeStMt}
              onChange={handleInputChange}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel htmlFor="contractCopy">
                Contract Copy/Work Order/LOI
              </InputLabel>
              <Select name="contractCopy" label="Contract Copy">
                {contractCopyOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
        <Box>
          <Button variant="contained" color="primary" type="submit">
            Submit
          </Button>
        </Box>
      </form>
    </Container>
  );
};

export default OrderReceivedDomestic;
