import React, { useEffect, useState } from "react";
import {
  Box,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
} from "@mui/material";
import KPIGrid from "../components/KPIGrid";
import ChartCard from "../components/ChartCard";
import { PipelineStatusChart, PipelineDomainChart } from "../components/Charts";
import * as mockData from "../mockData";
import axios from "axios";

const pipelineKpis = [
  {
    label: "Open Leads",
    value: 42,
    delta: "Across 5 stages",
    deltaType: "neutral",
  },
  {
    label: "Pre-bid Pending",
    value: 8,
    delta: "This month",
    deltaType: "neutral",
  },
  {
    label: "Submissions Due",
    value: 5,
    delta: "Next 7 days",
    deltaType: "down",
  },
  {
    label: "Corrigendums",
    value: 12,
    delta: "Active tenders",
    deltaType: "neutral",
  },
  {
    label: "Consortium Deals",
    value: 11,
    delta: "+3 vs last FY",
    deltaType: "up",
  },
  {
    label: "Expected Win (Cr)",
    value: "₹98",
    delta: "Weighted pipeline",
    deltaType: "up",
  },
];

const getStatusColor = (status) => {
  switch (status) {
    case "In progress":
      return { bg: "#eff4ff", text: "#2563eb" };
    case "Pending docs":
      return { bg: "#fffbeb", text: "#d97706" };
    case "Draft ready":
      return { bg: "#f0fdf4", text: "#16a34a" };
    default:
      return { bg: "#f1f3f7", text: "#525868" };
  }
};

export default function DashboardPipeline() {
  const [pipelineKpisData, setPipelineKpisData] = useState(pipelineKpis);
  const [upcomingSubmissions, setUpcomingSubmissions] = useState(
    mockData.upcomingDeadlinesData
  );
  const [pipelineStatus, setPipelineStatus] = useState([]);
  const [pipelineDomain, setPipelineDomain] = useState([]);

  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/dashboard/pipeline/kpis`)
      .then((response) => {
        console.log("Pipeline KPI data : ", response.data?.data);
        setPipelineKpisData(response?.data?.data);
      })
      .catch((error) => {
        console.log(error.message);
      })
      .finally(function () {
        // always executed
      });

    axios
      .get(`http://localhost:5000/api/dashboard/pipeline/deadlines`)
      .then((response) => {
        console.log("Pipeline KPI data : ", response.data?.data);
        setUpcomingSubmissions(response?.data?.data);
      })
      .catch((error) => {
        console.log(error.message);
      })
      .finally(function () {
        // always executed
      });

    axios
      .get(`http://localhost:5000/api/dashboard/pipeline/status`)
      .then((res) => setPipelineStatus(res.data.data));

    // ✅ Domain chart
    axios
      .get(`http://localhost:5000/api/dashboard/pipeline/domain`)
      .then((res) => setPipelineDomain(res.data.data));

    return () => {};
  }, []);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      {/* KPIs */}
      <KPIGrid kpis={pipelineKpisData} />

      {/* Charts Grid */}
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <ChartCard
            title="Pipeline by present status"
            subtitle="All open leads grouped by current stage"
            chip={{ label: "Live", type: "blue" }}
          >
            <PipelineStatusChart data={pipelineStatus} />
          </ChartCard>
        </Grid>
        <Grid item xs={12} md={6}>
          <ChartCard
            title="Pipeline value by domain (Cr)"
            subtitle="Expected value of open leads per domain"
            legend={[
              { label: "Non Defence", color: "#2563eb" },
              { label: "Defence", color: "#7c3aed" },
            ]}
          >
            <PipelineDomainChart data={pipelineDomain} />
          </ChartCard>
        </Grid>
      </Grid>

      {/* Upcoming Deadlines Table */}
      <Paper
        sx={{
          border: "1px solid #e4e8ef",
          borderRadius: "14px",
          overflow: "hidden",
        }}
      >
        <Box sx={{ padding: "16px 20px", borderBottom: "1px solid #e4e8ef" }}>
          <div style={{ fontSize: "13px", fontWeight: 500, color: "#0f1117" }}>
            Upcoming submission deadlines
          </div>
          <div style={{ fontSize: "11px", color: "#8892a4", marginTop: "2px" }}>
            Next 30 days — action required
          </div>
        </Box>
        <TableContainer>
          <Table sx={{ fontSize: "12px" }}>
            <TableHead>
              <TableRow sx={{ backgroundColor: "#f1f3f7" }}>
                <TableCell
                  sx={{
                    fontSize: "10px",
                    fontWeight: 500,
                    textTransform: "uppercase",
                    color: "#8892a4",
                    borderColor: "#e4e8ef",
                  }}
                >
                  Tender Name
                </TableCell>
                <TableCell
                  sx={{
                    fontSize: "10px",
                    fontWeight: 500,
                    textTransform: "uppercase",
                    color: "#8892a4",
                    borderColor: "#e4e8ef",
                  }}
                >
                  Customer
                </TableCell>
                <TableCell
                  sx={{
                    fontSize: "10px",
                    fontWeight: 500,
                    textTransform: "uppercase",
                    color: "#8892a4",
                    borderColor: "#e4e8ef",
                  }}
                >
                  Type
                </TableCell>
                <TableCell
                  sx={{
                    fontSize: "10px",
                    fontWeight: 500,
                    textTransform: "uppercase",
                    color: "#8892a4",
                    borderColor: "#e4e8ef",
                  }}
                >
                  Value (Cr)
                </TableCell>
                <TableCell
                  sx={{
                    fontSize: "10px",
                    fontWeight: 500,
                    textTransform: "uppercase",
                    color: "#8892a4",
                    borderColor: "#e4e8ef",
                  }}
                >
                  Deadline
                </TableCell>
                <TableCell
                  sx={{
                    fontSize: "10px",
                    fontWeight: 500,
                    textTransform: "uppercase",
                    color: "#8892a4",
                    borderColor: "#e4e8ef",
                  }}
                >
                  Owner
                </TableCell>
                <TableCell
                  sx={{
                    fontSize: "10px",
                    fontWeight: 500,
                    textTransform: "uppercase",
                    color: "#8892a4",
                    borderColor: "#e4e8ef",
                  }}
                >
                  Status
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {upcomingSubmissions.map((row, idx) => {
                const statusColor = getStatusColor(row.status);
                return (
                  <TableRow
                    key={idx}
                    sx={{
                      borderColor: "#e4e8ef",
                      "&:hover": { backgroundColor: "#f1f3f7" },
                    }}
                  >
                    <TableCell
                      sx={{ color: "#525868", borderColor: "#e4e8ef" }}
                    >
                      {row.tenderName}
                    </TableCell>
                    <TableCell
                      sx={{ color: "#525868", borderColor: "#e4e8ef" }}
                    >
                      {row.customer}
                    </TableCell>
                    <TableCell
                      sx={{ color: "#525868", borderColor: "#e4e8ef" }}
                    >
                      {row.type}
                    </TableCell>
                    <TableCell
                      sx={{
                        fontFamily: '"DM Mono", monospace',
                        fontWeight: 500,
                        color: "#0f1117",
                        borderColor: "#e4e8ef",
                      }}
                    >
                      {row.value}
                    </TableCell>
                    <TableCell
                      sx={{
                        fontFamily: '"DM Mono", monospace',
                        fontWeight: 500,
                        color: "#0f1117",
                        borderColor: "#e4e8ef",
                      }}
                    >
                      {row.deadline}
                    </TableCell>
                    <TableCell
                      sx={{ color: "#525868", borderColor: "#e4e8ef" }}
                    >
                      {row.owner}
                    </TableCell>
                    <TableCell sx={{ borderColor: "#e4e8ef" }}>
                      <Chip
                        label={row.status}
                        size="small"
                        sx={{
                          fontSize: "10px",
                          fontWeight: 500,
                          padding: "2px 7px",
                          height: "auto",
                          backgroundColor: statusColor.bg,
                          color: statusColor.text,
                          border: "none",
                        }}
                      />
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
}
