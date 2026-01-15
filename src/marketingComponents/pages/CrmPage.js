import React, { useState } from "react";
import {
  Grid,
  Card,
  CardActionArea,
  CardContent,
  Typography,
  Box,
  Container,
  IconButton,
} from "@mui/material";

// Icons
import RequestQuoteIcon from "@mui/icons-material/RequestQuote";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import GroupsIcon from "@mui/icons-material/Groups";
import PublicIcon from "@mui/icons-material/Public";
import HubIcon from "@mui/icons-material/Hub";
import FactCheckIcon from "@mui/icons-material/FactCheck";
import ReportProblemIcon from "@mui/icons-material/ReportProblem";
import EngineeringIcon from "@mui/icons-material/Engineering";

// Forms
import BudgetaryQuotationForm from "../components/budgetaryQuotation/BudgetaryQuotationForm";
import LeadSubmittedForm from "../components/leadSubmitted/LeadSubmittedForm";
import DomesticLeadForm from "../components/domesticLead/DomesticLeadForm";
import ExportLeadForm from "../components/exportLead/ExportLeadForm";
import CRMLeadForm from "../components/crmLeads/CRMLeadForm";
import ReceivedDomesticOrder from "../components/orderReceived/OrderReceivedForm";
import LostForm from "../components/lostLeads/LostDomesticLead";
import FutureRDInitiative from "../components/futureRdInitiatives/FutureRDInitiative";
import { Home} from "@mui/icons-material";

// Gradients
const gradients = [
  // 1. Executive Navy (Strong, Dark Primary - Hero) - Recreated with the palette
  // "linear-gradient(145deg, #013A63 20%, #014F86 55%, #468FAF 100%)",
  "linear-gradient(145deg, #013A63 10%, #014F86 55%, #468FAF 100%)",

  // 2. Corporate Blue (Professional, Trustworthy) - Similar to original, vibrant version
  "linear-gradient(145deg, #013A63 10%, #014F86 55%, #468FAF 100%)",

  // 3. Calm Professional (Subtle, Soothing - No Cyan) - Gentle gradient
  "linear-gradient(145deg, #013A63 10%, #014F86 55%, #468FAF 100%)",

  // 4. Authority / Strong Action (More intense, Command)
  "linear-gradient(145deg, #013A63 10%, #014F86 55%, #468FAF 100%)", //Using a made up #003566 for a subtle tone change.

  // 5. Balanced Mid-Tone (Approachable, But Confident)
  "linear-gradient(145deg, #013A63 10%, #014F86 55%, #468FAF 100%)",

  // 6. Subtle Variation (Dark, but not as intense)
  "linear-gradient(145deg, #013A63 10%, #014F86 55%, #468FAF 100%)",

  // 7. Deep Elegant Contrast (Sophisticated, refined)
  // "linear-gradient(145deg, #01497C 0%, #468FAF 60%, #61A5C2 100%)",
  "linear-gradient(145deg, #013A63 10%, #014F86 55%, #468FAF 100%)",

  // 8. Light Blue Wash - For highlights/accents
  "linear-gradient(145deg, #013A63 10%, #014F86 55%, #468FAF 100%)",

  // 9. Light Blue Wash - For highlights/accents
  "linear-gradient(145deg, #013A63 10%, #014F86 55%, #468FAF 100%)",
];

// Cards
const menuItems = [
  { title: "Budgetary Quotation", icon: <RequestQuoteIcon />, value: 0 },
  { title: "Lead Submitted", icon: <AssignmentTurnedInIcon />, value: 1 },
  { title: "Domestic Leads", icon: <GroupsIcon />, value: 2 },
  { title: "Export Leads", icon: <PublicIcon />, value: 3 },
  { title: "CRM Leads", icon: <HubIcon />, value: 4 },
  { title: "Order Received", icon: <FactCheckIcon />, value: 5 },
  { title: "Lost Leads", icon: <ReportProblemIcon />, value: 6 },
  { title: "Future R&D initiatives", icon: <EngineeringIcon />, value: 7 },
];

export default function CrmPage() {
  const [value, setValue] = useState(null);

  return (
    <Box
      sx={{
        // mt:-2,
        minHeight: "90vh",
        py: 2,
        background: "linear-gradient(135deg, #E3F2FD 0%, #F9FCFF 100%)",
      }}
    >
      {value === null && (
        <>
          <Typography
            variant="h4"
            fontWeight={700}
            mb={6}
            textAlign="center"
            sx={{
              letterSpacing: "0.6px", // subtle authority
              // background: "linear-gradient(180deg, #034078 50%,#001F54 65%)",
              background: "#034078",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              position: "relative",

              // subtle underline accent (formal, not flashy)
              "&::after": {
                content: '""',
                display: "block",
                width: "180px",
                height: "4px",
                margin: "14px auto 0",
                borderRadius: "2px",
                background: "linear-gradient(90deg, #001F54, #034078)",
                opacity: 0.85,
              },
            }}
          >
            Marketing Data Entry Management
          </Typography>

          {/* ✅ WIDTH-CONSTRAINED CONTAINER */}
          <Container maxWidth="lg">
            <Grid
              container
              justifyContent="center"
              columnSpacing={4}
              rowSpacing={3}
            >
              {menuItems.map((item, index) => (
                <Grid
                  item
                  mt={2}
                  xs={16}
                  sm={6}
                  md={3} // ✅ Forces 4 per row
                  key={item.title}
                  sx={{ display: "flex", justifyContent: "center" }}
                >
                  <Card
                    sx={{
                      width: 260,
                      height: 230,
                      borderRadius: 4,
                      background: gradients[index],
                      color: "#fff",
                      boxShadow: "0 16px 40px rgba(0,0,0,0.15)",
                      transition: "0.35s",
                      "&:hover": {
                        transform: "translateY(-8px)",
                        boxShadow: "0 26px 60px rgba(0,0,0,0.25)",
                      },
                    }}
                  >
                    <CardActionArea
                      sx={{ height: "100%" }}
                      onClick={() => setValue(item.value)}
                    >
                      <CardContent
                        sx={{
                          height: "100%",
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          justifyContent: "center",
                          textAlign: "center",
                        }}
                      >
                        <Box
                          sx={{
                            mb: 2.5,
                            width: 70,
                            height: 70,
                            borderRadius: "50%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            background: "rgba(255,255,255,0.25)",
                          }}
                        >
                          {React.cloneElement(item.icon, {
                            sx: { fontSize: 38, color: "#fff" },
                          })}
                        </Box>

                        <Typography variant="h6" fontWeight={800}>
                          {item.title}
                        </Typography>

                        <Typography variant="body2" sx={{ opacity: 0.9 }}>
                          Open module
                        </Typography>
                      </CardContent>
                    </CardActionArea>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Container>
        </>
      )}

      {value !== null && (
        <Box px={{ xs: 2, sm: 4 }} position={"relative"}>
          {/* <Typography
            sx={{
              mb: 2,
              // mt: -2,
              // ml: -3,
              cursor: "pointer",
              textAlign: "left",
              fontWeight: 600,
              color: "#1976D2",
              p: 1,
              borderRadius: 15,
              border: " 2px solid",
              maxWidth: 110,
              // opacity: 9,
              // display: "flex",
              // alignItems: "center"
            }}
          >
           </Typography> */}
          <IconButton
            onClick={() => setValue(null)}
            aria-label="back"
            size="small"
            
            sx={{
              // ml: { xs: -80, md: -110, lg: -170 },
              // mt: -5,
              cursor: "pointer",
              textAlign: "left",
              fontWeight: 600,
              color: "#1976D2",
              px: 1,
              borderRadius: 15,
              border: " 2px solid",
              maxWidth: 60,
              position: "absolute",
              top: 0,
              left: 90
            }}
          >
            <Home />
          </IconButton>
          {value === 0 && <BudgetaryQuotationForm />}
          {value === 1 && <LeadSubmittedForm />}
          {value === 2 && <DomesticLeadForm />}
          {value === 3 && <ExportLeadForm />}
          {value === 4 && <CRMLeadForm />}
          {value === 5 && <ReceivedDomesticOrder />}
          {value === 6 && <LostForm />}
          {value === 7 && <FutureRDInitiative />}
          
        </Box>
      )}
    </Box>
  );
}
