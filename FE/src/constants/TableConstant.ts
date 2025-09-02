import { createConstant } from "./Constant";
const TableConstant = createConstant(
  {
    QL_LanhDao: "QL_LanhDao",
    QLVuViec: "QLVuViec",
  },
  {
    QL_LanhDao: { displayName: "Quản lý lãnh đạo" },
    QLVuViec: { displayName: "Quản lý vụ việc" },
  }
);
export default TableConstant;
