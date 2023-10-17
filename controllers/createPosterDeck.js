const { InsertIntoPosterDecks } = require("../routes/queries");

async function CreateDeck(req,res, newFileName){
    try {
    
        const TableData  = await InsertIntoPosterDecks(req,res,newFileName)
        // res.render("success", {status:"Poster Uploaded Successfully", page:"/sessionDashboard"})
       
        // const DummyDeck = await InsertDummyPosterDecks(req,res)
    } catch (error) {
        res.render("success", {status:"Internal Server Error", page:"/sessionDashboard"})
        console.error("Error", error.message)
    }
}

module.exports = CreateDeck