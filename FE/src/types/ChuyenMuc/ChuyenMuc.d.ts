import { SearchBase } from "../general";

interface ChuyenMucType {
    id: string;
    name?: string;
    code?: string;
    isShow: boolean | false;
    thuTuHienThi: number;
    slug: string;
    description: string;
    parentid?: string;
    chuyenMucChatxt: string;
}
interface searchChuyenMucData extends SearchBase {
    name?: string | null;
    code?: string | null;
    isShow: boolean | false;
    thuTuHienThi: number;
}

interface tableChuyenMucData {
    id?: string | null;
    name?: string | null;
    code?: string | null;
    isShow: boolean | false;
    thuTuHienThi: number;
    slug: string;
    description: string;
    parentid?: string;
    chuyenMucChatxt: string;
}
interface createEditType {
    id?: string;
    Name?: string | null;
    Code?: string | null;
    ThuTuHienThi: number;
    IsShow: boolean | false;
    Slug: string;
    Description: string;
    Parentid?: string;
}

export {
    ChuyenMucType,
    searchChuyenMucData,
    tableChuyenMucData,
    createEditType,
};
