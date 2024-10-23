function getCookie(name) {
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();
        if (cookie.startsWith(name + '=')) {
            return cookie.substring(name.length + 1);
        }
    }
    return '';
}

const meetingID = document.getElementById("meetingID")
// Usage
 // Access the encryption secret value
// const cookieValue = getCookie('meetingId');
const cookieValue = meetingID.value;

const posterDeckMain = document.getElementById('posterDeckListContainer')
const posterDeckContainers = []
const posterDeckFiles = []
// console.log(cookieValue)
if(cookieValue){
    
fetch(`/getposterdecks/${cookieValue}`, ()=>{
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
            const posterMainFile = `${posterDeckImage}`
            
            posterDeckMain.innerHTML += `<a href="/event/poster/${posterDeckLink}" target="_blank">
			<div class="posterContainer">
				<div class="posterImg" style='overflow:hidden; display:flex; '>
            
                    <div id="${posterDeckLink}" style="margin: auto; width:100%; display:flex;flex-direction:column; align-items:center;"></div>
                
				</div>
				<div class="posterInfo">
					<div class='posterTitle'>${posterDeckTitle}</div>
				
					<div class='small'><small>${posterDeckOwner}</small></div>

				</div>
			</div>
		</a>`;
        posterDeckFiles.push(posterMainFile)
        posterDeckContainers.push(posterDeckLink)
        })
        
        // posterDeckMain.innerHTML += `
        // <div class="posterAction">
        // <a href="/uploadPoster" target=_blank><button>Upload Your Posters</button></a>
        // </div>`
        pdfRenderer(posterDeckFiles,posterDeckContainers);
    }else{
        posterDeckMain.innerHTML = `<div class='empty'> 
        <div>No posters available</div> `
       
    }
    
})
}else{
    posterDeckMain.innerHTML = `<div class='empty'> Unathorized Access </div>`
}