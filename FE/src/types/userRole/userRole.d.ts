import { Department } from "../department/department";

export interface createEditType {
  userId: string;
  roleCode?: string[];
  idGroupRoles?: string[];
  //deparmentId: string;
}

export interface searchUserRole extends SearchBase {
  name?: string;
  code?: string;
  isShow?: boolean;
}

export interface tableUserRoleVMData {
  id?: string;
  userId: string;
  departments: Department[];
}
