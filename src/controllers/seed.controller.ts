/**
 * Seed controller.
 * Handles bulk data upload via file.
 */
import { Request, Response } from 'express';
import { AppError } from '../errors/AppError';
import { seedService } from '../services/seed.service';

export class SeedController {
  static async upload(req: Request, res: Response): Promise<void> {
    if (!req.file) {
      throw new AppError(400, 'Debes enviar un archivo JSON en el campo "file"', 'VALIDATION_ERROR');
    }
    if (!req.file.originalname.endsWith('.json')) {
      throw new AppError(400, 'File must be JSON (.json)', 'VALIDATION_ERROR');
    }
    const payload = seedService.parseFile(req.file.buffer);
    const summary = await seedService.bulkInsert(payload);
    res.status(201).json({ success: true, data: summary });
  }
}
