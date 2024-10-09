const { config } = require('dotenv');
const mysql = require('mysql2/promise');
config()
// Setup connection pool
const pool = mysql.createPool({
  host: process.env.RIHANNA,
  user: process.env.DB_SARAH,
  password: process.env.MANASEY,
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