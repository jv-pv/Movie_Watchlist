const omdbURL = "http://www.omdbapi.com/?apikey=4ce09e3&";
const searchBar = document.getElementById("search-bar");
const searchButton = document.getElementById("search-button");
const resultsContainerEl = document.querySelector(".results-container");

let imdbIDArray = [];

let localStorageWatchlist =
  JSON.parse(localStorage.getItem("movieWatchlist")) || [];

document.addEventListener("DOMContentLoaded", () => {
  renderPage();
});

document.addEventListener("click", (e) => {
  if (e.target.matches(".submit-btn")) {
    e.preventDefault();
    resultsContainerEl.innerHTML = "";
    showLoading();
    let inputValue = searchBar.value;
    fetchSearchValue(inputValue);
    document.querySelector("form").reset();
  } else if (e.target.dataset.add) {
    let movieID = e.target.dataset.add;
    if (!localStorageWatchlist.includes(movieID)) {
      localStorageWatchlist.push(movieID);
      localStorage.setItem("movieWatchlist", JSON.stringify(localStorageWatchlist));
    }
  } else if (e.target.dataset.remove) {
    let movieID = e.target.dataset.remove
    let index = localStorageWatchlist.indexOf(movieID)
    console.log(index)
    if (index >= 0) {
      localStorageWatchlist.splice(index, 1)
      localStorage.setItem('movieWatchlist', JSON.stringify(localStorageWatchlist))
      getWatchlist()
    } 
    updateContainerPlacement()
  }
});

async function fetchSearchValue(searchValue) {
  try {
    if (!searchValue) {
      renderSearchPagePlaceholder();
  
    } else {
      let response = await fetch(`${omdbURL}s=${searchValue}`, { method: "GET" });
  
      if (!response.ok) {
        throw new Error("Network response not ok");
      } else {
        let data = await response.json();
        console.log(data)
        if (data.Response === "False") {
          throw Error("Movie not found!");
        } else {
          let searchResults = data.Search;
          if (imdbIDArray.length > 0) {
            imdbIDArray = [];
          }
          // Exclude multiple same title movies
          let addedTitleSet = new Set();
          searchResults.forEach((result) => {
            let searchResultID = result.imdbID;
            if (result.Title && !addedTitleSet.has(result.Title.toLowerCase())) {
              addedTitleSet.add(result.Title.toLowerCase());
              imdbIDArray.push(searchResultID);
            }
          });
          getMoviesFromSearch();
          updateContainerPlacement()
        }
      }
    }
  } catch (error) {
    console.log(error, "Search value not found!")
    renderError()
  }
}

async function getMoviesFromSearch() {
  resultsContainerEl.innerHTML = "";
  for (let id of imdbIDArray) {
    let response = await fetch(`${omdbURL}i=${id}&plot=short`);

    if (!response.ok) {
      throw new Error("Network response not ok");
    } else {
      let data = await response.json();
      const { Title, Poster, Plot, imdbRating, imdbID, Runtime, Genre } = data;
      let img = document.createElement("img");
      img.src =
        Poster !== "N/A" ? Poster : "./images/blade_runner_placeholder.png";
      img.alt = "Movie Poster";
      img.className = "movie-poster";
      resultsContainerEl.innerHTML += `
      <div class="movie-wrapper">

      ${img.outerHTML}

        <div class="movie-metadata">

            <div class="title-rating">
                <h2 class="movie-title">${Title}</h2>
                <p class="movie-rating"><i class="fa-solid fa-star" style="color: #ffea00;"></i> ${imdbRating}</p>
            </div>
            <div class="runtime-genres">
                <p class="movie-runtime">${Runtime}</p>
                <p class="movie-genres">${Genre}</p>
                <p data-add="${imdbID}"><i class="fa-solid fa-circle-plus fa-lg" data-add="${imdbID}"></i> Watchlist</p>
            </div>
            <div class="movie-plot">
              <p>${Plot}</p>
            </div>


        </div>


      </div>
  `;
    }
  }
}

async function getWatchlist() {
  if (localStorageWatchlist.length < 1) {
    renderWatchlistPagePlaceholder();
  } else {
    showLoading()
    resultsContainerEl.innerHTML = "";
    for (let movieID of localStorageWatchlist) {
      let response = await fetch(`${omdbURL}i=${movieID}`);

      if (!response.ok) {
        throw new Error("Network response not ok");
      } else {
        let data = await response.json();
        const { Title, Poster, Plot, imdbRating, imdbID, Runtime, Genre } =
          data;

        let img = document.createElement("img");
        img.src =
          Poster !== "N/A" ? Poster : "./images/blade_runner_placeholder.png";
        img.alt = "Movie Poster"
        img.className = "movie-poster"

        resultsContainerEl.innerHTML += `
        <div class="movie-wrapper">

        ${img.outerHTML}
  
          <div class="movie-metadata">
  
              <div class="title-rating">
                  <h2 class="movie-title">${Title}</h2>
                  <p class="movie-rating"><i class="fa-solid fa-star" style="color: #ffea00;"></i> ${imdbRating}</p>
              </div>
              <div class="runtime-genres">
                  <p class="movie-runtime">${Runtime}</p>
                  <p class="movie-genres">${Genre}</p>
                  <p data-remove="${imdbID}"><i class="fa-solid fa-circle-minus fa-lg" style="color: darkred;" data-remove="${imdbID}"></i> Watchlist</p>
              </div>
              <div class="movie-plot">
                  <p>${Plot}</p>
              </div>
  
  
          </div>
  
  
        </div>

        `;
      }
    }
    updateContainerPlacement()
  }
}

function renderSearchPagePlaceholder() {
  resultsContainerEl.innerHTML = `
  <div class="empty-search-wrapper">
    <img src="./icons/Icon.svg" alt="a film icon" class="empty-search-icon">
    <p>Start exploring</p>
  </div>
  `;
}

function renderWatchlistPagePlaceholder() {
  resultsContainerEl.innerHTML = `
  <div class="empty-watchlist-wrapper">
    <p>Your watchlist is looking a little empty</p>
    <a href="index.html"><i class="fa-solid fa-circle-plus fa-lg"></i> Let's add some movies!</a>
  </div>
  `;
}

function renderPage() {
  let currentPage = document.body.id;
  switch (currentPage) {
    case "search-page":
      fetchSearchValue();
      break;
    case "watchlist-page":
      getWatchlist();
      break;
  }
}


function renderError() {
  resultsContainerEl.innerHTML = ""
  let h2 = document.createElement("h2");
  h2.textContent = "Unable to find what you are looking for! Please try another search.";
  h2.className = "error";
  resultsContainerEl.prepend(h2);
}

function showLoading() {
  let h2 = document.createElement("h2");
  h2.textContent = "Loading...";
  h2.className = "loading";
  resultsContainerEl.prepend(h2);
}

function updateContainerPlacement() {

  if (imdbIDArray.length > 0 || localStorageWatchlist.length > 0) {
    resultsContainerEl.style.justifyContent = "flex-start"
  } else {
    resultsContainerEl.style.justifyContent = "center"
  }

}