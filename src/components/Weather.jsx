import { useCallback, useEffect, useState } from "react";
import "./Weather.css";

const API_KEY = import.meta.env.VITE_WEATHER_APP_ID;
const BASE_URL = "https://api.openweathermap.org/data/2.5";

function Weather() {
  const [query, setQuery] = useState("Ottawa");
  const [weather, setWeather] = useState(null);
  const [unit, setUnit] = useState("metric");
  const [lastSearch, setLastSearch] = useState("Ottawa");
  const [loading, setLoading] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);
  const [error, setError] = useState("");

  const unitSymbol = unit === "metric" ? "C" : "F";
  const windUnit = unit === "metric" ? "m/s" : "mph";

  const getErrorMessage = (status) => {
    if (status === 401) {
      return "Your weather API key is invalid or has not been activated yet.";
    }

    if (status === 404) {
      return "City not found. Check the spelling and try again.";
    }

    if (status === 429) {
      return "Too many requests. Please wait a moment and try again.";
    }

    return "Unable to load weather data. Please try again.";
  };

  const requestWeather = useCallback(
    async (url, cityName = "") => {
      if (!API_KEY) {
        setError("Weather API key is missing. Check your .env file.");
        return;
      }

      setLoading(true);
      setError("");

      try {
        const response = await fetch(url);

        if (!response.ok) {
          throw new Error(getErrorMessage(response.status));
        }

        const data = await response.json();

        setWeather(data);

        if (cityName) {
          setLastSearch(cityName);
        } else {
          setLastSearch(data.name);
        }
      } catch (err) {
        setError(err.message || "Something went wrong while loading weather.");
      } finally {
        setLoading(false);
        setLocationLoading(false);
      }
    },
    [unit]
  );

  const fetchWeatherByCity = useCallback(
    (city) => {
      const trimmedCity = city.trim();

      if (!trimmedCity) {
        setError("Enter a city name before searching.");
        return;
      }

      const url =
        `${BASE_URL}/weather?q=${encodeURIComponent(trimmedCity)}` +
        `&appid=${API_KEY}&units=${unit}`;

      requestWeather(url, trimmedCity);
    },
    [requestWeather, unit]
  );

  const fetchWeatherByCoordinates = useCallback(
    (latitude, longitude) => {
      const url =
        `${BASE_URL}/weather?lat=${latitude}&lon=${longitude}` +
        `&appid=${API_KEY}&units=${unit}`;

      requestWeather(url);
    },
    [requestWeather, unit]
  );

  useEffect(() => {
    fetchWeatherByCity("Ottawa");
  }, []);

  useEffect(() => {
    if (weather && lastSearch) {
      fetchWeatherByCity(lastSearch);
    }
  }, [unit]);

  const handleSubmit = (event) => {
    event.preventDefault();
    fetchWeatherByCity(query);
  };

  const handleUseLocation = () => {
    if (!navigator.geolocation) {
      setError("Your browser does not support location services.");
      return;
    }

    setLocationLoading(true);
    setError("");

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        fetchWeatherByCoordinates(latitude, longitude);
      },
      () => {
        setLocationLoading(false);
        setError("Location access was not allowed. Search for a city instead.");
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000,
      }
    );
  };

  const formatTemperature = (value) => `${Math.round(value)}°${unitSymbol}`;

  const formatTime = (unixTimestamp, timezoneOffset) => {
    const date = new Date((unixTimestamp + timezoneOffset) * 1000);

    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "UTC",
    });
  };

  const getLocalDate = (timezoneOffset) => {
    const localDate = new Date(Date.now() + timezoneOffset * 1000);

    return localDate.toLocaleDateString(undefined, {
      weekday: "long",
      month: "long",
      day: "numeric",
      timeZone: "UTC",
    });
  };

  return (
    <div className="weather-wrapper">
      <section className="weather-hero">
        <p className="eyebrow">Real-time conditions worldwide</p>
        <p className="hero-copy">
          Search any city or use your current location to view the latest weather conditions.
        </p>
      </section>

      <section className="search-section card">
        <form onSubmit={handleSubmit} className="search-form">
          <label className="sr-only" htmlFor="city-search">
            Search for a city
          </label>

          <input
            id="city-search"
            type="text"
            placeholder="Search a city, e.g. Ottawa, London, Tokyo"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />

          <button type="submit" disabled={loading}>
            {loading ? "Searching…" : "Search"}
          </button>

          <button
            type="button"
            className="location-button"
            onClick={handleUseLocation}
            disabled={loading || locationLoading}
          >
            {locationLoading ? "Finding…" : "Use my location"}
          </button>
        </form>
      </section>

      {loading && (
        <section className="loading-section card" aria-live="polite">
          <div className="loader" />
          <p>Loading current weather…</p>
        </section>
      )}

      {error && !loading && (
        <section className="error-section card" role="alert">
          <p className="error-title">Unable to load weather</p>
          <p className="error-text">{error}</p>
        </section>
      )}

      {weather && !loading && !error && (
        <>
          <div className="weather-toolbar">
            <p className="updated-text">Current conditions</p>

            <div className="unit-toggle" aria-label="Temperature unit">
              <button
                type="button"
                className={unit === "metric" ? "active" : ""}
                onClick={() => setUnit("metric")}
                aria-pressed={unit === "metric"}
              >
                °C
              </button>

              <button
                type="button"
                className={unit === "imperial" ? "active" : ""}
                onClick={() => setUnit("imperial")}
                aria-pressed={unit === "imperial"}
              >
                °F
              </button>
            </div>
          </div>

          <section className="weather-section card">
            <div className="weather-top">
              <div className="location-info">
                <p className="location-label">Location</p>
                <h2 className="city-name">
                  {weather.name}
                  {weather.sys?.country ? `, ${weather.sys.country}` : ""}
                </h2>
                <p className="weather-date">{getLocalDate(weather.timezone)}</p>
              </div>

              <div className="condition-summary">
                <img
                  src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@4x.png`}
                  alt={weather.weather[0].description}
                  className="weather-icon-large"
                />
                <p className="weather-description">{weather.weather[0].description}</p>
              </div>
            </div>

            <div className="temperature-section">
              <div className="temp-block">
                <span className="temp-value">{Math.round(weather.main.temp)}</span>
                <span className="temp-unit">°{unitSymbol}</span>
              </div>

              <p className="feels-like">
                Feels like <strong>{formatTemperature(weather.main.feels_like)}</strong>
              </p>
            </div>

            <div className="weather-details">
              <DetailItem label="Humidity" value={`${weather.main.humidity}%`} />
              <DetailItem label="Wind speed" value={`${Math.round(weather.wind.speed)} ${windUnit}`} />
              <DetailItem label="Pressure" value={`${weather.main.pressure} hPa`} />
              <DetailItem
                label="Visibility"
                value={
                  weather.visibility
                    ? `${(weather.visibility / 1000).toFixed(1)} km`
                    : "Not available"
                }
              />
              <DetailItem
                label="Sunrise"
                value={weather.sys?.sunrise ? formatTime(weather.sys.sunrise, weather.timezone) : "N/A"}
              />
              <DetailItem
                label="Sunset"
                value={weather.sys?.sunset ? formatTime(weather.sys.sunset, weather.timezone) : "N/A"}
              />
            </div>
          </section>
        </>
      )}
    </div>
  );
}

function DetailItem({ label, value }) {
  return (
    <div className="detail-item">
      <span className="detail-label">{label}</span>
      <span className="detail-value">{value}</span>
    </div>
  );
}

export default Weather;