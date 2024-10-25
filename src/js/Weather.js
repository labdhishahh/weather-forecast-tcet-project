import { useState } from "react";
import axios from "axios";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { faLocationDot } from "@fortawesome/free-solid-svg-icons";
import { SpinnerCircular } from "spinners-react";

import WeatherData from "./WeatherData";
import WeatherForecast from "./WeatherForecast";

import "../css/Weather.css";

export default function Weather(props) {
  const [weatherData, setWeatherData] = useState({ loaded: false });
  const [city, setCity] = useState(props.defaultCity);

  const apiKey = process.env.REACT_APP_API_KEY;

  // Set weather data fetched from API call
  function getWeatherData(response) {
    setWeatherData({
      loaded: true,
      temperature: Math.round(response.data.main.temp),
      icon: response.data.weather[0].icon,
      description: response.data.weather[0].description,
      humidity: Math.round(response.data.main.humidity),
      wind: Math.round(response.data.wind.speed),
      city: response.data.name,
      date: new Date(response.data.dt * 1000),
      coords: response.data.coord,
    });
  }

  // Search city
  function searchCity() {
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;
    axios.get(apiUrl).then(getWeatherData);
  }

  // Search city when search button is clicked (form submitted)
  function handleSubmit(event) {
    event.preventDefault();
    searchCity(city);
  }

  // Get city name typed in input field
  function handleChange(event) {
    setCity(event.target.value);
  }

  // Search city using coordinates
  function searchLocation(position) {
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${position.coords.latitude}&lon=${position.coords.longitude}&units=metric&appid=${apiKey}`;
    axios.get(apiUrl).then(getWeatherData);
  }

  // Get current coordinates
  function getCurrentLocation(event) {
    event.preventDefault();
    navigator.geolocation.getCurrentPosition(searchLocation);
  }

  if (weatherData.loaded) {
    return (
      <div>
        <form className="search row" onSubmit={handleSubmit}>
          <input
            type="search"
            className="col-12 col-lg-8 form-control search-input "
            placeholder="Enter a city..."
            onChange={handleChange}
          />
          <div className="col-12 col-lg-4 search-buttons">
            <button type="submit" className="btn col-6 col-lg-2 search-button">
              <FontAwesomeIcon icon={faMagnifyingGlass} size="lg" />
            </button>
            <button
              type="submit"
              className="btn col-6 col-lg-2 current-position-button"
              onClick={getCurrentLocation}
            >
              <FontAwesomeIcon icon={faLocationDot} size="lg" />
            </button>
          </div>
        </form>
        <WeatherData data={weatherData} />
        <WeatherForecast coords={weatherData.coords} />
      </div>
    );
  } else {
    searchCity();
    return (
      <div className="spinner">
        <SpinnerCircular color="#3a438b" />
      </div>
    );
  }
}
