// Variables to store rating information
let ratings = [];  
let hasRated = false; // Flag to track if use  has already rated
const totalRatingsElement = document.getElementById("total-ratings");
const averageRatingElement = document.getElementById("average-rating");
const userAverageRating = document.getElementById("user-average-rating");
const averageStarRatingElement = document.getElementById("average-star-rating");
const main_poster_id = document.getElementById("posterID")
// const posterID = document.getElementById("posterID")

// Function to update average rating in numbers and stars
async function AllRatings(){
  return fetch(`/getAllRatings?pid=${main_poster_id.value}` )
  .then(res =>res.json())
  .then( data =>{

    // ratings = data || [];
    return data
  })
}
async function CreateAllFunctions(){
 ratings = await AllRatings()

}


await CreateAllFunctions()

updateAverageRating();

// Fetch ratings from backend
async function fetchTotalRatings() {
  try {
    const response = await fetch(`/getTotalRatings?pid=${main_poster_id.value}`);
    if (!response.ok) {
      throw new Error("Failed to fetch ratings");
    }
    const data = await response.json(); // Assuming the API returns an array of ratings
    const TotalRatingsMain = data[0].totalRatings
   
    return TotalRatingsMain
  } catch (error) {
    console.error("Error fetching ratings:", error);
  }
}


async function updateAverageRating() {
  const totalRatings = ratings.length; 
  const sumOfRatings = await fetchTotalRatings()
  console.log("SUMRATINGS", sumOfRatings)
  console.log("TOTALRATIGNS", totalRatings)
  const averageRating = totalRatings ? sumOfRatings / totalRatings : 0;

  // Update numeric average rating
  if(averageRatingElement){
    averageRatingElement.innerText = averageRating.toFixed(1);
    totalRatingsElement.innerText = totalRatings;
  }
 
  if(userAverageRating){
  userAverageRating.innerText = averageRating.toFixed(1);
  }

  // Update stars based on average rating
  const fullStars = Math.floor(averageRating);
  const hasHalfStar = averageRating % 1 >= 0.5;



  // Reset all stars
  averageStarRatingElement
    .querySelectorAll(".star")
    .forEach((star) => star.classList.remove("filled", "half"));

  // Fill full stars
  for (let i = 0; i < fullStars; i++) {
    averageStarRatingElement.children[i].classList.add("filled");
  }

  // Add half star if applicable
  if (hasHalfStar && fullStars < 5) {
    averageStarRatingElement.children[fullStars].classList.add("half");
    averageStarRatingElement.children[fullStars].style.backgroundImage =
      "linear-gradient(to right, gold 50%, lightgray 50%)";
  }
}




// Save rating to backend
async function saveRating(rating) {
  try {
    const response = await fetch("/saveRating", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ rating,  posterID:main_poster_id.value }),
    }).then(res => res.json())
    .then(data =>{
      console.log(data.error)
   
     if(data.error && data.error === "User aleady rated this poster"){
      
      alert("Previously Rated")
    }else if(data.error && data.error !== "User aleady rated this poster"){
      alert(data.error);

    }else{
    alert("Rating saved successfully");
    }
  });
  } catch (error) {
    console.log(error)
    alert("Error saving rating:", error);
  }
}

const StarsContainer = document.getElementById("stars_container")
fetch(`/checkRatingExists?pid=${main_poster_id.value}`, {
  
}).then (res =>res.json())
.then(data =>{
  if(data.currentRating > 0){
    
    for (let i = 0; i < data.currentRating; i++) {
      document
        .querySelectorAll(".star-rating .star")
        [i].classList.add("selected");
    }
  }else{
    console.log(data)
  }
})
// Star rating functionality
document.querySelectorAll(".star-rating .star").forEach((star) => {
  star.addEventListener("click", async function () {
    if (!hasRated) {
      const rating = parseInt(this.getAttribute("data-value"));
      ratings.push(rating); // Add the new rating to the list
      await saveRating(rating); // Save rating to backend
     updateAverageRating(); // Recalculate average rating
      hasRated = true; // Set flag to true, preventing further ratings

      // Reset star colors
      document
        .querySelectorAll(".star-rating .star")
        .forEach((s) => s.classList.remove("selected"));

      // Highlight selected stars
      for (let i = 0; i < rating; i++) {
        document
          .querySelectorAll(".star-rating .star")
          [i].classList.add("selected");
      }
    } else {
      alert("You have already rated this item.");
    }
  });
});


