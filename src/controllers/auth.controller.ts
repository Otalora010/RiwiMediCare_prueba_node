import { Request, Response } from 'express';
import { LoginDto, RegisterDto } from '../dto/auth.dto';
import { authService } from '../services/auth.service';

// Controller responsible for handling authentication-related HTTP requests.
export class AuthController {
  // Registers a new user and returns the created session.
  static async register(req: Request, res: Response): Promise<void> {
    const session = await authService.register(req.body as RegisterDto);
    res.status(201).json({ success: true, data: session });
  }

  // Authenticates a user and returns the created session.
  static async login(req: Request, res: Response): Promise<void> {
    const session = await authService.login(req.body as LoginDto);
    res.status(200).json({ success: true, data: session });
  }

  // Retrieves the information of the currently authenticated user.
  static async me(req: Request, res: Response): Promise<void> {
    const user = await authService.me(req.auth!.id);
    res.status(200).json({ success: true, data: user });
  }
}