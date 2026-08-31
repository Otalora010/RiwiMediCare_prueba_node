/**
 * Almacen controller.
 * Translates HTTP requests to service calls for warehouse management.
 */
import { Request, Response } from 'express';
import { CreateAlmacenDto, UpdateAlmacenDto } from '../dto/almacen.dto';
import { almacenService } from '../services/almacen.service';

export class AlmacenController {
  static async create(req: Request, res: Response): Promise<void> {
    const almacen = await almacenService.create(req.body as CreateAlmacenDto);
    res.status(201).json({ success: true, data: almacen });
  }

  static async list(_req: Request, res: Response): Promise<void> {
    const almacenes = await almacenService.list();
    res.status(200).json({ success: true, data: almacenes });
  }

  static async getById(req: Request, res: Response): Promise<void> {
    const id = String(req.params.id);
    const almacen = await almacenService.getById(id);
    res.status(200).json({ success: true, data: almacen });
  }

  static async update(req: Request, res: Response): Promise<void> {
    const id = String(req.params.id);
    const almacen = await almacenService.update(id, req.body as UpdateAlmacenDto);
    res.status(200).json({ success: true, data: almacen });
  }

  static async delete(req: Request, res: Response): Promise<void> {
    const id = String(req.params.id);
    await almacenService.delete(id);
    res.status(204).send();
  }
}
