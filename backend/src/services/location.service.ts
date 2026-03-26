import { Request } from 'express';
import { geolocationClient } from '../clients/geolocation.client';
import { cities } from '../constants/cities';

const DEFAULT_CITY_ID = 'edmonton';

class LocationService {
  /**
   * Fetches the current city based on the client's IP address.
   * @param req 
   * @returns A promise resolving to the current city.
   */
  async getCurrentCity(req: Request) {
    try {
      const ip = this.getRequestIp(req);
      const detectedCity = await geolocationClient.lookupCity(ip);
      const matchedCity = this.matchSupportedCity(detectedCity);

      return {
        detectedCity,
        matchedCityId: matchedCity.id,
        source: 'ip-geolocation',
      };
    } catch {
      const fallbackCity = this.getDefaultCity();

      return {
        detectedCity: fallbackCity.name,
        matchedCityId: fallbackCity.id,
        source: 'ip-geolocation',
      };
    }
  }

  /**
   * Extracts the client's IP address from the request, accounting for proxies and load balancers.
   * @param req 
   * @returns The client's IP address.
   */
  private getRequestIp(req: Request): string {
    const forwarded = req.headers['x-forwarded-for'];
    const forwardedIp = Array.isArray(forwarded) ? forwarded[0] : forwarded?.split(',')[0];
    const rawIp = forwardedIp?.trim() || req.ip || '';

    return rawIp.replace('::ffff:', '');
  }

  /**
   * Matches the detected city name against the list of supported cities
   * @param detectedCity 
   * @returns The matched city or the default city if no match is found.
   */
  private matchSupportedCity(detectedCity: string) {
    const normalized = detectedCity.trim().toLowerCase();

    return cities.find((city) => city.name.toLowerCase() === normalized) || this.getDefaultCity();
  }

  /**
   * Returns a default city to use as a fallback when geolocation fails or the detected city is not supported.
   * @returns The default city object from the list of supported cities.
   */
  private getDefaultCity() {
    return cities.find((city) => city.id === DEFAULT_CITY_ID) || cities[0];
  }
}

export const locationService = new LocationService();
