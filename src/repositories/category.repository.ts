import { Category, Resource } from '../models';
import { CreateCategoryDto, UpdateCategoryDto } from '../dto/category.dto';

export class CategoryRepository {
  create(data: CreateCategoryDto): Promise<Category> {
    return Category.create({ ...data, description: data.description ?? null });
  }

  findAll(): Promise<Category[]> {
    return Category.findAll({
      attributes: {
        include: [
          [Category.sequelize!.fn('COUNT', Category.sequelize!.col('resources.id')), 'resourceCount'],
        ],
      },
      include: [{ model: Resource, as: 'resources', attributes: [] }],
      group: ['Category.id'],
      order: [['name', 'ASC']],
    });
  }

  findById(id: string): Promise<Category | null> {
    return Category.findByPk(id);
  }

  async update(category: Category, data: UpdateCategoryDto): Promise<Category> {
    return category.update(data);
  }

  countResources(id: string): Promise<number> {
    return Resource.count({ where: { categoryId: id } });
  }

  async delete(category: Category): Promise<void> {
    await category.destroy();
  }
}

export const categoryRepository = new CategoryRepository();
