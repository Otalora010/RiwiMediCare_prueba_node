import { Request, Response } from 'express';
import { Role } from '../models/User';
import { userService } from '../services/user.service';

export class UserController {
  static async list(req: Request, res: Response): Promise<void> {
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 10));
    const result = await userService.list(page, limit);
    res.status(200).json({ success: true, ...result });
  }

  static async updateRole(req: Request, res: Response): Promise<void> {
    const id = String(req.params.id);
    const { role } = req.body as { role: Role };
    const user = await userService.updateRole(id, role, req.auth!.id);
    res.status(200).json({ success: true, data: user });
  }

  static async delete(req: Request, res: Response): Promise<void> {
    const id = String(req.params.id);
    await userService.delete(id, req.auth!.id);
    res.status(204).send();
  }
}
