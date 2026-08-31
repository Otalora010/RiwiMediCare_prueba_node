/**
 * Resource DTOs.
 * Input shapes for resource creation, update and queries.
 */
import { ResourceStatus } from '../models/Resource';

export interface CreateResourceDto {
  title: string;
  description?: string | null;
  price: number;
  status?: ResourceStatus;
  categoryId: string;
}

export type UpdateResourceDto = Partial<CreateResourceDto>;

export interface ResourceQueryDto {
  page: number;
  limit: number;
  status?: ResourceStatus;
  categoryId?: string;
  search?: string;
}
