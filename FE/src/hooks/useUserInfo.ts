import { useSelector } from 'react-redux';
import { useMemo } from 'react';
import { RootState } from '@/store/store';
import { UserType } from '@/types/auth/User';

/**
 * Hook để lấy thông tin user từ Redux store
 * @returns Object chứa thông tin user và các utility functions
 */
export const useUserInfo = () => {
  const user = useSelector((state: RootState) => state.auth.User);
  const accessToken = useSelector((state: RootState) => state.auth.AccessToken);
  const listRole = useSelector((state: RootState) => state.auth.ListRole);

  // Memoize các giá trị được tính toán
  const userInfo = useMemo(() => {
    if (!user) {
      return {
        user: null,
        userId: null,
        userName: null,
        userEmail: null,
        userPicture: null,
        userDonViId: null,
        userTenDonVi: null,
        userCapBac: null,
        userAnhDaiDien: null,
        userGender: null,
        isLoggedIn: false,
        isSSO: false,
        isHasRole: false,
        listRole: [],
        accessToken: null,
        menuData: [],
        permissions: [],
        hasAnyRole: false,
        isAdmin: false,
        getDisplayName: () => 'Chưa đăng nhập',
        getAvatarUrl: () => null,
        hasRole: () => false,
        hasPermission: () => false,
      };
    }

    return {
      // Raw user object
      user,
      
      // User basic info
      userId: user.id || null,
      userName: user.name || null,
      userEmail: user.email || null,
      userPicture: user.picture || null,
      userDonViId: user.donViId || null,
      userTenDonVi: user.tenDonVi_txt || null,
      userCapBac: user.capBac || null,
      userAnhDaiDien: user.anhDaiDien || null,
      userGender: user.gender || null,
      
      // Auth status
      isLoggedIn: true,
      isSSO: user.isSSO || false,
      isHasRole: user.isHasRole || false,
      
      // Roles and permissions
      listRole: user.listRole || listRole || [],
      accessToken: accessToken || null,
      menuData: user.menuData || [],
      permissions: user.permissions || [],
      
      // Computed properties
      hasAnyRole: Boolean(user.listRole?.length || listRole?.length),
      isAdmin: Boolean(user.listRole?.includes('Admin') || listRole?.includes('Admin')),
      
      // Utility functions
      getDisplayName: () => {
        return user.name || user.email || 'Người dùng';
      },
      
      getAvatarUrl: () => {
        return user.anhDaiDien || user.picture || null;
      },
      
      hasRole: (roleName: string) => {
        const roles = user.listRole || listRole || [];
        return roles.includes(roleName);
      },
      
      hasPermission: (permissionName: string) => {
        const permissions = user.permissions || [];
        return permissions.some((p: any) => p.name === permissionName);
      },
    };
  }, [user, accessToken, listRole]);

  return userInfo;
};

/**
 * Hook đơn giản chỉ trả về user object
 */
export const useUser = (): UserType | null => {
  return useSelector((state: RootState) => state.auth.User);
};

/**
 * Hook để kiểm tra trạng thái đăng nhập
 */
export const useAuthStatus = () => {
  const user = useSelector((state: RootState) => state.auth.User);
  const accessToken = useSelector((state: RootState) => state.auth.AccessToken);
  
  return useMemo(() => ({
    isLoggedIn: Boolean(user && accessToken),
    isLoading: false, // Có thể thêm loading state từ Redux nếu cần
    user,
    accessToken,
  }), [user, accessToken]);
};

/**
 * Hook để lấy thông tin về roles
 */
export const useUserRoles = () => {
  const user = useSelector((state: RootState) => state.auth.User);
  const listRole = useSelector((state: RootState) => state.auth.ListRole);
  
  return useMemo(() => {
    const roles = user?.listRole || listRole || [];
    
    return {
      roles,
      hasAnyRole: roles.length > 0,
      isAdmin: roles.includes('Admin'),
      isSuperAdmin: roles.includes('SuperAdmin'),
      hasRole: (roleName: string) => roles.includes(roleName),
      hasAnyRoles: (roleNames: string[]) => roleNames.some(role => roles.includes(role)),
      hasAllRoles: (roleNames: string[]) => roleNames.every(role => roles.includes(role)),
    };
  }, [user?.listRole, listRole]);
};

/**
 * Hook để lấy thông tin về permissions
 */
export const useUserPermissions = () => {
  const user = useSelector((state: RootState) => state.auth.User);
  
  return useMemo(() => {
    const permissions = user?.permissions || [];
    
    return {
      permissions,
      hasAnyPermission: permissions.length > 0,
      hasPermission: (permissionName: string) => 
        permissions.some((p: any) => p.name === permissionName),
      hasAnyPermissions: (permissionNames: string[]) => 
        permissionNames.some(name => permissions.some((p: any) => p.name === name)),
      hasAllPermissions: (permissionNames: string[]) => 
        permissionNames.every(name => permissions.some((p: any) => p.name === name)),
      getPermissionsByModule: (moduleCode: string) => 
        permissions.filter((p: any) => p.moduleCode === moduleCode),
    };
  }, [user?.permissions]);
};

export default useUserInfo;
