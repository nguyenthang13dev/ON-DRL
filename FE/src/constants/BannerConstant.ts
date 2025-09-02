import { createConstant } from "./Constant";
const BannerConstant = createConstant(
  {
    Slide: "SLIDE",
    Static: "STATIC",
  },
  {
    SLIDE: { displayName: "Banner Slide" },
    STATIC: { displayName: "Banner Tĩnh" },
  }
);

export default BannerConstant;
