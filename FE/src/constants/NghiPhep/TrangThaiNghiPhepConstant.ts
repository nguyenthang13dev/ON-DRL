import { createConstant } from "../Constant";
const TrangThaiNghiPhepConstant = createConstant(
  {
    TaoMoi: 0,
    DaGuiTruongBan: 1,
    TruongBanDuyet: 2,
    GuiTongGiamDoc: 3,
    TongGiamDocPheDuyet: 4,
    TruongBanTuChoi: 5,
    TongGiamDocTuChoi: 6,
    HuyDangKy: 7,
  },
  {
    0: { displayName: "Tạo mới" },
    1: { displayName: "Đã gửi trưởng ban" },
    2: { displayName: "Trưởng ban phê duyệt" },
    3: { displayName: "Gửi tổng giám đốc" },
    4: { displayName: "Tổng giám đốc phê duyệt" },
    5: { displayName: "Trưởng ban từ chối" },
    6: { displayName: "Tổng giám đốc từ chối" },
    7: { displayName: "Hủy đăng ký" },
  }
);

export default TrangThaiNghiPhepConstant;
