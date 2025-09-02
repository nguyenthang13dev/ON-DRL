import { EntityType, SearchBase } from "../general";

export interface QLThongBaoSearchType extends SearchBase {
  tieuDe?: string;
  loaiThongBao?: string;
}
export interface QLThongBaoType extends EntityType {
  tieuDe?: string;
  loaiThongBao?: string;
  noiDung?: string;
  ngayTao?: any | null;
  maThongBao?: string;
  id?: string;
}
export interface QLThongBaoCreateOrUpdateType {
  id?: string;
  tieuDe?: string;
  loaiThongBao?: string;
  noiDung?: string;
}
