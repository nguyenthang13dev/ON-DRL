import { createConstant } from "../Constant";
const TrangThaiConstant = createConstant(
  {
    DangLamViec: 1,
    NghiViec: 0,
  },
  {
    1: { displayName: "Đang làm việc" },
    0: { displayName: "Nghỉ việc" },
  }
);
export default TrangThaiConstant;
