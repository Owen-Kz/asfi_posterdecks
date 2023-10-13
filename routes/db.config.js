const { Pool } = require('pg');
const dotenv = require("dotenv").config();


const pool = new Pool({
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  host: process.env.PGHOST,
  port: process.env.PGPORT,
  database: process.env.PGDATABASE
  
});

// Rest of your code using the 'pool' for database operations
module.exports = pool