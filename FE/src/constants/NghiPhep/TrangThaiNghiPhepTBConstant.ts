import { createConstant } from "../Constant";
const TrangThaiNghiPhepTBConstant = createConstant(
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
    1: { displayName: "Chờ duyệt" },
    2: { displayName: "Đã phê duyệt" },
    3: { displayName: "Gửi tổng giám đốc" },
    4: { displayName: "Tổng giám đốc phê duyệt" },
    5: { displayName: "Đã từ chối" },
    6: { displayName: "Tổng giám đốc từ chối" },
    7: { displayName: "Hủy đăng ký" },
  }
);

export default TrangThaiNghiPhepTBConstant;
