import { Request } from 'express';
import { geolocationClient } from '../src/clients/geolocation.client';
import { locationService } from '../src/services/location.service';

jest.mock('../src/clients/geolocation.client', () => ({
  geolocationClient: {
    lookupCity: jest.fn(),
  },
}));

const mockedGeolocationClient = geolocationClient as jest.Mocked<typeof geolocationClient>;

describe('LocationService', () => {
  const req = {
    headers: {},
    ip: '127.0.0.1',
  } as Request;

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('uses the detected city when it matches a supported city', async () => {
    mockedGeolocationClient.lookupCity.mockResolvedValue('Tokyo');

    const result = await locationService.getCurrentCity(req);

    expect(result).toEqual({
      detectedCity: 'Tokyo',
      matchedCityId: 'tokyo',
      source: 'ip-geolocation',
    });
  });

  it('falls back to the default supported city when the detected city is unsupported', async () => {
    mockedGeolocationClient.lookupCity.mockResolvedValue('Calgary');

    const result = await locationService.getCurrentCity(req);

    expect(result).toEqual({
      detectedCity: 'Calgary',
      matchedCityId: 'edmonton',
      source: 'ip-geolocation',
    });
  });

  it('falls back to the default supported city when the geolocation client fails', async () => {
    mockedGeolocationClient.lookupCity.mockRejectedValue(new Error('Geolocation unavailable'));

    const result = await locationService.getCurrentCity(req);

    expect(result).toEqual({
      detectedCity: 'Edmonton',
      matchedCityId: 'edmonton',
      source: 'ip-geolocation',
    });
  });
});
