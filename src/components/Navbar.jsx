import { Menu } from "@mui/icons-material";
import { AppBar, Button, IconButton, Toolbar, Typography } from "@mui/material";
import { makeStyles } from "@mui/styles";

const useCustomStyles = makeStyles((theme) => ({
	HeadingLg: {
		display: "none",
		[theme.breakpoints.up("sm")]: {
			display: "block",
		},
		alignSelf: "center",
	},
}));

const Navbar = () => {
	const customClass = useCustomStyles();
	return (
		<AppBar>
			<Toolbar>
				<IconButton
					size="large"
					edge="start"
					color="inherit"
					aria-label="menu">
					<Menu />
				</IconButton>
				<Typography
					variant="h6"
					component="div"
					className={customClass.HeadingLg}
					sx={{ flexGrow: 1 }}
					justifyItems="center">
					BEL-Marketing
				</Typography>
				<Button color="inherit">Login</Button>
			</Toolbar>
		</AppBar>
	);
};

export default Navbar;
