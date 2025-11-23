import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";

import "./App.css";
import Errorpage from "./pages/ErrorPage";
import Home from "./pages/Home";
import { createTheme, CssBaseline, ThemeProvider } from "@mui/material";

const appRouter = createBrowserRouter([
	{
		path: "/",
		element: <Home />,
		errorElement: <Errorpage />,
		children: [
			{
				path: "/",
				element: <div>ram</div>,
				errorElement: <Errorpage />,
			},
			{
				path: "/",
				element: <div>end</div>,
				errorElement: <Errorpage />,
			},
		],
	},
]);

const thisTheme = createTheme({
	typography: {

	}
})

function App() {
	return (
		<ThemeProvider theme={thisTheme}>
      {/* To remove unwanted css like padding and margin */}
			<CssBaseline />
      {/* Provide router */}
			<RouterProvider router={appRouter}>
				<div>
					<Outlet />
				</div>
			</RouterProvider>
		</ThemeProvider>
	);
}

export default App;
