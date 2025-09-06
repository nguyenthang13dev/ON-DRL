export interface createEditType {
  id: string;
  tenKhoa: string;
  maKhoa: string;
}

export interface searchKhoa extends SearchBase {
  tenKhoa?: string;
  maKhoa?: string;
}
export interface Khoa {
  id?: string;
  tenKhoa: string;
  maKhoa: string;
}
