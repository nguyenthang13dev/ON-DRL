import { SearchBase } from "../general";

export interface createEditType {
  maGiaoVien: string;
  hoTen: string;
  email: string;
  soDienThoai?: string;
  khoaId: string;
  trangThai: string;
}

export interface searchGiaoVien extends SearchBase {
  maGiaoVien?: string;
  hoTen?: string;
  email?: string;
  khoaId?: string;
  trangThai?: string;
}

export interface GiaoVien {
  id?: string;
  maGiaoVien: string;
  hoTen: string;
  email: string;
  soDienThoai?: string;
  khoaId: string;
  trangThai: string;
  tenKhoa?: string;
  tenTrangThai: string;
}
