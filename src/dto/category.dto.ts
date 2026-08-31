/**
 * Category DTOs.
 * Input shapes for category creation and update.
 */
export interface CreateCategoryDto {
  name: string;
  description?: string | null;
}

export type UpdateCategoryDto = Partial<CreateCategoryDto>;
