const getAllChannels = require('./getAllChannels'); // Adjust the path as necessary

const GraphChannels = async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1] || `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdXRoZW50aWNhdGlvbl90eXBlIjowLCJhcHBfaWQiOiIxYTM1ZDUyZGM0ODc0ZDEzOTk3YTQxMWVjNjQwYjFjNiIsInVzZXJfaWQiOiIxODI5Mzc0NC0yOTJkLTQ5MDAtYWFkZC00MDNkYTE0NmJlZTAiLCJwcm9qZWN0X2lkIjoiYWM3ZmIyOTRjZTJiOWE0NGY4YjEiLCJleHAiOjE3Mjg2NDk3NTZ9.vZpXh8PqC0w8w_i_LTnQuJkFeIXBLT0s9KcYyEl9FSA`; // Extract the token from the request headers

  // Call the function to get all channels
  try {
    const channels = await getAllChannels(token);
    res.json({ channels: channels });
    console.log('Available channels:', channels);
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.error('Error fetching channels:', error);
  } 
} 
module.exports = GraphChannels;
