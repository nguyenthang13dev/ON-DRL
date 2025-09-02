import { createConstant } from './Constant'
const LoaiSanPhamConstant = createConstant(
  {
    TBDienTu: 'Thiết bị điện tử',
    ThoiTrang: 'Thời trang',
    DoGiaDung: 'Đồ gia dụng',
    VanPhongPham: 'Văn phòng phẩm',
    Khac: 'Khác',
  },
  {
    'Thiết bị điện tử': { displayName: 'Thiết bị điện tử' },
    'Thời trang': { displayName: 'Thời trang' },
    'Đồ gia dụng': { displayName: 'Đồ gia dụng' },
    'Văn phòng phẩm': { displayName: 'Văn phòng phẩm' },
    Khác: { displayName: 'Khác' },
  }
)
export default LoaiSanPhamConstant
