const { SaveRating } = require("../routes/queries")

const saveRatingToDB = async (req,res) =>{
    const {rating, username, posterID} = req.body
    try {
    
        const SAVED = await SaveRating(rating, username, posterID)

        if(SAVED.affectedRows && SAVED.affectedRows > 0){
        return res.json({success:"Rating Saved"})
        }else{
            const errMessage = SAVED.error? SAVED.error : "Could not Save Rating"
            return res.json({error:"Could Not Save Rating"})
        }
        // res.render("success", {status:"Poster Uploaded Successfully", page:"/sessionDashboard"})
       
        // const DummyDeck = await InsertDummyPosterDecks(req,res)
    } catch (error) {
        
        console.error("Error", error.message)

        return res.json({status:"Internal Server Error", page:"/sessionDashboard"})
        
    }
}

module.exports = saveRatingToDB