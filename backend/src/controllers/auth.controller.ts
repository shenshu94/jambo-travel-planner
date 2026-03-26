import { Request, Response } from 'express';
import { authService } from '../services/auth.service';

class AuthController {
  /**
   * Handles the user login request.
   * @param req 
   * @param res 
   * @returns A JSON response containing the access token and user information if the login is successful, or an error message if it fails.
   */
  login(req: Request, res: Response) {
    const { username, password } = req.body as {
      username?: string;
      password?: string;
    };

    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required' });
    }

    try {
      const result = authService.login(username, password);
      return res.json(result);
    } catch (error) {
      return res.status(401).json({
        message: error instanceof Error ? error.message : 'Authentication failed',
      });
    }
  }
}

export const authController = new AuthController();
