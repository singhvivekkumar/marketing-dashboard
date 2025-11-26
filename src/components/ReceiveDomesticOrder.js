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
	Tooltip,
	Chip,
} from "@mui/material";

import { useForm, Controller } from "react-hook-form";

const ReceivedDomesticOrder = () => {
	const [submitSuccess, setSubmitSuccess] = useState(false);
	const [submittedData, setSubmittedData] = useState(null);
	const [selectedFile, setSelectedFile] = useState(null);

	const { 
		control, 
		handleSubmit, 
		reset, 
		watch,
		formState: { errors } 
	} = useForm({
		defaultValues: {
			serialNumber: '',
			contractName: '',
			customerName: '',
			customerAddress: '',
			orderReceivedDate: '',
			poNumber: '',
			orderType: '',
			valueWithoutGST: '',
			valueWithGST: '',
			competitors: '',
			remarks: '',
			attachment: ''
		}
	});

	const orderTypes = ['single order', 'multiple order'];

	const handleFileChange = (event) => {
		const file = event.target.files[0];
		if (file) {
			setSelectedFile(file);
		}
	};

	const onSubmit = (data) => {
		// Convert string numbers to actual numbers with 2 decimal precision
		const formattedData = {
			serialNumber: data.serialNumber,
			contractName: data.contractName,
			customerName: data.customerName,
			customerAddress: data.customerAddress,
			orderReceivedDate: data.orderReceivedDate,
			poNumber: data.poNumber,
			orderType: data.orderType,
			valueWithoutGST: parseFloat(parseFloat(data.valueWithoutGST).toFixed(2)),
			valueWithGST: parseFloat(parseFloat(data.valueWithGST).toFixed(2)),
			competitors: data.competitors,
			remarks: data.remarks,
			attachment: selectedFile ? selectedFile.name : '',
			submittedAt: new Date().toISOString()
		};

		console.log('Form Data:', JSON.stringify(formattedData, null, 2));
		setSubmittedData(formattedData);
		setSubmitSuccess(true);
	};

	const handleReset = () => {
		reset();
		setSubmittedData(null);
		setSelectedFile(null);
	};

	const handleCloseSnackbar = () => {
		setSubmitSuccess(false);
	};

	const handleDownloadJSON = () => {
		if (submittedData) {
			const dataStr = JSON.stringify(submittedData, null, 2);
			const dataBlob = new Blob([dataStr], { type: 'application/json' });
			const url = URL.createObjectURL(dataBlob);
			const link = document.createElement('a');
			link.href = url;
			link.download = `domestic-order-${submittedData.serialNumber}-${Date.now()}.json`;
			link.click();
			URL.revokeObjectURL(url);
		}
	};

	return (
		<Container maxWidth="lg" sx={{ py: 4 }}>
			<Paper elevation={3} sx={{ p: { xs: 2, sm: 4 }, backgroundColor: '#ffffff' }}>
				<Box sx={{ textAlign: 'center', mb: 4 }}>
					<Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 600, color: '#1976d2' }}>
						Domestic Order Received Form
					</Typography>
					<Typography variant="body2" color="text.secondary">
						Complete all required fields to submit order information
					</Typography>
				</Box>

				<form onSubmit={handleSubmit(onSubmit)}>
					{/* Order Details Section */}
					<Card sx={{ mb: 3, backgroundColor: '#f8f9fa' }}>
						<CardContent>
							<Typography variant="h6" gutterBottom sx={{ fontWeight: 500, mb: 2, color: '#1976d2' }}>
								📋 Order Details
							</Typography>
							<Divider sx={{ mb: 3 }} />
							
							<Grid container spacing={3}>
								<Grid item xs={12} sm={6}>
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
												helperText={errors.serialNumber?.message}
												variant="outlined"
											/>
										)}
									/>
								</Grid>

								<Grid item xs={12} sm={6}>
									<Controller
										name="contractName"
										control={control}
										rules={{ required: 'Contract Name is required' }}
										render={({ field }) => (
											<TextField
												{...field}
												label="Contract Name"
												fullWidth
												required
												error={!!errors.contractName}
												helperText={errors.contractName?.message}
												variant="outlined"
											/>
										)}
									/>
								</Grid>

								<Grid item xs={12}>
									<Controller
										name="orderReceivedDate"
										control={control}
										rules={{ required: 'Order Received Date is required' }}
										render={({ field }) => (
											<TextField
												{...field}
												label="Order Received Date"
												type="date"
												fullWidth
												required
												error={!!errors.orderReceivedDate}
												helperText={errors.orderReceivedDate?.message}
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
					</Card>

					{/* Customer Information Section */}
					<Card sx={{ mb: 3, backgroundColor: '#f8f9fa' }}>
						<CardContent>
							<Typography variant="h6" gutterBottom sx={{ fontWeight: 500, mb: 2, color: '#1976d2' }}>
								👤 Customer Information
							</Typography>
							<Divider sx={{ mb: 3 }} />
							
							<Grid container spacing={3}>
								<Grid item xs={12}>
									<Controller
										name="customerName"
										control={control}
										rules={{ required: 'Customer Name is required' }}
										render={({ field }) => (
											<TextField
												{...field}
												label="Customer Name"
												fullWidth
												required
												error={!!errors.customerName}
												helperText={errors.customerName?.message}
												variant="outlined"
											/>
										)}
									/>
								</Grid>

								<Grid item xs={12}>
									<Controller
										name="customerAddress"
										control={control}
										rules={{ required: 'Customer Address is required' }}
										render={({ field }) => (
											<TextField
												{...field}
												label="Customer Address"
												multiline
												rows={3}
												fullWidth
												required
												error={!!errors.customerAddress}
												helperText={errors.customerAddress?.message}
												variant="outlined"
												placeholder="Enter complete customer address..."
											/>
										)}
									/>
								</Grid>
							</Grid>
						</CardContent>
					</Card>

					{/* Document Information Section */}
					<Card sx={{ mb: 3, backgroundColor: '#f8f9fa' }}>
						<CardContent>
							<Typography variant="h6" gutterBottom sx={{ fontWeight: 500, mb: 2, color: '#1976d2' }}>
								📄 Document Information
							</Typography>
							<Divider sx={{ mb: 3 }} />
							
							<Grid container spacing={3}>
								<Grid item xs={12} sm={6}>
									<Controller
										name="poNumber"
										control={control}
										rules={{ required: 'Purchase Order/Work Order Number is required' }}
										render={({ field }) => (
											<TextField
												{...field}
												label="Purchase Order/Work Order Number"
												fullWidth
												required
												error={!!errors.poNumber}
												helperText={errors.poNumber?.message}
												variant="outlined"
											/>
										)}
									/>
								</Grid>

								<Grid item xs={12} sm={6}>
									<Controller
										name="orderType"
										control={control}
										rules={{ required: 'Order Type is required' }}
										render={({ field }) => (
											<TextField
												{...field}
												select
												label="Order Type"
												fullWidth
												required
												error={!!errors.orderType}
												helperText={errors.orderType?.message}
												variant="outlined"
											>
												{orderTypes.map((option) => (
													<MenuItem key={option} value={option}>
														{option}
													</MenuItem>
												))}
											</TextField>
										)}
									/>
								</Grid>
							</Grid>
						</CardContent>
					</Card>

					{/* Financial Details Section */}
					<Card sx={{ mb: 3, backgroundColor: '#f8f9fa' }}>
						<CardContent>
							<Typography variant="h6" gutterBottom sx={{ fontWeight: 500, mb: 2, color: '#1976d2' }}>
								💰 Financial Details
							</Typography>
							<Divider sx={{ mb: 3 }} />
							
							<Grid container spacing={3}>
								<Grid item xs={12} sm={6}>
									<Tooltip title="Enter value in crore (e.g., 1.50 for 1.5 crore)" arrow>
										<Controller
											name="valueWithoutGST"
											control={control}
											rules={{ 
												required: 'Value without GST is required',
												pattern: {
													value: /^[0-9]+(\.[0-9]{1,2})?$/,
													message: 'Please enter a valid number with max 2 decimals'
												},
												min: {
													value: 0.01,
													message: 'Value must be greater than 0'
												}
											}}
											render={({ field }) => (
												<TextField
													{...field}
													label="Value without GST (in Crore)"
													type="number"
													fullWidth
													required
													error={!!errors.valueWithoutGST}
													helperText={errors.valueWithoutGST?.message || 'Enter value in crore'}
													variant="outlined"
													inputProps={{
														step: '0.01',
														min: '0'
													}}
													InputProps={{
														startAdornment: <Typography sx={{ mr: 1 }}>₹</Typography>,
														endAdornment: <Typography sx={{ ml: 1, fontSize: '0.875rem', color: 'text.secondary' }}>Cr</Typography>
													}}
												/>
											)}
										/>
									</Tooltip>
								</Grid>

								<Grid item xs={12} sm={6}>
									<Tooltip title="Enter value in crore (e.g., 1.77 for 1.77 crore)" arrow>
										<Controller
											name="valueWithGST"
											control={control}
											rules={{ 
												required: 'Value with GST is required',
												pattern: {
													value: /^[0-9]+(\.[0-9]{1,2})?$/,
													message: 'Please enter a valid number with max 2 decimals'
												},
												min: {
													value: 0.01,
													message: 'Value must be greater than 0'
												}
											}}
											render={({ field }) => (
												<TextField
													{...field}
													label="Value with GST (in Crore)"
													type="number"
													fullWidth
													required
													error={!!errors.valueWithGST}
													helperText={errors.valueWithGST?.message || 'Enter value in crore'}
													variant="outlined"
													inputProps={{
														step: '0.01',
														min: '0'
													}}
													InputProps={{
														startAdornment: <Typography sx={{ mr: 1 }}>₹</Typography>,
														endAdornment: <Typography sx={{ ml: 1, fontSize: '0.875rem', color: 'text.secondary' }}>Cr</Typography>
													}}
												/>
											)}
										/>
									</Tooltip>
								</Grid>
							</Grid>
						</CardContent>
					</Card>

					{/* Competitors & Remarks Section */}
					<Card sx={{ mb: 3, backgroundColor: '#f8f9fa' }}>
						<CardContent>
							<Typography variant="h6" gutterBottom sx={{ fontWeight: 500, mb: 2, color: '#1976d2' }}>
								🏢 Competitors &amp; Remarks
							</Typography>
							<Divider sx={{ mb: 3 }} />
							
							<Grid container spacing={3}>
								<Grid item xs={12}>
									<Controller
										name="competitors"
										control={control}
										render={({ field }) => (
											<TextField
												{...field}
												label="Competitors (Optional)"
												multiline
												rows={3}
												fullWidth
												variant="outlined"
												placeholder="Enter competitor names separated by commas (e.g., Company A, Company B, Company C)"
												helperText="List all competing companies for this order"
											/>
										)}
									/>
								</Grid>

								<Grid item xs={12}>
									<Controller
										name="remarks"
										control={control}
										render={({ field }) => (
											<TextField
												{...field}
												label="Remarks (Optional)"
												multiline
												rows={4}
												fullWidth
												variant="outlined"
												placeholder="Add any additional comments or notes about this order..."
												helperText="Any special notes or observations"
											/>
										)}
									/>
								</Grid>
							</Grid>
						</CardContent>
					</Card>

					{/* Attachments Section */}
					<Card sx={{ mb: 3, backgroundColor: '#f8f9fa' }}>
						<CardContent>
							<Typography variant="h6" gutterBottom sx={{ fontWeight: 500, mb: 2, color: '#1976d2' }}>
								📎 Attachments
							</Typography>
							<Divider sx={{ mb: 3 }} />
							
							<Box>
								<Typography variant="body2" color="text.secondary" gutterBottom>
									Upload Contract Copy / Work Order / Letter of Intent (Optional)
								</Typography>
								<Button
									variant="outlined"
									component="label"
									sx={{ mt: 2, mb: 2 }}
								>
									Choose File
									<input
										type="file"
										hidden
										onChange={handleFileChange}
										accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
									/>
								</Button>
								{selectedFile && (
									<Box sx={{ mt: 2 }}>
										<Chip
											label={selectedFile.name}
											onDelete={() => setSelectedFile(null)}
											color="primary"
											variant="outlined"
											sx={{ maxWidth: '100%' }}
										/>
										<Typography variant="caption" display="block" sx={{ mt: 1, color: 'text.secondary' }}>
											Size: {(selectedFile.size / 1024).toFixed(2)} KB
										</Typography>
									</Box>
								)}
							</Box>
						</CardContent>
					</Card>

					{/* Form Actions */}
					<Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', mt: 4, flexWrap: 'wrap' }}>
						<Button
							type="submit"
							variant="contained"
							color="primary"
							size="large"
							sx={{ minWidth: 150, px: 4, py: 1.5 }}
						>
							Submit Order
						</Button>
						<Button
							type="button"
							variant="outlined"
							color="secondary"
							size="large"
							onClick={handleReset}
							sx={{ minWidth: 150, px: 4, py: 1.5 }}
						>
							Reset Form
						</Button>
					</Box>
				</form>

				{/* Success Snackbar */}
				<Snackbar
					open={submitSuccess}
					autoHideDuration={6000}
					onClose={handleCloseSnackbar}
					anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
				>
					<Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
						Form submitted successfully! Check console for JSON output.
					</Alert>
				</Snackbar>

				{/* Submitted Data Display */}
				{submittedData && (
					<Box sx={{ mt: 4 }}>
						<Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
							<Typography variant="h6" sx={{ fontWeight: 500 }}>
								📊 Submitted Data (JSON)
							</Typography>
							<Button
								variant="contained"
								color="success"
								onClick={handleDownloadJSON}
								size="small"
							>
								Download JSON
							</Button>
						</Box>
						<Divider sx={{ mb: 2 }} />
						<Paper 
							elevation={2} 
							sx={{ 
								p: 3, 
								backgroundColor: '#1e1e1e',
								color: '#d4d4d4',
								maxHeight: 500, 
								overflow: 'auto',
								fontFamily: 'monospace',
								fontSize: '0.875rem',
								borderRadius: 2
							}}
						>
							<pre style={{ margin: 0, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
								{JSON.stringify(submittedData, null, 2)}
							</pre>
						</Paper>
					</Box>
				)}
			</Paper>
		</Container>
	);
};

export default ReceivedDomesticOrder;