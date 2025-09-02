import { EntityType, SearchBase } from "../general";

export interface UC_UseCaseDemoType extends EntityType {
    idDuAn?: string;
    tenUseCase?: string;
    tacNhanChinh?: string;
    tacNhanPhu?: string;
    doPhucTap?: string;
    lstHanhDong?: string;
    lstHanhDongNangCao?: string;
    createdDate?: string;
}

export interface UC_UseCaseDemoCreateType  {
    idDuAn: string;
    tenUseCase: string;
    tacNhanChinh: string;
    tacNhanPhu?: string;
    doPhucTap: string;
    lstHanhDong?: string;
    lstHanhDongNangCao?: string;
    loaiUseCaseCode?: string;
}

export interface UC_UseCaseDemoEditType extends UC_UseCaseDemoCreateType {
    id: string;
}

export interface UC_UseCaseDemoSearchType extends SearchBase {
    tenUseCase?: string;
    tacNhanChinh?: string;
    tacNhanPhu?: string;
    doPhucTap?: string;
    idDuAn?: string;
} 