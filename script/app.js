const cityInput = document.querySelector("#city-input");
const searchButton = document.querySelector("#search-btn");
const currentWeatherDiv = document.querySelector("#current-weather");
const weatherCardsDiv = document.querySelector("#w-cards");

const API_key = "88fa27564919625a365a7e325e37a9b5";

const createWeatherCard = (cityName, weatherItem, index) => {
    if(index === 0){
        // html for main weather card
        return `<div class="details">
                        <h2>${cityName} (${weatherItem.dt_txt.split(" ")[0]})</h2>
                        <h4>Temperature : ${(weatherItem.main.temp - 273.15).toFixed(2)}°C</h4>
                        <h4>Wind : ${weatherItem.wind.speed} M/S</h4>
                        <h4>Humidity : ${weatherItem.main.humidity}%</h4>
                    </div>
                    <div class="icon">
                        <img src="http://openweathermap.org/img/wn/${weatherItem.weather[0].icon}@4x.png" alt="weather-icon">
                        <h6>${weatherItem.weather[0].description}</h6>
                    </div>`;

    } else {
        // html for orther cards
        return `<li class="cards">
                            <h2>(${weatherItem.dt_txt.split(" ")[0]})</h2>
                            <img src="http://openweathermap.org/img/wn/${weatherItem.weather[0].icon}@2x.png" alt="weather-icon">
                            <h4>Temp: ${(weatherItem.main.temp - 273.15).toFixed(2)}°C</h4>
                            <h4>Wind: ${weatherItem.wind.speed} M/S</h4>
                            <h4>Humidity : ${weatherItem.main.humidity}%</h4>
                        </li>`;

    }
    
}

const getWeatherDetails = (cityName,lat,lon) => {
    const WEATHER_API_URL = `http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_key}`;

    fetch(WEATHER_API_URL).then(res => res.json()).then(data => {

        // it filters the data to get one forecast per day
        const uniqueForecastDays = [];
        const fiveDaysForecast = data.list.filter(forecast => {
            const forecastDate = new Date(forecast.dt_txt).getDate();
            if(!uniqueForecastDays.includes(forecastDate)) {
                return uniqueForecastDays.push(forecastDate)
            }

        });

        // clears the previous data
        cityInput.value = " ";
        weatherCardsDiv.innerHTML = " ";
        currentWeatherDiv.innerHTML = " ";

        // creating weather cards and adding them to the DOM
        console.log(fiveDaysForecast);
        fiveDaysForecast.forEach((weatherItem, index) => {
            if(index === 0){
                currentWeatherDiv.insertAdjacentHTML("beforeend", createWeatherCard(cityName,weatherItem,index));
            } else{
                weatherCardsDiv.insertAdjacentHTML("beforeend", createWeatherCard(cityName,weatherItem,index));
            }
    
        });
    }).catch(() => {
        alert("An error occurred during the fetching of weather forecast data");

    });
}

const getCitycoordinates = () => {
    const cityName = cityInput.value.trim(); //it will remove extra space
    if(!cityName) return; //return if city name is empty
    const GEOCODING_API_URL = `http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${API_key}`;

    // gets the city from the api calls
    fetch(GEOCODING_API_URL).then(res => res.json()).then(data => {
        if(!data.length) return alert(`no city found for ${cityName}`);
        const { name, lat, lon} = data[0];
        getWeatherDetails(name,lat,lon);
    }).catch(() => {
        alert("An error occurred during the fetching of data");

    });

}

searchButton.addEventListener("click", getCitycoordinates);