import request from 'supertest';
import app from '../src/app';
import { env } from '../src/config/env';

describe('Protected API flow', () => {
  it('logs in and uses the returned token to fetch cities', async () => {
    const loginResponse = await request(app).post('/api/auth/login').send({
      username: env.DEMO_USERNAME,
      password: env.DEMO_PASSWORD,
    });

    expect(loginResponse.status).toBe(200);
    expect(loginResponse.body.accessToken).toEqual(expect.any(String));

    const citiesResponse = await request(app)
      .get('/api/cities')
      .set('Authorization', `Bearer ${loginResponse.body.accessToken}`);

    expect(citiesResponse.status).toBe(200);
    expect(Array.isArray(citiesResponse.body)).toBe(true);
    expect(citiesResponse.body.length).toBeGreaterThan(0);
  });
});
