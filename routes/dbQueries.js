const { config } = require('dotenv');
const mysql = require('mysql2/promise');
config()
// Setup connection pool
const pool = mysql.createPool({
  host: "db4free.net",
  user: process.env.SARAH,
  password: process.env.SAMMUEL,
  database: process.env.TENI
});

// Function to execute query
async function executeQuery(query, values) {
    const [results] = await pool.execute(query, values);
    return results;
}

async function UploadFiles(query, values) {
    return executeQuery(query, values);
}


module.exports = {
  executeQuery,
  UploadFiles
}