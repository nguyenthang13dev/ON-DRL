import { EntityType, SearchBase } from "../general";

export interface KySoInfoType extends EntityType {
  userId: string;
  idDoiTuong?: string;
  loaiDoiTuong?: string;
  duongDanFile?: string;
  duongDanFileTemp?: string;
  thongTin?: string;
  trangThai?: "DAKYSO" | "CHUAKYSO";
  listCertificateInfo?: CertificateInfo[] | [];
}

export interface KySoInfoCreateOrUpdateType {
  id?: string;
  userId: string;
  idDoiTuong?: string;
  loaiDoiTuong?: string;
  duongDanFile?: string;
  duongDanFileTemp?: string;
  thongTin?: string;
  trangThai?: string;
}

export interface KySoInfoSearchType extends SearchBase {
  userId?: string;
  idDoiTuong?: string;
  loaiDoiTuong?: string;
  duongDanFile?: string;
  duongDanFileTemp?: string;
  thongTin?: string;
  trangThai?: string;
}

export interface CertificateInfo {
  invalidSignature?: boolean;
  cn?: string;
  signedAt?: string;
  signersIdentity?: boolean;
  documentModified?: boolean;
}
