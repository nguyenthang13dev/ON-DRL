import { createConstant } from "../Constant";
const TrangThaiNghiPhepTGDConstant = createConstant(
  {
    GuiTongGiamDoc: 3,
    TongGiamDocPheDuyet: 4,
    TongGiamDocTuChoi: 6,
  },
  {
    3: { displayName: "Chờ duyệt" },
    4: { displayName: "Đã phê duyệt" },
    6: { displayName: "Đã từ chối" },
  }
);

export default TrangThaiNghiPhepTGDConstant;
