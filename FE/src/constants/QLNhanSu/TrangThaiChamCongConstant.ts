import { createConstant } from "../Constant";
const TrangThaiChamCongConstant = createConstant(
  {
    BinhThuong: 0,
    DiMuon: 1,
    VeSom: 2,
    ChuaChamCong: 3,
  },
  {
    0: { displayName: "Bình thường" },
    1: { displayName: "Đi muộn" },
    2: { displayName: "Về sớm" },
    3: { displayName: "Chưa chấm công" },
  }
);
export default TrangThaiChamCongConstant;
