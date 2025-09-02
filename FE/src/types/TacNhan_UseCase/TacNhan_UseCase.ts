import { EntityType, SearchBase } from "../general";

export interface TacNhan_UseCaseType extends EntityType {
  maTacNhan: string;
  tenTacNhan: string;
  idDuAn: string;
  createdDate?: string;
}

export interface TacNhan_UseCaseSearchType extends SearchBase {
  maTacNhan?: string;
  tenTacNhan?: string;
  idDuAn?: string;
}

export interface TacNhan_UseCaseCreateType {
  maTacNhan: string;
  tenTacNhan: string;
  idDuAn: string;
}

export interface TacNhan_UseCaseEditType extends TacNhan_UseCaseCreateType {
  id: string;
} 