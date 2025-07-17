const sendEmail = require('../controllers/sendEmail');
const CreateDeckChatRoom = require('../controllers/createChatRoomForDeck');
const { executeQuery, UploadFiles } = require('./dbQueries');


async function HasLiked(username, posterID, reaction){
    const query = `SELECT * FROM poster_reactions WHERE username = '${username}' AND poster_id = '${posterID}' AND reaction = '${reaction}'`
    return executeQuery(query)
}
async function CreateReaction(username, posterID, reaction){
    const query = `INSERT INTO poster_reactions (username, poster_id, reaction) VALUES ('${username}', '${posterID}', '${reaction}')`
    return executeQuery(query)
}
async function DeleteReaction(username, posterID, reaction){
    const query = `DELETE FROM poster_reactions WHERE username = '${username}' AND poster_id = '${posterID}' AND reaction = '${reaction}'`
    return executeQuery(query)
}

async function CreateTableForPosterDecks() {
    const query = `CREATE TABLE poster_decks_secret_container (
        id INT AUTO_INCREMENT PRIMARY KEY,
        poster_deck_id TEXT NOT NULL,
        use_count VARCHAR(100) NOT NULL DEFAULT '0'
      )`;
    return executeQuery(query);
}
async function TotalViews(posterId){
    const query = `SELECT COUNT(*) AS views_count FROM poster_reactions WHERE poster_id = '${posterId}' AND reaction = 'viewed' `
    return executeQuery(query)
}

async function TotalDownloads(posterId){
    const query = `SELECT COUNT(*) AS views_count FROM poster_reactions WHERE poster_id = '${posterId}' AND reaction = 'downloaded' `
    return executeQuery(query)
}


async function CreateFileStorageTable(){
    const query = `CREATE TABLE files (
        fileid INT AUTO_INCREMENT PRIMARY KEY,
        filename VARCHAR(255) NOT NULL,
        filedata LONGBLOB NOT NULL
      )`;
    return executeQuery(query)
}

async function CreatePollsTable() {
    const query = `CREATE TABLE polls (
        id INT AUTO_INCREMENT PRIMARY KEY,
        buffer TEXT NOT NULL,
        question VARCHAR(300),
        meeting_id TEXT NOT NULL
      )`;
    return executeQuery(query);
}

async function CreateTableForPollOptions() {
    const query = `CREATE TABLE polls_question (
        id INT AUTO_INCREMENT PRIMARY KEY,
        poll_id TEXT NOT NULL,
        options VARCHAR(100),
        number_of_votes VARCHAR(80)
      )`;
    return executeQuery(query);
}

async function UpdatePolls(){
    const query = `DELETE FROM polls_question`
    return executeQuery(query)
}


async function SelectVoteCount(optionID){
    const query = `SELECT number_of_votes FROM polls_question WHERE id = '${optionID}'`
    return executeQuery(query)
}

async function VotePoll(optionID){
    const VoteCount  = await SelectVoteCount(optionID)
    const NewCount = Math.floor(Number(VoteCount[0].number_of_votes) + 1)
    const query = `UPDATE polls_question SET number_of_votes = '${NewCount}' WHERE id = '${optionID}'`
    return executeQuery(query)
}

async function CreateVotersTable(){
    const query = `CREATE TABLE voters (
        id INT AUTO_INCREMENT PRIMARY KEY,
        device_name TEXT NOT NULL,
        poll_id TEXT NOT NULL
    )`
    return executeQuery(query)
}

async function CheckVoted(hostName, poll_id){
    const query = `SELECT * FROM voters WHERE device_name = '${hostName}' AND poll_id = '${poll_id}'`
    return executeQuery(query)
}

async function CreateVoter(hostName, poll_id){
    const query = `INSERT INTO voters (device_name, poll_id) VALUES ('${hostName}', '${poll_id}')`
    return executeQuery(query)
}

async function DELETEVOTER(){
    const query = `DELETE FROM voters`
    return executeQuery(query)
}

async function ResetPolls(){
    const query = `UPDATE polls_question SET number_of_votes = '0'`
    return executeQuery(query)
}

async function DEleteTAbelPolls_question(){
    const query = `DROP TABLE polls_question`
    return executeQuery(query)
}

async function CreateQuestion(buffer, question, meetingID){
    const query = `INSERT INTO polls (buffer, question, meeting_id) VALUES ('${buffer}', '${question}', '${meetingID}')`
    return executeQuery(query)
}

async function CreateOptions(buffer, option, OptionId){
    const query = `INSERT INTO polls_question (number_of_votes, options, poll_id) VALUES ('0', '${option}', '${buffer}')`
    return executeQuery(query)
}

async function FindQuestion(meetingId){
    const query = `SELECT * FROM polls WHERE meeting_id = '${meetingId}'`
    return executeQuery(query)
}

async function FindOption(questionId){
    const query = `SELECT * FROM polls_question WHERE poll_id = '${questionId}'`
    return executeQuery(query)
}

async function AlterTable(){
    const query = `ALTER TABLE posterdecks
    ADD COLUMN presenter_image VARCHAR(200) DEFAULT 'default_image.jpg',
    ADD COLUMN likes_count VARCHAR(20) DEFAULT '0',
    ADD COLUMN views_count VARCHAR(20) DEFAULT '0',
    ADD COLUMN dislike_count VARCHAR(20) DEFAULT '0';`
    return executeQuery(query);
}

async function CreateDownloadCount(){
    const query = `ALTER TABLE posterdecks ADD COLUMN downloads_count VARCHAR(20) DEFAULT '0';`
    return executeQuery(query);
}

async function UpdatePosterDeckTables(){
    const query = `
    ALTER TABLE posterdecks
    MODIFY COLUMN poster_deck_owner VARCHAR(255),
    MODIFY COLUMN poster_deck_title VARCHAR(255),
    MODIFY COLUMN presenter_email VARCHAR(255);`
    return executeQuery(query)
}

async function DeleteSecrets() {
    const query = `DELETE FROM poster_decks_secret_container`
    return executeQuery(query)
}

async function DeleteInvalidDecks(){
    const query = `DELETE FROM posterdecks`
    return executeQuery(query)
}

async function DeleteFiles(){
    const query = `DELETE FROM files`
    return executeQuery(query)
}

async function DeleteInvalidChannels(){
    const query = `DELETE FROM channels WHERE channel_secret = '797c248c13224924953cbfd3b5ffcb0c'`
    return executeQuery(query)
}

async function CreateSerials(data_secret){
    const query = `INSERT INTO poster_decks_secret_container (poster_deck_id) VALUES ('${data_secret}')`
    return executeQuery(query)
}

async function ValidateSecretKey(secret){
    const query = `SELECT * FROM poster_decks_secret_container WHERE poster_deck_id = '${secret}' AND use_count = 0`
    return executeQuery(query)
}

async function updateKeyCount(DeckId){
    const query = `UPDATE poster_decks_secret_container SET use_count = '1' WHERE poster_deck_id = '${DeckId}'`
    return executeQuery(query)
}

function getRandomString() {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    const passwordLength = 15;
    let bufferID = "";
    for (let i = 0; i <= passwordLength; i++) {
        const randomNumber = Math.floor(Math.random() * chars.length);
        bufferID += chars.substring(randomNumber, randomNumber + 1);
    }
    return bufferID;
}

async function InsertIntoPosterDecks(req, res, newFileName, ImageFile){
    const {posterSecretId, eventTitle, deckTitle, PresenterPrefix, presenterName, presenterEmail, presenterAffiliation, presenterCountry} = req.body
    const FullPresenterName = `${PresenterPrefix} ${presenterName}`
    const ValidateSecreeResult = await ValidateSecretKey(posterSecretId)

    await updateKeyCount(posterSecretId).then(() =>{
        if(ValidateSecreeResult[0]){ 
            const DeckId = getRandomString()
            CreateNewDeck(posterSecretId, eventTitle, deckTitle, FullPresenterName, presenterEmail, presenterAffiliation, presenterCountry, newFileName, ImageFile, DeckId)
            res.render("success", {status:"Poster Uploaded Successfully", page:`/event/poster/${DeckId}`})
        } else {
            res.render("error", {status:"Poster ID already used or is invalid", page:"/uploadPoster"})
        }
    })
}

async function CreateNewDeck(posterSecretId, eventTitle, deckTitle, presenterName, presenterEmail, presenterAffiliation, presenterCountry, newFileName, ImageFile, DeckId) {
    const sanitizedPresenterName = presenterName.replace(/'/g, "''").replace(/\\/g, '\\\\');
    const sanitizedDeckTitle = deckTitle.replace(/'/g, "''").replace(/\\/g, '\\\\');

    await sendEmail(presenterEmail, sanitizedPresenterName, eventTitle, sanitizedDeckTitle, DeckId)
    await CreateDeckChatRoom(sanitizedDeckTitle,`A Poster Presented By ${sanitizedPresenterName}`, DeckId)
    // First, ensure the posterdecks table exists
    const createTableQuery = `CREATE TABLE IF NOT EXISTS posterdecks (
        id INT AUTO_INCREMENT PRIMARY KEY,
        poster_deck_title VARCHAR(255) NOT NULL,
        poster_deck_descritiption TEXT NOT NULL,
        poster_deck_id VARCHAR(255) NOT NULL,
        poster_deck_image VARCHAR(255),
        poster_deck_link VARCHAR(255),
        poster_deck_owner VARCHAR(255),
        presenter_image VARCHAR(255),
        poster_deck_meeting VARCHAR(255),
        presenter_email VARCHAR(255)
    )`;
    
    // Execute the table creation query first
    await executeQuery(createTableQuery);

    // Then, insert the new deck data
    const insertQuery = `INSERT INTO posterdecks (
        poster_deck_title,
        poster_deck_descritiption,
        poster_deck_id,
        poster_deck_image,
        poster_deck_link,
        poster_deck_owner,
        presenter_image,
        poster_deck_meeting,
        presenter_email,
        affiliation,
        country
    ) VALUES (
        '${sanitizedDeckTitle}',
        'description_for_${DeckId}',
        '${DeckId}',
        '${newFileName}',
        'https://posters.asfischolar.com/${DeckId}',
        '${sanitizedPresenterName}',
        '${ImageFile}',
        '${eventTitle}',
        '${presenterEmail}',
        '${presenterAffiliation}',
        '${presenterCountry}'
    );`;
    
    // Execute the insert query
    return executeQuery(insertQuery);
}


async function RetrievePosterDecksTable(req, res, meetingId){
    const meetingIdMain = req.params.meetingId
    const query = `SELECT * FROM posterdecks WHERE poster_deck_meeting = '${meetingIdMain}'`
    return executeQuery(query)
}

async function validateIdNumber(req, res, key){
    const ValidateSecreeResult = await ValidateSecretKey(key)
    if (ValidateSecreeResult[0]) {
        res.json({status: "valid", message: "Valid Poster Id provided"})
    } else {
        res.json({status: "error", message: "Poster Id has already been used or is Invalid"})
    }
}

async function RetrievePosterDecksTableForAdmin(req, res, presenterEmail){
    const query = `SELECT * FROM posterdecks WHERE presenter_email = '${presenterEmail}'`
    return executeQuery(query)
}

async function PreviewDeck(req, res){
    const posterDeckLink = req.params.posterDeckLink
  
    const query = `SELECT * FROM posterdecks WHERE poster_deck_id = '${posterDeckLink}'`
    return executeQuery(query)
}

async function getAllFromTable() {
    const query = `SELECT * FROM channels ORDER BY id DESC`;
    return executeQuery(query);
}

async function TotalDisLikes(posterId){
    const query = `SELECT COUNT(*) AS dislike_count FROM poster_reactions WHERE poster_id = '${posterId}' AND reaction = 'disliked'`
    return executeQuery(query)
}

async function ReduceDisLikes(req, res, posterId, currentCount){
    const TOtalDisLikes = await TotalDisLikes(posterId)
    let AddedCount = Number(TOtalDisLikes[0].dislike_count) - 1
    if(AddedCount < 0){
        AddedCount = 0
    }
    const query = `UPDATE posterdecks SET dislike_count = '${AddedCount}' WHERE poster_deck_id = '${posterId}'`
    return executeQuery(query)
}

async function DisLikePoster(req, res, posterId, currentCount){
    const HasLikedPoster = await HasLiked(req.user.username, posterId, "disliked")

    if(HasLikedPoster.length > 0){

        return []
        }else{
            PreviouslyLiked = await HasLiked(req.user.username, posterId, "liked")
            if(PreviouslyLiked.length > 0){
              await DeleteReaction(req.user.username, posterId, "liked")
            }
            CreateReaction(req.user.username, posterId, "disliked")
    const TOtalDisLikes = await TotalDisLikes(posterId)
    const NewCount = Number(TOtalDisLikes[0].dislike_count) + 1
    const query = `UPDATE posterdecks SET dislike_count = '${NewCount}' WHERE poster_deck_id = '${posterId}'`
    return executeQuery(query)
}
}

async function TotalLikes(posterId){
    const query = `SELECT COUNT(*) AS likes_count FROM poster_reactions WHERE poster_id = '${posterId}' AND reaction = 'liked'`
    return executeQuery(query)
}

async function LikePoster(req, res, posterId, currentCount){
    // Chck if the user already liked the poster 
    const HasLikedPoster = await HasLiked(req.user.username, posterId, "liked")

    if(HasLikedPoster.length > 0){
        return []
        }else{
            PreviouslyDisLiked = await HasLiked(req.user.username, posterId, "disliked")
            if(PreviouslyDisLiked.length > 0){
               await DeleteReaction(req.user.username, posterId, "disliked")
            }
            CreateReaction(req.user.username, posterId, "liked")
    const TOtalLikes = await TotalLikes(posterId)
    const NewCount = Number(TOtalLikes[0].likes_count) + 1
    const query = `UPDATE posterdecks SET likes_count = '${NewCount}' WHERE poster_deck_id = '${posterId}'`
    return executeQuery(query)
        }
}

async function ViewPoster(req, res, posterId){
    const HasLikedPoster = await HasLiked(req.user.username, posterId, "viewed")

    if(HasLikedPoster.length > 0){

        return []
        }else{
            CreateReaction(req.user.username, posterId, "viewed")
    const totalViews = await TotalViews(posterId)
    const NewCount = Number(totalViews[0].views_count) + 1
    const updateQuery = `UPDATE posterdecks SET views_count = '${NewCount}' WHERE poster_deck_id = '${posterId}'`
    return executeQuery(updateQuery)
        }
}

async function DownloadCount(req, res, posterId){
    const HasLikedPoster = await HasLiked(req.user.username, posterId, "downloaded")

    if(HasLikedPoster.length > 0){

        return []
        }else{
            CreateReaction(req.user.username, posterId, "downloaded")
  
    const TotalDownloads = await TotalDownloads(posterId)
    const NewCount = Number(TotalDownloads[0].downloads_count) + 1
    const updateQuery = `UPDATE posterdecks SET downloads_count = '${NewCount}' WHERE poster_deck_id = '${posterId}'`
    return executeQuery(updateQuery)
        }
}

async function SelectMeetings(){
    const query = `SELECT * FROM meetings`
    return executeQuery(query)
}

async function TotalMeetingsCount(){
    const query = `SELECT COUNT(*) FROM meetings`
    return executeQuery(query)
}

async function DeleteChannel(channel_id){
    const query = `DELETE FROM channels WHERE id = '${channel_id}'`
    return executeQuery(query)
}

async function SelectPosters(){
    const query = `SELECT * FROM posterdecks`
    return executeQuery(query)
}

async function TotalPostersCount(){
    const query = `SELECT COUNT(*) FROM posterdecks`
    return executeQuery(query)
}

async function DeletePoster(poster_id, presenterEMail){
    const query = `DELETE FROM posterdecks WHERE poster_deck_id = '${poster_id}' AND presenter_email = '${presenterEMail}'`
    return executeQuery(query)
}

async function GetMeetingName(meeting_id){
    const query = `SELECT * FROM meetings WHERE meeting_id = '${meeting_id}'`
    return executeQuery(query)
}


// Edit Poster Deck 
async function EditPosterDeck(eventTitle, deckTitle, presenterName, presenterEmail, presenterAffiliation, presenterCountry, newFileName, ImageFile, DeckId) {
    const sanitizedPresenterName = presenterName.replace(/'/g, "''").replace(/\\/g, '\\\\');
    const sanitizedDeckTitle = deckTitle.replace(/'/g, "''").replace(/\\/g, '\\\\');


console.log("EDIT DATA", eventTitle, deckTitle, presenterName, presenterEmail, presenterAffiliation, presenterCountry, newFileName, ImageFile, DeckId)
    // Then, insert the new deck data
    const insertQuery = `UPDATE posterdecks SET 
        poster_deck_title = '${sanitizedDeckTitle}',
        poster_deck_descritiption = 'description_for_${DeckId}',
        poster_deck_image = '${newFileName}',
        poster_deck_link = 'https://posters.asfischolar.com/${DeckId}',
        poster_deck_owner = '${sanitizedPresenterName}',
        presenter_image = '${ImageFile}',
        poster_deck_meeting = '${eventTitle}',
        presenter_email = '${presenterEmail}',
        affiliation = '${presenterAffiliation}',
        country = '${presenterCountry}' WHERE poster_deck_id = '${DeckId}';`;
    
    // Execute the insert query
    return executeQuery(insertQuery);
}

async function UpdatePosterDecks(req, res, newFileName, ImageFile){
    const {posterSecretId, eventTitle, deckTitle, PresenterPrefix, presenterName, presenterEmail, presenterAffiliation, presenterCountry} = req.body
    const FullPresenterName = `${PresenterPrefix} ${presenterName}`

    EditPosterDeck(eventTitle, deckTitle, FullPresenterName, presenterEmail, presenterAffiliation, presenterCountry, newFileName, ImageFile, posterSecretId)
}
async function CheckIfRatingExists(username, posterID){
    const Query = `SELECT * FROM ratings WHERE posterId = '${posterID}' AND username = '${username}'`
    return executeQuery(Query)
}

async function GetTotalRatings(posterID){
    try{
    const Query = `SELECT SUM(rating) AS totalRatings FROM ratings WHERE posterId  = '${posterID}'`
    return executeQuery(Query)
    }catch(error){
        return {error:error}
    }
}
async function GetAllRatings(posterID){
    try{
    const Query = `SELECT rating FROM ratings WHERE posterId  = '${posterID}'`
    return executeQuery(Query)
    
    }catch(error){
        console.log(error)
        return {error:error}
    }
}
async function SaveRating(rating, username, posterId){
    const RatingExists = await CheckIfRatingExists(username, posterId)

    if(RatingExists.length > 0){
        console.log("Rating Exists")
        return {error:"User aleady rated this poster", currentRating:RatingExists[0].rating}
    }else{
    const Query = `INSERT INTO ratings (rating, posterId, username) VALUES ('${rating}', '${posterId}', '${username}')`
    return executeQuery(Query)
    }
}

module.exports = {
    CreateTableForPosterDecks,
    InsertIntoPosterDecks,
    PreviewDeck,
    RetrievePosterDecksTable,
    getAllFromTable,
    ValidateSecretKey,
    updateKeyCount,
    RetrievePosterDecksTableForAdmin,
    validateIdNumber,
    LikePoster,
    DisLikePoster,
    ViewPoster,
    DownloadCount,
    VotePoll,
    CreateOptions,
    CreateQuestion,
    FindQuestion,
    FindOption,
    CheckVoted,
    CreateVoter,
    SelectMeetings,
    TotalMeetingsCount,
    DeleteChannel,
    SelectPosters,
    TotalPostersCount,
    DeletePoster,
    GetMeetingName,
    CreateSerials,
    UpdatePosterDecks,
    SaveRating,
    GetTotalRatings,
    TotalLikes,
    TotalDisLikes,
    TotalViews,
    TotalDownloads,
    GetAllRatings,
    CheckIfRatingExists
};
