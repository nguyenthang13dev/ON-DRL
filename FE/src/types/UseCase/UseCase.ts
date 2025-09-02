import dayjs from "dayjs";
import { EntityType, SearchBase } from "../general";

export interface UseCaseType extends EntityType {
 
    idUseCase?: string;
    hanhDong?: string;
    moTaKiemThu?: string;
    tinhHuongKiemThu?: string;
    ketQuaMongDoi?: string;
    taiKhoan?: string;
    linkHeThong?: string;
    trangThai?: string;
    moTaLoi?: string;
    ghiChu?: string;
}
export interface UseCaseCreate extends EntityType {
 
    IdDuAn?: string;
    TenUseCase?: string;
    TacNhanChinh?: string;
    DoPhucTap?: string;
    lstMoTa?: string[];
}

export interface UseCaseSearchType extends SearchBase {

    hanhDong?: string;
    moTaKiemThu?: string;
    tinhHuongKiemThu?: string;
    ketQuaMongDoi?: string;

}




export interface UseCaseCreateAndEditType extends EntityType {

    idUseCase?: string;
    hanhDong?: string;
    moTaKiemThu?: string;
    tinhHuongKiemThu?: string;
    ketQuaMongDoi?: string;
    taiKhoan?: string;
    linkHeThong?: string;
    trangThai?: string;
    moTaLoi?: string;
    ghiChu?: string;
}

// New interfaces for nested structure
export interface UseCaseWithDetailsType extends EntityType {
    idUseCase?: string;
    hanhDong?: string;
    moTaKiemThu?: string;
    tinhHuongKiemThu?: string;
    ketQuaMongDoi?: string;
    taiKhoan?: string;
    linkHeThong?: string;
    trangThai?: string;
    moTaLoi?: string;
    ghiChu?: string;
}

export interface UseCaseGroupType extends EntityType {
    listUC_mota?: UseCaseWithDetailsType[];
    rowIndex?: number;
    errors?: string[];
    isValid?: boolean;
    idDuAn?: string;
    tenUseCase?: string;
    tacNhanChinh?: string;
    tacNhanPhu?: string;
    doCanThiet?: string;
    doPhucTap?: string;
    parentId?: string;
    nhomId?: string;
    moTa?: string;
}

export interface UseCaseImportDataType {
    soLuongThanhCong?: number;
    soLuongThatBai?: number;
    data?: UseCaseGroupType[];
}

export interface UseCaseImportResponseType {
    message?: string;
    data?: UseCaseImportDataType;
    status?: boolean;
    errors?: any;
}


