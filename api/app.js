// app.js
const express = require("express");
const cors = require("cors");
// const leadRoutes = require("./routes/domesticLeadRoutes");

const app = express();
app.use(cors());
app.use(express.json({ limit: "2mb" }));

// health
app.get("/health", (req, res) => res.json({ ok: true, data: {data: "You don't have any data..."}, message: 'Health is good' }));

// routes
// app.use("/api/leads", leadRoutes);

// default 404
app.use((req, res) => res.status(404).json({ error: "Not found" }));

app.listen(5000, () => console.log(`Server running on`));

module.exports = app;
