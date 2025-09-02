import dayjs from "dayjs";
import { EntityType, SearchBase } from "../general";

export interface UseCase_NhomType extends EntityType {

    IdDuAn?: string;
    TenUseCase?: string;
    TacNhanChinh?: string;
    TacNhanPhu?: string;
    DoCanThiet?: string;
    DoPhucTap?: string;
    ParentId?: string;
    NhomId?: string;
    MoTa?: string;

}

export interface UseCase_NhomSearchType extends SearchBase {

    TenUseCase?: string;
    TacNhanChinh?: string;
    TacNhanPhu?: string;
    DoCanThiet?: string;
    DoPhucTap?: string;
    MoTa?: string;
}

export interface UseCase_NhomCreateAndEditType extends EntityType {

    IdDuAn?: string;
    TenUseCase?: string;
    TacNhanChinh?: string;
    TacNhanPhu?: string;
    DoCanThiet?: string;
    DoPhucTap?: string;
    ParentId?: string;
    NhomId?: string;
    MoTa?: string;
}
