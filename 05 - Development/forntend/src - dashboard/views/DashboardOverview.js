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
  Button,
} from "@mui/material";
import KPIGrid from "../components/KPIGrid";
import ChartCard from "../components/ChartCard";
import {
  FiveYearChart,
  LeadOutcomesChart,
  MonthlyTrendChart,
  CivilDefenceChart,
  LeadSubTypesChart,
  DomainWinLossChart,
  Top10Chart,
  DomesticLeadsTypesChart,
} from "../components/Charts";
import * as mockData from "../mockData";
import axios from "axios";

const overviewKpis = [
  {
    label: "Leads Analysed",
    value: 0,
    delta: "+0 vs last FY",
    deltaType: "up",
  },
  {
    label: "Not participated",
    value: 0,
    delta: "+0 vs last FY",
    deltaType: "up",
  },
  {
    label: "Under Evaluation",
    value: 0,
    delta: "+₹0 vs last FY",
    deltaType: "up",
  },
  {
    label: "Pursuing",
    value: 0,
    delta: "same as last FY",
    deltaType: "neutral",
  },
  { label: "Won Leads", value: 0, delta: "+0% vs last FY", deltaType: "up" },
  { label: "Lost Leads", value: 0, delta: "+0 vs last FY", deltaType: "down" },
];

const feedKpisData = (kpisData) => {
  return [
    {
      label: "Leads Analysed",
      value: kpisData.totalAnalysedLeads,
      delta: "+8 vs last FY",
      deltaType: "up",
    },
    {
      label: "Not participated",
      value: kpisData.notParticipatedLeads,
      delta: "+23 vs last FY",
      deltaType: "up",
    },
    {
      label: "Under Evaluation",
      value: kpisData.inEvaluationLeads,
      delta: "+₹38 vs last FY",
      deltaType: "up",
    },
    {
      label: "Pursuing",
      value: kpisData.pursuingLeads,
      delta: "same as last FY",
      deltaType: "neutral",
    },
    {
      label: "Won Leads",
      value: kpisData.wonLeads,
      delta: "+6% vs last FY",
      deltaType: "up",
    },
    {
      label: "Lost Leads",
      value: kpisData.lostLeads,
      delta: "+5 vs last FY",
      deltaType: "down",
    },
  ];
};

function feedOders5Years(data) {
  const results = {};

  // Helper function to get fiscal year from date
  function getFiscalYear(dateStr) {
    const date = new Date(dateStr);
    const year = date.getFullYear();
    const month = date.getMonth(); // 0-based (0-11)

    // In India, fiscal year runs from April to March
    // So if month is March (2) or earlier, it's previous year's fiscal year
    if (month <= 2) {
      return `FY ${year - 1}-${year}`;
    } else {
      return `FY ${year}-${year + 1}`;
    }
  }

  // Process each row in the data
  for (const row of data) {
    const orderDate = row.orderRxdDate;
    const valueWithGST = parseFloat(row.valueWithGST) || 0;

    // Get fiscal year for this order
    const fy = getFiscalYear(orderDate);

    // Initialize fiscal year in results if not exists
    if (!results[fy]) {
      results[fy] = {
        orders: 0,
        value: 0,
      };
    }

    // Increment orders and add value
    results[fy].orders++;
    results[fy].value += valueWithGST;
  }

  // Convert results object to array and sort by fiscal year
  const resultArray = Object.entries(results).map(([fy, data]) => ({
    fy,
    orders: data.orders,
    value: Math.round(data.value), // Rounding to nearest integer
  }));

  // Sort by fiscal year
  resultArray.sort((a, b) => {
    const aYear = parseInt(a.fy.split(" ")[1].split("-")[0]);
    const bYear = parseInt(b.fy.split(" ")[1].split("-")[0]);
    return aYear - bYear;
  });
  console.log("resultArray : ", resultArray);
  return resultArray;
}

function calculateMonthlyOrdersTrend(data) {
  // Get current date
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();

  // Determine current and previous fiscal years
  let currentFiscalYear;
  let prevFiscalYear;

  // Fiscal year runs from April to March
  if (currentMonth <= 2) {
    // April to March
    currentFiscalYear = `FY ${currentYear - 1}-${currentYear}`;
    prevFiscalYear = `FY ${currentYear - 2}-${currentYear - 1}`;
  } else {
    currentFiscalYear = `FY ${currentYear}-${currentYear + 1}`;
    prevFiscalYear = `FY ${currentYear - 1}-${currentYear}`;
  }

  console.log("Current Fiscal Year:", currentFiscalYear);
  console.log("Previous Fiscal Year:", prevFiscalYear);

  // Initialize results for current and previous fiscal years
  const currentYearData = {};
  const prevYearData = {};

  // Helper function to get month from date
  function getMonth(dateStr) {
    const date = new Date(dateStr);
    return date.getMonth() + 1; // 1-based (1-12)
  }

  // Process each row in the data
  for (const row of data) {
    const orderDate = row.orderRxdDate;
    const orderMonth = getMonth(orderDate);
    const valueWithGST = parseFloat(row.valueWithGST) || 0;

    // Get fiscal year for this order
    const date = new Date(orderDate);
    const year = date.getFullYear();
    const month = date.getMonth();

    let fy;
    if (month <= 2) {
      // April to March
      fy = `FY ${year - 1}-${year}`;
    } else {
      fy = `FY ${year}-${year + 1}`;
    }

    // Only process current and previous fiscal years
    if (fy === currentFiscalYear || fy === prevFiscalYear) {
      if (!currentYearData[orderMonth]) {
        currentYearData[orderMonth] = 0;
      }
      if (!prevYearData[orderMonth]) {
        prevYearData[orderMonth] = 0;
      }

      if (fy === currentFiscalYear) {
        currentYearData[orderMonth] += valueWithGST;
      } else {
        prevYearData[orderMonth] += valueWithGST;
      }
    }
  }

  // Convert results to the desired format
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const resultArray = months.map((monthName, index) => {
    const monthNum = index + 1;
    return {
      month: monthName,
      [currentFiscalYear]: currentYearData[monthNum] || 0,
      [prevFiscalYear]: prevYearData[monthNum] || 0,
    };
  });

  return resultArray;
}

export default function DashboardOverview() {
  const [kpisData, setKpisData] = useState(overviewKpis);
  const [order5Years, setOrder5Years] = useState(mockData.fiveYearData);
  const [monthlyOrderTrends, setMonthlyOrderTrends] = useState(
    mockData.monthlyTrendData
  );
  const [leadOutcomesData, setLeadOutcomesData] = useState(
    mockData.leadOutcomesData
  );
  const [domesticLeadTypesData, setDomesticLeadTypesData] = useState(
    mockData.domesticLeadTypesData
  );
  const [topCustomers, setTopCustomers] = useState([]);

  // here, we apply the logic networking
  useEffect(() => {
    // ===== FOR PRODUCTION - UNCOMMENT BELOW & COMMENT ABOVE =====
    axios
      .get(`http://localhost:5000/api/dashboard/overview/kpis`)
      .then((response) => {
        console.log(response.data?.data);
        const kpisApiData = response.data?.data;
        const kpisDataToFeed = feedKpisData(kpisApiData);

        setKpisData(kpisDataToFeed);
        console.log(
          "kpisData.notParticipatedLeads : ",
          kpisApiData.notParticipatedLeads
        );
        const won =
          Math.round(
            (kpisApiData.wonLeads / kpisApiData.totalAnalysedLeads) * 100 * 100
          ) / 100;
        const lost =
          Math.round(
            (kpisApiData.lostLeads / kpisApiData.totalAnalysedLeads) * 100 * 100
          ) / 100;
        const participated =
          Math.round(
            ((kpisApiData.inEvaluationLeads +
              kpisApiData.wonLeads +
              kpisApiData.lostLeads +
              kpisApiData.inEvaluationLeads) /
              kpisApiData.totalAnalysedLeads) *
              100 *
              100
          ) / 100;
        const notParticipated =
          Math.round(
            (kpisApiData.notParticipatedLeads /
              kpisApiData.totalAnalysedLeads) *
              100 *
              100
          ) / 100;
        console.log("won : ", won, lost, participated, notParticipated);
        setLeadOutcomesData([
          { name: "Won", value: won, color: "#16a34a" },
          { name: "Lost", value: lost, color: "#dc2626" },
          { name: "Participated", value: participated, color: "#2563eb" },
          {
            name: "Not-Participated",
            value: notParticipated,
            color: "#d97706",
          },
        ]);
      })
      .catch((error) => {
        console.log(error.message);
      })
      .finally(function () {
        // always executed
      });

    axios
      .get(`http://localhost:5000/api/dashboard/overview/orders-5year`)
      .then((response) => {
        console.log(response.data?.data);
        const kpisDataResponse = feedOders5Years(response?.data?.data);
        setOrder5Years(kpisDataResponse);

        const monthlyOrderTrendsData = calculateMonthlyOrdersTrend(
          response?.data?.data
        );
        setMonthlyOrderTrends(monthlyOrderTrendsData);
        console.log("mockData.monthlyTrendData : ", mockData.monthlyTrendData);
        console.log("monthlyOrderTrendsData : ", monthlyOrderTrendsData);
      })
      .catch((error) => {
        console.log(error.message);
      })
      .finally(function () {
        // always executed
      });

    axios
      .get(`http://localhost:5000/api/dashboard/overview/tenderType-count`)
      .then((response) => {
        console.log(response.data?.data);
        setDomesticLeadTypesData(response.data.data);
      })
      .catch((error) => {
        console.log(error.message);
      })
      .finally(function () {
        // always executed
      });

    axios
      .get(`http://localhost:5000/api/dashboard/overview/top-customers`)
      .then((response) => {
        console.log("Top Customers:", response.data.data);
        setTopCustomers(response.data.data);
      })
      .catch((error) => {
        console.log(error.message);
      });
  }, []);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      {/* KPIs */}
      <KPIGrid kpis={kpisData} />

      {/* Charts Grid 1 */}
      <Grid container spacing={2}>
        <Grid item xs={12} md={8}>
          <ChartCard
            title="Monthly order trend"
            subtitle="Count + cumulative value (Cr)"
            chip={{ label: "2 years", type: "blue" }}
            legend={[
              { label: "FY 25-26", color: "#2563eb" },
              { label: "FY 24-25", color: "#d97706" },
            ]}
          >
            <MonthlyTrendChart data={monthlyOrderTrends} />
          </ChartCard>
        </Grid>
        <Grid item xs={12} md={4}>
          <ChartCard
            title="Lead outcomes"
            subtitle="All-time distribution"
            chip={{ label: "Current FY", type: "green" }}
            legend={[
              { label: "Won", color: "#16a34a" },
              { label: "Lost", color: "#dc2626" },
              { label: "Participated", color: "#2563eb" },
              { label: "Not-Participated", color: "#d97706" },
            ]}
          >
            <LeadOutcomesChart data={leadOutcomesData} />
          </ChartCard>
        </Grid>
      </Grid>

      {/* Charts Grid 2 */}
      <Grid container spacing={2}>
        <Grid item xs={12} md={4}>
          <ChartCard
            title="Software SBU Last 5-year order history"
            subtitle="Order count & value (Cr) by financial year"
            chip={{ label: "5 years", type: "blue" }}
            legend={[
              { label: "Orders (count)", color: "#2563eb" },
              { label: "Value (Cr)", color: "#7c3aed" },
            ]}
          >
            <FiveYearChart data={order5Years} />
          </ChartCard>
        </Grid>

        <Grid item xs={12} md={4}>
          <ChartCard
            title="Domestic Lead types"
            subtitle="Distribution this FY"
            chip={{ label: "3 types", type: "blue" }}
            legend={[
              { label: "ST", color: "#2563eb" },
              { label: "MT", color: "#0d9488" },
              { label: "LT", color: "#d97706" },
              // { label: "Domestic", color: "#0d9488" },
              // { label: "Export", color: "#7c3aed" },
            ]}
          >
            <DomesticLeadsTypesChart data={domesticLeadTypesData} />
          </ChartCard>
        </Grid>

        <Grid item xs={12} md={4}>
          <ChartCard
            title="Defence vs. Non Defence"
            subtitle="Lead & order split"
            chip={{ label: "Mix", type: "amber" }}
            legend={[
              { label: "Defence", color: "#7c3aed" },
              { label: "Non Defence", color: "#2563eb" },
            ]}
          >
            <CivilDefenceChart data={mockData.defenceNonDefenceData} />
          </ChartCard>
        </Grid>

        {/* <Grid item xs={12} md={4}>
          <ChartCard
            title="Lead sub-types"
            subtitle="Distribution this FY"
            chip={{ label: "5 types", type: "blue" }}
            legend={[
              { label: "Submitted", color: "#2563eb" },
              { label: "Lost Lead", color: "#dc2626" },
              { label: "CRM Lead", color: "#d97706" },
              { label: "Domestic", color: "#0d9488" },
              { label: "Export", color: "#7c3aed" },
            ]}
          >
            <LeadSubTypesChart data={mockData.leadSubTypesData} />
          </ChartCard>
        </Grid> */}
      </Grid>

      {/* Charts Grid 3 */}
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <ChartCard
            title="Performance by business domain"
            subtitle="Stacked by outcome"
            chip={{ label: "Domain view", type: "green" }}
            legend={[
              { label: "Won", color: "#16a34a" },
              { label: "Lost", color: "#dc2626" },
            ]}
          >
            <DomainWinLossChart data={mockData.domainWinLossData} />
          </ChartCard>
        </Grid>
        <Grid item xs={12} md={6}>
          <ChartCard
            title="Top 10 Customers"
            subtitle="By order value (Cr)"
            chip={{ label: "Top 10", type: "blue" }}
          >
            <Top10Chart data={topCustomers} />
          </ChartCard>
        </Grid>
      </Grid>

      {/* Lost Leads Table */}
      <Paper
        sx={{
          border: "1px solid #e4e8ef",
          borderRadius: "14px",
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            padding: "16px 20px",
            borderBottom: "1px solid #e4e8ef",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Box>
            <div
              style={{ fontSize: "13px", fontWeight: 500, color: "#0f1117" }}
            >
              Lost lead analysis
            </div>
            <div
              style={{ fontSize: "11px", color: "#8892a4", marginTop: "2px" }}
            >
              Detailed breakdown of all lost opportunities
            </div>
          </Box>
          {/* <Button
            variant="outlined"
            size="small"
            sx={{
              fontSize: '12px',
              padding: '6px 12px',
              border: '1px solid #d0d5e0',
              borderRadius: '7px',
              backgroundColor: '#ffffff',
              color: '#525868',
              textTransform: 'none',
            }}
          >
            Analyse with AI ↗
          </Button> */}
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
                  Domain
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
                  Competitor
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
                  Reason
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
                  Date
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {mockData.lostLeadsTableData.map((row, idx) => (
                <TableRow
                  key={idx}
                  sx={{
                    borderColor: "#e4e8ef",
                    "&:hover": { backgroundColor: "#f1f3f7" },
                  }}
                >
                  <TableCell sx={{ color: "#525868", borderColor: "#e4e8ef" }}>
                    {row.tenderName}
                  </TableCell>
                  <TableCell sx={{ color: "#525868", borderColor: "#e4e8ef" }}>
                    {row.customer}
                  </TableCell>
                  <TableCell sx={{ color: "#525868", borderColor: "#e4e8ef" }}>
                    {row.domain}
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
                  <TableCell sx={{ color: "#525868", borderColor: "#e4e8ef" }}>
                    {row.competitor}
                  </TableCell>
                  <TableCell sx={{ color: "#525868", borderColor: "#e4e8ef" }}>
                    {row.reason}
                  </TableCell>
                  <TableCell
                    sx={{
                      fontFamily: '"DM Mono", monospace',
                      fontWeight: 500,
                      color: "#0f1117",
                      borderColor: "#e4e8ef",
                    }}
                  >
                    {row.date}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
}
