import { createConstant } from "../Constant";
const LoaiHopDongLaoDongConstant = createConstant(
  {
    ChinhThuc: 1,
    ThuViec: 2,
    ThucTap: 3,
    VoThoiHan: 4,
  },
  {
    1: { displayName: "Chính thức" },
    2: { displayName: "Thử việc" },
    3: { displayName: "Thực tập" },
    4: { displayName: "Vô thời hạn" },
  }
);
export default LoaiHopDongLaoDongConstant;
