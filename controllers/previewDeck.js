const { PreviewDeck, TotalLikes, TotalDisLikes, TotalDownloads, TotalViews } = require("../routes/queries")
const ProfileDetails = require("./getProfileDetails")


async function PosterDeckPreviews(req, res) {
    try {
        if (req.user) {
            const DeckView = await PreviewDeck(req, res)
            const TotalLikesCount = await TotalLikes(DeckView[0].poster_deck_id)
            const likes_count = TotalLikesCount[0].likes_count
            const TotalDislikesCount = await TotalDisLikes(DeckView[0].poster_deck_id)
            const DislikesCount = TotalDislikesCount[0].dislike_count

            const TotalDownloadsCount = await TotalDownloads(DeckView[0].poster_deck_id)
            const TotalViewsCount = await TotalViews(DeckView[0].poster_deck_id)

            const PosterTitle = DeckView[0].poster_deck_title
            const Description = DeckView[0].poster_deck_descritiption
            const Presenter = DeckView[0].poster_deck_owner
            const PosterFile = DeckView[0].poster_deck_image
            const PosterId = DeckView[0].poster_deck_id
            const PresenterEmail = DeckView[0].presenter_email
            const PresenterImage = DeckView[0].presenter_image
            const ViewsCount = TotalViewsCount[0].views_count
            const DownloadsCount = TotalDownloadsCount[0].downloads_count
            const PosterMeeting = DeckView[0].poster_deck_meeting
            let affiliation = ""
            let country = ""
            if (DeckView[0].affiliation !== null) {
                affiliation = `${DeckView[0].affiliation}, `
            }

            if (DeckView[0].country !== null) {
                country = DeckView[0].country;
            }


            let Picture = ""

            const GetPresenterDetails = await ProfileDetails(PresenterEmail)

            if (!GetPresenterDetails.error) {
                if (GetPresenterDetails.userDetails.profile_picture === "avatar.jpg") {
                    Picture = "https://res.cloudinary.com/dll8awuig/image/upload/v1705444097/dc69h8mggh01bvlvbowh.jpg"
                } else if (!GetPresenterDetails.userDetails.profile_picture) {
                    Picture = "https://res.cloudinary.com/dll8awuig/image/upload/v1705444097/dc69h8mggh01bvlvbowh.jpg"
                } else {
                    Picture = GetPresenterDetails.userDetails.profile_picture
                }
            } else {
                Picture = "https://res.cloudinary.com/dll8awuig/image/upload/v1705444097/dc69h8mggh01bvlvbowh.jpg"
            }

            let isOwner = false
            if (PresenterEmail === req.user.email) {
                isOwner = true
            }
            const is_link = DeckView[0].is_link || 0; // Get the is_link flag
 const posterFile = is_link ? DeckView[0].file_link : DeckView[0].poster_deck_image;
            
            res.render("previewPoster", {
                PosterTitle: PosterTitle,
                Description: Description,
                Presenter: Presenter,
                PosterFile: posterFile, // This now contains either the filename or Cloudinary URL
                PosterId: PosterId,
                PresenterEmail: PresenterEmail,
                PresenterImage: Picture,
                DislikesCount: DislikesCount,
                ViewsCount: ViewsCount,
                likes_count: likes_count,
                DownloadsCount: DownloadsCount,
                meeting: PosterMeeting,
                affiliation: affiliation,
                country: country,
                isOwner: isOwner,
                is_link: is_link
            })
        } else {
            res.render("loginExternal")
        }

        // res.json({PosterDecks:JSON.stringify(DeckView)})
    } catch (error) {
        res.render("error", { status: error.message, page: "/" })
        console.error("Error", error)
    }
}

module.exports = PosterDeckPreviews