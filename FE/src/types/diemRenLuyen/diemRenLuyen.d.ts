export interface createEditType {
  sinhVienId: string;
  hocKy: string;
  diem: number;
  xepLoai: string;
}

export interface searchDiemRenLuyen extends SearchBase {
  sinhVienId?: string;
  hocKy?: string;
  xepLoai?: string;
}
export interface DiemRenLuyen {
  id?: string;
  sinhVienId: string;
  hocKy: string;
  diem: number;
  xepLoai: string;
}
