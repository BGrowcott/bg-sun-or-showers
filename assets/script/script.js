let cityName = "";
let weatherData = "";
let weatherApiUrl = ''

function weatherSearch() {
  fetch(weatherApiUrl)
    .then(function (response) {
      console.log(response);
      return response.json();
    })
    .then(function (data) {
      weatherData = data;
    });
}

function citySearch(e) {
  e.preventDefault();
  cityName = $("#cityInput").val();
  weatherApiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=8d0c1a27ce3e47ce06696db25a3b205f`;
  weatherSearch();
}

$("#citySearchButton").click(citySearch);

function renderWeather(){
  
}

// IF I WANT A DROP LIST - WORK IN PROGRESS
// let availableTags =[]
// let cityData = "";
// fetch("assets/script/city.list.json/cityList.json")
//   .then(function (response) {
//     console.log(response);
//     return response.json();
//   })
//   .then(function (data) {
//     cityData = data;
//     for (let i=0; i<cityData.length; i++){
//       availableTags.push(cityData[i].name)
//     }
//     console.log(availableTags)
//     return availableTags

//   })
// // list of tags for city input
// $(function () {
//   $("#cityInput").autocomplete({
//     source: availableTags,
//   });
// })
