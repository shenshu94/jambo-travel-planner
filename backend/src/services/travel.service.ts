import { weatherClient } from '../clients/weather.client';
import { wikiClient } from '../clients/wiki.client';
import { City, cities } from '../constants/cities';

// Type definition for the travel weather information returned by the API
type TravelWeather = {
  current: {
    temperatureC: number;
    condition: string;
    windKph: number;
    humidity: number;
  };
  weekly: Array<{
    date: string;
    minC: number;
    maxC: number;
    condition: string;
  }>;
};

// Type definition for the response shape of the travel information API
type DailyForecast = {
  date: string;
  minC: number;
  maxC: number;
  condition: string;
};

class TravelService {
  /**
   * Retrieves travel information for a specific city.
   * @param cityId 
   * @returns A promise resolving to the travel information for the specified city.
   */
  async getCityTravelInfo(cityId: string) {
    const city = cities.find((item) => item.id === cityId);

    if (!city) {
      throw new Error('City not found');
    }

    // Fetch the city description and weather information in parallel, with fallbacks for each
    const description = await this.getDescriptionWithFallback(city);
    const weather = await this.getWeatherWithFallback(city);

    return {
      city: {
        id: city.id,
        name: city.name,
        country: city.country,
        description,
      },
      weather,
    };
  }

  /**
   * Fetches the weather forecast for a specific city on a given date
   * @param cityId 
   * @param date 
   * @returns A promise resolving to the forecast information for the specified city and date.
   */
  async getCityForecastByDate(cityId: string, date: string) {
    const city = cities.find((item) => item.id === cityId);

    if (!city) {
      throw new Error('City not found');
    }

    this.validateForecastDate(date);

    try {
      const dailyForecasts = await this.getDailyForecasts(city);
      const matchedForecast = dailyForecasts.find((item) => item.date === date);

      return {
        date,
        forecast: matchedForecast || this.getFallbackForecastForDate(date),
      };
    } catch {
      return {
        date,
        forecast: this.getFallbackForecastForDate(date),
      };
    }
  }

  /**
   * Helper method to fetch the city description with a fallback in case of failure.
   * @param city 
   * @returns A promise resolving to the city description or a fallback description.
   */
  private async getDescriptionWithFallback(city: City): Promise<string> {
    try {
      return await wikiClient.getCitySummary(city);
    } catch {
      return this.getFallbackDescription(city);
    }
  }

  /**
   * Helper method to fetch the weather information with a fallback in case of failure.
   * @param city 
   * @returns A promise resolving to the weather information or a fallback weather response.
   */
  private async getWeatherWithFallback(city: City): Promise<TravelWeather> {
    try {
      const [current, forecast] = await Promise.all([
        weatherClient.getCurrentWeather(city),
        weatherClient.getForecast(city),
      ]);

      return {
        current: {
          temperatureC: current.main.temp,
          condition: current.weather[0]?.description || 'Unknown',
          windKph: current.wind.speed * 3.6,
          humidity: current.main.humidity,
        },
        weekly: this.aggregateDailyForecasts(forecast.list).slice(0, 5),
      };
    } catch {
      return this.getFallbackWeather();
    }
  }

  /**
   * Helper method to fetch and aggregate daily forecasts for a city.
   * @param city 
   * @returns A promise resolving to an array of daily forecast objects.
   */
  private async getDailyForecasts(city: City): Promise<DailyForecast[]> {
    const forecast = await weatherClient.getForecast(city);
    return this.aggregateDailyForecasts(forecast.list);
  }

  /**
   * Helper method to aggregate 3-hourly forecast data into daily forecasts.
   * @param forecastItems 
   * @returns An array of daily forecast objects.
   */
  private aggregateDailyForecasts(
    forecastItems: Array<{
      dt_txt: string;
      main: {
        temp_min: number;
        temp_max: number;
      };
      weather: Array<{
        description: string;
      }>;
    }>,
  ): DailyForecast[] {
    const weeklyMap = new Map<string, DailyForecast>();

    // Iterate through each 3-hourly forecast item and aggregate it into daily forecasts
    for (const item of forecastItems) {
      const date = item.dt_txt.split(' ')[0];
      const existing = weeklyMap.get(date);
      const condition = item.weather[0]?.description || 'Unknown';

      if (!existing) {
        weeklyMap.set(date, {
          date,
          minC: item.main.temp_min,
          maxC: item.main.temp_max,
          condition,
        });
        continue;
      }

      existing.minC = Math.min(existing.minC, item.main.temp_min);
      existing.maxC = Math.max(existing.maxC, item.main.temp_max);
    }

    return Array.from(weeklyMap.values());
  }

  /**
   * Helper method to validate the requested forecast date and ensure it is within the allowed range
   * @param date 
   * @throws An error if the date is invalid or out of range.
   */
  private validateForecastDate(date: string): void {
    if (!date) {
      throw new Error('Date is required');
    }

    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      throw new Error('Date must be in YYYY-MM-DD format');
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const maxDate = new Date(today);
    maxDate.setDate(maxDate.getDate() + 5);

    const requestedDate = new Date(`${date}T00:00:00`);

    if (Number.isNaN(requestedDate.getTime()) || requestedDate < today || requestedDate > maxDate) {
      throw new Error('Date must be between today and 5 days in the future');
    }
  }

  // Helper method to return a fallback weather response in case the weather client fails
  private getFallbackWeather(): TravelWeather {
    return {
      current: {
        temperatureC: 21,
        condition: 'Partly cloudy',
        windKph: 14,
        humidity: 58,
      },
      weekly: [
        { date: '2026-03-23', minC: 12, maxC: 21, condition: 'Sunny' },
        { date: '2026-03-24', minC: 11, maxC: 19, condition: 'Cloudy' },
        { date: '2026-03-25', minC: 10, maxC: 18, condition: 'Light rain' },
        { date: '2026-03-26', minC: 13, maxC: 22, condition: 'Partly cloudy' },
        { date: '2026-03-27', minC: 14, maxC: 23, condition: 'Sunny' },
      ],
    };
  }

  // Helper method to return a fallback forecast for a specific date in case the weather client fails
  private getFallbackForecastForDate(date: string): DailyForecast {
    return {
      date,
      minC: 12,
      maxC: 21,
      condition: 'Partly cloudy',
    };
  }

  // Helper method to return a fallback description for a city in case the wiki client fails
  private getFallbackDescription(city: City): string {
    return `${city.name} is a great destination for travelers looking to explore ${city.country}.`;
  }
}

export const travelService = new TravelService();
