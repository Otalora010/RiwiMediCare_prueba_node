import { Request, Response } from 'express';
import { CreateCategoryDto, UpdateCategoryDto } from '../dto/category.dto';
import { categoryService } from '../services/category.service';

export class CategoryController {
  static async create(req: Request, res: Response): Promise<void> {
    const category = await categoryService.create(req.body as CreateCategoryDto);
    res.status(201).json({ success: true, data: category });
  }

  static async list(_req: Request, res: Response): Promise<void> {
    const categories = await categoryService.list();
    res.status(200).json({ success: true, data: categories });
  }

  static async getById(req: Request, res: Response): Promise<void> {
    const id = String(req.params.id);
    const category = await categoryService.getById(id);
    res.status(200).json({ success: true, data: category });
  }

  static async update(req: Request, res: Response): Promise<void> {
    const id = String(req.params.id);
    const category = await categoryService.update(id, req.body as UpdateCategoryDto);
    res.status(200).json({ success: true, data: category });
  }

  static async delete(req: Request, res: Response): Promise<void> {
    const id = String(req.params.id);
    await categoryService.delete(id);
    res.status(204).send();
  }
}
