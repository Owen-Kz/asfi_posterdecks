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
async function ValidateSecretKey(secret){
    console.log(secret)
    const query = `SELECT * FROM poster_decks_secret_container WHERE poster_deck_id = '${secret}' AND use_count = '0'`
    return executeQuery(query)
}

async function updateKeyCount(DeckId){
    console.log(DeckId)
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
async function InsertIntoPosterDecks(req, res, newFileName){
//    console.log(newFileName)
    const {posterSecretId, eventTitle, deckTitle, shortDescription,PresenterPrefix, presenterName, presenterEmail} = req.body
    
const FullPresenterName = `${PresenterPrefix}. ${presenterName}`

const ValidateSecreeResult = await ValidateSecretKey(posterSecretId)
  await updateKeyCount(posterSecretId)
    .then(() =>{
        if(ValidateSecreeResult[0]){  
  const DeckId = getRandomString()
        
       CreateNewDeck(posterSecretId, eventTitle, deckTitle, shortDescription, FullPresenterName, presenterEmail, newFileName, DeckId)
        res.render("success", {status:"Poster Uploaded Successfully", page:`/event/poster/${DeckId}`})
}else{
    // console.log("Error")
    res.render("error", {status:"Poster ID  already used or is invalid", page:"/uploadPoster"})
}
})
}

async function CreateNewDeck(posterSecretId, eventTitle, deckTitle, shortDescription, presenterName, presenterEmail, newFileName, DeckId){
    function escapeSpecialCharacters(input) {
        return input.replace(/'/g, "''").replace(/\0/g, '\\0').replace(/\\/g, '\\\\');
      }
    const sanitizedPresenterName = escapeSpecialCharacters(presenterName);
    const sanitizedDescription = escapeSpecialCharacters(shortDescription)
    const sanitizedDeckTitle = escapeSpecialCharacters(deckTitle)
    const query = `INSERT INTO posterdecks (
        poster_deck_title,
        poster_deck_descritiption,
        poster_deck_id,
        poster_deck_image,
        poster_deck_link,
        poster_deck_owner,
        poster_deck_meeting,
        presenter_email
    ) VALUES (
        '${sanitizedDeckTitle}',
        '${sanitizedDescription}',
        '${DeckId}',
        '${newFileName}',
        'https://asfiposterdecks.com/${DeckId}',
        '${sanitizedPresenterName}',
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

async function PreviewDeck(req,res){
    const posterDeckLink = req.params.posterDeckLink
    const query = `SELECT * FROM posterdecks WHERE poster_deck_id = '${posterDeckLink}'`
    return executeQuery(query)
}

async function getAllFromTable() {
  const query = 'SELECT * FROM channels';
  return executeQuery(query);
}







module.exports = {
    CreateTableForPosterDecks,
    InsertIntoPosterDecks,
    PreviewDeck,
    RetrievePosterDecksTable,
    getAllFromTable,
    ValidateSecretKey,
    updateKeyCount
};
