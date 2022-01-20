let weatherApiUrl = 'https://api.openweathermap.org/data/2.5/forecast/daily?q=London&units=metric&cnt=7&appid=8d0c1a27ce3e47ce06696db25a3b205f'

fetch(weatherApiUrl)
    .then(function (response) {
        console.log(response)
    //   return response.json();
    })
    .then(function (data) {
      console.log(data);
    });