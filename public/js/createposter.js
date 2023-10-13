// const createPosterDeckForm = document.getElementById('createPosterDeckForm')
// function getRandomString() {
//     var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
//     var passwordLength = 24;
//     var bufferID = "";
//     for (var i = 0; i <= passwordLength; i++) {
//         var randomNumber = Math.floor(Math.random() * chars.length);
//         bufferID += chars.substring(randomNumber, randomNumber + 1);
//     }
//     return bufferID
//   }

// createPosterDeckForm.addEventListener("submit", (e)=>{
//     e.preventDefault()
//     const formContent = {
//         DeckTitle:deckTitle.value,
//         DeckId:getRandomString(),
//         DeckMeeting:eventTitle.value,
//         DeckFile:PosterPDF.files[0],
//         DeckDescription:shortDescription.value,
//         DeckOwner:presenterName.value,
//         PresenterEmail:presenterEmail.value
//     }
//     console.log(formContent)
//     fetch("/createdeck", {
//         method: "POST",
//         body: JSON.stringify(formContent),
//         headers:{
//             "Content-type" : "application/JSON",
//             "Accept": "application/json",
//         }
//     }).then(res => res.json())
//     .then(data =>{
//         alert(data.message)
//     })
// })