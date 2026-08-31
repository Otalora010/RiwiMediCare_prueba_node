import { Op, WhereOptions } from 'sequelize';
import { CreateResourceDto, ResourceQueryDto, UpdateResourceDto } from '../dto/resource.dto';
import { Category, Resource, User } from '../models';
import { ResourceStatus } from '../models/Resource';

export class ResourceRepository {
  create(data: CreateResourceDto & { ownerId: string }): Promise<Resource> {
    return Resource.create({
      ...data,
      description: data.description ?? null,
      status: data.status ?? ResourceStatus.ACTIVE,
    });
  }

  findById(id: string): Promise<Resource | null> {
    return Resource.findByPk(id, {
      include: [
        { model: Category, as: 'category', attributes: ['id', 'name'] },
        { model: User, as: 'owner', attributes: ['id', 'name', 'email'] },
      ],
    });
  }

  findAll(query: ResourceQueryDto) {
    const where: WhereOptions = {};
    if (query.status) where.status = query.status;
    if (query.categoryId) where.categoryId = query.categoryId;
    if (query.search) where.title = { [Op.iLike]: `%${query.search}%` };

    return Resource.findAndCountAll({
      where,
      limit: query.limit,
      offset: (query.page - 1) * query.limit,
      distinct: true,
      order: [['createdAt', 'DESC']],
      include: [
        { model: Category, as: 'category', attributes: ['id', 'name'] },
        { model: User, as: 'owner', attributes: ['id', 'name'] },
      ],
    });
  }

  async update(resource: Resource, data: UpdateResourceDto): Promise<Resource> {
    await resource.update(data);
    return this.findById(resource.id) as Promise<Resource>;
  }

  async delete(resource: Resource): Promise<void> {
    await resource.destroy();
  }
}

export const resourceRepository = new ResourceRepository();
