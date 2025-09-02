import { createConstant } from "./Constant";
const TypeNotifyConstant = createConstant(
  {
    ThongBao: "ThongBao",
    TinTuc: "TinTuc",
  },
  {
    ThongBao: { displayName: "Thông báo" },
    TinTuc: { displayName: "Tin tức" },
  }
);
export default TypeNotifyConstant;
