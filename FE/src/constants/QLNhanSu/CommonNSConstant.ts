import { createConstant } from "../Constant";
const FilterKeys = createConstant(
  {
    Gender: "GENDER",
    Department: "DEPARTMENT",
    StatusWork: "STATUSWORK",
  },
  {
    Gender: { displayName: "Giới tính" },
    Department: { displayName: "Phòng ban" },
    StatusWork: { displayName: "Trạng thái làm việc" },
  }
);
export default FilterKeys;
