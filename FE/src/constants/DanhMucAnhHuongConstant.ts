import { createConstant } from './Constant'
const DanhMucAnhHuongConstant = createConstant(
  {
    SanPham: 'Sản phẩm',
    ThuongHieu: 'Thương hiệu',
  },
  {
    'Sản phẩm': { displayName: 'Sản phẩm' },
    'Thương hiệu': { displayName: 'Thương hiệu' },
  }
)
export default DanhMucAnhHuongConstant
