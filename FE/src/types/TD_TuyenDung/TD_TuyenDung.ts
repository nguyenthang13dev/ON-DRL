import dayjs from "dayjs";
import { EntityType, SearchBase } from "../general";

export interface TD_TuyenDungType extends EntityType {
  tenViTri: string;
  phongBanId?: string;
  soLuongCanTuyen: number;
  ngayBatDau: string | dayjs.Dayjs;
  ngayKetThuc: string | dayjs.Dayjs;
  moTa?: string;
  tinhTrang: number;
  loai?: number;
  hinhThuc?: number;
  // Thêm field từ DTO
  tenPhongBan?: string;
  // Audit fields
  createdDate?: string | dayjs.Dayjs;
  createdBy?: string;
  modifiedDate?: string | dayjs.Dayjs;
  modifiedBy?: string;
}

export interface TD_TuyenDungSearchType extends SearchBase {
  tenViTri?: string;
  phongBanId?: string;
  soLuongCanTuyen?: string;
  ngayBatDau?: dayjs.Dayjs | null;
  ngayKetThuc?: dayjs.Dayjs | null;
  tinhTrang?: number;
}

export interface TD_TuyenDungCreateType {
  tenViTri: string;
  phongBanId?: string;
  soLuongCanTuyen: string;
  ngayBatDau: dayjs.Dayjs;
  ngayKetThuc: dayjs.Dayjs;
  moTa?: string;
  tinhTrang: string;
  loai: number;
  hinhThuc: number;
}

export interface TD_TuyenDungEditType extends TD_TuyenDungCreateType {
  id: string;
}

// Constants cho trạng thái
export const TD_TuyenDungTinhTrangOptions = [
  { value: 0, label: "Đang tuyển dụng" },
  { value: 1, label: "Đã đóng" },
  { value: 2, label: "Hoãn" },
];

export const getTinhTrangLabel = (value: number): string => {
  const option = TD_TuyenDungTinhTrangOptions.find(opt => opt.value === value);
  return option?.label || "Không xác định";
};

export enum Loai_TuyenDung {
  ThucTap = 0,
  NhanVien = 1,
  Hoan = 2,
}

export enum HinhThuc_TuyenDung {
  FullTime = 0,
  PartTime = 1,
}

export const TD_TuyenDungLoaiOptions = [
  { value: Loai_TuyenDung.ThucTap, label: "Thực tập" },
  { value: Loai_TuyenDung.NhanVien, label: "Nhân viên" }
];

export const TD_TuyenDungHinhThucOptions = [
  { value: HinhThuc_TuyenDung.FullTime, label: "FullTime" },
  { value: HinhThuc_TuyenDung.PartTime, label: "PartTime" },
];

export const getLoaiLabel = (value?: number): string => {
  const option = TD_TuyenDungLoaiOptions.find(opt => opt.value === value);
  return option?.label || "Không xác định";
};

export const getHinhThucLabel = (value?: number): string => {
  const option = TD_TuyenDungHinhThucOptions.find(opt => opt.value === value);
  return option?.label || "Không xác định";
};
