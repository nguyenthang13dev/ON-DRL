import { EntityType, SearchBase } from "../../general";

export interface NS_ChamCongType extends EntityType {
  nhanSuId: string;
  gioVao: string;
  gioRa: string;
  ngayLamViec: string;
  ngayTao: string;
  trangThai: string;
  diMuon: boolean;
  veSom: boolean;
  soGioLam: number;
  ghiChu: string;
  maNV: string;
}

export interface NS_ChamCongCreateOrUpdateType {
  id?: string;
  nhanSuId: string;
  gioVao: string;
  gioRa: string;
  ngayLamViec: string;
  ngayTao: string;
  trangThai: string;
  diMuon: boolean;
  veSom: boolean;
  soGioLam: number;
  ghiChu: string;
  maNV: string;
}

export interface NS_ChamCongSearchType extends SearchBase {
  gioVao?: string;
  gioRa?: string;
  ngayLamViec?: string;
  ngayTao?: string;
  trangThai?: string;
  diMuon?: boolean;
  veSom?: boolean;
  soGioLam?: number;
  ghiChu?: string;
  maNV?: string;
}
export interface DataTableChamCongType {
  key?: string;
  stt?: number;
  maNV: string;
  hoTen: string;
  chucVu: string;
  dataOfDate: {
    [key: string]: {
      trangThai: number;
      gioVao?: string;
      isNghiLe?: boolean;
      isNghiPhep?: boolean;
    };
  };
}

export interface DataTableSearch extends SearchBase {
  startDate?: string;
  endDate?: string;
  month?: number;
  year?: number;
  maNV?: string;
}

export interface DataChamCongTheoNgay {
  ngayLam: string;
  gioVao: string;
}

export interface UpdateDataListByMaNV {
  maNV: string;
  chamCongList: DataChamCongTheoNgay[];
}

export interface DataChamCongDto {
  isNgayLe: boolean;
  isNghiPhep: boolean;
  gioVao: string;
  ngayDiemDanh?: Date;
  trangThai?: number;
  note?: string;
}
