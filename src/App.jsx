import { BrowserRouter, Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import HomePage from "./pages/HomePage";
import CrmPage from "./pages/CrmPage";
import { ThemeProvider } from "@mui/styles";
import { customTheme } from "./utils/customTheme";

const App = () => {
	return (
		<ThemeProvider theme={customTheme}>
			<BrowserRouter>
				<Header />
				<Routes>
					<Route path="/" element={<HomePage />} />
					<Route path="/crm" element={<CrmPage />} />
				</Routes>
				<Footer />
			</BrowserRouter>
		</ThemeProvider>
	);
};

export default App;
