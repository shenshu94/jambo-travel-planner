import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import { locationController } from '../controllers/location.controller';

const locationRouter = Router();

locationRouter.get('/current-city', authenticate, (req, res) =>
  locationController.getCurrentCity(req, res),
);

export default locationRouter;
