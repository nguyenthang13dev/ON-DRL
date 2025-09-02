import { createConstant } from "./Constant";
const KieuDuLieuBieuMauConstant = createConstant(
  {
    text: "text",
    number: "number",
    checkbox: "checkbox",
    date: "date",
    editor: "editor",
    textarea: "textarea",
    filedinhkem: "filedinhkem",
  },
  {
    text: { displayName: "Chữ" },
    number: { displayName: "Số" },
    checkbox: { displayName: "Checkbox" },
    date: { displayName: "Ngày" },
    editor: { displayName: "Editor" },
    textarea: { displayName: "Textarea" },
    filedinhkem: { displayName: "File đính kèm" },
  }
);
export default KieuDuLieuBieuMauConstant;
