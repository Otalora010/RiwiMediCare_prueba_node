import { Request, Response } from 'express';
import { CreateSolicitudDto } from '../dto/solicitud.dto';
import { SolicitudEstado } from '../models/Solicitud';
import { solicitudService } from '../services/solicitud.service';

export class SolicitudController {
  static async create(req: Request, res: Response): Promise<void> {
    const solicitud = await solicitudService.create(req.body as CreateSolicitudDto, req.auth!.id);
    res.status(201).json({ success: true, data: solicitud });
  }

  static async getById(req: Request, res: Response): Promise<void> {
    const id = String(req.params.id);
    const solicitud = await solicitudService.getById(id);
    res.status(200).json({ success: true, data: solicitud });
  }

  static async listActivas(_req: Request, res: Response): Promise<void> {
    const solicitudes = await solicitudService.listActivas();
    res.status(200).json({ success: true, data: solicitudes });
  }

  static async listHistorial(_req: Request, res: Response): Promise<void> {
    const solicitudes = await solicitudService.listHistorial();
    res.status(200).json({ success: true, data: solicitudes });
  }

  static async listByClinica(req: Request, res: Response): Promise<void> {
    const id = String(req.params.id);
    const solicitudes = await solicitudService.listByClinica(id);
    res.status(200).json({ success: true, data: solicitudes });
  }

  static async updateEstado(req: Request, res: Response): Promise<void> {
    const id = String(req.params.id);
    const { estado } = req.body as { estado: SolicitudEstado };
    const solicitud = await solicitudService.updateEstado(id, estado);
    res.status(200).json({ success: true, data: solicitud });
  }

  static async delete(req: Request, res: Response): Promise<void> {
    const id = String(req.params.id);
    await solicitudService.delete(id);
    res.status(204).send();
  }
}
