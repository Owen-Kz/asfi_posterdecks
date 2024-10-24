const posterDeckMain = document.getElementById("posterDeckMain")

fetch(`/posteradmin`, ()=>{
    method: "GET"
}).then(res => res.json())
.then(data =>{
    const allPosterDecks = JSON.parse(data.PosterDecks)
    if(allPosterDecks.length >0){
        allPosterDecks.forEach(posterDeck =>{
            const posterDeckTitle = posterDeck.poster_deck_title
            const posterDeckLink = posterDeck.poster_deck_id
            const posterDeckOwner = posterDeck.poster_deck_owner 
            const posterDeckDescription = posterDeck.poster_deck_descritiption
            const posterDeckImage = posterDeck.poster_deck_image
            // let posterMainFile
            const posterMainFile = `/uploads/posters/${posterDeckImage}`
            
            posterDeckMain.innerHTML += `	<li style="display: flex; justify-content: space-between;">
            <div>
                <h5>${posterDeckTitle}</h5>
    
                <p class="p-name" id="posterName">Presenter name: <span id="posterEmail">${posterDeckOwner}</span></p>
            </div>
        <div style="display: flex;">
       
            <div class="tester-side">
                <h4 class="text-2xl flex font-bold leading-7 text-gray-900 sm:text-3xl sm:leading-9 sm:truncate">
                  <a href="/event/poster/${posterDeckLink}">Preview</a>

                  <form action="/delete/${posterDeckLink}" method="POST">
                  
                     <button type="submit">Delete and Re-upload
                     </button>
                  
                  </form>

                    <a href="edit/poster/${posterDeckLink}">Edit</a>

                </h4>
            </div>
        </div>
    </li>`;
    
        })
    

     
    }else{
        posterDeckMain.innerHTML = `<div class='empty'> No poster Decks available </div>`
    }
    
})