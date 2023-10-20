const apiKey = "4ce09e3";
const searchBar = document.getElementById('search-bar')
const searchButton = document.getElementById('search-button')
const resultsContainerEl = document.querySelector('.results-container')
let imbdIDArray = []

document.addEventListener('DOMContentLoaded', () => {
 renderPage()
})

document.addEventListener('click', (e) => {
  if (e.target.matches('.submit-btn')) {
    e.preventDefault()
    let inputValue = searchBar.value
    fetchSearchValue(inputValue)
  }
})

async function fetchSearchValue(searchValue) {
  let response = await fetch(`http://www.omdbapi.com/?apikey=${apiKey}&s=${searchValue}`, {method: "GET"})
  
  if (!response.ok) {
    throw new Error ("Network response not ok")
  } else {
    let data = await response.json()
    if (data.Response === "False") {
      throw Error ("Movie not found!")
    } else {
      let searchResults = data.Search 
      console.log(searchResults)
      let
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
    renderSearchPagePlaceholder()
    break
    case "watchlist-page": 
    renderWatchlistPagePlaceholder()
    break
  }
}

