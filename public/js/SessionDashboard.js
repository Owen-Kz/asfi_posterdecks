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
            
      posterDeckMain.innerHTML += `     <li class="presentation-item px-6 py-5">
                    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                        <div class="mb-3 sm:mb-0">
                            <h3 class="text-lg font-medium text-gray-900">${posterDeckTitle}</h3>
                            <p class="text-sm text-gray-500 mt-1">Presenter: <span id="posterEmail">${posterDeckOwner}</span></p>
                        </div>
                        <div class="flex space-x-2">
                            <button class="action-btn px-3 py-1.5 text-xs font-medium rounded border border-gray-300 text-gray-700 bg-white hover:bg-gray-50" onclick="window.location.href='/event/poster/${posterDeckLink}'">
                                PREVIEW
                            </button>
                            <form action="/delete/${posterDeckLink}" method="POST">
                            <button type="submit" class="action-btn px-3 py-1.5 text-xs font-medium rounded border border-gray-300 text-gray-700 bg-white hover:bg-gray-50">
                                DELETE AND RE-UNLOAD
                            </button>
                            </form>
                            <button class="action-btn px-3 py-1.5 text-xs font-medium rounded border border-gray-300 text-gray-700 bg-white hover:bg-gray-50" onclick="window.location.href='/edit/${posterDeckLink}'">
                                EDIT
                            </button>
                        </div>
                    </div>
                </li>`
    
        })
    

     
    }else{
        posterDeckMain.innerHTML = `<div class='empty'> No poster Decks available </div>`
    }
    
})