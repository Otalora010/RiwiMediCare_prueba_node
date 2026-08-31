import { Request, Response } from 'express';
import { CreateClinicaDto, UpdateClinicaDto } from '../dto/clinica.dto';
import { clinicaService } from '../services/clinica.service';

export class ClinicaController {
  static async create(req: Request, res: Response): Promise<void> {
    const clinica = await clinicaService.create(req.body as CreateClinicaDto);
    res.status(201).json({ success: true, data: clinica });
  }

  static async list(_req: Request, res: Response): Promise<void> {
    const clinicas = await clinicaService.list();
    res.status(200).json({ success: true, data: clinicas });
  }

  static async getById(req: Request, res: Response): Promise<void> {
    const id = String(req.params.id);
    const clinica = await clinicaService.getById(id);
    res.status(200).json({ success: true, data: clinica });
  }

  static async update(req: Request, res: Response): Promise<void> {
    const id = String(req.params.id);
    const clinica = await clinicaService.update(id, req.body as UpdateClinicaDto);
    res.status(200).json({ success: true, data: clinica });
  }

  static async delete(req: Request, res: Response): Promise<void> {
    const id = String(req.params.id);
    await clinicaService.delete(id);
    res.status(204).send();
  }
}
