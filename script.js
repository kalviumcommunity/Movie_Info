const apiKey = "5b3b774b";
let currentPage = 1;
let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

function createMovieCard(movie) {
  const isFav = favorites.some((f) => f.imdbID === movie.imdbID);
  return `
    <div class="movie-card">
      <img src="${movie.Poster}" alt="${movie.Title}" />
      <h3>${movie.Title}</h3>
      <button class="fav-btn" onclick="toggleFavorite('${movie.imdbID}')">
        <i class="fas fa-heart" style="color:${isFav ? "red" : "white"};"></i>
      </button>
    </div>
  `;
}

// Display functions
function displayFeaturedMovies(movies) {
  const featuredSection = document.getElementById("featuredMovies");
  featuredSection.innerHTML = movies.slice(0, 7).map(createMovieCard).join("");
}

function displayMovies(movies) {
  const results = document.getElementById("movieResults");
  results.innerHTML += movies.map(createMovieCard).join("");
}

function displayFavorites() {
  const favSection = document.getElementById("favoritesSection");
  favSection.innerHTML = favorites.map(createMovieCard).join("");
}

// API functions
async function fetchFeaturedMovies() {
  const response = await fetch(
    `https://www.omdbapi.com/?s=movie&y=2025&type=movie&apikey=${apiKey}`
  );
  const data = await response.json();
  if (data.Response === "True") displayFeaturedMovies(data.Search);
}

async function fetchMovies(query, page = 1) {
  const response = await fetch(
    `https://www.omdbapi.com/?s=${query}&page=${page}&apikey=${apiKey}`
  );
  const data = await response.json();
  if (data.Response === "True") displayMovies(data.Search);
}

async function fetchMoviesByCategory(category) {
  const response = await fetch(
    `https://www.omdbapi.com/?s=${category}&apikey=${apiKey}`
  );
  const data = await response.json();
  document.getElementById("movieResults").innerHTML = "";
  if (data.Response === "True") displayMovies(data.Search);
  else displayError("No movies found for this category.");
}

function displayError(msg) {
  document.getElementById(
    "movieResults"
  ).innerHTML = `<p class="error">${msg}</p>`;
}

// Favorites handler
function toggleFavorite(imdbID) {
  fetch(`https://www.omdbapi.com/?i=${imdbID}&apikey=${apiKey}`)
    .then((res) => res.json())
    .then((movie) => {
      const index = favorites.findIndex((f) => f.imdbID === imdbID);
      if (index !== -1) {
        favorites.splice(index, 1);
      } else {
        favorites.push(movie);
      }
      localStorage.setItem("favorites", JSON.stringify(favorites));
      displayFavorites();
      document.getElementById("movieResults").innerHTML = "";
      fetchMoviesByCategory(document.getElementById("movieCategory").value);
    });
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

// On load
document.addEventListener("DOMContentLoaded", () => {
  fetchFeaturedMovies();
  fetchMoviesByCategory("action");
  displayFavorites();
});
