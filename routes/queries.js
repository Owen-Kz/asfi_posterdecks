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
async function AlterTable(){
    const query = `ALTER TABLE posterdecks
    ADD COLUMN presenter_image VARCHAR(200) DEFAULT 'default_image.jpg',
    ADD COLUMN likes_count VARCHAR(20) DEFAULT 0,
    ADD COLUMN views_count VARCHAR(20) DEFAULT 0,
    ADD COLUMN dislike_count VARCHAR(20) DEFAULT 0;
    ;`
    return executeQuery(query);
}

// AlterTable()
async function DeleteSecrets() {
    const query = `DELETE FROM poster_decks_secret_container`
    return executeQuery(query)
}
async function DeleteInvalidDecks(){
    const query = `DELETE FROM posterdecks WHERE poster_deck_title = 'jjjjjj' OR poster_deck_title = 'Abstract Poster Upload 3'`
    return executeQuery(query)
}

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
    const query = `SELECT * FROM poster_decks_secret_container WHERE poster_deck_id = '${secret}' AND use_count = '0'`
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
};
