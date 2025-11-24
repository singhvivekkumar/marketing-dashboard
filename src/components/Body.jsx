import { Button, Container, Grid, Stack } from "@mui/material";
import SideBar from "./SideBar";
import { Outlet } from "react-router-dom";

const Body = () => {
	return (
		<Container>
			<SideBar/>
			<Outlet/>
		</Container>
	);
}

export default Body;
