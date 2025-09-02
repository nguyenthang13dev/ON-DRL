import { SearchBase } from "../general";
export interface nhomDanhMucType {
    id?: string;
    groupCode?: string | null;
    groupName?: string | null;
}

export interface searchNhomDanhMucData extends SearchBase {
    groupCode?: string;
    groupName?: string;
}

export interface tableNhomDanhMucDataType {
    id?: string;
    groupCode?: string | null;
    groupName?: string | null;
}

export interface createEditType {
    id?: string;
    groupCode?: string;
    groupName?: string;

}
