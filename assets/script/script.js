let cityName = "birmingham, gb";
let coordData = "";
let weatherData = "";
let weatherApiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&units=metric&cnt=1&appid=8d0c1a27ce3e47ce06696db25a3b205f`;
let lat = 33.52;
let lon = -86.8;
let oneCallApiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=metric&exclude=minutely,hourly&appid=8d0c1a27ce3e47ce06696db25a3b205f`;

function coordSearch() {
  fetch(weatherApiUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      coordData = data;
      lat = coordData.city.coord.lat;
      lon = coordData.city.coord.lon;
      oneCallApiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=metric&exclude=minutely,hourly&appid=8d0c1a27ce3e47ce06696db25a3b205f`;
    })
    .then(weatherSearch);
}

function weatherSearch() {
  fetch(oneCallApiUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      weatherData = data;
    })
    .then(renderCurrentWeather);
}

coordSearch();

function citySearch(e) {
  e.preventDefault();
  cityName = $("#cityInput").val();
  weatherApiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&units=metric&appid=8d0c1a27ce3e47ce06696db25a3b205f`;
  coordSearch();
}

$("#citySearchButton").click(citySearch);

function renderCurrentWeather() {
  $("#cityName").text(coordData.city.name);
  $("#todaysDate").text(moment().format("DD-MM-YYYY, H:mm"));
  $("#weatherIcon").attr(
    "src",
    `http://openweathermap.org/img/wn/${weatherData.current.weather[0].icon}@2x.png`
  );
  $("#temp").text(`Temperature: ${weatherData.current.temp} °C`);
  $("#wind").text(`Wind: ${weatherData.current.wind_speed} meter/sec`);
  $("#humidity").text(`Humidity: ${weatherData.current.humidity}`);
  $("#UV").text(`UV Index: ${weatherData.current.uvi}`);
}

// let availableTags =[]
// let cityData = "";
// fetch("assets/script/city.list.json/cityList.json")
//   .then(function (response) {
//     return response.json();
//   })
//   .then(function (data) {
//     cityData = data;
//   })

// function cityCoordinates(){
//   for (let city of cityData){
//     console.log(city.name)
//     return
//     if (city.name === cityName){
//       return city.name
//     }
//   }
// }
