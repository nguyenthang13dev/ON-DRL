import { createConstant } from './Constant'
const LoaiPhanAnhChungConstant = createConstant(
  {
    Website: 'Website',
    SanPham: 'Sản phẩm',
  },
  {
    Website: {
      displayName: 'Website',
    },
    'Sản phẩm': { displayName: 'Sản phẩm' },
  }
)
export default LoaiPhanAnhChungConstant
