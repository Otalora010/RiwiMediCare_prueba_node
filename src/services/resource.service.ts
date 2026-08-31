/**
 * Resource service.
 * Business rules and ownership checks for resources.
 */
import { AppError } from '../errors/AppError';
import { CreateResourceDto, ResourceQueryDto, UpdateResourceDto } from '../dto/resource.dto';
import { Role } from '../models/User';
import { categoryRepository } from '../repositories/category.repository';
import { resourceRepository } from '../repositories/resource.repository';
import { getPaginationMeta } from '../utils/pagination';

interface Actor {
  id: string;
  role: Role;
}

/**
 * Contains business rules; does not depend on Request or Response.
 */
export class ResourceService {
  async create(input: CreateResourceDto, ownerId: string) {
    if (!(await categoryRepository.findById(input.categoryId))) {
      throw new AppError(404, 'Categoría no encontrada', 'CATEGORY_NOT_FOUND');
    }
    return resourceRepository.create({ ...input, ownerId });
  }

  async list(query: ResourceQueryDto) {
    const { rows, count } = await resourceRepository.findAll(query);
    return { data: rows, meta: getPaginationMeta(count, query.page, query.limit) };
  }

  async getById(id: string) {
    const resource = await resourceRepository.findById(id);
    if (!resource) throw new AppError(404, 'Recurso no encontrado', 'RESOURCE_NOT_FOUND');
    return resource;
  }

  async update(id: string, input: UpdateResourceDto, actor: Actor) {
    const resource = await this.getById(id);
    this.assertOwnerOrAdmin(resource.ownerId, actor);

    if (input.categoryId && !(await categoryRepository.findById(input.categoryId))) {
      throw new AppError(404, 'Categoría no encontrada', 'CATEGORY_NOT_FOUND');
    }
    return resourceRepository.update(resource, input);
  }

  async delete(id: string, actor: Actor) {
    const resource = await this.getById(id);
    this.assertOwnerOrAdmin(resource.ownerId, actor);
    await resourceRepository.delete(resource);
  }

  private assertOwnerOrAdmin(ownerId: string, actor: Actor): void {
    if (actor.role !== Role.ADMIN && actor.id !== ownerId) {
      throw new AppError(403, 'Solo el propietario o un administrador puede modificarlo', 'FORBIDDEN');
    }
  }
}

export const resourceService = new ResourceService();
