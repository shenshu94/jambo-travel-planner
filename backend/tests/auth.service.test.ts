import { authService } from '../src/services/auth.service';
import { env } from '../src/config/env';

describe('AuthService', () => {
  describe('login', () => {
    it('returns an accessToken and user for valid demo credentials', () => {
      const result = authService.login(env.DEMO_USERNAME, env.DEMO_PASSWORD);

      expect(result.accessToken).toEqual(expect.any(String));
      expect(result.accessToken.length).toBeGreaterThan(0);
      expect(result.user).toEqual({ username: env.DEMO_USERNAME });
    });

    it('throws for an invalid username', () => {
      expect(() => authService.login('wrong-user', env.DEMO_PASSWORD)).toThrow(
        'Invalid credentials',
      );
    });

    it('throws for an invalid password', () => {
      expect(() => authService.login(env.DEMO_USERNAME, 'wrong-password')).toThrow(
        'Invalid credentials',
      );
    });
  });
});
