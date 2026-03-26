import { travelService } from '../src/services/travel.service';
import { weatherClient } from '../src/clients/weather.client';
import { wikiClient } from '../src/clients/wiki.client';

jest.mock('../src/clients/weather.client', () => ({
  weatherClient: {
    getCurrentWeather: jest.fn(),
    getForecast: jest.fn(),
  },
}));

jest.mock('../src/clients/wiki.client', () => ({
  wikiClient: {
    getCitySummary: jest.fn(),
  },
}));

const mockedWeatherClient = weatherClient as jest.Mocked<typeof weatherClient>;
const mockedWikiClient = wikiClient as jest.Mocked<typeof wikiClient>;

describe('TravelService', () => {
  beforeEach(() => {
    jest.resetAllMocks();

    mockedWikiClient.getCitySummary.mockResolvedValue('A city summary from Wikipedia.');
    mockedWeatherClient.getCurrentWeather.mockResolvedValue({
      main: { temp: 18, humidity: 55 },
      wind: { speed: 5 },
      weather: [{ description: 'clear sky' }],
    });
    mockedWeatherClient.getForecast.mockResolvedValue({
      list: [
        {
          dt_txt: '2026-03-24 12:00:00',
          main: { temp_min: 10, temp_max: 18 },
          weather: [{ description: 'sunny' }],
        },
        {
          dt_txt: '2026-03-25 12:00:00',
          main: { temp_min: 11, temp_max: 19 },
          weather: [{ description: 'cloudy' }],
        },
      ],
    });
  });

  it('returns the expected response shape for a valid city id', async () => {
    const result = await travelService.getCityTravelInfo('edmonton');

    expect(result).toEqual({
      city: {
        id: 'edmonton',
        name: 'Edmonton',
        country: 'Canada',
        description: 'A city summary from Wikipedia.',
      },
      weather: {
        current: {
          temperatureC: 18,
          condition: 'clear sky',
          windKph: 18,
          humidity: 55,
        },
        weekly: [
          { date: '2026-03-24', minC: 10, maxC: 18, condition: 'sunny' },
          { date: '2026-03-25', minC: 11, maxC: 19, condition: 'cloudy' },
        ],
      },
    });
  });

  it('throws "City not found" for an unknown city id', async () => {
    await expect(travelService.getCityTravelInfo('unknown-city')).rejects.toThrow('City not found');
  });

  it('falls back to the default description if the wiki client fails', async () => {
    mockedWikiClient.getCitySummary.mockRejectedValue(new Error('Wiki unavailable'));

    const result = await travelService.getCityTravelInfo('toronto');

    expect(result.city.description).toBe(
      'Toronto is a great destination for travelers looking to explore Canada.',
    );
  });

  it('falls back to mock weather data if the weather client fails', async () => {
    mockedWeatherClient.getCurrentWeather.mockRejectedValue(new Error('Weather unavailable'));

    const result = await travelService.getCityTravelInfo('paris');

    expect(result.weather).toEqual({
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
    });
  });
});
