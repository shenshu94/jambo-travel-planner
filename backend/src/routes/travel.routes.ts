import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import { travelController } from '../controllers/travel.controller';

const travelRouter = Router();

travelRouter.get('/cities/:cityId/forecast', authenticate, (req, res) =>
  travelController.getCityForecastByDate(req, res),
);

travelRouter.get('/cities/:cityId', authenticate, (req, res) =>
  travelController.getCityTravelInfo(req, res),
);

export default travelRouter;
