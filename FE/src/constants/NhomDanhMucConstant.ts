import { createConstant } from "./Constant";
const NhomDanhMucConstant = createConstant(
  {
    TrangThaiDuAn: "TTDA",
    VaiTroDuAn: "VTDA",
    TrinhDoHocVan: "TDHV",
  },
  {
    TTDA: { displayName: "Trạng thái dự án" },
    VTDA: { displayName: "Vai trò dự án" },
    TDHV: { displayName: "Trình độ học vấn" },
  }
);
export default NhomDanhMucConstant;
