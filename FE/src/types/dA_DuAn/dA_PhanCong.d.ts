import { EntityType, SearchBase } from "../general";


export interface DA_PhanCongType extends EntityType {
  // duAnId: string;
  vaiTroId?: string | null;
  userId?: string;
  tenVaiTro?: string | null;  
  tenUser?: string | null;
  // isActive?: boolean;
  // orderBy?: string;
}


export interface DA_PhanCongCreateOrUpdateType {
  id?: string;
  duAnId: string;
  vaiTroId?: string | null;
  userId: string;
  orderBy?: string;
}


export interface DA_PhanCongSearchType extends SearchBase {
  duAnId?: string;
  vaiTroId?: string;
  userId?: string;
  orderBy?: string;
}
