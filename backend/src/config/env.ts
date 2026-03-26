import dotenv from 'dotenv';

dotenv.config();

export const env = {
  PORT: process.env.PORT || '3001',
  JWT_SECRET: process.env.JWT_SECRET || 'default_secret',
  DEMO_USERNAME: process.env.DEMO_USERNAME || 'demo',
  DEMO_PASSWORD: process.env.DEMO_PASSWORD || 'demo123',
  WEATHER_API_KEY: process.env.WEATHER_API_KEY || '',
};
