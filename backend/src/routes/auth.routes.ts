import { Router } from 'express';
import { authController } from '../controllers/auth.controller';

const authRouter = Router();

authRouter.post('/login', (req, res) => authController.login(req, res));

export default authRouter;
