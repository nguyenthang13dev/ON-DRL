import { SearchBase } from "../general";

export interface HoatDongNgoaiKhoaType {
  id?: string;
  tenHoatDong: string;
  status: string;
  qrValue: string;
  danhSachDangKy?: AppUser[];
  createdDate?: string;
  createdBy?: string;
  updatedDate?: string;
  updatedBy?: string;
}

export interface AppUser {
  id?: string;
  userName?: string;
  fullName?: string;
  email?: string;
  phoneNumber?: string;
}

export interface HoatDongNgoaiKhoaCreateEditType {
  id?: string;
  tenHoatDong: string;
  status: string;
  qrValue: string;
  danhSachDangKy?: string[]; // Array of user IDs
}

export interface SearchHoatDongNgoaiKhoaData extends SearchBase {
  tenHoatDong?: string;
  status?: string;
  qrValue?: string;
}

export interface TableHoatDongNgoaiKhoaDataType {
  id?: string;
  tenHoatDong: string;
  status: string;
  qrValue: string;
  soLuongDangKy?: number;
  createdDate?: string;
  createdBy?: string;
  updatedDate?: string;
  updatedBy?: string;
}

// Types for registration functionality
export interface HoatDongDangKyType extends HoatDongNgoaiKhoaType {
  isRegistered?: boolean; // User đã đăng ký chưa
  registrationDate?: string; // Ngày đăng ký
  canRegister?: boolean; // Có thể đăng ký không (dựa trên status, thời hạn, etc.)
  moTa?: string; // Mô tả hoạt động
  thoiGianBatDau?: string; // Thời gian bắt đầu
  thoiGianKetThuc?: string; // Thời gian kết thúc  
  diaDiem?: string; // Địa điểm tổ chức
  soLuongToiDa?: number; // Số lượng tối đa có thể đăng ký
}

export interface DangKyHoatDongRequest {
  hoatDongId: string;
  userId?: string; // Optional, có thể lấy từ current user
}

export interface SearchHoatDongDangKyData extends SearchBase {
  tenHoatDong?: string;
  status?: string;
  isRegistered?: boolean; // Lọc theo đã đăng ký hay chưa
  thoiGianBatDau?: string;
  thoiGianKetThuc?: string;
}