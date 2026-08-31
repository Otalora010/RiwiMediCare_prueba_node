import { Request, Response } from 'express';
import { CreateMedicamentoDto, UpdateMedicamentoDto } from '../dto/medicamento.dto';
import { medicamentoService } from '../services/medicamento.service';

export class MedicamentoController {
  static async create(req: Request, res: Response): Promise<void> {
    const medicamento = await medicamentoService.create(req.body as CreateMedicamentoDto);
    res.status(201).json({ success: true, data: medicamento });
  }

  static async list(_req: Request, res: Response): Promise<void> {
    const medicamentos = await medicamentoService.list();
    res.status(200).json({ success: true, data: medicamentos });
  }

  static async getById(req: Request, res: Response): Promise<void> {
    const id = String(req.params.id);
    const medicamento = await medicamentoService.getById(id);
    res.status(200).json({ success: true, data: medicamento });
  }

  static async update(req: Request, res: Response): Promise<void> {
    const id = String(req.params.id);
    const medicamento = await medicamentoService.update(id, req.body as UpdateMedicamentoDto);
    res.status(200).json({ success: true, data: medicamento });
  }

  static async delete(req: Request, res: Response): Promise<void> {
    const id = String(req.params.id);
    await medicamentoService.delete(id);
    res.status(204).send();
  }
}
