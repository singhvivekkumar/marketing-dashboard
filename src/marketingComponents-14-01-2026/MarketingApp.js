import { useState } from "react";
import { Box, Tabs, Tab, Paper } from "@mui/material";
import ReceivedDomesticOrder from "./components/orderReceived/OrderReceivedForm";
import BudgetaryQuotationForm from "./components/budgetaryQuotation/BudgetaryQuotationForm";
import LeadSubmittedForm from "./components/leadSubmitted/LeadSubmittedForm";
import DomesticLeadForm from "./components/domesticLead/DomesticLeadForm";
import ExportLeadForm from "./components/exportLead/ExportLeadForm";
import CRMLeadForm from "./components/crmLeads/CRMLeadForm";
import LostForm from "./components/lostLeads/LostDomesticLead";

const MarketingApp = () => {
  const [value, setValue] = useState(0);

  return (
    <Box  sx={{ backgroundColor: "#f5f5f5", pb: 0, maxWidth: "100%" }}>
      {/* <Container maxWidth="100%" sx={{ mt: 1 }}> */}
        <Paper elevation={3} sx={{ backgroundColor: "#ffffff", maxWidth: "100%" }}>
          <Tabs
            value={value}
            onChange={(e, v) => setValue(v)}
            variant="scrollable"
            scrollButtons="auto"
            sx={{
              "& .MuiTab-root": {
                fontSize: "1.05rem",
                fontWeight: 700,
              },
            }}
          >
            <Tab
              label={
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <span>{"💵"}</span>
                  <span>{"Budgetary Quotation"}</span>
                </Box>
              }
            ></Tab>
            <Tab
              label={
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <span>{"✅"}</span>
                  <span>{"Lead Submitted"}</span>
                </Box>
              }
            ></Tab>
            <Tab
              label={
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <span>{"🏢"}</span>
                  <span>{"Domestic Leads"}</span>
                </Box>
              }
            ></Tab>
            <Tab
              label={
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <span>{"🌍"}</span>
                  <span>{"Export Leads"}</span>
                </Box>
              }
            ></Tab>
            <Tab
              label={
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <span>{"📞"}</span>
                  <span>{"CRM Leads"}</span>
                </Box>
              }
            ></Tab>
            <Tab
              label={
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <span>{"🧾"}</span>
                  <span>{"Order Received Domestic"}</span>
                </Box>
              }
            ></Tab>
            <Tab
              label={
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <span>{"📉"}</span>
                  <span>{"Lost Form"}</span>
                </Box>
              }
            ></Tab>
          </Tabs>

          {value === 0 && <BudgetaryQuotationForm />}
          {value === 1 && <LeadSubmittedForm />}

          {value === 2 && <DomesticLeadForm />}
          {value === 3 && <ExportLeadForm />}

          {value === 4 && <CRMLeadForm />}
          {value === 5 && <ReceivedDomesticOrder />}

          {value === 6 && <LostForm />}
        </Paper>
      {/* </Container> */}
    </Box>
  );
};

export default MarketingApp;
