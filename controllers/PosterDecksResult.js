const { getAllFromTable } = require("../routes/queries");

async function fetchDataFromTable(req,res) {
  try {
    const data = await getAllFromTable();
    res.json({ChannelData:JSON.stringify(data)})
    // console.log('Data from table:', data);
  } catch (error) {
    console.error("Error", error.message)

  }
}


// fetchDataFromTable();

module.exports = fetchDataFromTable
