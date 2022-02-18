export interface Pagination {
  currentPage: number;
  itemsPerPage: number;
  totalItems: number;
  totalPages: number;
}

export class PaginatedResult<T> {
  public pagination: Pagination;
  public data: T;

  constructor(data: T, pagination: Pagination) {
    this.data = data;
    this.pagination = pagination;
  }
}

export class PagingParams {
  constructor(
    public pageNumber: number = 1,
    public pageSize: number = 3
  ){}
}