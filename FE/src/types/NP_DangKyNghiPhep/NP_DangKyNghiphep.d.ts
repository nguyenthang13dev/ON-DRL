import { SearchBase } from "../general";

export interface tableNP_DangKyNghiPhepDataType {
  id?: string;
  maLoaiPhep: string;
  tuNgay: Date;
  denNgay: Date;
  lyDo: string;
  soNgayNghi: number;
  trangThai: number;
  ngayDangKy: Date;
  ngayDuyet?: Date;
  hoVaTen?: string;
  tenLoaiPhep?: string;
  idNhanSu?: string;
}

export interface createEditType {
  id?: string;
  maLoaiPhep: string;
  tuNgay: Date;
  denNgay: Date;
  lyDo: string;
  soNgayNghi: number;
  khoangNgayNghi?: [DayJs, DayJs];
  maNhanSuBanGiao?: string
  congViecBanGiao?: string;
}

export interface searchNP_DangKyNghiPhepDataType extends SearchBase {
  trangThaiFilter?: number;
  ngayXinNghiFrom?: Date;
  ngayXinNghiTo?: Date;
}
export interface tableConfigImport {
  order: number;
  columnName?: string;
  displayName?: string;
}
export interface ImportResponse {
  data?: tableNP_DangKyNghiPhepDataType[];
}
export interface ConfigUpload {
  fileId?: string;
  itemId?: string;
}

export interface HuyDangKyType {
  lyDoTuChoi: string;
}

export interface ThongTinNghiPhepType {
  tongSoNgayPhep?: number;
  soNgayPhepConLai?: number;
  soNgayPhepDaSuDung?: number;
}

export interface ThongTinNghiPhepResponse {
  path?: string;
}

export interface ThongKeNghiPhepResponse{
  taoMoi?: number;
  daGuiTruongBan?: number;
  truongBanPheDuyet?: number;
  truongBanTuChoi?: number;
  guiTongGiamDoc?: number;
  tongGiamDocPheDuyet?: number;
  tongGiamDocTuChoi?: number;
}