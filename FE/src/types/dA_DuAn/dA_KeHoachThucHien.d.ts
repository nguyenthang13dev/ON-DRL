import { EntityType, SearchBase } from "../general";

export interface DA_KeHoachThucHienType extends EntityType {
  duAnId: string;
	groupNoiDungId: string;
	ngayBatDau: string;
	ngayKetThuc: string;
	canhBaoTruocNgay: number;
	isKeHoachNoiBo: boolean;
	isCanhBao: boolean;
	noiDungCongViec: string;
  noiDungCongViecCon: string;
  phanCongKH: string;
  progress?: number | null;
}





export interface DA_KeHoachThucHienCreateOrUpdateType {
  id?: string | null;
  duAnId?: string | null;
  groupNoiDungId?: string | null; // Có thể null
  ngayBatDau?: string | null;
  ngayKetThuc?: string | null;
  canhBaoTruocNgay?: number | null; // Có thể không bắt buộc
  isKeHoachNoiBo?: boolean | null; // Có thể không bắt buộc
  isCanhBao?: boolean | null;
  noiDungCongViec?: string | null;
  phanCong?: string | null; 
  phanCongKH?: string | null;
  isGroup?: boolean | null;
  stt?: string | null;
  group?: string | null;
  noiDungCongViecCon?: string | null;
  progress?: number | null;
}

export interface DA_KeHoachThucHienSearchType extends SearchBase {
  duAnId?: string;
	groupNoiDungId?: string;
	ngayBatDau?: string;
	ngayKetThuc?: string;
	canhBaoTruocNgay?: number;
	isKeHoachNoiBo?: boolean;
	isCanhBao?: boolean;
	noiDungCongViec?: string;
}

// Interface cho response API GetFormByDuAn
export interface DA_GetFormByDuAnResponse {
  duAnId: string;
  isKeHoachNoiBo: boolean;
  keHoachThucHienList: DA_KeHoachThucHienCreateOrUpdateType[];
  // Có thể bổ sung các trường khác nếu API trả về thêm
}

// Interface cho tree structure
export interface DA_KeHoachThucHienTreeType extends DA_KeHoachThucHienCreateOrUpdateType {
  listdA_KeHoachThucHienTrees: DA_KeHoachThucHienTreeType[];
  createdDate?: string;
  createdBy?: string;
  updatedDate?: string;
  stt?: string;
  tyLeHoanThanh?: number;
}
