const apiKey = "5b3b774b";
let currentPage = 1;
let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

function createMovieCard(movie) {
  const isFav = favorites.some((f) => f.imdbID === movie.imdbID);
  const note = movie.note ? `<p class="movie-note">${movie.note}</p>` : "";
  return `
    <div class="movie-card">
      <img src="${movie.Poster}" alt="${movie.Title}" />
      <h3>${movie.Title}</h3>
      ${note}
      <button class="fav-btn" onclick="toggleFavorite('${movie.imdbID}')">
        <i class="fas fa-heart" style="color:${isFav ? "red" : "white"};"></i>
      </button>
    </div>
  `;
}

function displayFeaturedMovies(movies) {
  const featuredSection = document.getElementById("featuredMovies");
  featuredSection.innerHTML = movies.slice(0, 20).map(createMovieCard).join("");
}

function displayMovies(movies) {
  const results = document.getElementById("movieResults");
  results.innerHTML += movies.map(createMovieCard).join("");
}

function displayFavorites() {
  const favSection = document.getElementById("favoritesSection");
  favSection.innerHTML = favorites.map(createMovieCard).join("");
}

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
function updateFavoriteByTitle(title, updateObj) {
  const index = favorites.findIndex(
    (movie) => movie.Title.toLowerCase() === title.toLowerCase()
  );

  if (index !== -1) {
    favorites[index] = { ...favorites[index], ...updateObj };
    localStorage.setItem("favorites", JSON.stringify(favorites));
    displayFavorites();
    alert(`Updated movie "${title}" successfully!`);
  } else {
    alert(`No favorite movie found with the title "${title}".`);
  }
}


function handleUpdate() {
  const title = document.getElementById("movieTitleInput").value.trim();
  const newNote = document.getElementById("newNoteInput").value.trim();

  if (title && newNote) {
    updateFavoriteByTitle(title, { note: newNote });
  } else {
    alert("Please enter both title and note.");
  }
}


document.getElementById("searchButton").addEventListener("click", () => {
  const query = document.getElementById("searchInput").value.trim();
  if (query) {
    document.getElementById("movieResults").innerHTML = "";
    currentPage = 1;
    lastSearchQuery = query; // Save for later
    fetchMovies(query, currentPage);
  }

});

document.getElementById("loadMoreButton").addEventListener("click", () => {
  if (lastSearchQuery) {
    currentPage++;
    fetchMovies(lastSearchQuery, currentPage);
  }
});


document.getElementById("movieCategory").addEventListener("change", (e) => {
  fetchMoviesByCategory(e.target.value);
});

document.addEventListener("DOMContentLoaded", () => {
  fetchFeaturedMovies();
  fetchMoviesByCategory("action");
  displayFavorites();
});
function createMovieCard(movie) {
  const isFav = favorites.some((f) => f.imdbID === movie.imdbID);
  const note = movie.note ? `<p class="movie-note">${movie.note}</p>` : "";
  return `
    <div class="movie-card">
      <a href="details.html?id=${movie.imdbID}">
        <img src="${movie.Poster}" alt="${movie.Title}" />
        <h3>${movie.Title}</h3>
      </a>
      ${note}
      <button class="fav-btn" onclick="event.preventDefault(); toggleFavorite('${
        movie.imdbID
      }')">
        <i class="fas fa-heart" style="color:${isFav ? "red" : "white"};"></i>
      </button>
    </div>
  `;
}
