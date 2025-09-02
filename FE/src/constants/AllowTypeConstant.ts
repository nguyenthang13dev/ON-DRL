import { createConstant } from "./Constant";
const AllowTypeConstant = createConstant(
  {
    pdf: "application/pdf",
    image: "image/jpeg,image/png,image/jpg,image/gif",
    doc: "application/msword",
    docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    excel: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  },
  {
    pdf: { displayName: "File pdf" },
    image: { displayName: "File ảnh" },
    doc: { displayName: "File doc" },
    docx: { displayName: "File docx" },
    excel: { displayName: "File excel" },
  }
);

export default AllowTypeConstant;
