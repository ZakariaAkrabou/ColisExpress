import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';

export class AuthController {
  static async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        res.status(400).json({ message: 'Email and password are required' });
        return;
      }
      const result = await AuthService.login(email, password);

      res.status(200).json({
        message: 'Login successful',
        ...result
      });
    } catch (error: any) {
     
      if (error.message === 'Invalid credentials' || error.message === 'Account is disabled') {
        res.status(401).json({ message: error.message });
        return;
      }
      console.error('Login Error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
}