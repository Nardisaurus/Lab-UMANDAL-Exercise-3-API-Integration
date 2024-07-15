document.addEventListener("DOMContentLoaded", function() {
    const apiKey = "Sj0pkrVEx8hYmgrkIjdIbSuVJeznAYyp"; // Use provided API key
    const form = document.getElementById("cityForm");
    const weatherDiv = document.getElementById("weather");
    const dailyForecastDiv = document.getElementById("daily-forecast");
    const hourlyForecastDiv = document.getElementById("hourly-forecast");

    form.addEventListener("submit", function(event) {
        event.preventDefault();
        const city = document.getElementById("cityInput").value;
        getWeather(city);
    });

    function getWeather(city) {
        const url = `http://dataservice.accuweather.com/locations/v1/cities/search?apikey=${apiKey}&q=${city}`;

        fetch(url)
            .then(response => response.json())
            .then(data => {
                if (data && data.length > 0) {
                    const locationKey = data[0].Key;
                    fetchWeatherData(locationKey);
                    fetchDailyForecast(locationKey);
                    fetchHourlyForecast(locationKey);
                } else {
                    weatherDiv.innerHTML = `<p>City not found.</p>`;
                    dailyForecastDiv.innerHTML = '';
                    hourlyForecastDiv.innerHTML = '';
                }
            })
            .catch(error => {
                console.error("Error fetching location data:", error);
                weatherDiv.innerHTML = `<p>Error fetching location data.</p>`;
                dailyForecastDiv.innerHTML = '';
                hourlyForecastDiv.innerHTML = '';
            });
    }

    function fetchWeatherData(locationKey) {
        const url = `http://dataservice.accuweather.com/currentconditions/v1/${locationKey}?apikey=${apiKey}`;

        fetch(url)
            .then(response => response.json())
            .then(data => {
                if (data && data.length > 0) {
                    displayWeather(data[0]);
                } else {
                    weatherDiv.innerHTML = `<p>No weather data available.</p>`;
                }
            })
            .catch(error => {
                console.error("Error fetching weather data:", error);
                weatherDiv.innerHTML = `<p>Error fetching weather data.</p>`;
            });
    }

    function fetchDailyForecast(locationKey) {
        const url = `http://dataservice.accuweather.com/forecasts/v1/daily/5day/${locationKey}?apikey=${apiKey}`;

        fetch(url)
            .then(response => response.json())
            .then(data => {
                if (data && data.DailyForecasts) {
                    displayDailyForecast(data.DailyForecasts);
                } else {
                    dailyForecastDiv.innerHTML = `<p>No daily forecast available.</p>`;
                }
            })
            .catch(error => {
                console.error("Error fetching daily forecast:", error);
                dailyForecastDiv.innerHTML = `<p>Error fetching daily forecast.</p>`;
            });
    }

    function fetchHourlyForecast(locationKey) {
        const url = `http://dataservice.accuweather.com/forecasts/v1/hourly/12hour/${locationKey}?apikey=${apiKey}`;

        fetch(url)
            .then(response => response.json())
            .then(data => {
                if (data && data.length > 0) {
                    displayHourlyForecast(data);
                } else {
                    hourlyForecastDiv.innerHTML = `<p>No hourly forecast available.</p>`;
                }
            })
            .catch(error => {
                console.error("Error fetching hourly forecast:", error);
                hourlyForecastDiv.innerHTML = `<p>Error fetching hourly forecast.</p>`;
            });
    }

    function displayWeather(data) {
        const temperature = data.Temperature.Metric.Value;
        const weather = data.WeatherText;
        const weatherIcon = data.WeatherIcon;
        const weatherContent = `
            <h2>Current Weather</h2>
            <p>Temperature: ${temperature}°C</p>
            <p>Weather: ${weather}</p>
            <img src="https://developer.accuweather.com/sites/default/files/${String(weatherIcon).padStart(2, '0')}-s.png" alt="${weather}">
        `;
        weatherDiv.innerHTML = weatherContent;
    }

    function displayDailyForecast(forecasts) {
        let forecastContent = `<h2>5-Day Forecast</h2>`;
        forecasts.forEach(forecast => {
            const date = new Date(forecast.Date).toLocaleDateString();
            const minTemp = forecast.Temperature.Minimum.Value;
            const maxTemp = forecast.Temperature.Maximum.Value;
            const weatherIcon = forecast.Day.Icon;
            forecastContent += `
                <div class="forecast-item">
                    <p>${date}</p>
                    <p>Min: ${minTemp}°C, Max: ${maxTemp}°C</p>
                    <img src="https://developer.accuweather.com/sites/default/files/${String(weatherIcon).padStart(2, '0')}-s.png" alt="Day Icon">
                </div>
            `;
        });
        dailyForecastDiv.innerHTML = forecastContent;
    }

    function displayHourlyForecast(forecasts) {
        let forecastContent = `<h2>12-Hour Forecast</h2>`;
        forecasts.forEach(forecast => {
            const time = new Date(forecast.DateTime).toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'});
            const temperature = forecast.Temperature.Value;
            const weatherIcon = forecast.WeatherIcon;
            forecastContent += `
                <div class="forecast-item">
                    <p>${time}</p>
                    <p>Temperature: ${temperature}°C</p>
                    <img src="https://developer.accuweather.com/sites/default/files/${String(weatherIcon).padStart(2, '0')}-s.png" alt="Hourly Icon">
                </div>
            `;
        });
        hourlyForecastDiv.innerHTML = forecastContent;
    }
});
