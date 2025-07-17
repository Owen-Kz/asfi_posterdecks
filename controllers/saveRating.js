const { SaveRating } = require("../routes/queries")

const saveRatingToDB = async (req,res) =>{
    const {rating, posterID} = req.body
    const username = req.user.username
    
    try {
    
        const SAVED = await SaveRating(rating, username, posterID)
        console.log(SAVED)
        if(SAVED.affectedRows && SAVED.affectedRows > 0){
        return res.json({success:"Rating Saved"})
        }else if(SAVED.error){
            return res.json({error:SAVED.error})
        }
        else{
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