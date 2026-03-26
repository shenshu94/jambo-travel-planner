import axios from 'axios';
import { City } from '../constants/cities';

type WikiSummaryResponse = {
  extract?: string;
  description?: string;
};

class WikiClient {
  /**
   * Fetches a summary description for a given city from the Wikipedia API.
   * @param city 
   * @returns A promise resolving to the summary description of the city.
   * @throws An error if the summary cannot be retrieved.
   */
  async getCitySummary(city: City): Promise<string> {
    const title = encodeURIComponent(city.name.replace(/\s+/g, '_'));
    const response = await axios.get<WikiSummaryResponse>(
      `https://en.wikipedia.org/api/rest_v1/page/summary/${title}`,
      {
        headers: {
          'User-Agent': 'JamboTravelPlanner/1.0',
        },
      },
    );

    const summary = response.data.extract || response.data.description;

    if (!summary) {
      throw new Error('Missing wiki summary');
    }

    return summary;
  }
}

export const wikiClient = new WikiClient();
