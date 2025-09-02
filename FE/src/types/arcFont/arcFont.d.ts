import { EntityType, SearchBase } from "../general";

export interface ArcFontType extends EntityType {
  identifier?: string;
	organId?: string;
	fondName?: string;
	fondHistory?: string;
	archivesTime?: string;
	archivesTimeStart?: number;
	archivesTimeEnd?: number;
	paperTotal?: number;
	paperDigital?: number;
	keyGroups?: string;
	otherTypes?: string;
	language?: string;
	lookupTools?: string;
	copyNumber?: number;
	description?: string;
	identifier_Name?:string;
}
interface OtherTypeItem {
  loaiTaiLieu?: string;
  soLuong?: number;
  donViTinh?: string;
}
export interface ArcFontCreateOrUpdateType {
  id?: string;
  identifier?: string;
	organId?: string;
	fondName?: string;
	archivesTimeStart?: number;
	archivesTimeEnd?: number;
	archivesTime?:string
	paperTotal?: number;
	paperDigital?: number;
	language?: string;
	fondHistory?:string;
	keyGroups?:string;
	otherTypes?:string;
	lookupTools?:string;
	copyNumber?:number;
	description?:string;
	lstOtherTypes?:OtherTypeItem[],
	lstLanguage?:string[]
}

export interface ArcFontSearchType extends SearchBase {
  identifier?: string;
	organId?: string;
	fondName?: string;
	archivesTimeStart?: number;
	archivesTimeEnd?: number;
	paperTotal?: number;
	paperDigital?: number;
	language?: string;
}
