let cityName = "birmingham, gb";
let coordData = "";
let weatherData = "";
let weatherApiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&units=metric&cnt=1&appid=8d0c1a27ce3e47ce06696db25a3b205f`;
let lat = 0;
let lon = 0;
let oneCallApiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=metric&exclude=minutely,hourly&appid=8d0c1a27ce3e47ce06696db25a3b205f`;

// render date and time
$('#today').text(moment().format("DD/MM/YYYY, HH:mm:ss"))
function updateTime() {
  $('#today').text(moment().format("DD/MM/YYYY, HH:mm:ss"))
}
setInterval(updateTime, 1000)

// function for finding a cities coordinates
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

// function for getting weather at coordinates and call render functions
function weatherSearch() {
  fetch(oneCallApiUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      weatherData = data;
    })
    .then(renderCurrentWeather)
    .then(renderForecast);
}
// load default of Birmingham 
coordSearch();

// getting city name from user input and call coordSearch
function citySearch(e) {
  e.preventDefault();
  for (let i=1; i<forecastCardArray.length; i++){
  $(forecastCardArray[i]).empty()}
  cityName = $("#cityInput").val();
  weatherApiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&units=metric&appid=8d0c1a27ce3e47ce06696db25a3b205f`;
  coordSearch();
}

$("#citySearchButton").click(citySearch);

// render current weather
function renderCurrentWeather() {
  $("#cityName").text(`${coordData.city.name}, ${coordData.city.country} - `);
  $("#todaysDate").text(moment.unix(weatherData.current.dt + weatherData.timezone_offset).format("DD/MM/YYYY, HH:mm"));
  $("#weatherIcon").attr(
    "src",
    `http://openweathermap.org/img/wn/${weatherData.current.weather[0].icon}@2x.png`
  );
  $("#temp").text(`Temperature: ${weatherData.current.temp} °C`);
  $("#wind").text(`Wind speed: ${weatherData.current.wind_speed} meter/sec`);
  $("#humidity").text(`Humidity: ${weatherData.current.humidity}`);
  $("#UV").text(` ${weatherData.current.uvi} `);
  if (weatherData.current.uvi > 2){
    $("#UV").css('background-color', 'yellow')
  }
  else if (weatherData.current.uvi > 5){
    $("#UV").css('background-color', 'red')
  }
  else $("#UV").css('background-color', 'green')
}

// render forecast
let forecastCardArray = $('.weatherCard')
function renderForecast() {
  for (let i=1; i<forecastCardArray.length; i++){
    $(forecastCardArray[i]).append($(`<p><span>${moment.unix(weatherData.daily[i].dt + weatherData.timezone_offset).format("DD/MM/YYYY")}</span>`))
    $(forecastCardArray[i]).append($(`<img>`, {src:`http://openweathermap.org/img/wn/${weatherData.daily[i].weather[0].icon}@2x.png`, alt:'weather icon for this day'}))
    $(forecastCardArray[i]).append($(`<p><span>${weatherData.daily[i].temp.day} °C</span>`))
    $(forecastCardArray[i]).append($(`<p><span>Wind: ${weatherData.daily[i].wind_speed} m/s</span>`))
    $(forecastCardArray[i]).append($(`<p><span>Humidity: ${weatherData.daily[i].humidity}</span>`))
  }
}