import { Route, Routes } from "react-router-dom";
import { ThemeProvider } from "@mui/styles";
import { customTheme } from "./utils/customTheme";
import Header from "./components/Header";
import HomePage from "./pages/HomePage";
import CrmPage from "./pages/CrmPage";

function MarketingApp() {
  return (
    <ThemeProvider theme={customTheme}>
      {/* <BrowserRouter> */}
      {/* <Header /> */}
      <CrmPage/>
      {/* <Footer /> currently we don't this footer because there is already a footer is available in main app*/}
      {/* </BrowserRouter> */}
    </ThemeProvider>
  );
}

export default MarketingApp;
