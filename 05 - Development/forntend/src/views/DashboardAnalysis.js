import React, { useEffect, useState } from "react";
import { Box, Grid } from "@mui/material";
import KPIGrid from "../components/KPIGrid";
import ChartCard from "../components/ChartCard";
import {
  ConversionFunnelChart,
  ValueDistributionChart,
  QuarterlyChart,
  DocumentTypeChart,
  OwnerPerformanceChart,
} from "../components/Charts";
import * as mockData from "../mockData";
import axios from "axios";

const analysisKpis = [
  {
    label: "Avg Deal Size (Cr)",
    value: "₹19.3",
    delta: "+₹2.1 vs last FY",
    deltaType: "up",
  },
  {
    label: "BQ Conversion",
    value: "48%",
    delta: "+4% vs last FY",
    deltaType: "up",
  },
  {
    label: "Pipeline Value (Cr)",
    value: "₹312",
    delta: "Active leads",
    deltaType: "neutral",
  },
  {
    label: "Avg Lead Age (days)",
    value: 47,
    delta: "+6 vs last FY",
    deltaType: "down",
  },
  { label: "Export Leads", value: 18, delta: "+5 vs last FY", deltaType: "up" },
  {
    label: "Sole Bidding",
    value: "62%",
    delta: "+8% vs last FY",
    deltaType: "up",
  },
];

export default function DashboardAnalysis() {
  const [funnelData, setFunnelData] = useState([]);
  const [distributionData, setDistributionData] = useState(mockData.orderValueDistributionData);
  const [quarterData, setQuarterData] = useState(mockData.quarterlyData);
  const [documentData, setDocumentData] = useState([mockData.documentTypeData]);
  const [ownerData, setOwnerData] = useState([]);
  const [analysisKpis, setAnalysisKpis] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/dashboard/analysis/bq-funnel")
      .then((res) => setFunnelData(res.data.data));

    axios
      .get("http://localhost:5000/api/dashboard/analysis/order-distribution")
      .then((res) => setDistributionData(res.data.data));

    axios
      .get("http://localhost:5000/api/dashboard/analysis/quarterly")
      .then((res) => setQuarterData(res.data.data));

    axios
      .get("http://localhost:5000/api/dashboard/analysis/document-type")
      .then((res) => setDocumentData(res.data.data));

    axios
      .get("http://localhost:5000/api/dashboard/analysis/owner-performance")
      .then((res) => setOwnerData(res.data.data));

    axios.get("http://localhost:5000/api/dashboard/analysis/kpis").then((res) => {
      const d = res.data.data;

      setAnalysisKpis([
        {
          label: "Avg Deal Size (Cr)",
          value: `₹${d.avgDealSize}`,
          delta: "+₹2.1 vs last FY",
          deltaType: "up",
        },
        {
          label: "BQ Conversion",
          value: `${d.conversion}%`,
          delta: "+4% vs last FY",
          deltaType: "up",
        },
        {
          label: "Pipeline Value (Cr)",
          value: `₹${d.pipelineValue}`,
          delta: "Active leads",
          deltaType: "neutral",
        },
        {
          label: "Avg Lead Age (days)",
          value: d.avgLeadAge,
          delta: "+6 vs last FY",
          deltaType: "down",
        },
        {
          label: "Export Leads",
          value: d.exportCount,
          delta: "+5 vs last FY",
          deltaType: "up",
        },
        {
          label: "Sole Bidding",
          value: `${d.solePercent}%`,
          delta: "+8% vs last FY",
          deltaType: "up",
        },
      ]);
    });
  }, []);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      {/* KPIs */}
      <KPIGrid kpis={analysisKpis} />

      {/* Charts Grid 1 */}
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <ChartCard
            title="BQ conversion funnel"
            subtitle="BQs submitted → Leads → Orders won"
            chip={{ label: "Funnel", type: "blue" }}
          >
            <ConversionFunnelChart data={funnelData} />
          </ChartCard>
        </Grid>
        <Grid item xs={12} md={6}>
          <ChartCard
            title="Order value distribution"
            subtitle="By deal size band (Cr)"
            chip={{ label: "Distribution", type: "amber" }}
          >
            <ValueDistributionChart data={distributionData} />
          </ChartCard>
        </Grid>
      </Grid>

      {/* Charts Grid 2 */}
      <Grid container spacing={2}>
        <Grid item xs={12} md={4}>
          <ChartCard
            title="Quarter-on-quarter orders"
            subtitle="Q1–Q4 current vs previous FY"
          >
            <QuarterlyChart data={quarterData} />
          </ChartCard>
        </Grid>

        <Grid item xs={12} md={4}>
          <ChartCard
            title="Document type breakdown"
            subtitle="RFP / RFQ / RFI etc."
          >
            <DocumentTypeChart data={documentData} />
          </ChartCard>
        </Grid>

        <Grid item xs={12} md={4}>
          <ChartCard
            title="Lead owner performance"
            subtitle="Won value per team member (Cr)"
          >
            <OwnerPerformanceChart data={ownerData} />
          </ChartCard>
        </Grid>
      </Grid>
    </Box>
  );
}
