import { Request, Response } from 'express';
import { cities } from '../constants/cities';

class CityController {
  list(_req: Request, res: Response) {
    return res.json(cities);
  }
}

export const cityController = new CityController();
