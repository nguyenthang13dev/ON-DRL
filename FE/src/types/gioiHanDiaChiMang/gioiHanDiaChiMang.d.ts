import { EntityType, SearchBase } from "../general";

export interface GioiHanDiaChiMangType extends EntityType {
  ipAddress: string;
  allowed: boolean;
}

export interface GioiHanDiaChiMangCreateOrUpdateType {
  id?: string;
  ipAddress: string;
  allowed: boolean;
}

export interface GioiHanDiaChiMangSearchType extends SearchBase {
  ipAddress?: string;
  allowed?: boolean;
}
