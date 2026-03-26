import { env } from '../config/env';
import { signToken } from '../utils/jwt';

class AuthService {
  /**
   * Performs a login operation by validating the provided username and password against the demo credentials.
   * @param username 
   * @param password 
   * @returns An object containing an access token and user information if the credentials are valid.
   */
  login(username: string, password: string) {
    if (username !== env.DEMO_USERNAME || password !== env.DEMO_PASSWORD) {
      throw new Error('Invalid credentials');
    }

    return {
      accessToken: signToken({ username }),
      user: { username },
    };
  }
}

export const authService = new AuthService();
