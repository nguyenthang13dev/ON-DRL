// DTO
export interface TD_UngVienDto {
  id: string;
  hoTen: string;
  ngaySinh: string; // yyyy-MM-dd
  gioiTinh?: number; // 0: Nam, 1: Nữ, 2: Khác
  email: string;
  soDienThoai: string;
  diaChi?: string;
  trinhDoHocVan?: string;
  kinhNghiem?: string;
  cvFile: string;
  ngayUngTuyen?: string; // yyyy-MM-dd
  thoiGianPhongVan?: string | null; // yyyy-MM-ddTHH:mm
  trangThai?: number;
  ghiChuUngVien?: string;
  tuyenDungId?: string;
  viTriTuyenDungText?: string;
  trangThaiText?: string;
  gioiTinhText?: string;
  createdDate?: string;
  updatedDate?: string;
}

export interface TD_UngVienTongQuanVM {
  totalCandidates: number;
  daNhanViec: number;
  dangChoPhongVan: number;
  daXetDuyet: number;
  daTuChoi: number;
  chuaXetDuyet: number;
  datPhongVan: number;
  interviewToday:number;
  interviewThisWeek: number;
  interviewThisMonth: number;
  avgInterviewPerDay: number;
  conversionRate: number;
  interviewRate: number;
}

// Search
export interface TD_UngVienSearch {
  HoTen?: string;
  Email?: string;
  sdt?: string;
  NgayUngTuyen?: string; // yyyy-MM-dd
  KinhNghiem?: string;
  GioiTinh?: number;
  TrangThai?: number;
  TuyenDungId?: string;
  pageIndex: number;
  pageSize: number;
  ThoiGianPhongVan_Start?: string; // yyyy-MM-dd
  ThoiGianPhongVan_End?: string;   // yyyy-MM-dd
}

// Create
export interface TD_UngVienCreate {
  HoTen: string;
  NgaySinh: string; // yyyy-MM-dd
  GioiTinh?: number;
  Email: string;
  SoDienThoai: string;
  DiaChi?: string;
  TrinhDoHocVan?: string;
  KinhNghiem?: string;
  CVFile: File; // upload
  NgayUngTuyen?: string; // yyyy-MM-dd
  ThoiGianPhongVan?: string; // yyyy-MM-ddTHH:mm
  TrangThai?: number;
  GhiChuUngVien?: string;
  TuyenDungId?: string;
}

// Edit
export interface TD_UngVienEdit extends TD_UngVienCreate {
  id: string;
}

// Create both UngVien and DonUngTuyen
export interface TD_UngVienAndDonUngTuyenCreate {
  // Thông tin ứng viên
  HoTen: string;
  NgaySinh?: string; // yyyy-MM-dd
  GioiTinh?: number;
  Email: string;
  SoDienThoai: string;
  DiaChi?: string;
  TrinhDoHocVan?: string;
  KinhNghiem?: string;
  CVFile?: File; // upload
  
  // Thông tin đơn ứng tuyển
  ViTriId: string;
  TrangThai?: number;
  GhiChu?: string;
  NgayNopDon: string; // yyyy-MM-dd
}

// Result DTO
export interface TD_UngVienAndDonUngTuyenResultDto {
  UngVien: TD_UngVienDto;
  DonUngTuyen: any; // TD_DonUngTuyenDto
  Message: string;
}

// Enum giới tính
export enum GioiTinhUngVien {
  Nam = 0,
  Nu = 1,
  Khac = 2,
} 

export enum TrangThaiUngVien {
  ChuaXetDuyet = 0,
  DaXetDuyet = 1,
  DangChoPhongVan = 2,
  DaNhanViec = 3,
  DaTuChoi = 4,
  DatPhongVan = 5
} 