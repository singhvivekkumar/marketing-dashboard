import {useState} from 'react';

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
	IconButton,
	Card,
	CardContent,
} from "@mui/material";

import { useForm, Controller, useFieldArray } from "react-hook-form";

const LostLeadApp = () => {
	const [submitSuccess, setSubmitSuccess] = useState(false);
	const [submittedData, setSubmittedData] = useState(null);

	const {
		control,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm({
		defaultValues: {
			serialNumber: "",
			tenderDescription: "",
			customer: "",
			tenderType: "",
			typeBid: "",
			valueWithoutGST: "",
			valueWithGST: "",
			reasonLosing: "",
			year: "",
			partner: "",
			competitors: [{ name: "", address: "" }],
			technicalScores: [{ competitorName: "", score: "" }],
			quotedPrices: [{ competitorName: "", price: "" }],
		},
	});

	const {
		fields: competitorFields,
		append: appendCompetitor,
		remove: removeCompetitor,
	} = useFieldArray({
		control,
		name: "competitors",
	});

	const {
		fields: scoreFields,
		append: appendScore,
		remove: removeScore,
	} = useFieldArray({
		control,
		name: "technicalScores",
	});

	const {
		fields: priceFields,
		append: appendPrice,
		remove: removePrice,
	} = useFieldArray({
		control,
		name: "quotedPrices",
	});

	const tenderTypes = ["single tender", "EOI", "RFI", "RFP", "BQ"];

	const onSubmit = (data) => {
		// Convert string numbers to actual numbers
		const formattedData = {
			...data,
			valueWithoutGST: parseFloat(data.valueWithoutGST),
			valueWithGST: parseFloat(data.valueWithGST),
			year: parseInt(data.year),
			technicalScores: data.technicalScores.map((score) => ({
				...score,
				score: parseFloat(score.score),
			})),
			quotedPrices: data.quotedPrices.map((price) => ({
				...price,
				price: parseFloat(price.price),
			})),
		};

		console.log("Form Data:", JSON.stringify(formattedData, null, 2));
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

	return (
		<Container maxWidth="lg" sx={{ py: 4 }}>
			<Paper elevation={3} sx={{ p: { xs: 2, sm: 4 } }}>
				<Typography
					variant="h4"
					component="h1"
					gutterBottom
					align="center"
					sx={{ mb: 4, fontWeight: 600 }}>
					Lost Domestic Leads Form
				</Typography>

				<form onSubmit={handleSubmit(onSubmit)}>
					{/* Basic Information Section */}
					<Box sx={{ mb: 4 }}>
						<Typography
							variant="h6"
							gutterBottom
							sx={{ fontWeight: 500, mb: 2 }}>
							Basic Information
						</Typography>
						<Divider sx={{ mb: 3 }} />

						<Grid container spacing={3}>
							<Grid item xs={12} sm={6}>
								<Controller
									name="serialNumber"
									control={control}
									rules={{
										required: "Serial Number is required",
									}}
									render={({ field }) => (
										<TextField
											{...field}
											label="Serial Number"
											fullWidth
											required
											error={!!errors.serialNumber}
											helperText={
												errors.serialNumber?.message
											}
										/>
									)}
								/>
							</Grid>

							<Grid item xs={12} sm={6}>
								<Controller
									name="customer"
									control={control}
									rules={{ required: "Customer is required" }}
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
										/>
									)}
								/>
							</Grid>

							<Grid item xs={12}>
								<Controller
									name="tenderDescription"
									control={control}
									rules={{
										required:
											"Tender/Lead Description is required",
									}}
									render={({ field }) => (
										<TextField
											{...field}
											label="Tender/Lead Description"
											fullWidth
											required
											error={!!errors.tenderDescription}
											helperText={
												errors.tenderDescription
													?.message
											}
										/>
									)}
								/>
							</Grid>

							<Grid item xs={12} sm={6}>
								<Controller
									name="tenderType"
									control={control}
									rules={{
										required: "Tender Type is required",
									}}
									render={({ field }) => (
										<TextField
											{...field}
											select
											label="Tender Type"
											fullWidth
											required
											error={!!errors.tenderType}
											helperText={
												errors.tenderType?.message
											}>
											{tenderTypes.map((option) => (
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

							<Grid item xs={12} sm={6}>
								<Controller
									name="typeBid"
									control={control}
									rules={{
										required: "Type of Bid is required",
									}}
									render={({ field }) => (
										<TextField
											{...field}
											label="Type of Bid"
											fullWidth
											required
											error={!!errors.typeBid}
											helperText={errors.typeBid?.message}
										/>
									)}
								/>
							</Grid>

							<Grid item xs={12} sm={6}>
								<Controller
									name="year"
									control={control}
									rules={{
										required: "Year is required",
										pattern: {
											value: /^[0-9]{4}$/,
											message:
												"Please enter a valid year",
										},
									}}
									render={({ field }) => (
										<TextField
											{...field}
											label="Year"
											type="number"
											fullWidth
											required
											error={!!errors.year}
											helperText={errors.year?.message}
										/>
									)}
								/>
							</Grid>

							<Grid item xs={12} sm={6}>
								<Controller
									name="partner"
									control={control}
									render={({ field }) => (
										<TextField
											{...field}
											label="Partner (Optional)"
											fullWidth
										/>
									)}
								/>
							</Grid>
						</Grid>
					</Box>

					{/* Financial Information Section */}
					<Box sx={{ mb: 4 }}>
						<Typography
							variant="h6"
							gutterBottom
							sx={{ fontWeight: 500, mb: 2 }}>
							Financial Information
						</Typography>
						<Divider sx={{ mb: 3 }} />

						<Grid container spacing={3}>
							<Grid item xs={12} sm={6}>
								<Controller
									name="valueWithoutGST"
									control={control}
									rules={{
										required:
											"Value without GST is required",
										pattern: {
											value: /^[0-9]+(\.[0-9]+)?$/,
											message:
												"Please enter a valid number",
										},
									}}
									render={({ field }) => (
										<TextField
											{...field}
											label="Value without GST"
											type="number"
											fullWidth
											required
											error={!!errors.valueWithoutGST}
											helperText={
												errors.valueWithoutGST?.message
											}
											InputProps={{
												startAdornment: (
													<Typography sx={{ mr: 1 }}>
														₹
													</Typography>
												),
											}}
										/>
									)}
								/>
							</Grid>

							<Grid item xs={12} sm={6}>
								<Controller
									name="valueWithGST"
									control={control}
									rules={{
										required: "Value with GST is required",
										pattern: {
											value: /^[0-9]+(\.[0-9]+)?$/,
											message:
												"Please enter a valid number",
										},
									}}
									render={({ field }) => (
										<TextField
											{...field}
											label="Value with GST"
											type="number"
											fullWidth
											required
											error={!!errors.valueWithGST}
											helperText={
												errors.valueWithGST?.message
											}
											InputProps={{
												startAdornment: (
													<Typography sx={{ mr: 1 }}>
														₹
													</Typography>
												),
											}}
										/>
									)}
								/>
							</Grid>
						</Grid>
					</Box>

					{/* Loss Reason Section */}
					<Box sx={{ mb: 4 }}>
						<Typography
							variant="h6"
							gutterBottom
							sx={{ fontWeight: 500, mb: 2 }}>
							Loss Information
						</Typography>
						<Divider sx={{ mb: 3 }} />

						<Controller
							name="reasonLosing"
							control={control}
							rules={{
								required: "Reason for Losing is required",
							}}
							render={({ field }) => (
								<TextField
									{...field}
									label="Reason for Losing"
									multiline
									rows={4}
									fullWidth
									required
									error={!!errors.reasonLosing}
									helperText={errors.reasonLosing?.message}
								/>
							)}
						/>
					</Box>

					{/* Competitors Section */}
					<Box sx={{ mb: 4 }}>
						<Typography
							variant="h6"
							gutterBottom
							sx={{ fontWeight: 500, mb: 2 }}>
							Competitors
						</Typography>
						<Divider sx={{ mb: 3 }} />

						{competitorFields.map((field, index) => (
							<Card
								key={field.id}
								sx={{ mb: 2, backgroundColor: "#f5f5f5" }}>
								<CardContent>
									<Grid container spacing={2}>
										<Grid item xs={12} sm={5}>
											<Controller
												name={`competitors.${index}.name`}
												control={control}
												rules={{
													required:
														"Competitor name is required",
												}}
												render={({ field }) => (
													<TextField
														{...field}
														label="Competitor Name"
														fullWidth
														required
														error={
															!!errors
																.competitors?.[
																index
															]?.name
														}
														helperText={
															errors
																.competitors?.[
																index
															]?.name?.message
														}
													/>
												)}
											/>
										</Grid>
										<Grid item xs={12} sm={5}>
											<Controller
												name={`competitors.${index}.address`}
												control={control}
												rules={{
													required:
														"Competitor address is required",
												}}
												render={({ field }) => (
													<TextField
														{...field}
														label="Competitor Address"
														fullWidth
														required
														error={
															!!errors
																.competitors?.[
																index
															]?.address
														}
														helperText={
															errors
																.competitors?.[
																index
															]?.address?.message
														}
													/>
												)}
											/>
										</Grid>
										<Grid
											item
											xs={12}
											sm={2}
											sx={{
												display: "flex",
												alignItems: "center",
											}}>
											{competitorFields.length > 1 && (
												<Button
													variant="outlined"
													color="error"
													onClick={() =>
														removeCompetitor(index)
													}
													fullWidth>
													Remove
												</Button>
											)}
										</Grid>
									</Grid>
								</CardContent>
							</Card>
						))}

						<Button
							variant="contained"
							onClick={() =>
								appendCompetitor({ name: "", address: "" })
							}
							sx={{ mt: 1 }}>
							Add Competitor
						</Button>
					</Box>

					{/* Technical Scores Section */}
					<Box sx={{ mb: 4 }}>
						<Typography
							variant="h6"
							gutterBottom
							sx={{ fontWeight: 500, mb: 2 }}>
							Technical Scores
						</Typography>
						<Divider sx={{ mb: 3 }} />

						{scoreFields.map((field, index) => (
							<Card
								key={field.id}
								sx={{ mb: 2, backgroundColor: "#f5f5f5" }}>
								<CardContent>
									<Grid container spacing={2}>
										<Grid item xs={12} sm={5}>
											<Controller
												name={`technicalScores.${index}.competitorName`}
												control={control}
												rules={{
													required:
														"Competitor name is required",
												}}
												render={({ field }) => (
													<TextField
														{...field}
														label="Competitor Name"
														fullWidth
														required
														error={
															!!errors
																.technicalScores?.[
																index
															]?.competitorName
														}
														helperText={
															errors
																.technicalScores?.[
																index
															]?.competitorName
																?.message
														}
													/>
												)}
											/>
										</Grid>
										<Grid item xs={12} sm={5}>
											<Controller
												name={`technicalScores.${index}.score`}
												control={control}
												rules={{
													required:
														"Score is required",
													pattern: {
														value: /^[0-9]+(\.[0-9]+)?$/,
														message:
															"Please enter a valid number",
													},
												}}
												render={({ field }) => (
													<TextField
														{...field}
														label="Technical Score"
														type="number"
														fullWidth
														required
														error={
															!!errors
																.technicalScores?.[
																index
															]?.score
														}
														helperText={
															errors
																.technicalScores?.[
																index
															]?.score?.message
														}
													/>
												)}
											/>
										</Grid>
										<Grid
											item
											xs={12}
											sm={2}
											sx={{
												display: "flex",
												alignItems: "center",
											}}>
											{scoreFields.length > 1 && (
												<Button
													variant="outlined"
													color="error"
													onClick={() =>
														removeScore(index)
													}
													fullWidth>
													Remove
												</Button>
											)}
										</Grid>
									</Grid>
								</CardContent>
							</Card>
						))}

						<Button
							variant="contained"
							onClick={() =>
								appendScore({ competitorName: "", score: "" })
							}
							sx={{ mt: 1 }}>
							Add Technical Score
						</Button>
					</Box>

					{/* Quoted Prices Section */}
					<Box sx={{ mb: 4 }}>
						<Typography
							variant="h6"
							gutterBottom
							sx={{ fontWeight: 500, mb: 2 }}>
							Quoted Prices
						</Typography>
						<Divider sx={{ mb: 3 }} />

						{priceFields.map((field, index) => (
							<Card
								key={field.id}
								sx={{ mb: 2, backgroundColor: "#f5f5f5" }}>
								<CardContent>
									<Grid container spacing={2}>
										<Grid item xs={12} sm={5}>
											<Controller
												name={`quotedPrices.${index}.competitorName`}
												control={control}
												rules={{
													required:
														"Competitor name is required",
												}}
												render={({ field }) => (
													<TextField
														{...field}
														label="Competitor Name"
														fullWidth
														required
														error={
															!!errors
																.quotedPrices?.[
																index
															]?.competitorName
														}
														helperText={
															errors
																.quotedPrices?.[
																index
															]?.competitorName
																?.message
														}
													/>
												)}
											/>
										</Grid>
										<Grid item xs={12} sm={5}>
											<Controller
												name={`quotedPrices.${index}.price`}
												control={control}
												rules={{
													required:
														"Price is required",
													pattern: {
														value: /^[0-9]+(\.[0-9]+)?$/,
														message:
															"Please enter a valid number",
													},
												}}
												render={({ field }) => (
													<TextField
														{...field}
														label="Quoted Price"
														type="number"
														fullWidth
														required
														error={
															!!errors
																.quotedPrices?.[
																index
															]?.price
														}
														helperText={
															errors
																.quotedPrices?.[
																index
															]?.price?.message
														}
														InputProps={{
															startAdornment: (
																<Typography
																	sx={{
																		mr: 1,
																	}}>
																	₹
																</Typography>
															),
														}}
													/>
												)}
											/>
										</Grid>
										<Grid
											item
											xs={12}
											sm={2}
											sx={{
												display: "flex",
												alignItems: "center",
											}}>
											{priceFields.length > 1 && (
												<Button
													variant="outlined"
													color="error"
													onClick={() =>
														removePrice(index)
													}
													fullWidth>
													Remove
												</Button>
											)}
										</Grid>
									</Grid>
								</CardContent>
							</Card>
						))}

						<Button
							variant="contained"
							onClick={() =>
								appendPrice({ competitorName: "", price: "" })
							}
							sx={{ mt: 1 }}>
							Add Quoted Price
						</Button>
					</Box>

					{/* Form Actions */}
					<Box
						sx={{
							display: "flex",
							gap: 2,
							justifyContent: "center",
							mt: 4,
						}}>
						<Button
							type="submit"
							variant="contained"
							color="primary"
							size="large"
							sx={{ minWidth: 150 }}>
							Submit
						</Button>
						<Button
							type="button"
							variant="outlined"
							color="secondary"
							size="large"
							onClick={handleReset}
							sx={{ minWidth: 150 }}>
							Reset
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
						<Typography
							variant="h6"
							gutterBottom
							sx={{ fontWeight: 500, mb: 2 }}>
							Submitted Data (JSON)
						</Typography>
						<Divider sx={{ mb: 2 }} />
						<Paper
							elevation={1}
							sx={{
								p: 2,
								backgroundColor: "#f5f5f5",
								maxHeight: 400,
								overflow: "auto",
								fontFamily: "monospace",
								fontSize: "0.875rem",
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

export default LostLeadApp;
