'use client';

import { useState } from 'react';
import axios from 'axios';

interface WeatherData {
  current: any;
  forecast: any;
}

export default function Home() {
  const [city, setCity] = useState('');
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchWeather = async () => {
    setLoading(true);
    setError(null);
    setWeatherData(null);

    try {
      const response = await axios.get<WeatherData>(`/api/weather?city=${city}`);
      setWeatherData(response.data);
      console.log('Weather Data:', response.data); // Add this line for debugging
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error fetching weather data');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCity(e.target.value);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      fetchWeather();
    }
  };

  const getWeatherBackgroundClass = (weatherCondition: string) => {
    const condition = weatherCondition.toLowerCase();
    if (condition.includes('clear')) return 'bg-clear';
    if (condition.includes('cloud')) return 'bg-cloudy';
    if (condition.includes('rain')) return 'bg-rainy';
    if (condition.includes('storm')) return 'bg-stormy';
    if (condition.includes('snow')) return 'bg-snowy';
    if (condition.includes('mist') || condition.includes('fog')) return 'bg-misty';
    return 'bg-default';
  };

  const backgroundClass = weatherData?.current?.weather?.[0]?.main
    ? getWeatherBackgroundClass(weatherData.current.weather[0].main)
    : 'bg-default';

  return (
    <div className={`min-h-screen flex flex-col items-center justify-center p-4 ${backgroundClass} bg-cover bg-center transition-all duration-500`} >
      <div className="bg-white bg-opacity-80 p-8 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold mb-4 text-center">Weather App</h1>
        <div className="flex mb-4">
          <input
            type="text"
            placeholder="Enter city"
            className="border p-2 rounded-l-md focus:outline-none"
            value={city}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
          />
          <button
            onClick={fetchWeather}
            className="bg-blue-500 text-white p-2 rounded-r-md hover:bg-blue-600 focus:outline-none"
          >
            Search
          </button>
        </div>

        {loading && <p className="text-center">Loading...</p>}
        {error && <p className="text-center text-red-500">{error}</p>}

        {weatherData && (
          <div className="mt-4">
            <h2 className="text-2xl font-semibold mb-2">{weatherData.current.name}</h2>
            <p>Current Temperature: {weatherData.current.main.temp}°C</p>
            <p>Condition: {weatherData.current.weather[0].description}</p>

            <h3 className="text-xl font-semibold mt-4 mb-2">Forecast (3-hour intervals)</h3>
            <div>
              {weatherData.forecast.list.map((item: any) => (
                <div key={item.dt} className="border-t pt-2 mt-2">
                  <p>Date: {new Date(item.dt * 1000).toLocaleString()}</p>
                  <p>Temp: {item.main.temp}°C</p>
                  <p>Condition: {item.weather[0].description}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
