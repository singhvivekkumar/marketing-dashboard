import { Container, Grid, TextField } from "@mui/material";
import { useForm } from "react-hook-form";

function LostDomesticLeads() {
	const { register, handleSubmit, formState } = useForm();

	const { errors } = formState;

	return (
		<Container>
			<form onSubmit={handleSubmit((data) => console.log(data))}>
				<Grid container spacing={2}>
					<Grid item >
						<TextField
							type="number"
							fullWidth
							{...register("serialNumber")}
						/>
					</Grid>
					<Grid item>
						<TextField type="text" fullWidth {...register("serialNumber")} />
					</Grid>
					<Grid item>
						<TextField type="text" fullWidth {...register("serialNumber")} />
					</Grid>
				</Grid>
			</form>
		</Container>
	);
}

export default LostDomesticLeads;
