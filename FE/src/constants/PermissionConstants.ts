// ===== PERMISSION CONSTANTS =====

import { DEFAULT_CIPHERS } from "tls";



export const MODULE_QUANTRIHETHONG =
{
  code: "QUANTRIHETHONG",
  name: 'Quản trị hệ thống',
  actions: {
    qLNguoiDung: 'QLNguoiDung',
    qLModule: 'QLModule',
    gioiHanDiaChiMang: 'GioiHanDiaChiMang',
    systemLog: 'SystemLog',
    nhomDanhMuc:'NhomDanhMuc',
    qLRole: 'QLRole',
    coCauToChuc: 'CoCauToChuc',
    qLGroupUser: 'QLGroupUser',
    create: 'canGroupUserCreate',
    view: 'canGroupUserView',
    edit: 'canGroupUserEdit',
    delete: 'canGroupUserDelete',
    setting:'canGroupUserSetting'//phân nhóm quyền
  }
};

export const MODULE_QUANLYDUAN={
  code: "QLDA",
  name: 'Quản lý dự án',
  actions: {
    list: 'DSDA',//Danh sách dự án
    viewAllNS: 'ViewAllNS',//Xem tất cả nhân sự
    testCase: 'TTC',//	Template Test Case
    create: 'canDuAnCreate',//Tạo mới dự án
    edit: 'canDuAnEdit',//Chỉnh sửa dự án
    delete: 'canDuAnDelete',//Xóa dự án
    view: 'canDuAnView',//Xem dự án
  }
}


