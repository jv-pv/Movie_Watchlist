const apiKey = "bc32164e";

function fetchAPI() {
  fetch("http://www.omdbapi.com/?apikey=[bc32164e]&", {method: "GET"})
    .then((response) => response.json())
    .then((data) => console.log(data));
}

fetchAPI();