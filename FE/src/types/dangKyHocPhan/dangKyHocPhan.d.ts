export interface createEditType {
  sinhVienId: string;
  lopHocPhanId: string;
  diemQuaTrinh: number;
  diemThi: number;
  diemTongKet: number;
  ketQua: string;
}

export interface searchDangKyHocPhan extends SearchBase {
  sinhVienId?: string;
  lopHocPhanId?: string;
  ketQua?: string;
}
export interface DangKyHocPhan {
  id?: string;
  sinhVienId: string;
  lopHocPhanId: string;
  diemQuaTrinh: number;
  diemThi: number;
  diemTongKet: number;
  ketQua: string;
}
