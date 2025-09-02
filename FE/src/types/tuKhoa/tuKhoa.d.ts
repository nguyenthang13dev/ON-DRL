import { SearchBase } from "../general";
export interface tuKhoaType {
    id?: string;
    tenTuKhoa?: string | null;
    loaiTuKhoa?: string | null;
    tanSuat?: string | null;
    ghiChu?: string | null;
    nhomTieuChiId?: string | null;
}

export interface searchTuKhoaData extends SearchBase {
    tenTuKhoa?: string | null;
    loaiTuKhoa?: string | null;
    nhomTieuChiId?: string | null;
}

export interface tableTuKhoaDataType {
    id?: string;
    tenTuKhoa?: string | null;
    loaiTuKhoa?: string | null;
    tenLoaiTuKhoa?: string | null;
    tanSuat?: string | null;
    ghiChu?: string | null;
    nhomTieuChiId?: string | null;
}

export interface createEditType {
    id?: string;
    tenTuKhoa?: string | null;
    loaiTuKhoa?: string | null;
    tanSuat?: string | null;
    ghiChu?: string | null;
    nhomTieuChiId?: string | null;

}
