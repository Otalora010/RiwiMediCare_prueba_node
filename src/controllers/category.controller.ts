import { Request, Response } from 'express';
import { CreateCategoryDto, UpdateCategoryDto } from '../dto/category.dto';
import { categoryService } from '../services/category.service';

// Controller responsible for handling category-related HTTP requests.
export class CategoryController {
  // Creates a new category using the data received in the request body.
  static async create(req: Request, res: Response): Promise<void> {
    const category = await categoryService.create(req.body as CreateCategoryDto);
    res.status(201).json({ success: true, data: category });
  }
  // Retrieves a list of all categories.
  static async list(_req: Request, res: Response): Promise<void> {
    const categories = await categoryService.list();
    res.status(200).json({ success: true, data: categories });
  }
  // Retrieves a category by its ID.
  static async getById(req: Request, res: Response): Promise<void> {
    const id = String(req.params.id);
    const category = await categoryService.getById(id);
    res.status(200).json({ success: true, data: category });
  }
  // Updates an existing category using its ID and the provided data.
  static async update(req: Request, res: Response): Promise<void> {
    const id = String(req.params.id);
    const category = await categoryService.update(id, req.body as UpdateCategoryDto);
    res.status(200).json({ success: true, data: category });
  }
  // Deletes a category using its ID.
  static async delete(req: Request, res: Response): Promise<void> {
    const id = String(req.params.id);
    await categoryService.delete(id);
    res.status(204).send();
  }
}