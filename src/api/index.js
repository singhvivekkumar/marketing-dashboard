// server.js
require("dotenv").config();
const app = require("./app");
const pool = require("./db");

const port = process.env.PORT || 5000;

(async () => {
  try {
    // test db connection
    await pool.query("SELECT 1");
    app.listen(port, () => console.log(`Server running on port ${port}`));
  } catch (err) {
    console.error("Failed to connect to DB", err);
    process.exit(1);
  }
})();
