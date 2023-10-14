const { executeQuery } = require('./dbQueries');

async function CreateTableForPosterDecks() {
    const query = `DELETE FROM posterdecks WHERE poster_deck_descritiption = 'afakfjakf'`;
    return executeQuery(query);
}
  
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
  const DeckId = getRandomString()
    const { eventTitle, deckTitle, shortDescription, presenterName, presenterEmail} = req.body
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
    getAllFromTable
};
