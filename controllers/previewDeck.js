const { PreviewDeck } = require("../routes/queries")
const ProfileDetails = require("./getProfileDetails")


async function PosterDeckPreviews(req,res){
    try {
        if(req.user){
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
        const DownloadsCount = DeckView[0].downloads_count
        const PosterMeeting = DeckView[0].poster_deck_meeting
        let affiliation = ""
        let country = ""
        if(DeckView[0].affiliation !== null){
            affiliation = `${DeckView[0].affiliation}, `
        }

        if(DeckView[0].country !== null){
            country = DeckView[0].country;
        }

        
        let Picture = ""

        const GetPresenterDetails =  await ProfileDetails(PresenterEmail)

        if(!GetPresenterDetails.error){
        if(GetPresenterDetails.userDetails.profile_picture === "avatar.jpg"){
            Picture = "https://res.cloudinary.com/dll8awuig/image/upload/v1705444097/dc69h8mggh01bvlvbowh.jpg"
        }else if(!GetPresenterDetails.userDetails.profile_picture){
            Picture = "https://res.cloudinary.com/dll8awuig/image/upload/v1705444097/dc69h8mggh01bvlvbowh.jpg"
        }else{
            Picture = GetPresenterDetails.userDetails.profile_picture
        }
        }else{
            Picture = "https://res.cloudinary.com/dll8awuig/image/upload/v1705444097/dc69h8mggh01bvlvbowh.jpg"
        }
    
        let isOwner = false 
        if(PresenterEmail === req.user.email){
            isOwner = true
        }
        res.render("previewPoster", {PosterTitle:PosterTitle, Description:Description, Presenter:Presenter, PosterFile:PosterFile, PosterId:PosterId, PresenterEmail:PresenterEmail, PresenterImage:Picture, DislikesCount:DislikesCount, ViewsCount:ViewsCount, likes_count:likes_count, DownloadsCount:DownloadsCount, meeting: PosterMeeting, affiliation:affiliation, country: country, isOwner:isOwner})
        }else{
            res.render("loginExternal")
        }
        // res.json({PosterDecks:JSON.stringify(DeckView)})
    } catch (error) {
        res.render("error", {status:"404 Not Found", page:"/" })
        console.error("Error", error.message)
    }
}

module.exports = PosterDeckPreviews