import { createConstant } from './Constant'
const LoaiTinTucConstant = createConstant(
  {
    TinTuc: "tintuc",
    ThongBao: "thongbao"
  },
  {
    "tintuc": { displayName: 'Tin tức' },
    "thongbao": { displayName: 'Thông báo' },
  }
)
export default LoaiTinTucConstant
