export interface PaginationInput {
  page: number;
  limit: number;
}

export const getPagination = ({ page, limit }: PaginationInput) => ({
  limit,
  offset: (page - 1) * limit,
});

export const getPaginationMeta = (total: number, page: number, limit: number) => ({
  total,
  page,
  limit,
  totalPages: Math.ceil(total / limit),
});
