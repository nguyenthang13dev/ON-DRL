import { createConstant } from "./Constant";
const ChuyenMucTinTucConstant = createConstant(
  {
    GiamSatTMDT: "GIAM_SAT_TMDT",
    ChuyenMucHangHoa: "Chuyen_muc_hang_that_hang_gia",
  },
  {
    GiamSatTMDT: {
      displayName:
        "	Quản lý tin tức, thông báo về công tác giám sat hoạt động TMĐT",
    },
    ChuyenMucHangHoa: {
      displayName: "Quản lý dấu hiệu nhận biết hàng thật, hàng giả",
    },
  }
);
export default ChuyenMucTinTucConstant;
