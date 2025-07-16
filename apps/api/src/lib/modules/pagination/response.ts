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
  const adjustedPage = page > totalPages ? totalPages : page - 1;
  const prevPage = page > 1 ? adjustedPage : null;

  return {
    data,
    total,
    prevPage,
    nextPage: page < totalPages ? page + 1 : null,
  };
}
