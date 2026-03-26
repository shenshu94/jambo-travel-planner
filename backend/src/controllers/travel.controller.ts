import { Request, Response } from 'express';
import { travelService } from '../services/travel.service';

class TravelController {
  /**
   * Handles the request to fetch travel information for a specific city.
   * @param req 
   * @param res 
   * @returns A JSON response containing the travel information for the specified city.
   */
  async getCityTravelInfo(req: Request, res: Response) {
    const cityId = req.params.cityId;

    if (!cityId || Array.isArray(cityId)) {
      return res.status(404).json({ message: 'City not found' });
    }

    try {
      const result = await travelService.getCityTravelInfo(cityId);
      return res.json(result);
    } catch (error) {
      if (error instanceof Error && error.message === 'City not found') {
        return res.status(404).json({ message: error.message });
      }

      return res.status(500).json({ message: 'Unable to fetch travel info' });
    }
  }

  /**
   * Handles the request to fetch the weather forecast for a specific city on a given date.
   * @param req 
   * @param res 
   * @returns A JSON response containing the weather forecast for the specified city and date.
   */
  async getCityForecastByDate(req: Request, res: Response) {
    const cityId = req.params.cityId;
    const date = req.query.date;

    if (!cityId || Array.isArray(cityId)) {
      return res.status(404).json({ message: 'City not found' });
    }

    if (!date || Array.isArray(date) || typeof date !== 'string') {
      return res.status(400).json({ message: 'Date is required' });
    }

    try {
      const result = await travelService.getCityForecastByDate(cityId, date);
      return res.json(result);
    } catch (error) {
      if (error instanceof Error && error.message === 'City not found') {
        return res.status(404).json({ message: error.message });
      }

      if (
        error instanceof Error &&
        (
          error.message === 'Date is required' ||
          error.message === 'Date must be in YYYY-MM-DD format' ||
          error.message === 'Date must be between today and 5 days in the future'
        )
      ) {
        return res.status(400).json({ message: error.message });
      }

      return res.status(500).json({ message: 'Unable to fetch forecast' });
    }
  }
}

export const travelController = new TravelController();
