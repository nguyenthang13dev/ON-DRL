import { SearchBase } from "../general";
export interface duLieuDanhMucType {
  id?: string;
  groupId?: string | null;
  name?: string | null;
  code?: string | null;
  note?: string | null;
  priority?: number | null;
  donViId?: string | null;
  duongDanFile?: string | null;
  noiDung?: string | null;
  fileDinhKem?: string | null;
}

export interface searchDuLieuDanhMucData extends SearchBase {
  name?: string;
  code?: string;
  groupId?: string;
}

export interface tableDuLieuDanhMucDataType {
  id?: string;
  groupId?: string | null;
  parentId?: string | null;
  name?: string | null;
  code?: string | null;
  note?: string | null;
  priority?: number | null;
  donViId?: string | null;
  duongDanFile?: string | null;
  noiDung?: string | null;
  tenDonVi?: string | null;
  fileDinhKem?: string | null;
  tenFileDinhKem?: string | null;
}

export interface createEditType {
  id?: string;
  groupId?: string | null;
  name?: string | null;
  code?: string | null;
  note?: string | null;
  priority?: number | null;
  donViId?: string | null;
  duongDanFile?: string | null;
  noiDung?: string | null;
  fileDinhKem?: string | null;
}
