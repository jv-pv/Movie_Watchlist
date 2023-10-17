const apiKey = "4ce09e3";

function fetchAPI() {
  fetch(`http://www.omdbapi.com/?apikey=${apiKey}&t=Ants`, {method: "GET"})
    .then((response) => response.json())
    .then((data) => console.log(data));
}

fetchAPI()

