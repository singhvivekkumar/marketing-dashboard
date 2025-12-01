import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import {
	Container,
	Paper,
	Typography,
	TextField,
	Button,
	Grid,
	MenuItem,
	Box,
	Divider,
	Alert,
	Snackbar,
	Card,
	CardContent,
	Chip,
	Tooltip,
	CircularProgress,
	Autocomplete,
} from "@mui/material";

const defenceOptions = ["Defence", "Non-Defence"];
const statusOptions = [
	"BQ Submitted",
	"Commercial Bid Submitted",
	"EOI was submitted",
	"Not participated",
	" ",
];

const leadOwnerOption = [
	"Umesha A",
	"Solomon",
	"Jamuna",
	"Asharani",
	"Chinta",
	"Sravanthy",
	"Praveen",
	"Sandeep",
	"Puneet",
	"Raju",
	"Sivaprasath",
];

const BudgetaryQuotationForm = () => {
	const [submitSuccess, setSubmitSuccess] = useState(false);
	const [submittedData, setSubmittedData] = useState(null);

	const {
		control,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm({
		defaultValues: {
			bqTitle: "",
			customer: "",
			leadOwner: "",
			classification: "",
			estimatedValueWithoutGST: "",
			estimatedValueWithGST: "",
			dateLetterSubmission: "",
			referenceNumber: "",
			competitor: "",
			presentStatus: "",
		},
	});

	const classificationOptions = ["Defence", "Non-Defence"];
	const statusOptions = [
		"Draft",
		"Submitted",
		"Under Review",
		"Quoted",
		"Won",
		"Lost",
	];

	const onSubmit = (data) => {
		// Convert string numbers to actual numbers with 2 decimal precision
		const formattedData = {
			bqTitle: data.bqTitle,
			customer: data.customer,
			leadOwner: data.leadOwner,
			classification: data.classification,
			estimatedValueWithoutGST: parseFloat(
				parseFloat(data.estimatedValueWithoutGST).toFixed(2)
			),
			estimatedValueWithGST: parseFloat(
				parseFloat(data.estimatedValueWithGST).toFixed(2)
			),
			dateLetterSubmission: data.dateLetterSubmission,
			referenceNumber: data.referenceNumber,
			competitor: data.competitor,
			presentStatus: data.presentStatus,
			submittedAt: new Date().toISOString(),
		};

		console.log(
			"Budgetary Quotation Data:",
			JSON.stringify(formattedData, null, 2)
		);
		setSubmittedData(formattedData);
		setSubmitSuccess(true);
	};

	const handleReset = () => {
		reset();
		setSubmittedData(null);
	};

	const handleCloseSnackbar = () => {
		setSubmitSuccess(false);
	};

	const handleDownloadJSON = () => {
		if (submittedData) {
			const dataStr = JSON.stringify(submittedData, null, 2);
			const dataBlob = new Blob([dataStr], { type: "application/json" });
			const url = URL.createObjectURL(dataBlob);
			const link = document.createElement("a");
			link.href = url;
			link.download = `budgetary-quotation-${submittedData.serialNumber
				}-${Date.now()}.json`;
			link.click();
			URL.revokeObjectURL(url);
		}
	};

	return (
		<Container maxWidth="lg" sx={{ py: 4 }}>
			<Paper
				elevation={3}
				sx={{ p: { xs: 2, sm: 4 }, backgroundColor: "#ffffff" }}>
				<Box sx={{ textAlign: "center", mb: 4 }}>
					<Typography
						variant="h4"
						component="h1"
						gutterBottom
						sx={{ fontWeight: 600, color: "#1976d2" }}>
						Budgetary Quotation Form
					</Typography>
					<Typography variant="body2" color="text.secondary">
						Complete all required fields to submit budgetary
						quotation information
					</Typography>
				</Box>

				<form onSubmit={handleSubmit(onSubmit)}>
					{/* BQ Details Section */}
					<Card sx={{ mb: 3, backgroundColor: "#f8f9fa" }}>
						<CardContent>
							<Typography
								variant="h6"
								gutterBottom
								sx={{
									fontWeight: 500,
									mb: 2,
									color: "#1976d2",
								}}>
								📋 BQ Details
							</Typography>
							<Divider sx={{ mb: 3 }} />

							<Grid container spacing={2} columnSpacing={5} justifyContent={"space-evenly"} >
								{/* field */}
								{/* <Grid item xs={12} sm={6}>
                  <Controller
                    name="serialNumber"
                    control={control}
                    rules={{ required: 'Serial Number is required' }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Serial Number"
                        fullWidth
                        required
                        error={!!errors.serialNumber}
                        helperText={errors.serialNumber?.message || 'e.g., BQ-001'}
                        variant="outlined"
                        placeholder="BQ-001"
                      />
                    )}
                  />
                </Grid> */}

								<Grid item xs={12} size={"grow"} >
									<Controller
										name="bqTitle"
										control={control}
										rules={{
											required: "BQ Title is required",
										}}
										render={({ field }) => (
											<TextField
												{...field}
												label="BQ Title"
												fullWidth
												required
												error={!!errors.bqTitle}
												helperText={
													errors.bqTitle?.message
												}
												variant="outlined"
											/>
										)}
									/>
								</Grid>

								<Grid item xs={12} size={4}>
									<Controller
										name="customer"
										control={control}
										rules={{
											required: "Customer is required",
										}}
										render={({ field }) => (
											<TextField
												{...field}
												label="Customer"
												fullWidth
												required
												error={!!errors.customer}
												helperText={
													errors.customer?.message
												}
												variant="outlined"
											/>
										)}
									/>
								</Grid>

								<Grid item xs={12} size={"grow"}>
									<Controller
										name="leadOwner"
										fullWidth
										control={control}
										rules={{
											required: "Lead Owner is required",
										}}
										render={({ field }) => (
											<Autocomplete
												multiple
												fullWidth
												options={leadOwnerOption}
												value={field.value || []}
												onChange={(e, newValue) =>
													field.onChange(newValue)
												}
												renderInput={(params) => (
													<TextField
														{...params}
														label="Lead Owner (Multi-select)"
														// className="text-field-style"
														fullWidth
														error={
															!!errors.leadOwner
														}
														helperText={
															errors.leadOwner
																?.message
														}
													/>
												)}
											/>
										)}
									/>
								</Grid>
							</Grid>
						</CardContent>
					</Card>

					{/* Customer Information Section */}
					{/* <Card sx={{ mb: 3, backgroundColor: "#f8f9fa" }}>
						<CardContent>
							<Typography
								variant="h6"
								gutterBottom
								sx={{
									fontWeight: 500,
									mb: 2,
									color: "#1976d2",
								}}>
								👤 Customer Information
							</Typography>
							<Divider sx={{ mb: 3 }} />

							<Grid container spacing={3}>
								
							</Grid>
						</CardContent>
					</Card> */}

					{/* Classification Section */}
					{/* <Card sx={{ mb: 3, backgroundColor: "#f8f9fa" }}>
						<CardContent>
							<Typography
								variant="h6"
								gutterBottom
								sx={{
									fontWeight: 500,
									mb: 2,
									color: "#1976d2",
								}}>
								🏷️ Classification
							</Typography>
							<Divider sx={{ mb: 3 }} />

							<Grid container spacing={3}>
								
							</Grid>
						</CardContent>
					</Card> */}

					{/* Financial Information Section */}
					<Card sx={{ mb: 3, backgroundColor: "#f8f9fa" }}>
						<CardContent>
							<Typography
								variant="h6"
								gutterBottom
								sx={{
									fontWeight: 500,
									mb: 2,
									color: "#1976d2",
								}}>
								💰 Financial Information & 🏷️ Classification
							</Typography>
							<Divider sx={{ mb: 3 }} />

							<Grid container spacing={2} columnSpacing={5}>
								<Grid item xs={12} size={4}>
									<Controller
										name="estimatedValueWithoutGST"
										control={control}
										rules={{
											required:
												"Estimated Value without GST is required",
											pattern: {
												value: /^[0-9]+(\.[0-9]{1,2})?$/,
												message:
													"Please enter a valid number with max 2 decimals",
											},
											min: {
												value: 0.01,
												message:
													"Value must be greater than 0",
											},
										}}
										render={({ field }) => (
											<TextField
												{...field}
												label="Estimated Value without GST"
												type="number"
												fullWidth
												required
												error={
													!!errors.estimatedValueWithoutGST
												}
												helperText={
													errors
														.estimatedValueWithoutGST
														?.message ||
													"Enter estimated value (2 decimals)"
												}
												variant="outlined"
												inputProps={{
													step: "0.01",
													min: "0",
												}}
												InputProps={{
													startAdornment: (
														<Typography
															sx={{ mr: 1 }}>
															₹
														</Typography>
													),
												}}
											/>
										)}
									/>
								</Grid>

								<Grid item xs={12} size={4}>
									<Controller
										name="estimatedValueWithGST"
										control={control}
										rules={{
											required:
												"Estimated Value with GST is required",
											pattern: {
												value: /^[0-9]+(\.[0-9]{1,2})?$/,
												message:
													"Please enter a valid number with max 2 decimals",
											},
											min: {
												value: 0.01,
												message:
													"Value must be greater than 0",
											},
										}}
										render={({ field }) => (
											<TextField
												{...field}
												label="Estimated Value with GST"
												type="number"
												fullWidth
												required
												error={
													!!errors.estimatedValueWithGST
												}
												helperText={
													errors.estimatedValueWithGST
														?.message ||
													"Enter estimated value (2 decimals)"
												}
												variant="outlined"
												inputProps={{
													step: "0.01",
													min: "0",
												}}
												InputProps={{
													startAdornment: (
														<Typography
															sx={{ mr: 1 }}>
															₹
														</Typography>
													),
												}}
											/>
										)}
									/>
								</Grid>

								<Grid item xs={12} size={4}>
									<Controller
										name="classification"
										control={control}
										rules={{
											required:
												"Classification is required",
										}}
										render={({ field }) => (
											<TextField
												{...field}
												select
												label="Defence/Non-Defence"
												fullWidth
												required
												error={!!errors.classification}
												helperText={
													errors.classification
														?.message
												}
												variant="outlined">
												{classificationOptions.map(
													(option) => (
														<MenuItem
															key={option}
															value={option}>
															{option}
														</MenuItem>
													)
												)}
											</TextField>
										)}
									/>
								</Grid>
							</Grid>
						</CardContent>
					</Card>

					{/* Submission Details Section */}
					{/* <Card sx={{ mb: 3, backgroundColor: "#f8f9fa" }}>
						<CardContent>
							<Typography
								variant="h6"
								gutterBottom
								sx={{
									fontWeight: 500,
									mb: 2,
									color: "#1976d2",
								}}>
								📅 Submission Details
							</Typography>
							<Divider sx={{ mb: 3 }} />

							<Grid container spacing={3}>
								<Grid item xs={12}>
									<Controller
										name="dateLetterSubmission"
										control={control}
										rules={{
											required:
												"Date of Letter Submission is required",
										}}
										render={({ field }) => (
											<TextField
												{...field}
												label="Date of Letter Submission"
												type="date"
												fullWidth
												required
												error={
													!!errors.dateLetterSubmission
												}
												helperText={
													errors.dateLetterSubmission
														?.message
												}
												InputLabelProps={{
													shrink: true,
												}}
												variant="outlined"
											/>
										)}
									/>
								</Grid>
							</Grid>
						</CardContent>
					</Card> */}

					{/* Additional Information Section */}
					<Card sx={{ mb: 3, backgroundColor: "#f8f9fa" }}>
						<CardContent>
							<Typography
								variant="h6"
								gutterBottom
								sx={{
									fontWeight: 500,
									mb: 2,
									color: "#1976d2",
								}}>
								📝 Additional Information
							</Typography>
							<Divider sx={{ mb: 3 }} />

							<Grid container spacing={2} columnSpacing={5}>
								
								<Grid item xs={12} size={3}>
									<Controller
										name="presentStatus"
										control={control}
										rules={{
											required:
												"Present Status is required",
										}}
										render={({ field }) => (
											<TextField
												{...field}
												select
												label="Present Status"
												fullWidth
												required
												error={!!errors.presentStatus}
												helperText={
													errors.presentStatus
														?.message
												}
												variant="outlined">
												{statusOptions.map((option) => (
													<MenuItem
														key={option}
														value={option}>
														{option}
													</MenuItem>
												))}
											</TextField>
										)}
									/>
								</Grid>

								<Grid item xs={12} size={3}>
									<Controller
										name="dateLetterSubmission"
										control={control}
										rules={{
											required:
												"Date of Letter Submission is required",
										}}
										render={({ field }) => (
											<TextField
												{...field}
												label="Date of Letter Submission"
												type="date"
												fullWidth
												required
												error={
													!!errors.dateLetterSubmission
												}
												helperText={
													errors.dateLetterSubmission
														?.message
												}
												InputLabelProps={{
													shrink: true,
												}}
												variant="outlined"
											/>
										)}
									/>
								</Grid>

								<Grid item xs={12} size={"grow"}>
									<Controller
										name="competitor"
										control={control}
										render={({ field }) => (
											<TextField
												{...field}
												label="Competitor (Optional)"
												multiline
												rows={3}
												fullWidth
												variant="outlined"
												placeholder="Enter competitor names separated by commas (e.g., Company A, Company B, Company C)"
												helperText="List all competing companies for this quotation"
											/>
										)}
									/>
								</Grid>

							</Grid>
						</CardContent>
					</Card>

					{/* Form Actions */}
					<Box
						sx={{
							display: "flex",
							gap: 2,
							justifyContent: "center",
							mt: 4,
							flexWrap: "wrap",
						}}>
						<Button
							type="submit"
							variant="contained"
							color="primary"
							size="large"
							sx={{ minWidth: 150, px: 4, py: 1.5 }}>
							Submit BQ
						</Button>
						<Button
							type="button"
							variant="outlined"
							color="secondary"
							size="large"
							onClick={handleReset}
							sx={{ minWidth: 150, px: 4, py: 1.5 }}>
							Reset Form
						</Button>
					</Box>
				</form>

				{/* Success Snackbar */}
				<Snackbar
					open={submitSuccess}
					autoHideDuration={6000}
					onClose={handleCloseSnackbar}
					anchorOrigin={{ vertical: "top", horizontal: "center" }}>
					<Alert
						onClose={handleCloseSnackbar}
						severity="success"
						sx={{ width: "100%" }}>
						Form submitted successfully! Check console for JSON
						output.
					</Alert>
				</Snackbar>

				{/* Submitted Data Display */}
				{submittedData && (
					<Box sx={{ mt: 4 }}>
						<Box
							sx={{
								display: "flex",
								justifyContent: "space-between",
								alignItems: "center",
								mb: 2,
							}}>
							<Typography variant="h6" sx={{ fontWeight: 500 }}>
								📊 Submitted Data (JSON)
							</Typography>
							<Button
								variant="contained"
								color="success"
								onClick={handleDownloadJSON}
								size="small">
								Download JSON
							</Button>
						</Box>
						<Divider sx={{ mb: 2 }} />
						<Paper
							elevation={2}
							sx={{
								p: 3,
								backgroundColor: "#1e1e1e",
								color: "#d4d4d4",
								maxHeight: 500,
								overflow: "auto",
								fontFamily: "monospace",
								fontSize: "0.875rem",
								borderRadius: 2,
							}}>
							<pre
								style={{
									margin: 0,
									whiteSpace: "pre-wrap",
									wordBreak: "break-word",
								}}>
								{JSON.stringify(submittedData, null, 2)}
							</pre>
						</Paper>
					</Box>
				)}
			</Paper>
		</Container>
	);
};

export default BudgetaryQuotationForm;
