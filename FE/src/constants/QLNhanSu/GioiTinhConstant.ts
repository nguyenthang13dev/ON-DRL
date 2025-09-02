import { createConstant } from "../Constant";
const GioiTinhConstant = createConstant(
  {
    Nam: 1,
    Nu: 0,
    Khac: 2,
  },
  {
    1: { displayName: "Nam" },
    0: { displayName: "Nữ" },
    2: { displayName: "Khác" },
  }
);
export default GioiTinhConstant;
