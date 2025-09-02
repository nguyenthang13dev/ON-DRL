export interface tableGroupUserDataType {
    id: string;
    name: string;
    code: string;
    roleIds?: string[];
    roleNames?: string[];
}

export interface createEditType {
    id?: string;
    name: string;
    code: string;
}

export interface searchGroupUserData {
    name?: string;
    code?: string;

}
