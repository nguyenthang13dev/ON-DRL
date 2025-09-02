import { EntityType, SearchBase } from "../general";

export interface DA_NoiDungCuocHopType extends EntityType {
  duAnId?: string; // Guid là string trong TS
  thoiGianHop: string;
  isNoiBo: boolean;
  tenDuAn: string;
  thanhPhanThamGia: string;
  noiDungCuocHop: string;
  diaDiemCuocHop: string;
  loaiCuocHopText: string;
  soTaiLieu: number;
  taiLieuDinhKem?: string;
  listTaiLieu?: TaiLieuUpload[];
  thanhPhanThamGiaText?: string;
}

export interface DA_NoiDungCuocHopCreateOrUpdateType {
  id?: string;
  duAnId: string;
  thoiGianHop: string | dayjs.Dayjs | null;
  isNoiBo: boolean;
  tenDuAn: string;
  thanhPhanThamGia: string;
  noiDungCuocHop: string;
  diaDiemCuocHop: string;
  taiLieuDinhKem?: string;
  listTaiLieu?: TaiLieuUpload[];
}

export interface DA_NoiDungCuocHopSearchType extends SearchBase {
  duAnId?: string;
  thoiGianHop?: string;
  isNoiBo?: boolean;
  tenDuAn?: string;
  thanhPhanThamGia?: string;
  noiDungCuocHop?: string;
  diaDiemCuocHop?: string;
}

interface UploadMeetingDocsResponse {
  success: boolean;
  message?: string;
  documents?: Array<{
    originalName: string;
    storedName: string;
    filePath: string;
    size: number;
  }>;
}
