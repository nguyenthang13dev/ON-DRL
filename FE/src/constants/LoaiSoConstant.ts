import { createConstant } from "./Constant";
const LoaiSoConstant = createConstant(
  {
    SoDonThu: "SoDonThu",
    SoTiepDan: "SoTiepDan",
  },
  {
    SoDonThu: { displayName: "Sổ đơn thư" },
    SoTiepDan: { displayName: "Sổ tiếp dân" },
  }
);
export default LoaiSoConstant;
