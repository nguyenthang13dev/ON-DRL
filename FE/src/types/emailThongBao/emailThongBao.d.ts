import { EntityType, SearchBase } from "../general";

export interface EmailThongBaoType extends EntityType {
  ma?: string;
	noiDung?: string;
}

export interface EmailThongBaoCreateOrUpdateType {
  id?: string;
  ma?: string;
	noiDung?: string;
}

export interface EmailThongBaoSearchType extends SearchBase {
  ma?: string;
	noiDung?: string;
}
