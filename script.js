const apiKey = '5b3b774b'; // Your OMDb API key
let currentPage = 1;

// Fetch featured movies
async function fetchFeaturedMovies() {
  const latestYear = "2025"; // Change as needed
  const response = await fetch(
    `https://www.omdbapi.com/?s=movie&type=movie&y=${latestYear}&apikey=${apiKey}`
  );
  const data = await response.json();
  if (data.Response === "True") {
    displayFeaturedMovies(data.Search);
  }
}

// Display featured movies
function displayFeaturedMovies(movies) {
  const featuredSection = document.getElementById("featuredMovies");
  featuredSection.innerHTML = movies.map(movie => `
    <div class="movie-card">
      <img src="${movie.Poster}" alt="${movie.Title}" />
      <h3>${movie.Title}</h3>
    </div>
  `).join('');
}

// Fetch movies by search query
async function fetchMovies(query, page = 1) {
  const response = await fetch(`https://www.omdbapi.com/?s=${query}&page=${page}&apikey=${apiKey}`);
  const data = await response.json();
  if (data.Response === "True") {
    displayMovies(data.Search);
  } else {
    displayError("No movies found.");
  }
}

// Display movies in main section
function displayMovies(movies) {
  const movieResults = document.getElementById("movieResults");
  movieResults.innerHTML += movies.map(movie => `
    <div class="movie-card">
      <img src="${movie.Poster}" alt="${movie.Title}" />
      <h3>${movie.Title}</h3>
    </div>
  `).join('');
}

// Fetch movies by category
async function fetchMoviesByCategory(category) {
  const response = await fetch(`https://www.omdbapi.com/?s=${category}&apikey=${apiKey}`);
  const data = await response.json();
  if (data.Response === "True") {
    document.getElementById("movieResults").innerHTML = ""; // reset
    displayMovies(data.Search);
  } else {
    displayError("No movies found for this category.");
  }
}

// Display error
function displayError(message) {
  document.getElementById("movieResults").innerHTML = `<p class="error">${message}</p>`;
}

// Event listeners
document.getElementById("searchButton").addEventListener("click", () => {
  const query = document.getElementById("searchInput").value.trim();
  if (query) {
    document.getElementById("movieResults").innerHTML = "";
    currentPage = 1;
    fetchMovies(query, currentPage);
  }
});

document.getElementById("loadMoreButton").addEventListener("click", () => {
  const query = document.getElementById("searchInput").value.trim();
  if (query) {
    currentPage++;
    fetchMovies(query, currentPage);
  }
});

document.getElementById("movieCategory").addEventListener("change", (e) => {
  fetchMoviesByCategory(e.target.value);
});

// On page load
document.addEventListener("DOMContentLoaded", () => {
  fetchFeaturedMovies();
  fetchMoviesByCategory("action"); // default
});
