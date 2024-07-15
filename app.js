document.addEventListener("DOMContentLoaded", function() {
    const apiKey = "w4EyDPAJhvaChfYGiAFBK0A0cVHyxb75"; // Use provided API key
    const form = document.getElementById("cityForm");
    const weatherDiv = document.getElementById("weather");
    const dailyForecastContainer = document.getElementById("daily-forecast-container");
    const hourlyForecastContainer = document.getElementById("hourly-forecast-container");

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
                    dailyForecastContainer.innerHTML = '';
                    hourlyForecastContainer.innerHTML = '';
                }
            })
            .catch(error => {
                console.error("Error fetching location data:", error);
                weatherDiv.innerHTML = `<p>Error fetching location data.</p>`;
                dailyForecastContainer.innerHTML = '';
                hourlyForecastContainer.innerHTML = '';
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
                    dailyForecastContainer.innerHTML = `<p>No daily forecast available.</p>`;
                }
            })
            .catch(error => {
                console.error("Error fetching daily forecast:", error);
                dailyForecastContainer.innerHTML = `<p>Error fetching daily forecast.</p>`;
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
                    hourlyForecastContainer.innerHTML = `<p>No hourly forecast available.</p>`;
                }
            })
            .catch(error => {
                console.error("Error fetching hourly forecast:", error);
                hourlyForecastContainer.innerHTML = `<p>Error fetching hourly forecast.</p>`;
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
        let forecastContent = '';
        forecasts.forEach(forecast => {
            const date = new Date(forecast.Date).toLocaleDateString();
            const minTemp = forecast.Temperature.Minimum.Value;
            const maxTemp = forecast.Temperature.Maximum.Value;
            const weatherIcon = forecast.Day.Icon;
            const weatherText = forecast.Day.IconPhrase;
            forecastContent += `
                <div class="forecast-item">
                    <p>${date}</p>
                    <p>Min: ${minTemp}°C, Max: ${maxTemp}°C</p>
                    <p>${weatherText}</p>
                    <img src="https://developer.accuweather.com/sites/default/files/${String(weatherIcon).padStart(2, '0')}-s.png" alt="${weatherText}">
                </div>
            `;
        });
        dailyForecastContainer.innerHTML = forecastContent;
    }

    function displayHourlyForecast(forecasts) {
        let forecastContent = '';
        forecasts.forEach(forecast => {
            const time = new Date(forecast.DateTime).toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'});
            const temperature = forecast.Temperature.Value;
            const weatherIcon = forecast.WeatherIcon;
            const weatherText = forecast.IconPhrase;
            forecastContent += `
                <div class="forecast-item">
                    <p>${time}</p>
                    <p>Temperature: ${temperature}°C</p>
                    <p>${weatherText}</p>
                    <img src="https://developer.accuweather.com/sites/default/files/${String(weatherIcon).padStart(2, '0')}-s.png" alt="${weatherText}">
                </div>
            `;
        });
        hourlyForecastContainer.innerHTML = forecastContent;
    }
});
