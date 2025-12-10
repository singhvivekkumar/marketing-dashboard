import { BrowserRouter, Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import HomePage from "./pages/HomePage";
import CrmPage from "./pages/CrmPage";
import { ThemeProvider } from "@mui/styles";
import { customTheme } from "./utils/customTheme";
import LeadSubmittedPage from "./table-example-10dec25/LeadSubmittedPage";

const App = () => {
	return (
		<ThemeProvider theme={customTheme}>
			<BrowserRouter>
				{/* <Header /> */}

				<Routes>
					{/* <Route path="/" element={<HomePage />} /> */}
					{/* <Route path="/" element={<CrmPage />} /> */}
					<Route path="/" element={<LeadSubmittedPage />} />
				</Routes>
				{/* <CrmPage/> */}
				{/* <Footer /> */}
			</BrowserRouter>
		</ThemeProvider>
	);
};

export default App;
