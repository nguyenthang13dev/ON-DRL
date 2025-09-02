import { EntityType } from "../general";

export interface TaiLieuDinhKem extends EntityType {
  tenTaiLieu: string;
  dinhDangFile: string;
  duongDanFile: string;
  loaiTaiLieu: string;
  ngayPhatHanh: Date;
  kichThuoc: number;
  isKySo: Nullable<boolean>;
  keyTieuChiKeKhai: string;
  nguoiKy: string;
  donViPhatHanh: string;
  ngayKy: string;
  moTa: string;
}

export interface TaiLieuUpload {
  tenTaiLieu: string;
  duongDanFile: string;
  id: string;
}

export interface TaiLieuDinhKemSearch {
  item_ID: string;
  loaiTaiLieu: string;
  tenTaiLieu: string;
  dinhDangFile: string;
}
