export interface EntityType {
  id: string;
}

export interface Response<T = any> {
  success: any;
  data: T;
  status?: boolean;
  message?: string;
  errors?: string[] | null;
}

export interface Dictionary<T = any> {
  [key: string]: T;
}

export interface DropdownOption {
  label: string;
  value: string;
  disabled?: boolean;
  selected?: boolean;
}

export interface DropdownTreeOptionAntd {
  value: string;
  title: string;
  children: DropdownTreeOptionAntd[];
}

//#region cũ không xài nữa
export interface ResponsePageList<T = any> {
  items: T;
  pageIndex?: int;
  pageSize?: int;
  totalCount?: int;
  totalPage?: int;
}

export interface ResponsePageInfo {
  pageIndex?: int;
  pageSize?: int;
  totalCount?: int | 0;
  totalPage?: int | 0;
}

export interface SearchBase {
  pageIndex?: int | 1;
  pageSize?: int | 20;
}

export interface DataToSend {
  IdFile: string; // Id của file (giả sử là chuỗi)
  collection: ColumnConfig[]; // Cấu hình cột, là một mảng các đối tượng
}

//#endregion
