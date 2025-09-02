import { EntityType, SearchBase } from "../../general";
import dayjs from "dayjs";
export interface NS_HopDongLaoDongType extends EntityType {
  nhanSuId: string;
  ngayKy: string | dayjs.Dayjs | null;
  ngayHetHan: string | dayjs.Dayjs | null;
  loaiHopDong: number;
  soHopDong: string;
  ghiChu: string;
  
}

export interface NS_HopDongLaoDongCreateOrUpdateType {
  id?: string;
  nhanSuId: string;
  ngayKy: string | dayjs.Dayjs | null;
  ngayHetHan: string | dayjs.Dayjs | null;
  loaiHopDong: number;
  soHopDong?: string | null;
  ghiChu?: string | null;
}

export interface NS_HopDongLaoDongSearchType extends SearchBase {
  nhanSuId?: string;
  ngayKy?: string | dayjs.Dayjs | null;
  ngayHetHan?: string | dayjs.Dayjs | null;
  loaiHopDong?: number;
  soHopDong?: string | null;
  ghiChu?: string | null;
}
