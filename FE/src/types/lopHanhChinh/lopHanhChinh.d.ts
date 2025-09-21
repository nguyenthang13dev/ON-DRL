import { SearchBase } from "../general";

export interface createEditType {
  tenLop: string;
  khoaId: string;
  giaoVienCoVanId?: string;
}

export interface searchLopHanhChinh extends SearchBase {
  tenLop?: string;
  khoaId?: string;
  giaoVienCoVanId?: string;
}

export interface LopHanhChinh {
  id?: string;
  tenLop: string;
  khoaId: string;
  giaoVienCoVanId?: string;
  tenKhoa?: string;
  tenGiaoVienCoVan?: string;
}
