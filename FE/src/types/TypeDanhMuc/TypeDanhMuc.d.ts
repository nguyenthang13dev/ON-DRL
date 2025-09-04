import { SearchBase } from "../general";

export interface TypeDanhMucType {
    id?: string;
    name?: string | null;
    type?: string | null;
    codeDm?: string | null;
    min?: number | null;
    max?: number | null;
}

export interface SearchTypeDanhMucData extends SearchBase {
    name?: string;
    type?: string;
    codeDm?: string;
}

export interface TableTypeDanhMucDataType {
    id?: string;
    name?: string | null;
    type?: string | null;
    codeDm?: string | null;
    min?: number | null;
    max?: number | null;
}

export interface TypeDanhMucCreateVM {
    id?: string;
    name?: string;
    type?: string;
    codeDm?: string;
    min?: number;
    max?: number;
}