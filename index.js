const apiKey = "4ce09e3";
const searchBar = document.getElementById('search-bar')
const searchButton = document.getElementById('search-button')
const resultsContainerEl = document.querySelector('.results-container')

let imdbIDArray = []

// let localStorageWatchlist = 

document.addEventListener('DOMContentLoaded', () => {
 renderPage()
})

document.addEventListener('click', (e) => {
  if (e.target.matches('.submit-btn')) {
    e.preventDefault()
    resultsContainerEl.innerHTML = ""
    showLoading()
    let inputValue = searchBar.value
    fetchSearchValue(inputValue)
    document.querySelector('form').reset()
  } else if (e.target.dataset.add) {
    let movieID = e.target.dataset.add
    console.log(movieID)
  }
})

async function fetchSearchValue(searchValue) {
  if (!searchValue) {
    renderSearchPagePlaceholder()
  } else {

    let response = await fetch(`http://www.omdbapi.com/?apikey=${apiKey}&s=${searchValue}`, {method: "GET"})
    
    if (!response.ok) {
      throw new Error ("Network response not ok")
    } else {
      let data = await response.json()
      if (data.Response === "False") {
        throw Error ("Movie not found!")
      } else {
        let searchResults = data.Search
        if (imdbIDArray.length > 0) {
          imdbIDArray = []
        }
        let addedTitleSet = new Set()
        searchResults.forEach(result => {
          let searchResultID = result.imdbID
          if (result.Title && !addedTitleSet.has(result.Title.toLowerCase())) {
            addedTitleSet.add(result.Title.toLowerCase())
            imdbIDArray.push(searchResultID)
          }
        })
        getMoviesFromSearch()
      }
    }
  }

}

async function getMoviesFromSearch() {
  resultsContainerEl.innerHTML = ""
  for (let id of imdbIDArray) {
    let response = await fetch(`http://www.omdbapi.com/?apikey=${apiKey}&i=${id}`)
    
    if (!response.ok) {
      throw new Error ('Network response not ok')
    } else {
      let data = await response.json()
      const {Title, Poster, Plot, imdbRating, imdbID, Runtime, Genre} = data
      let img = document.createElement('img')
      img.src = Poster !== "N/A" ? Poster : "./images/blade_runner_placeholder.png"
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
                <p><i class="fa-solid fa-circle-plus fa-lg" data-add="${imdbID}"></i> Watchlist</p>
            </div>
            <div class="movie-descrip">
                ${Plot}
            </div>


        </div>


      </div>
  `
    }
  }
  
}

function renderSearchPagePlaceholder() {
  resultsContainerEl.innerHTML = `
  <div class="empty-search-wrapper">
    <img src="./icons/Icon.svg" alt="a film icon" class="empty-search-icon">
    <p>Start exploring</p>
  </div>
  `
}

function renderWatchlistPagePlaceholder() {
  resultsContainerEl.innerHTML = `
  <div class="empty-watchlist-wrapper">
    <p>Your watchlist is looking a little empty</p>
    <p><a href="index.html"><i class="fa-solid fa-circle-plus fa-lg"></i></a> Let's add some movies!</p>
  </div>
  `
}

function renderPage() {
  let currentPage = document.body.id 
  switch (currentPage) {
    case "search-page":
    fetchSearchValue()
    break
    case "watchlist-page": 
    renderWatchlistPagePlaceholder()
    break
  }
}

function showLoading() {
  let h2 = document.createElement('h2')
  h2.textContent = "Loading..."
  h2.className = "loading"
  resultsContainerEl.prepend(h2)
}