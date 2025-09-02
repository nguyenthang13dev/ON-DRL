import { PermissionType } from "@/types/role/role";

export const hasPermission = (
  permissions: PermissionType[],
  moduleCode: string,
  key: string
): boolean => {
  const foundModule = permissions.find((p) => p.moduleCode === moduleCode);
  return foundModule?.permissions?.[key] === true;
};

export const hasMultiPermission = (
  permissions: PermissionType[],
  moduleCode: string
): Record<string, boolean> => {
  const matchedModule = permissions.find(p => p.moduleCode === moduleCode);
  return matchedModule?.permissions ?? {};
};
