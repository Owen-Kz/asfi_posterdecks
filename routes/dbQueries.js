const { config } = require('dotenv');
const mysql = require('mysql2/promise');
config()
// Setup connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME
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