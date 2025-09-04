import { useSelector } from '@/store/hooks';
import { RootState } from '@/store/store';
import { UserType } from '@/types/auth/User';
import { MenuDataType } from '@/types/menu/menu';
import { PermissionType } from '@/types/role/role';
import React from 'react';

/**
 * Custom Hook để lấy thông tin user, roles, operations và permissions từ Redux store
 */
export const usePermissionHelper = () => {
  // Lấy dữ liệu từ store với null checking
  const user: UserType | null = useSelector((state: RootState) => state?.auth?.User ?? null);
  const listRole: string[] | null = useSelector((state: RootState) => state?.auth?.ListRole ?? null);
  const menuData: MenuDataType[] | null = useSelector((state: RootState) => state?.menu?.menuData ?? null);
  const permissions: PermissionType[] | null = useSelector((state: RootState) => state?.permission?.permissions ?? null);

  /**
   * Lấy danh sách roles của user
   * @returns string[] - Danh sách role codes
   */
  const getUserRoles = (): string[] => {
    if (!user && !listRole) return [];
    return user?.listRole || listRole || [];
  };

  /**
   * Lấy danh sách operations từ menuData
   * @returns string[] - Danh sách operation codes mà user có quyền truy cập
   */
  const getUserOperations = (): string[] => {
    if (!menuData) return [];

    const operations: string[] = [];
    
    menuData.forEach(menu => {
      if (menu.listMenu && Array.isArray(menu.listMenu)) {
        menu.listMenu.forEach(item => {
          // Chỉ lấy những item có quyền truy cập
          if (item.isAccess === true && item.code) {
            operations.push(item.code);
          }
        });
      }
    });

    return operations;
  };

  /**
   * Lấy danh sách permissions
   * @returns PermissionType[] - Danh sách permissions
   */
  const getUserPermissions = (): PermissionType[] => {
    return permissions || [];
  };

  /**
   * Kiểm tra user có role cụ thể không
   * @param roleName - Tên role cần kiểm tra
   * @returns boolean
   */
  const hasRole = (roleName: string): boolean => {
    const roles = getUserRoles();
    return roles.includes(roleName);
  };

  /**
   * Kiểm tra user có operation cụ thể không
   * @param operationCode - Mã operation cần kiểm tra
   * @returns boolean
   */
  const hasOperation = (operationCode: string): boolean => {
    const operations = getUserOperations();
    return operations.includes(operationCode);
  };

  /**
   * Kiểm tra user có permission cụ thể không
   * @param moduleCode - Mã module cần kiểm tra
   * @param permissionKey - Key permission cần kiểm tra
   * @returns boolean
   */
const hasPermission = (moduleCode: string, permissionKey: string): boolean => {
  const userPermissions = getUserPermissions() ?? [];
  console.log("Checking permission for module:", moduleCode, "userPermissions:", userPermissions);

  const modulePermission = userPermissions.find(
    (permission) => permission?.moduleCode?.toUpperCase() === moduleCode.toUpperCase()
  );


  console.log(modulePermission);
  
  const result = modulePermission?.permissions?.[permissionKey] === true;
  console.log(`Permission check: module=${moduleCode}, key=${permissionKey}, result=${result}`);
  return result;
};

  /**
   * Kiểm tra user có bất kỳ role nào trong danh sách không
   * @param roleNames - Danh sách tên roles cần kiểm tra
   * @returns boolean
   */
  const hasAnyRole = (roleNames: string[]): boolean => {
    const userRoles = getUserRoles();
    return roleNames.some(roleName => userRoles.includes(roleName));
  };

  /**
   * Kiểm tra user có tất cả roles trong danh sách không
   * @param roleNames - Danh sách tên roles cần kiểm tra
   * @returns boolean
   */
  const hasAllRoles = (roleNames: string[]): boolean => {
    const userRoles = getUserRoles();
    return roleNames.every(roleName => userRoles.includes(roleName));
  };

  /**
   * Kiểm tra user có bất kỳ operation nào trong danh sách không
   * @param operationCodes - Danh sách mã operations cần kiểm tra
   * @returns boolean
   */
  const hasAnyOperation = (operationCodes: string[]): boolean => {
    const operations = getUserOperations();
    return operationCodes.some(code => operations.includes(code));
  };

  /**
   * Kiểm tra user có tất cả operations trong danh sách không
   * @param operationCodes - Danh sách mã operations cần kiểm tra
   * @returns boolean
   */
  const hasAllOperations = (operationCodes: string[]): boolean => {
    const operations = getUserOperations();
    return operationCodes.every(code => operations.includes(code));
  };

  /**
   * Lấy thông tin chi tiết của user
   * @returns UserType | null
   */
  const getUserInfo = (): UserType | null => {
    console.log("getUserInfo", user);
    return user;
  };

  /**
   * Kiểm tra user đã đăng nhập hay chưa
   * @returns boolean
   */
  const isAuthenticated = (): boolean => {
    return !!user && !!user.id && user.id !== null && user.id !== '';
  };

  /**
   * Lấy menu data theo nhóm
   * @param groupName - Tên nhóm menu
   * @returns MenuDataType | undefined
   */
  const getMenuByGroup = (groupName: string): MenuDataType | undefined => {
    if (!menuData) return undefined;
    return menuData.find(menu => menu.name === groupName);
  };

  /**
   * Lấy tất cả menu items có quyền truy cập
   * @returns array of menu items
   */
  const getAccessibleMenuItems = () => {
    if (!menuData) return [];

    const accessibleItems: any[] = [];
    
    menuData.forEach(menu => {
      if (menu.listMenu && Array.isArray(menu.listMenu)) {
        const accessibleSubItems = menu.listMenu.filter(item => item.isAccess === true);
        if (accessibleSubItems.length > 0) {
          accessibleItems.push({
            ...menu,
            listMenu: accessibleSubItems
          });
        }
      }
    });

    return accessibleItems;
  };

  return {
    // Data getters
    getUserRoles,
    getUserOperations,
    getUserPermissions,
    getUserInfo,
    getMenuByGroup,
    getAccessibleMenuItems,

    // Permission checkers
    hasRole,
    hasOperation,
    hasPermission,
    hasAnyRole,
    hasAllRoles,
    hasAnyOperation,
    hasAllOperations,
    isAuthenticated,

    // Raw data
    user,
    listRole,
    menuData,
    permissions
  };
};

/**
 * Higher Order Component để bảo vệ component dựa trên quyền
 * @param WrappedComponent - Component cần bảo vệ
 * @param requiredOperations - Danh sách operations cần có
 * @param requiredRoles - Danh sách roles cần có (optional)
 * @param fallbackComponent - Component hiển thị khi không có quyền (optional)
 */
export const withPermission = <T extends object>(
  WrappedComponent: React.ComponentType<T>,
  requiredOperations: string[] = [],
  requiredRoles: string[] = [],
  FallbackComponent?: React.ComponentType
) => {
  const WithPermissionComponent = (props: T) => {
    const { hasAnyOperation, hasAnyRole, isAuthenticated } = usePermissionHelper();

    // Kiểm tra đăng nhập
    if (!isAuthenticated()) {
      return FallbackComponent ? <FallbackComponent /> : null;
    }

    // Kiểm tra operations
    if (requiredOperations.length > 0 && !hasAnyOperation(requiredOperations)) {
      return FallbackComponent ? <FallbackComponent /> : null;
    }

    // Kiểm tra roles (nếu có)
    if (requiredRoles.length > 0 && !hasAnyRole(requiredRoles)) {
      return FallbackComponent ? <FallbackComponent /> : null;
    }

    return <WrappedComponent {...props} />;
  };

  WithPermissionComponent.displayName = `withPermission(${WrappedComponent.displayName || WrappedComponent.name})`;

  return WithPermissionComponent;
};

/**
 * Component để hiển thị nội dung dựa trên quyền
 */
export interface PermissionGateProps {
  children: React.ReactNode;
  operations?: string[];
  roles?: string[];
  requireAll?: boolean; // true: yêu cầu tất cả quyền, false: yêu cầu ít nhất 1 quyền
  fallback?: React.ReactNode;
}

export const PermissionGate: React.FC<PermissionGateProps> = ({
  children,
  operations = [],
  roles = [],
  requireAll = false,
  fallback = null
}) => {
  const {
    hasAnyOperation,
    hasAllOperations,
    hasAnyRole,
    hasAllRoles,
    isAuthenticated
  } = usePermissionHelper();

  // Kiểm tra đăng nhập
  if (!isAuthenticated()) {
    return <>{fallback}</>;
  }

  let hasPermission = true;

  // Kiểm tra operations
  if (operations.length > 0) {
    hasPermission = requireAll 
      ? hasAllOperations(operations)
      : hasAnyOperation(operations);
  }

  // Kiểm tra roles (nếu có)
  if (hasPermission && roles.length > 0) {
    hasPermission = requireAll
      ? hasAllRoles(roles)
      : hasAnyRole(roles);
  }

  return hasPermission ? <>{children}</> : <>{fallback}</>;
};

export default usePermissionHelper;
