const { PreviewDeck } = require("../../routes/queries")

const editPosterPage = async (req,res) =>{
    try{
        if(req.user){
            const DeckView  = await PreviewDeck(req,res)
            if(DeckView.length > 0){


            const PosterTitle = DeckView[0].poster_deck_title
            const Description = DeckView[0].poster_deck_descritiption
            const Presenter = DeckView[0].poster_deck_owner
            const PosterFile = DeckView[0].poster_deck_image
            const PosterId = DeckView[0].poster_deck_id
         
        
            const PosterMeeting = DeckView[0].poster_deck_meeting
            let affiliation = ""
        let country = ""
        if(DeckView[0].affiliation !== null){
            affiliation = `${DeckView[0].affiliation}, `
        }

        if(DeckView[0].country !== null){
            country = DeckView[0].country;
        }
            
            res.render("editPoster", {firstname:req.user.first_name, lastname:req.user.last_name, email:req.user.email, prefix:req.user.prefix, PosterTitle, PosterId, PosterMeeting, PosterFile, Presenter, Description, affiliation, country})
    }else{
        return res.render("error", {status:"Poster Does not Exist"})
    }
        }
    }catch(error){
        res.render("error", {status:error.message})
    }
}

module.exports = editPosterPage