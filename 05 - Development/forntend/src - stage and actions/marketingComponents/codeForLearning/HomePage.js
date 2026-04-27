import { Container, Typography } from "@mui/material";
// import { makeStyles } from "@mui/styles";
import VeiwTabs from "../components/ViewTabs";
import TabbedExcelTable from "../components/TabbedExcelTable";

const HomePage = () => {
  return (
    <Container>
      <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
        BEL-Marketing
      </Typography>
      {/* <VeiwTabs /> */}
      <TabbedExcelTable/>
    </Container>
  );
};

export default HomePage;
