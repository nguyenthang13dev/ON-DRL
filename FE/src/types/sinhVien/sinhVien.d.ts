export interface StudentInforDto
{
  id?: string;
  maSV: string;
  hoTen: string;
  ngaySinh: string;
  gioiTinh: boolean;
  email: string;
  trangThai: string;
  khoaId: string;
  lopId: string;
  tenTrangThai?: string;
  tenKhoa?: string;
  tenLopHanhChinh?: string;
}


export interface createEditType
{
  maSV: string;
  hoTen: string;
  ngaySinh: string;
  gioiTinh: boolean;
  email: string;
  trangThai: string;
  khoaId: string;
  lopId: string;
}

export interface searchSinhVien extends SearchBase {
  maSV?: string;
  hoTen?: string;
  email?: string;
  trangThai?: string;
  khoaId?: string;
  lopId?: string;
}
export interface SinhVien {
  id?: string;
  maSV: string;
  hoTen: string;
  ngaySinh: string;
  gioiTinh: boolean;
  email: string;
  trangThai: string;
  khoaId: string;
  lopId: string;
  tenTrangThai?: string;
  tenKhoa?: string;
  tenLopHanhChinh?: string;
}
