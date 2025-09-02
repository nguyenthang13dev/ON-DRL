export interface tableRoleOperationViewModelData {
  id?: string;
  roleId: string;
  operationId: string;
  isAccess: number;
  roleName?: string;
  operationName?: string[];
}

export interface createEditType {
  id?: string;
  roleId: string;
  listOperationCreateVM: OperationIdCreateData[];
}

export interface operationIdCreateData {
  isAccess: number;
  operationId: string;
}
