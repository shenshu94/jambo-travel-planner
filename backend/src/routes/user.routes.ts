import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';

const userRouter = Router();

userRouter.get('/me', authenticate, (req, res) => {
  res.json({
    user: req.user,
  });
});

export default userRouter;
