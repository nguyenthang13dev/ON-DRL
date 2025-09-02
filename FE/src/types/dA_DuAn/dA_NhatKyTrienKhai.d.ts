import { EntityType, SearchBase } from "../general";


export interface DA_NhatKyTrienKhaiType extends EntityType {
    id?: string|null;
    duAnId?: string ;
    phanCong?: string;
    ngayBatDau?: string;
    ngayKetThuc?: string;
    hangMucCongViec?: string;
    noiDungThucHien?: string;
    ketQuaThucHien?: string;
    ghiChu?: string;
    khoKhan?: string;
    kienNghi?: string;
    isValid?: boolean;
    errors?: string[];
}
export interface DA_NhatKyTrienKhaiTypeVM extends EntityType {
 
    duAnId?: string ;
    phanCong?: string;
    ngayBatDau?: string;
    ngayKetThuc?: string;
    hangMucCongViec?: string;
    noiDungThucHien?: string;
    ketQuaThucHien?: string;
    ghiChu?: string;
    khoKhan?: string;
    kienNghi?: string;
    isValid?: boolean;
    errors?: string[];
}

export interface DA_NhatKyTrienKhaiCreateOrUpdateType {
    id?: string|null;
    duAnId?: string;
    phanCong?: string;
    ngayBatDau?: string;
    ngayKetThuc?: string;
    hangMucCongViec?: string;
    noiDungThucHien?: string;
    ketQuaThucHien?: string;
    ghiChu?: string;
    khoKhan?: string;
    kienNghi?: string;
}

export interface DA_NhatKyTrienKhaiSearchType extends SearchBase {
    duAnId?: string;
    ngayBatDau?: string;
    ngayKetThuc?: string;
    hangMucCongViec?: string;
    noiDungThucHien?: string;
    phanCong?: string;
    ketQuaThucHien?: string;
    ghiChu?: string;
    khoKhan?: string;
    kienNghi?: string;
}

export interface ImportNhatKyTrienKhaiResponse {
    // Định nghĩa cũ
    items?: DA_NhatKyTrienKhaiTypeVM[];
    totalValid?: number;
    totalInvalid?: number;
    totalItems?: number;
    
    // Định nghĩa mới theo API thực tế
    listDA_NhatKyTrienKhai?: DA_NhatKyTrienKhaiTypeVM[];
    soLuongThanhCong?: number;
    soLuongThatBai?: number;
}
