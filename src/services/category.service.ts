/**
 * Category service.
 * Business logic for category CRUD.
 */
import { AppError } from '../errors/AppError';
import { CreateCategoryDto, UpdateCategoryDto } from '../dto/category.dto';
import { categoryRepository } from '../repositories/category.repository';

export class CategoryService {
  create(input: CreateCategoryDto) {
    return categoryRepository.create(input);
  }

  list() {
    return categoryRepository.findAll();
  }

  async getById(id: string) {
    const category = await categoryRepository.findById(id);
    if (!category) throw new AppError(404, 'Categoría no encontrada', 'CATEGORY_NOT_FOUND');
    return category;
  }

  async update(id: string, input: UpdateCategoryDto) {
    const category = await this.getById(id);
    return categoryRepository.update(category, input);
  }

  async delete(id: string) {
    const category = await this.getById(id);
    if ((await categoryRepository.countResources(id)) > 0) {
      throw new AppError(
        409,
        'No puedes eliminar una categoría que contiene recursos',
        'CATEGORY_IN_USE',
      );
    }
    await categoryRepository.delete(category);
  }
}

export const categoryService = new CategoryService();
