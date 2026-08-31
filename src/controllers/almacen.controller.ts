import { Request, Response } from 'express';
import { CreateAlmacenDto, UpdateAlmacenDto } from '../dto/almacen.dto';
import { almacenService } from '../services/almacen.service';

// Controller responsible for handling warehouse-related HTTP requests.
export class AlmacenController {
  // Creates a new warehouse using the data received in the request body.
  static async create(req: Request, res: Response): Promise<void> {
    const almacen = await almacenService.create(req.body as CreateAlmacenDto);
    res.status(201).json({ success: true, data: almacen });
  }
  // Retrieves a list of all warehouses.
  static async list(_req: Request, res: Response): Promise<void> {
    const almacenes = await almacenService.list();
    res.status(200).json({ success: true, data: almacenes });
  }
  // Retrieves a warehouse by its ID.
  static async getById(req: Request, res: Response): Promise<void> {
    const id = String(req.params.id);
    const almacen = await almacenService.getById(id);
    res.status(200).json({ success: true, data: almacen });
  }
  // Updates an existing warehouse using its ID and the provided data.
  static async update(req: Request, res: Response): Promise<void> {
    const id = String(req.params.id);
    const almacen = await almacenService.update(id, req.body as UpdateAlmacenDto);
    res.status(200).json({ success: true, data: almacen });
  }
  // Deletes a warehouse using its ID.
  static async delete(req: Request, res: Response): Promise<void> {
    const id = String(req.params.id);
    await almacenService.delete(id);
    res.status(204).send();
  }
}