import express from 'express';
import cors from 'cors';
import authRouter from './routes/auth.routes';
import userRouter from './routes/user.routes';
import cityRouter from './routes/city.routes';
import travelRouter from './routes/travel.routes';
import locationRouter from './routes/location.routes';

const app = express();

app.use(cors());
app.use(express.json());
app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);
app.use('/api/cities', cityRouter);
app.use('/api/travel', travelRouter);
app.use('/api/location', locationRouter);

app.get('/health', (_req, res) => {
  res.json({ ok: true, message: 'Backend is running' });
});

export default app;
