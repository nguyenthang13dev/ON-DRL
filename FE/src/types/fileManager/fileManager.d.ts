import dayjs from "dayjs";
import { EntityType, SearchBase } from "../general";


export interface FileSecurityType {
    fileID: string,
    sharedToID: string,
    sharedToName: string,
    sharedToType: string,
    permission?: string,
}

export interface FilePermissionType {
    copy: boolean,
    create: boolean,
    delete: boolean,
    download: boolean,
    move: boolean,
    rename: boolean,
    upload: boolean,
    share: boolean
}

export interface FileManagerType {
    id: string;
    name: string;
    parentId: string;
    isDirectory: boolean;
    path?: string;
    size?: number;
    mimeType?: string;
    updatedAt?: Date;
    fileExtension?: string;
    physicalPath?: string;
    permission?: FilePermissionType;

    //
    isEditing?: boolean;
    subDirectories?: FileManagerType[];

    // 
    loaiVanBan?: string;
    tenLoaiVanBan?: string;
    soKyHieu?: string;
    ngayBanHanh?: Date;
    trichYeu?: string;

}

export interface FileDataType {
    file: File;
    appendData: any;
    error?: string | boolean;
    removed?: boolean;
}


export interface FileManagerCreateOrUpdateType {
    id?: string;
    name: string;
    parentId: string;
    //

    loaiVanBan?: string;
    soKyHieu?: string;
    ngayBanHanh?: Date | dayjs;
    trichYeu?: string;
}

export interface FileManagerSearchType extends SearchBase {
    name?: string;
    parentId?: string;
}


export interface FileManagerThongTinVanBanType {
    loaiVanBan?: string;
    soKyHieu?: string;
    ngayBanHanh?: Date | dayjs;
    trichYeu?: string;
}