// Dto dùng cho hiển thị
export interface NS_NgayLeDto {
  id: string;
  ngayBatDau: string; // ISO date string
  ngayKetThuc: string; // ISO date string
  tenNgayLe: string;
  loaiNLCode?: string; // đổi từ loai: number sang loaiNLCode?: string
  moTa?: string;
  trangThai: string; // "HoatDong" | "KhongHoatDong"
  nam: number;
  tenLoaiNL: string;  
}

// Type cho tìm kiếm, phân trang
export interface NS_NgayLeSearchType {
  pageIndex?: number;
  pageSize?: number;
  sortColumn?: string;
  sortOrder?: string;
  ngayBatDau?: string; // ISO date string
  ngayKetThuc?: string; // ISO date string
  tenNgayLe?: string;
  loaiNLCode?: string; // đổi từ loai?: number sang loaiNLCode?: string
  moTa?: string;
  trangThai?: string;
  nam?: string;
}

// Type hợp nhất cho tạo mới/cập nhật
export interface NS_NgayLeCreateUpdateType {
  id?: string; // Có khi update, không có khi create
  tenNgayLe: string;
  ngayBatDau: string;
  ngayKetThuc: string;
  loaiNLCode?: string; // đổi từ loai: number sang loaiNLCode?: string
  moTa?: string;
  trangThai?: string;
  nam: number;
}
// Type hợp nhất cho tạo mới/cập nhật
export interface KeThuaDuLieuNamCuType {
  namDuocKeThua: string;
  namKeThua: string;
}

// Kết quả phân trang
export interface PagedList<T> {
  items: T[];
  pageIndex: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
} 