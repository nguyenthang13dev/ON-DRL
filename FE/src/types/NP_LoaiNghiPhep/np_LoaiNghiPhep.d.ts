import { SearchBase } from "../general";

export interface tableNP_LoaiNghiPhepDataType {
  id?: string;
  //Note: Tên loại nghỉ phép (VD: Phép năm);
  tenLoaiPhep: string;
  maLoaiPhep?: string;
  //Note: Số ngày phép mặc định;
  soNgayMacDinh: number;
}
export interface createEditType {
  id?: string;
  //Note: Tên loại nghỉ phép (VD: Phép năm);
  tenLoaiPhep: string;
  maLoaiPhep?: string;
  //Note: Số ngày phép mặc định;
  soNgayMacDinh: number;
}
export interface searchNP_LoaiNghiPhepDataType extends SearchBase {
  //Note: Tên loại nghỉ phép (VD: Phép năm);
  tenLoaiPhep?: string;
  maLoaiPhep?: string;
  //Note: Số ngày phép mặc định;
  soNgayMacDinh?: number;
}
export interface tableConfigImport {
  order: number;
  columnName?: string;
  displayName?: string;
}
export interface ImportResponse {
  data?: tableNP_LoaiNghiPhepDataType[];
}
