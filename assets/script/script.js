let cityName = "birmingham, gb";
let coordData = "";
let weatherData = "";
let weatherApiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&units=metric&cnt=1&appid=8d0c1a27ce3e47ce06696db25a3b205f`;
let lat = 0;
let lon = 0;
let oneCallApiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=metric&exclude=minutely,hourly&appid=8d0c1a27ce3e47ce06696db25a3b205f`;

if (localStorage.getItem("history") == null) {
  localStorage.setItem("history", "[]");
}

// render date and time
$("#today").text(moment().format("DD/MM/YYYY HH:mm:ss"));
function updateTime() {
  $("#today").text(moment().format("DD/MM/YYYY HH:mm:ss"));
}
setInterval(updateTime, 1000);

// function for finding a cities coordinates
function coordSearch() {
  fetch(weatherApiUrl)
    .then(function (response) {
      if (response.status === 200){
        return response.json();
      }
      else {throw response}
    })
    .then(function (data) {
      coordData = data;
      lat = coordData.city.coord.lat;
      lon = coordData.city.coord.lon;
      oneCallApiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=metric&exclude=minutely,hourly&appid=8d0c1a27ce3e47ce06696db25a3b205f`;
    })
    .then(weatherSearch)
    .catch(errorBehaviour)
}

function errorBehaviour(){
  //show modal
  $('#errorModal').modal()
  // remove bad search from local storage
  localStorageArray.pop()
  localStorage.setItem("history", JSON.stringify(localStorageArray))
  // remove bad search from recent searches
  $('#searchHistory').children().eq(0).remove()
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
    .then(renderForecast)
    .then(setDayNight)
}
// load default of Birmingham
coordSearch();

// getting city name from user input and call coordSearch
function citySearch(e) {
  e.preventDefault();
  if ($("#cityInput").val() === ''){return}
  for (let i = 1; i < forecastCardArray.length; i++) {
    $(forecastCardArray[i]).empty();
  }
  cityName = $("#cityInput").val();
  weatherApiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&units=metric&appid=8d0c1a27ce3e47ce06696db25a3b205f`;
  coordSearch();
  history();
  addSearch();
  $("#cityInput").val("");
}

$("#citySearchButton").click(citySearch);

// render current weather
function renderCurrentWeather() {
  $("#cityName").text(`${coordData.city.name}, ${coordData.city.country} - `);
  $("#todaysDate").text(
    moment
      .unix(weatherData.current.dt + weatherData.timezone_offset)
      .format("DD/MM/YYYY, HH:mm")
  );
  $("#weatherIcon").attr(
    "src",
    `http://openweathermap.org/img/wn/${weatherData.current.weather[0].icon}@2x.png`
  );
  $("#temp").text(`Temperature: ${weatherData.current.temp} °C`);
  $("#wind").text(`Wind speed: ${weatherData.current.wind_speed} meter/sec`);
  $("#humidity").text(`Humidity: ${weatherData.current.humidity}`);
  $("#UV").text(` ${weatherData.current.uvi} `);
  if (weatherData.current.uvi > 2) {
    $("#UV").css("background-color", "yellow");
  } else if (weatherData.current.uvi > 5) {
    $("#UV").css("background-color", "red");
  } else $("#UV").css("background-color", "green");
}

// render forecast
let forecastCardArray = $(".weatherCard");
function renderForecast() {
  for (let i = 1; i < forecastCardArray.length; i++) {
    $(forecastCardArray[i]).append(
      $(
        `<p><span>${moment
          .unix(weatherData.daily[i].dt + weatherData.timezone_offset)
          .format("DD/MM/YYYY")}</span>`
      )
    );
    $(forecastCardArray[i]).append(
      $(`<img>`, {
        src: `http://openweathermap.org/img/wn/${weatherData.daily[i].weather[0].icon}@2x.png`,
        alt: "weather icon for this day",
      })
    );
    $(forecastCardArray[i]).append(
      $(`<p><span>${weatherData.daily[i].temp.day} °C</span>`)
    );
    $(forecastCardArray[i]).append(
      $(`<p><span>Wind: ${weatherData.daily[i].wind_speed} m/s</span>`)
    );
    $(forecastCardArray[i]).append(
      $(`<p><span>Humidity: ${weatherData.daily[i].humidity}</span>`)
    );
  }
}

// saving inputs to local storage
let historyArray = [];
function history() {
  historyArray = JSON.parse(localStorage.getItem("history"));
  // don't add it again if it's already there  
  for (let i = 0; i < historyArray.length; i++){
    if ($("#cityInput").val().toUpperCase() === historyArray[i]) {
      return;
    }
  }
  // limit history size
  if (historyArray.length > 10){historyArray.shift()}

  historyArray.push($("#cityInput").val().toUpperCase());
  localStorage.setItem("history", JSON.stringify(historyArray));
}

//render history
let localStorageArray = JSON.parse(localStorage.getItem("history"));
renderHistory();
function renderHistory() {
  localStorageArray = JSON.parse(localStorage.getItem("history"))
  for (let i = 0; i < localStorageArray.length; i++) {
    $("#searchHistory").prepend(
      $(`<li>${localStorageArray[i].toUpperCase()}</li>`)
    );
  }
}

//add latest input
function addSearch() {
  // don't add it again if it's already there  
  if (localStorageArray.length > 0){
  for (let i = 0; i < localStorageArray.length; i++) {
    if ($("#cityInput").val().toUpperCase() === localStorageArray[i]) {
      return;
    }
  }}
  localStorageArray = JSON.parse(localStorage.getItem("history"))
  // add to list
  $("#searchHistory").prepend(
    $(`<li>${$("#cityInput").val().toUpperCase()}</li>`)
  );
}

// search by clicking item in history
$("#searchHistory").click(searchFromHistory);
function searchFromHistory(e) {
  $("#cityInput").val(`${$(e.target).text()}`);
  citySearch(e);
}

// background day/night theme

function setDayNight() {
  if (moment().unix() + weatherData.timezone_offset > weatherData.current.sunset){
    $('body').css('background-image', 'url(assets/images/nightsky.jpg)')
    $('body').css('color', 'white')
  }
  else {
    $('body').css('background-image', 'url(assets/images/pikrepo.com.jpg)')
    $('body').css('color', 'black')
  }
}


