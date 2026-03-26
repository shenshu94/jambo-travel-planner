import { Router } from 'express';
import { cityController } from '../controllers/city.controller';
import { authenticate } from '../middleware/auth.middleware';

const cityRouter = Router();

cityRouter.get('/', authenticate, (req, res) => cityController.list(req, res));

export default cityRouter;
