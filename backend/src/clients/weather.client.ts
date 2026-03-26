import axios from 'axios';
import { env } from '../config/env';
import { City } from '../constants/cities';

// Type definition for the current weather response from the OpenWeather API
type OpenWeatherCurrentResponse = {
  main: {
    temp: number;
    humidity: number;
  };
  wind: {
    speed: number;
  };
  weather: Array<{
    description: string;
  }>;
};

// Type definition for the forecast response from the OpenWeather API
type OpenWeatherForecastResponse = {
  list: Array<{
    dt_txt: string;
    main: {
      temp_min: number;
      temp_max: number;
    };
    weather: Array<{
      description: string;
    }>;
  }>;
};

class WeatherClient {
  /**
   * Fetches the current weather information for a given city from the OpenWeather API.
   * @param city 
   * @returns A promise resolving to the current weather information for the city.
   * @throws An error if the weather information cannot be retrieved.
   */
  async getCurrentWeather(city: City): Promise<OpenWeatherCurrentResponse> {
    if (!env.WEATHER_API_KEY) {
      throw new Error('Missing weather API key');
    }

    const response = await axios.get<OpenWeatherCurrentResponse>(
      'https://api.openweathermap.org/data/2.5/weather',
      {
        params: {
          appid: env.WEATHER_API_KEY,
          lat: city.lat,
          lon: city.lon,
          units: 'metric',
        },
      },
    );

    return response.data;
  }

  /**
   * Fetches the weather forecast for a given city from the OpenWeather API.
   * @param city 
   * @returns A promise resolving to the weather forecast for the city.
   * @throws An error if the forecast cannot be retrieved.
   */
  async getForecast(city: City): Promise<OpenWeatherForecastResponse> {
    if (!env.WEATHER_API_KEY) {
      throw new Error('Missing weather API key');
    }

    const response = await axios.get<OpenWeatherForecastResponse>(
      'https://api.openweathermap.org/data/2.5/forecast',
      {
        params: {
          appid: env.WEATHER_API_KEY,
          lat: city.lat,
          lon: city.lon,
          units: 'metric',
        },
      },
    );

    return response.data;
  }
}

export const weatherClient = new WeatherClient();
