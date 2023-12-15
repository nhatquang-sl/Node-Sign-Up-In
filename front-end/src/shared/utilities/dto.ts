export const PAGE = {
  START: 0,
  SIZE: 10,
};

export class Pagination {
  total: number = 0;
  page: number = PAGE.START;
  size: number = PAGE.SIZE;
}

export class PaginationWithData<T> extends Pagination {
  items: T[] = [];
}
