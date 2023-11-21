const { executeQuery } = require('./dbQueries');
// const secretKeys = require('./secretKeys');

async function CreateTableForPosterDecks() {
    const query = `CREATE TABLE poster_decks_secret_container (
        id SERIAL PRIMARY KEY,
        poster_deck_id TEXT NOT NULL,
        use_count VARCHAR(100) NOT NULL DEFAULT '0'
      )`;
    return executeQuery(query);
}

async function CreatePollsTable() {
    const query = `CREATE TABLE polls (
        id SERIAL PRIMARY KEY,
        buffer TEXT NOT NULL,
        question VARCHAR(300),
        meeting_id TEXT NOT NULL
      )`;
    return executeQuery(query);
}

async function CreateTableForPollOptions() {
    const query = `CREATE TABLE polls_question (
        id SERIAL PRIMARY KEY,
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
// UpdatePolls()

async function SelectVoteCount(optionID){
    const query = `SELECT number_of_votes FROM polls_question WHERE question_id = '${optionID}'`
    return executeQuery(query)
}

async function VotePoll(optionID){
    const VoteCount  = await SelectVoteCount(optionID)
    const NewCount = Math.floor(new Number(VoteCount[0].number_of_votes) + 1)
        const query = `UPDATE polls_question SET number_of_votes = '${NewCount}' WHERE question_id = '${optionID}'`
        return executeQuery(query)
}
async function ResetPolls(){
    const query = "UPDATE polls_question SET number_of_votes = '0' WHERE number_of_votes = 'NaN'"
    return executeQuery(query)
}

// ResetPolls()

async function DEleteTAbelPolls_question(){
    const query = `DROP TABLE polls_question`
    return executeQuery(query)
}

// CREATE A POLL QUESTION 
async function CreateQuestion(buffer, question, meetingID){
    const query = `INSERT INTO polls (
        buffer,
        question,
        meeting_id
    ) VALUES(
        '${buffer}',
        '${question}',
        '${meetingID}'
    )`
    return executeQuery(query)
}

// Create Poll Options  
async function CreateOptions(buffer, option, OptionId){
    // await CreateQuestion(buffer, question, meetingId)
    // console.log(buffer, option, OptionId)
    const query = `INSERT INTO polls_question (
        number_of_votes,
        options,
        poll_id,
        question_id
    ) VALUES (
        '0',
        '${option}',
        '${buffer}',
        '${OptionId}'
    )`
    return executeQuery(query)
}
// CreatePollsTable()
// CreateTableForPollOptions()
// UpdatePolls()

// FIND A QUESTION FRO THE MEETING 
async function FindQuestion(meetingId){
   const query = `SELECT * FROM polls WHERE meeting_id = '${meetingId}'`
   return executeQuery(query) 
}

// FIND RELATEED question 
async function FindOption(questionId){
    const query = `SELECT * FROM polls_question WHERE poll_id = '${questionId}'`
    return executeQuery(query)
}

async function AlterTable(){
    const query = `ALTER TABLE posterdecks
    ADD COLUMN presenter_image VARCHAR(200) DEFAULT 'default_image.jpg',
    ADD COLUMN likes_count VARCHAR(20) DEFAULT 0,
    ADD COLUMN views_count VARCHAR(20) DEFAULT 0,
    ADD COLUMN dislike_count VARCHAR(20) DEFAULT 0;
    ;`
    return executeQuery(query);
}
async function CreateDownloadCount(){
    const query = `ALTER TABLE posterdecks
    ADD COLUMN downloads_count VARCHAR(20) DEFAULT 0;`
    return executeQuery(query);
}

// AlterTable()
// CreateDownloadCount()


async function DeleteSecrets() {
    const query = `DELETE FROM poster_decks_secret_container`
    return executeQuery(query)
}
async function DeleteInvalidDecks(){
    const query = `DELETE FROM posterdecks WHERE poster_deck_id = 'vtpWrtxBuaPDmmqd'`
    return executeQuery(query)
}

async function DeleteInvalidChannels(){
    const query = `DELETE FROM channels WHERE channel_secret = '797c248c13224924953cbfd3b5ffcb0c'`
    return executeQuery(query)
}

// DeleteInvalidChannels()
// DeleteInvalidDecks()
// DeleteSecrets()

async function CreateSerials(data_secret){

    const query = `INSERT INTO poster_decks_secret_container (
        poster_deck_id
    )VALUES(
        '${data_secret}'
    )`
    return executeQuery(query)
}

// Validate Poster Id number
async function ValidateSecretKey(secret){
    // console.log(secret)
    const query = `SELECT * FROM poster_decks_secret_container WHERE poster_deck_id = '${secret}'`
    return executeQuery(query)
}

async function updateKeyCount(DeckId){
    
    const query = `UPDATE poster_decks_secret_container SET use_count = '1' WHERE poster_deck_id = '${DeckId}'`
    return executeQuery(query)
}

// async function insertSecrets() {
//     for (const secretKey of secretKeys) {
//       try {
//         await CreateSerials(secretKey);
//         console.log(`Inserted secret: ${secretKey}`);
//       } catch (error) {
//         console.error(`Failed to insert secret ${secretKey}: ${error.message}`);
//       }
//     }
//   }
  
//   insertSecrets()
//     .then(() => console.log('All secrets inserted successfully'))
//     .catch((error) => console.error('Failed to insert all secrets:', error));
  


  
function getRandomString() {
    var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    var passwordLength = 15;
    var bufferID = "";
    for (var i = 0; i <= passwordLength; i++) {
        var randomNumber = Math.floor(Math.random() * chars.length);
        bufferID += chars.substring(randomNumber, randomNumber + 1);
    }
    return bufferID
}
async function InsertIntoPosterDecks(req, res, newFileName, ImageFile){
   console.log(ImageFile)
    const {posterSecretId, eventTitle, deckTitle, PresenterPrefix, presenterName, presenterEmail} = req.body
    
const FullPresenterName = `${PresenterPrefix}. ${presenterName}`

const ValidateSecreeResult = await ValidateSecretKey(posterSecretId)
  await updateKeyCount(posterSecretId)
    .then(() =>{
        if(ValidateSecreeResult[0]){ 
  const DeckId = getRandomString()
        
       CreateNewDeck(posterSecretId, eventTitle, deckTitle, FullPresenterName, presenterEmail, newFileName, ImageFile, DeckId)
        res.render("success", {status:"Poster Uploaded Successfully", page:`/event/poster/${DeckId}`})
}else{
    // console.log("Error")
    res.render("error", {status:"Poster ID  already used or is invalid", page:"/uploadPoster"})
}
})
}

async function CreateNewDeck(posterSecretId, eventTitle, deckTitle, presenterName, presenterEmail, newFileName, ImageFile, DeckId){
   console.log(ImageFile)

    function escapeSpecialCharacters(input) {
        return input.replace(/'/g, "''").replace(/\0/g, '\\0').replace(/\\/g, '\\\\');
      }
    const sanitizedPresenterName = escapeSpecialCharacters(presenterName);
    // const sanitizedDescription = escapeSpecialCharacters(shortDescription)
    const sanitizedDeckTitle = escapeSpecialCharacters(deckTitle)
    const query = `INSERT INTO posterdecks (
        poster_deck_title,
        poster_deck_descritiption,
        poster_deck_id,
        poster_deck_image,
        poster_deck_link,
        poster_deck_owner,
        presenter_image,
        poster_deck_meeting,
        presenter_email
    ) VALUES (
        '${sanitizedDeckTitle}',
        'description_for_${DeckId}',
        '${DeckId}',
        '${newFileName}',
        'https://asfiposterdecks.com/${DeckId}',
        '${sanitizedPresenterName}',
        '${ImageFile}',
        '${eventTitle}',
        '${presenterEmail}'
    );`;
    return executeQuery(query)
}

async function RetrievePosterDecksTable(req,res, meetingId){
    const meetingIdMain = req.params.meetingId
    const query = `SELECT * FROM posterdecks WHERE poster_deck_meeting = '${meetingIdMain}'`
    return executeQuery(query)
}

// validate Poster id number 
async function validateIdNumber(req,res, key){
    const ValidateSecreeResult = await ValidateSecretKey(key)
    if(ValidateSecreeResult[0]){ 
    res.json({status:"valid", message:"Valid Poster Id provided"})

    }else{
    res.json({status:"error", message:"Poster Id has already been used or is Invalid"})
    }
}


async function RetrievePosterDecksTableForAdmin(req,res){
    const query = `SELECT * FROM posterdecks`
    return executeQuery(query)
}

async function PreviewDeck(req,res){
    const posterDeckLink = req.params.posterDeckLink
    const query = `SELECT * FROM posterdecks WHERE poster_deck_id = '${posterDeckLink}'`
    return executeQuery(query)
}

async function getAllFromTable() {
  const query = `SELECT * FROM channels`;
  return executeQuery(query);
}

// get Total Dislikes
async function TotalDisLikes(req,res,posterId, currentCount){
    const AddedCount = Math.floor(new Number(currentCount)-1)
    const query = `SELECT dislike_count FROM posterdecks WHERE poster_deck_id = '${posterId}'`
    return executeQuery(query)
}
// reduce dislikes
async function ReduceDisLikes(req,res,posterId, currentCount){
    const TOtalDisLikes = await TotalDisLikes(req,res,posterId, currentCount)
    const AddedCount = Math.floor(new Number(TOtalDisLikes[0].dislike_count)-1)
    console.log(TOtalDisLikes)
    const query = `UPDATE posterdecks SET dislike_count = '${AddedCount}' WHERE poster_deck_id = '${posterId}'`
    return executeQuery(query)
}


// Like a poster 
async function LikePoster(req,res,posterId, currentCount){
    let LikeCounter 
    if(currentCount == "NaN"){
        LikeCounter = 0
    }else{
        LikeCounter = currentCount
    }
    await ReduceDisLikes(req,res, posterId, currentCount)
    const AddedCount = Math.floor(new Number(LikeCounter)+1)
    const query = `UPDATE posterdecks SET likes_count = '${AddedCount}' WHERE poster_deck_id = '${posterId}'`
    return executeQuery(query)
}

// get Total Likes 
async function TotalLikes(req,res,posterId, currentCount){
    const AddedCount = Math.floor(new Number(currentCount)-1)
    const query = `SELECT likes_count FROM posterdecks WHERE poster_deck_id = '${posterId}'`
    return executeQuery(query)
}

// reduce Likes 
async function ReduceLikes(req,res,posterId, currentCount){
    const TOtalLikes = await TotalLikes(req,res,posterId, currentCount)
    const AddedCount = Math.floor(new Number(TOtalLikes[0].likes_count)-1)
    const query = `UPDATE posterdecks SET likes_count = '${AddedCount}' WHERE poster_deck_id = '${posterId}'`
    return executeQuery(query)
}
// Dislike a poster 
async function DisLikePoster(req,res,posterId, currentCount){
    let DislikeCounter 
    if(currentCount == "NaN"){
        DislikeCounter = 0
    }else{
        DislikeCounter = currentCount
    }
    await ReduceLikes(req,res, posterId, currentCount)
    const AddedCount = Math.floor(new Number(DislikeCounter)+1)
    const query = `UPDATE posterdecks SET dislike_count = '${AddedCount}' WHERE poster_deck_id = '${posterId}'`
    return executeQuery(query)
}

// View Poster 
// Dislike a poster 
async function ViewPoster(req,res,posterId, currentCount){
    let DislikeCounter 
    if(currentCount == "NaN"){
        DislikeCounter = 0
    }else{
        DislikeCounter = currentCount
    }
    const AddedCount = Math.floor(new Number(DislikeCounter)+1)

    const query = `UPDATE posterdecks SET views_count = '${AddedCount}' WHERE poster_deck_id = '${posterId}'`
    return executeQuery(query)
}



async function DownloadCount(re,res,posterId,currentCount){
    let DownloadCounter 
    if(currentCount == "NaN"){
        DownloadCounter = 0
    }else{
        DownloadCounter = currentCount
    }
    const AddedCount = Math.floor(new Number(DownloadCounter)+1)

    const query = `UPDATE posterdecks SET downloads_count = '${AddedCount}' WHERE poster_deck_id = '${posterId}'`
    return executeQuery(query)
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
    FindOption
};
