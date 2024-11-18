// Variables to store rating information
let ratings = [];
let hasRated = false; // Flag to track if user has already rated
const totalRatingsElement = document.getElementById("total-ratings");
const averageRatingElement = document.getElementById("average-rating");
const userAverageRating = document.getElementById("user-average-rating");
const averageStarRatingElement = document.getElementById("average-star-rating");

// Function to update average rating in numbers and stars
function updateAverageRating() {
  const totalRatings = ratings.length;
  const sumOfRatings = ratings.reduce((a, b) => a + b, 0);
  const averageRating = totalRatings ? sumOfRatings / totalRatings : 0;

  // Update numeric average rating
    averageRatingElement.innerText = averageRating.toFixed(1);
    userAverageRating.innerText = averageRating.toFixed(1);
  totalRatingsElement.innerText = totalRatings;

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

// Star rating functionality
document.querySelectorAll(".star-rating .star").forEach((star) => {
  star.addEventListener("click", function () {
    if (!hasRated) {
      // Check if user has already rated
      const rating = parseInt(this.getAttribute("data-value"));
      ratings.push(rating); // Add the new rating to the list
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
      alert("You have already rated this item."); // Optional: Alert user if they try to rate again
    }
  });
});


// POST REQUEST : /saveRating 
// req.body {rating, username, posterID }

// GEt REQUEST : /getTotalRatings/?pid=posterID
// REPLACE psoterID With the current PosterId