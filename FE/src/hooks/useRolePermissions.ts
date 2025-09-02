import { useSelector } from "react-redux";
import { VaiTroConstant } from "@/constants/VaiTroConstant";

export interface RolePermissions {
  // Core roles
  isAdmin: boolean;
  isDev: boolean;
  isTester: boolean;
  isTruongBan: boolean;
  
  // Use Case permissions
  canCreateUseCase: boolean;
  canEditUseCase: boolean;
  canDeleteUseCase: boolean;
  canViewAllUseCases: boolean;
  
  // Test Case permissions  
  canCreateTestCase: boolean;
  canEditTestCase: boolean;
  canDeleteTestCase: boolean;
  canExecuteTest: boolean;
  canViewTestDetails: boolean;
  
  // Test Results permissions
  canUpdateTestStatus: boolean;
  canAddTestNotes: boolean;
  canViewTestHistory: boolean;
  canMarkAsCompleted: boolean;
  
  // Import/Export permissions
  canImportExcel: boolean;
  canExportData: boolean;
  
  // View permissions
  canAccessAdminView: boolean;
  canAccessDevView: boolean;
  canAccessTesterView: boolean;
  canAccessDetailedView: boolean;
  
  // Advanced permissions
  canViewSystemMetrics: boolean;
  canManageProjectSettings: boolean;
  canAssignTestCases: boolean;
  canApproveTestResults: boolean;

  //View Tài liệu dự án
  canViewTaiLieuDuAn: boolean;
  canEditTaiLieuDuAn: boolean;
  canUploadTaiLieuDuAn: boolean;
  canDeleteTaiLieuDuAn: boolean;

  //Kế hoạch triển khai KH
  canViewKeHoachTrienKhaiKH: boolean;
  canCreateKeHoachTrienKhaiKH: boolean;
  canEditKeHoachTrienKhaiKH: boolean;
  canUploadKeHoachTrienKhaiKH: boolean;
  canDeleteKeHoachTrienKhaiKH: boolean;
  canExportExcelKeHoachTrienKhaiKH: boolean;
  canImportExceltKeHoachTrienKhaiKH: boolean;
  canDowloadTemplateKeHoachTrienKhaiKH: boolean;
  canSuDungMauKeHoachTrienKhaiKH: boolean;


  //Kế hoạch triển khai Nội bộ
  canViewKeHoachTrienKhaiNoiBo: boolean;
  canEditKeHoachTrienKhaiNoiBo: boolean;
  canDeleteKeHoachTrienKhaiNoiBo: boolean;
  canCreateKeHoachTrienKhaiNoiBo: boolean;
  canUpdateProgressAndTimeKeHoachTrienKhaiNoiBo: boolean;
  canEditNoiDungCongViec : boolean;
  canEditPhanCongKeHoachTrienKhaiNoiBo : boolean;
  canEditPhanCongKHKeHoachTrienKhaiNoiBo : boolean;


  //Phân công dự án
  canViewPhanCongDuAn: boolean;
  canEditPhanCongDuAn: boolean;
  canDeletePhanCongDuAn: boolean;
  canCreatePhanCongDuAn: boolean;




}

export const useRolePermissions = (): RolePermissions => {
  const listRoles = useSelector((state: any) => state.auth.User?.listRole) || [];
    
  const isAdmin = listRoles.includes(VaiTroConstant.Admin);
  const isTruongBan = listRoles.includes(VaiTroConstant.TruongBan);
  const isDev = listRoles.includes(VaiTroConstant.Dev);
  const isTester = listRoles.includes(VaiTroConstant.Tester);
  const isQA = listRoles.includes(VaiTroConstant.QA);
  
  return {
    // Core roles
    isAdmin,
    isDev,
    isTester,
    isTruongBan,
    // Use Case permissions
    canCreateUseCase: isAdmin || isDev || isTester || isTruongBan,
    canEditUseCase: isAdmin || isDev || isTester || isTruongBan,
    canDeleteUseCase: isAdmin || isTester || isTruongBan,
    canViewAllUseCases: isAdmin || isDev || isTester || isQA || isTruongBan,
    
    // Test Case permissions
    canCreateTestCase: isAdmin || isDev || isTester || isTruongBan  ,
    canEditTestCase: isAdmin || isDev || isTester || isTruongBan,
    canDeleteTestCase: isAdmin || isDev || isTester || isTruongBan,
    canExecuteTest: isAdmin || isDev || isTester || isQA || isTruongBan,
    canViewTestDetails: isAdmin || isDev || isTester || isQA || isTruongBan,
    
    // Test Results permissions - Allow both Dev and Tester to edit status and notes
    canUpdateTestStatus: isAdmin || isDev || isTester || isQA || isTruongBan,
    canAddTestNotes: isAdmin || isDev || isTester || isQA || isTruongBan,
    canViewTestHistory: isAdmin || isDev || isTester || isQA || isTruongBan,
    canMarkAsCompleted: isAdmin || isDev || isTester || isQA || isTruongBan,
    
    // Import/Export permissions
    canImportExcel: isAdmin || isTester || isTruongBan,
    canExportData: isAdmin || isDev || isTester || isTruongBan,
    
    // View permissions
    canAccessAdminView: isAdmin || isTester || isTruongBan,
    canAccessDevView: isDev ,
    canAccessTesterView:  isQA ,
    canAccessDetailedView: isAdmin || isDev || isTester || isQA || isTruongBan,
    
    // Advanced permissions
    canViewSystemMetrics: isAdmin || isTester || isTruongBan,
    canManageProjectSettings: isAdmin || isTester || isTruongBan,
    canAssignTestCases: isAdmin || isDev || isTester || isTruongBan,
    canApproveTestResults: isAdmin || isQA || isTester || isTruongBan,

     //View Tài liệu dự án
     canViewTaiLieuDuAn: isAdmin || isDev || isTester || isTruongBan,
     canEditTaiLieuDuAn: isAdmin || isTruongBan,
     canUploadTaiLieuDuAn: isAdmin || isDev || isTester || isTruongBan,
     canDeleteTaiLieuDuAn: isAdmin  || isTruongBan,

     //Phân công dự án
     canViewPhanCongDuAn: isAdmin || isDev || isTester || isTruongBan,
     canEditPhanCongDuAn: isAdmin || isTruongBan,
     canDeletePhanCongDuAn: isAdmin || isTruongBan,
     canCreatePhanCongDuAn: isAdmin ||  isTruongBan,

    //Kế hoạch triển khai KH
    canViewKeHoachTrienKhaiKH: isAdmin || isDev || isTester || isTruongBan,
    canEditKeHoachTrienKhaiKH: isAdmin ||  isTruongBan,
    canUploadKeHoachTrienKhaiKH: isAdmin || isTruongBan,
    canDeleteKeHoachTrienKhaiKH: isAdmin ||  isTruongBan,
    canExportExcelKeHoachTrienKhaiKH: isAdmin || isDev || isTester || isTruongBan,  
    canImportExceltKeHoachTrienKhaiKH: isAdmin || isTruongBan,
    canDowloadTemplateKeHoachTrienKhaiKH: isAdmin || isDev || isTester || isTruongBan,
    canSuDungMauKeHoachTrienKhaiKH: isAdmin ||  isTruongBan,
    canCreateKeHoachTrienKhaiKH: isAdmin ||  isTruongBan,

    //Kế hoạch triển khai Nội bộ
    canViewKeHoachTrienKhaiNoiBo: isAdmin || isDev || isTester || isTruongBan,
    canEditKeHoachTrienKhaiNoiBo: isAdmin || isDev || isTester || isTruongBan,
    canDeleteKeHoachTrienKhaiNoiBo: isAdmin ||isTruongBan,
    canCreateKeHoachTrienKhaiNoiBo: isAdmin ||  isTruongBan,
    canUpdateProgressAndTimeKeHoachTrienKhaiNoiBo: isAdmin || isDev || isTester || isTruongBan,
    canEditNoiDungCongViec : isAdmin || isTruongBan,
    canEditPhanCongKeHoachTrienKhaiNoiBo : isAdmin || isTruongBan,
    canEditPhanCongKHKeHoachTrienKhaiNoiBo : isAdmin || isTruongBan,





  };
}; 