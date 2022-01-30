let cityName = "birmingham, gb";
let coordData;
let weatherData;
let weatherApiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&units=metric&cnt=1&appid=8d0c1a27ce3e47ce06696db25a3b205f`;
let lat;
let lon;
let oneCallApiUrl;

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
      if (response.status === 200) {
        return response.json();
      } else {
        throw response;
      }
    })
    .then(function (data) {
      coordData = data;
      lat = coordData.city.coord.lat;
      lon = coordData.city.coord.lon;
      oneCallApiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=metric&exclude=minutely,hourly&appid=8d0c1a27ce3e47ce06696db25a3b205f`;
    })
    .then(weatherSearch)
    .then(() => $("body").addClass("fadeIn"))
    .catch(errorBehaviour);
}

function errorBehaviour() {
  //show modal
  $("#errorModal").modal();
  // remove bad search from local storage
  localStorageArray.pop();
  localStorage.setItem("history", JSON.stringify(localStorageArray));
  // remove bad search from recent searches
  $("#searchHistory").children().eq(0).remove();
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
    .then(setDayNight);
}
// load default of Birmingham
coordSearch();

// getting city name from user input and call coordSearch
function citySearch(e) {
  e.preventDefault();
  if ($("#cityInput").val() === "") {
    return;
  }
  cityName = $("#cityInput").val();
  weatherApiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&units=metric&appid=8d0c1a27ce3e47ce06696db25a3b205f`;
  $("body").removeClass("fadeIn");
  coordSearch();
  history();
  addSearch();
  $("#cityInput").val("");
}

$("#citySearchButton").click(citySearch);

// render current weather
function renderCurrentWeather() {
  const uvIndicator = $("#UV");
  const currentWeather = weatherData.current;
  $("#cityName").text(`${coordData.city.name}, ${coordData.city.country} - `);
  $("#todaysDate").text(
    moment
      .unix(currentWeather.dt + weatherData.timezone_offset)
      .format("DD/MM/YYYY, HH:mm")
  );
  $("#weatherIcon").attr(
    "src",
    `https://openweathermap.org/img/wn/${currentWeather.weather[0].icon}@2x.png`
  );
  $("#temp").text(`Temperature: ${currentWeather.temp} °C`);
  $("#wind").text(`Wind speed: ${currentWeather.wind_speed} meter/sec`);
  $("#humidity").text(`Humidity: ${currentWeather.humidity}`);
  uvIndicator.text(` ${currentWeather.uvi} `);
  if (currentWeather.uvi > 2) {
    uvIndicator.css("background-color", "yellow");
    uvIndicator.css("color", "black");
  }
  if (currentWeather.uvi > 5) {
    uvIndicator.css("background-color", "red");
  } else uvIndicator.css("background-color", "green");
}

// render forecast
let forecastCardArray = $(".weatherCard");
function renderForecast() {
  for (let i = 1; i < forecastCardArray.length; i++) {
    const dailyWeather = weatherData.daily[i];
    const forecastCard = $(forecastCardArray[i]);
    forecastCard.empty()
    forecastCard.append(
      $(
        `<p><span>${moment
          .unix(dailyWeather.dt + weatherData.timezone_offset)
          .format("DD/MM/YYYY")}</span>`
      )
    );
    forecastCard.append(
      $(`<img>`, {
        src: `https://openweathermap.org/img/wn/${dailyWeather.weather[0].icon}@2x.png`,
        alt: "weather icon for this day",
      })
    );
    forecastCard.append($(`<p><span>${dailyWeather.temp.day} °C</span>`));
    forecastCard.append(
      $(`<p><span>Wind: ${dailyWeather.wind_speed} m/s</span>`)
    );
    forecastCard.append(
      $(`<p><span>Humidity: ${dailyWeather.humidity}</span>`)
    );
  }
}

// saving inputs to local storage
let historyArray = [];
function history() {
  historyArray = JSON.parse(localStorage.getItem("history"));
  // don't add it again if it's already there
  for (let i = 0; i < historyArray.length; i++) {
    if ($("#cityInput").val().toUpperCase() === historyArray[i]) {
      return;
    }
  }
  // limit history size
  if (historyArray.length > 10) {
    historyArray.shift();
  }

  historyArray.push($("#cityInput").val().toUpperCase());
  localStorage.setItem("history", JSON.stringify(historyArray));
}

//render history
let localStorageArray = JSON.parse(localStorage.getItem("history"));
renderHistory();
function renderHistory() {
  localStorageArray = JSON.parse(localStorage.getItem("history"));
  for (let i = 0; i < localStorageArray.length; i++) {
    $("#searchHistory").prepend(
      $(`<li>${localStorageArray[i].toUpperCase()}</li>`)
    );
  }
}

//add latest input
function addSearch() {
  // don't add it again if it's already there
  if (localStorageArray.length > 0) {
    for (let i = 0; i < localStorageArray.length; i++) {
      if ($("#cityInput").val().toUpperCase() === localStorageArray[i]) {
        return;
      }
    }
  }
  localStorageArray = JSON.parse(localStorage.getItem("history"));
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
  if (
    weatherData.current.dt > weatherData.current.sunset ||
    weatherData.current.dt < weatherData.current.sunrise
  ) {
    $("body").css("background-image", "url(assets/images/nightsky.jpg)");
    $("body").css("color", "white");
  } else {
    $("body").css("background-image", "url(assets/images/pikrepo.com.jpg)");
    $("body").css("color", "black");
  }
}
