export interface PaginationParams {
  searchTerm?: string;
  pageNumber?: number | 1;
  pageSize?: number | 10;
  attributes?: string | '';
  order?: string | '';
  filters?: Record<string, Record<string, string>>;
}
