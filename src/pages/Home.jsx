import { Button, Container, Grid, Stack } from "@mui/material";
import SideBar from "../components/SideBar";
import { Outlet } from "react-router-dom";

const Home = () => {
	return (
		<Container>
			<SideBar/>
			<Outlet/>
		</Container>
	);
}

export default Home;
