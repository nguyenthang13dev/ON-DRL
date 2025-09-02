export interface roleType {
  id: string | null;
  name: string | null;
  code: string | null;
  type: string | null;
  isActive: boolean;
}

export interface tableRoleType {
  id: string;
  name: string | null;
  code: string | null;
  type: string | null;
  isActive: boolean;
}

export interface createEditType {
  id: string | null;
  name: string | null;
  code: string | null;
  type: string | null;
  isActive: boolean;
}

export interface searchRole extends SearchBase {
  name?: string;
  code?: string;
  isShow?: boolean;
}


export interface PermissionType {
  moduleCode?: string;
  moduleName?: string;
  permissions: {
    [key: string]: boolean;
  };
}