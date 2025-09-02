import { SearchBase } from '../general'
export interface CanBoQuanLyType {
  id?: string | null
  // Thông tin cá nhân
  hoTen?: string | null
  ngaySinh?: Date | null
  gioiTinh?: number | null
  soCCCD?: string | null
  diaChi?: string | null
  maTinh?: string | null
  maHuyen?: string | null
  maXa?: string | null
  email?: string | null
  sdt?: string | null
  danToc?: string | null
  tonGiao?: string | null

  // Thông tin công việc
  maCanBo?: string | null
  chucVu?: string | null
  capBac?: string | null
  donViCongTac?: string | null
  phongBan?: string | null
  ngayVaoCoQuan?: Date | null
  tinhTrangLamViec?: string | null
  congViecChinhDuocGiao?: string | null
  nhiemVuKhac?: string | null

  // Trình độ chuyên môn
  bangCapCaoNhat?: string | null
  chuyenNganhDaoTao?: string | null
  chungChi?: string | null
  ngoaiNgu?: string | null

  // Thông tin khác
  userId?: string | null
  avatar?: string | null
  isLock?: boolean
}

export interface searchCanBoQuanLyData extends SearchBase {
  hoTen?: string | null
  soCCCD?: string | null
  diaChi?: string | null
  maCanBo?: string | null
  maTinh?: string | null
  maHuyen?: string | null
  donViCongTac?: string | null
  phongBan?: string | null
  tinhTrangLamViec?: string | null
  isLock?: boolean | null
}

export interface tableCanBoQuanLyDataType {
  id?: string
  // Thông tin cá nhân
  hoTen?: string | null
  ngaySinh?: Date | null
  gioiTinh?: number | null
  soCCCD?: string | null
  diaChi?: string | null
  maTinh?: string | null
  maHuyen?: string | null
  maXa?: string | null
  email?: string | null
  sdt?: string | null
  danToc?: string | null
  tonGiao?: string | null

  // Thông tin công việc
  maCanBo?: string | null
  chucVu?: string | null
  capBac?: string | null
  // donViCongTac?: string | null;
  // phongBan?: string | null;
  departmentId?: string | null
  ngayVaoCoQuan?: Date | null
  tinhTrangLamViec?: string | null
  congViecChinhDuocGiao?: string | null
  nhiemVuKhac?: string | null

  // Trình độ chuyên môn
  bangCapCaoNhat?: string | null
  chuyenNganhDaoTao?: string | null
  chungChi?: string | null
  ngoaiNgu?: string | null

  // Thông tin khác
  userId?: string | null
  avatar?: string | null
  fileAvatar?: { id: string; name: string; url: string } | null
  isLock?: boolean

  //
  tenChucVu?: string | null
  //tenDonViCongTac?: string | null;
  tenTinhTrangLamViec?: string | null
  tenDanToc?: string | null
  tenCapBac?: string | null
  tenPhongBan?: string | null
  tenChuyenNganhDaoTao?: string | null
  tenTinh?: string | null
  tenHuyen?: string | null
  tenXa?: string | null
}

export interface createEditType {
  id?: string | null
  // Thông tin cá nhân
  hoTen?: string | null
  ngaySinh?: Date | null
  gioiTinh?: number | null
  soCCCD?: string | null
  diaChi?: string | null
  maTinh?: string | null
  maHuyen?: string | null
  maXa?: string | null
  email?: string | null
  sdt?: string | null
  danToc?: string | null
  tonGiao?: string | null

  // Thông tin công việc
  maCanBo?: string | null
  chucVu?: string | null
  capBac?: string | null
  //donViCongTac?: string | null;
  // phongBan?: string | null;
  departmentId: string
  ngayVaoCoQuan?: Date | null
  tinhTrangLamViec?: string | null
  congViecChinhDuocGiao?: string | null
  nhiemVuKhac?: string | null

  // Trình độ chuyên môn
  bangCapCaoNhat?: string | null
  chuyenNganhDaoTao?: string | null
  chungChi?: string | null
  ngoaiNgu?: string | null

  // Thông tin khác
  userId?: string | null
  avatar?: string | null
  fileAvatar?: { id: string; name: string; url: string } | null
  isLock?: boolean
  file?: any | null
}
export interface CanBoQuanLyByDept {
  id: string;
  hoTen?: string
  ngaySinh?: Date
  gioiTinh?: number
  tenDanToc?: string
  departmentId?: string
  tenPhongBan?: string
  tenCapBac?: string
  tenTinhTrangLamViec?: string
}