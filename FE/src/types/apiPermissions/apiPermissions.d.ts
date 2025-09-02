import { EntityType, SearchBase } from "../general";

export interface ApiPermissionsType extends EntityType {
  userId?: string;
  roleId?: string;
  path?: string;
}

export interface ApiPermissionsSaveType {
  roleId?: string;
  userId?: string;
  fullPermission: boolean;
  paths: string[];
  controllers: string[];
}

export interface ApiPermissionsSearchType extends SearchBase {}

export interface ApiPermissionGroupDataType {
  name: string;
  path: string;
  checked: boolean;
  actions: ApiPermissionActionType[];
}
export interface ApiPermissionActionType {
  name: string;
  path: string;
  checked: boolean;
}
