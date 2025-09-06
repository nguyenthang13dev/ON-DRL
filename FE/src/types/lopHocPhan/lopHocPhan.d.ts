export interface createEditType {
  monHocId: string;
  hocKy: string;
  giaoVienId: string;
}

export interface searchLopHocPhan extends SearchBase {
  monHocId?: string;
  hocKy?: string;
  giaoVienId?: string;
}
export interface LopHocPhan {
  id?: string;
  monHocId: string;
  hocKy: string;
  giaoVienId: string;
}
