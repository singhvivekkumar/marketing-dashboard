import { Route, Routes } from "react-router-dom";
import { ThemeProvider } from "@mui/styles";
import { customTheme } from "./utils/customTheme";
// import Header from "../";
import HomePage from "./pages/HomePage";
import ModulePage from "./pages/ModulePage";

function MarketingApp() {
  return (
    <ThemeProvider theme={customTheme}>
      {/* <BrowserRouter> */}
      {/* <Header /> */}
      <ModulePage/>
      {/* <Footer /> currently we don't this footer because there is already a footer is available in main app*/}
      {/* </BrowserRouter> */}
    </ThemeProvider>
  );
}

export default MarketingApp;
