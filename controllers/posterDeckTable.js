const { RetrievePosterDecksTable } = require("../routes/queries")

async function posterDeckTable(req,res, meetingId){
    try {
        const meetingId = req.params.meetingId

        const TableData  = await RetrievePosterDecksTable(req,res, meetingId)
   
        res.json({PosterDecks:JSON.stringify(TableData)})
    } catch (error) {
        console.error("Error", error.message)
        return res.json({error:error.message})
    }
}
 
    module.exports = posterDeckTable