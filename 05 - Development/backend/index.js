// server.js
import { config } from 'dotenv';
// const app = require("./server");
// const pool = require("./db");
import app from './server.js';
import pool from './db.js'

config(); // Or config({ path: '.env' }) if your .env is in a different location


// in this we combine both app.js(http server by express) + db.js(database server by postgres) = index.js(server)

const port = process.env.PORT || 5000;

(async () => {
  try {
    // first we run database server then we start our backend server
    // test db connection
    await pool.query("SELECT 1");
    // after database connection we start our backend server
    // app.listen(port, () => console.log(`Server running on port ${port}`));
    app;
  } catch (err) {
    console.error("Failed to connect to DB", err);
    process.exit(1);
  }
})();
