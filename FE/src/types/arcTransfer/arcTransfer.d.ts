import {EntityType} from "../general";

export interface FilePathDto {
    id: string;
    duongDanFile: string;
    tenTaiLieu: string;
}

export interface ArcTransferType extends EntityType {
    canCu: string;
    userIDGiao: string;
    tenUserGiao: string;
    chucVuGiao: string;
    userIDNhan: string;
    tenUserNhan: string;
    chucVuNhan: string;
    tenKhoiTaiLieu: string;
    thoiGianHoSo: string;
    tongSoHop: number;
    tongSoHoSo: number;
    soMetHoSo: number;
    tongSoHoSoDienTu: number;
    tongSoTepTin: number;
    tinhTrangTaiLieu: string;
    ngayGiaoNhan: DateTime | string;
    nguonGiaoNhan: string;
    tenNguonGiaoNhan: string;
    bienBanDinhKem?: FilePathDto[];
    taiLieuDinhKem?: string[];
}

// Define the search parameters
export interface ArcTransferSearch {
    pageNumber?: number;
    pageSize?: number;
    searchText?: string;
    sortColumn?: string;
    sortOrder?: string;
    // Add other filter fields as needed
}