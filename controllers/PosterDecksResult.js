const { getAllFromTable } = require("../routes/queries");

async function fetchDataFromTable(req,res) {
  try {
    const data = await getAllFromTable();
    if(data){
    return res.json({ChannelData:JSON.stringify(data)})
    }else{
     return res.json({error:"Could Not get data"})
    }
    // console.log('Data from table:', data);
  } catch (error) {
    console.error("Error", error.message)
   return res.json({error:error.message, environmentDB:process.env})
  }
}


// fetchDataFromTable();

module.exports = fetchDataFromTable
