export function paginatedResponse<T>({
  data,
  total,
  page,
  limit,
}: {
  data: T[];
  total: number;
  page: number;
  limit: number;
}) {
  const totalPages = Math.ceil(total / limit);

  return {
    data,
    total,
    prevPage: page > 1 ? page - 1 : null,
    nextPage: page < totalPages ? page + 1 : null,
  };
}
