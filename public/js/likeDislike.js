const DisLikeButton = document.getElementById("DisLikeButton")
const LikeButton = document.getElementById("LikeButton")


const dislike_count_container = document.getElementById("dislike_count_container")
const like_count_container = document.getElementById("like_count_container")
const view_count_container = document.getElementById("view_count_container")

const hoursToKeep = 1;  // Desired duration in hours
const daysToKeep = hoursToKeep / 24;  // Convert hours to days
const expirationDays = daysToKeep > 0 ? daysToKeep : 1;  // Ensure a minimum of 1 day
const posterID = document.getElementById("posterID")


function setCookie(name, value, daysToExpire) {
    const date = new Date();
    date.setTime(date.getTime() + (daysToExpire * 24 * 60 * 60 * 1000));
    const expires = 'expires=' + date.toUTCString();
    document.cookie = name + '=' + value + '; ' + expires + '; path=/';
}

function getCookie(cookieName) {
    const name = cookieName + "=";
    const decodedCookie = decodeURIComponent(document.cookie);
    const cookieArray = decodedCookie.split(';');
    for (let i = 0; i < cookieArray.length; i++) {
        let cookie = cookieArray[i];
        while (cookie.charAt(0) == ' ') {
            cookie = cookie.substring(1);
        }
        if (cookie.indexOf(name) == 0) {
            return cookie.substring(name.length, cookie.length);
        }
    }
    return null; // Cookie not found
}


const LikedTrue =  getCookie(`${posterID.value}-liked`);
const DislikeTrue = getCookie(`${posterID.value}-disliked`);
const PageViewed = getCookie(`${posterID.value}`)
const Downloaded = getCookie(`${posterID.value}-download`)

const currentLikesCount = like_count_container.value
const currentDislikeCount = dislike_count_container.value


function deleteCookie(cookieName) {
    document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    window.location.reload()
}

let ClickCount = 0
LikeButton.addEventListener("click", function(){
    if(LikedTrue){
        console.log("Poster Already Liked")
    }else{
        if(ClickCount == 0){
    fetch(`/likeposter/${posterID.value}/${currentLikesCount}`, ()=>{
        method:"GET"
    }).then(res => res.json())
    .then(data =>{
        if(data.message === "liked"){
    setCookie(`${posterID.value}-liked`, "User Liked", hoursToKeep)
    ClickCount++

    if(ClickCount == 1){
    like_count_container.innerHTML = `<span>${Math.floor(new Number(like_count_container.value) + 1)}</span>`
    like_count_container.value = Math.floor(new Number(like_count_container.value) + 1)
    dislike_count_container.innerHTML = `<span>${Math.floor(new Number(dislike_count_container.value) - 1)}</span>`
    dislike_count_container.value = Math.floor(new Number(dislike_count_container.value) - 1)
    deleteCookie(`${posterID.value}-disliked`);

    }
        }
    })
}
}
})

DisLikeButton.addEventListener("click", function(){
    if(DislikeTrue){
        console.log("Poster Already Disliked")
    }else{
        if(ClickCount == 0){
    fetch(`/dislikeposter/${posterID.value}/${currentDislikeCount}`, ()=>{
        method:"GET"
    }).then(res => res.json())
    .then(data =>{
        if(data.message === "disliked"){
    setCookie(`${posterID.value}-disliked`, `${posterID.value}`, hoursToKeep)
    ClickCount++
    if(ClickCount == 1){
    dislike_count_container.innerHTML = `<span>${Math.floor(new Number(dislike_count_container.value) + 1)}</span>`
    dislike_count_container.value = Math.floor(new Number(dislike_count_container.value) + 1)
    like_count_container.innerHTML = `<span>${Math.floor(new Number(like_count_container.value)- 1)}</span>`
    like_count_container.value = Math.floor(new Number(like_count_container.value) - 1)
    deleteCookie(`${posterID.value}-liked`);

    }
        }
    })
}
}
})




// VIew the Postetr Page and increase view count 

if(!PageViewed){
function ViewPoster(){
    fetch(`/viewposter/${posterID.value}/${view_count_container.value}`, ()=>{
        method:"GET"
    }).then(res => res.json())
    .then(data =>{
        if(data.message === "viewed"){
    setCookie(`${posterID.value}`, `${posterID.value}-viewed`, hoursToKeep)
    view_count_container.value = Math.floor(new Number(view_count_container.value)+1)
    view_count_container.innerHTML = `<span>${new Number(view_count_container.value)}</span>`
        }
    })
}

ViewPoster()
}


// Download Poster 
const downloadPoster = document.getElementById("downloadPoster")
const download_count_container = document.getElementById("download_count_container")
const CurrentDownloadCount = download_count_container.value

if(!Downloaded){
function DownloadCount(){
downloadPoster.addEventListener("click", function(){
    fetch(`/downloadpostercount/${posterID.value}/${CurrentDownloadCount}`, ()=>{
        method: "GET"
    }).then(res => res.json())
    .then(data =>{
        if(data.message === "downloaded"){
            setCookie(`${posterID.value}-download`, `${posterID.value}-downloaded`, hoursToKeep)
            download_count_container.value = Math.floor(new Number(CurrentDownloadCount)+1)
            download_count_container.innerHTML = `<span>${Math.floor(new Number(CurrentDownloadCount)+1)}</span>`
        }
    })
})
}

DownloadCount()
}