const apiKey = '4ce09e3'

function fetchAPI() {
    fetch(`http://www.omdbapi.com/?apikey=4ce09e3&`)
    .then(response => response.json())
    .then(data => console.log(data))
}

fetchAPI()