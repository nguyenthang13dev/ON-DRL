import { SearchBase } from "../general";

export interface ConfigFormType {
    id?: string;
    name?: string | null;
    description?: string | null;
    isActive?: boolean;
    fileDinhKems?: string | null;
    createdDate?: string;
    createdBy?: string;
    updatedDate?: string;
    updatedBy?: string;
}

export interface SearchConfigFormData extends SearchBase {
    name?: string;
    description?: string;
    isActive?: boolean;
}

export interface TableConfigFormDataType {
    id?: string;
    name?: string | null;
    description?: string | null;
    isActive?: boolean;
    fileDinhKems?: string | null;
    createdDate?: string;
    createdBy?: string;
    updatedDate?: string;
    updatedBy?: string;
}

export interface ConfigFormCreateVM {
    id?: string;
    name: string;
    description: string;
    isActive: boolean;
    fileDinhKems?: string | null;
}
