const apiKey = '4ce09e3'

function fetchAPI() {
    fetch(`https://www.omdbapi.com/?apikey=1f50d832'`)
    .then(response => response.json())
    .then(data => console.log(data))
}

fetchAPI()