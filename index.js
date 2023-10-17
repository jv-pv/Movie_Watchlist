const apiKey = "4ce09e3";
const searchBar = document.getElementById('search-bar')
const searchButton = document.getElementById('search-button')
const form = document.querySelector('form')


async function fetchAPI() {
  let response = await fetch(`http://www.omdbapi.com/?apikey=${apiKey}&t=${searchBar.value}`, {method: "GET"})
  let data = await response.json()
  console.log(data)
}

searchButton.addEventListener('click', (e) => {
  e.preventDefault()
  fetchAPI()
})
