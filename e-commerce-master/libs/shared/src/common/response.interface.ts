export interface IResponse<T> {
  data?: T[] | T;
  count?: number;
  totalPages?: number;
  currentPage?: number;
  status: IMessage;
  [key: string]: any;
}

export interface IPaginatedData<T> {
  data: T[];
  count: number;
  totalPages?: number;
  currentPage?: number;
}

export interface IMessage {
  message: string;
  code: number;
}
