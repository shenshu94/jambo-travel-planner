import { Request, Response } from 'express';
import { locationService } from '../services/location.service';

class LocationController {
  /**
   * Handles the request to fetch the current city based on the client's IP address.
   * @param req 
   * @param res 
   * @returns A promise resolving to the current city.
   */
  async getCurrentCity(req: Request, res: Response) {
    const result = await locationService.getCurrentCity(req);
    return res.json(result);
  }
}

export const locationController = new LocationController();
