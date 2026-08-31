/**
 * Resource controller.
 * Handles HTTP layer for resource CRUD with ownership checks.
 */
import { Request, Response } from 'express';
import { CreateResourceDto, ResourceQueryDto, UpdateResourceDto } from '../dto/resource.dto';
import { ResourceStatus } from '../models/Resource';
import { resourceService } from '../services/resource.service';

export class ResourceController {
  static async create(req: Request, res: Response): Promise<void> {
    const resource = await resourceService.create(
      req.body as CreateResourceDto,
      req.auth!.id,
    );
    res.status(201).json({ success: true, data: resource });
  }

  static async list(req: Request, res: Response): Promise<void> {
    const query: ResourceQueryDto = {
      page: Math.max(1, Number(req.query.page) || 1),
      limit: Math.min(100, Math.max(1, Number(req.query.limit) || 10)),
      status: req.query.status as ResourceStatus | undefined,
      categoryId: req.query.categoryId as string | undefined,
      search: req.query.search as string | undefined,
    };
    const result = await resourceService.list(query);
    res.status(200).json({ success: true, ...result });
  }

  static async getById(req: Request, res: Response): Promise<void> {
    const id = String(req.params.id);
    const resource = await resourceService.getById(id);
    res.status(200).json({ success: true, data: resource });
  }

  static async update(req: Request, res: Response): Promise<void> {
    const id = String(req.params.id);
    const resource = await resourceService.update(
      id,
      req.body as UpdateResourceDto,
      req.auth!,
    );
    res.status(200).json({ success: true, data: resource });
  }

  static async delete(req: Request, res: Response): Promise<void> {
    const id = String(req.params.id);
    await resourceService.delete(id, req.auth!);
    res.status(204).send();
  }
}
