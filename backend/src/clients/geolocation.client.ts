import axios from 'axios';

// Type definition for the geolocation response from the ipwho API
type GeolocationResponse = {
  city?: string;
};

class GeolocationClient {
  /**
   * Looks up the city for a given IP address.
   * @param ip 
   * @returns A promise resolving to the city name.
   * @throws An error if the city cannot be found.
   */
  async lookupCity(ip: string): Promise<string> {
    const response = await axios.get<GeolocationResponse>(`https://ipwho.org/ip/${ip}`);
    const city = response.data.city?.trim();

    if (!city) {
      throw new Error('City not found from geolocation');
    }

    return city;
  }
}

export const geolocationClient = new GeolocationClient();
