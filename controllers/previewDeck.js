const { PreviewDeck } = require("../routes/queries")


async function PosterDeckPreviews(req,res){
    try {
        const DeckView  = await PreviewDeck(req,res)
        const PosterTitle = DeckView[0].poster_deck_title
        const Description = DeckView[0].poster_deck_descritiption
        const Presenter = DeckView[0].poster_deck_owner
        const PosterFile = DeckView[0].poster_deck_image
        const PosterId = DeckView[0].poster_deck_id
        const PresenterEmail = DeckView[0].presenter_email
        const PresenterImage = DeckView[0].presenter_image
        const likes_count = DeckView[0].likes_count
        const DislikesCount = DeckView[0].dislike_count
        const ViewsCount = DeckView[0].views_count
    
       
        res.render("previewPoster", {PosterTitle:PosterTitle, Description:Description, Presenter:Presenter, PosterFile:PosterFile, PosterId:PosterId, PresenterEmail:PresenterEmail, PresenterImage:PresenterImage, DislikesCount:DislikesCount, ViewsCount:ViewsCount, likes_count:likes_count})

        // res.json({PosterDecks:JSON.stringify(DeckView)})
    } catch (error) {
        res.render("error", {status:"404 Not Found", page:"/" })
        console.error("Error", error.message)
    }
}

module.exports = PosterDeckPreviews