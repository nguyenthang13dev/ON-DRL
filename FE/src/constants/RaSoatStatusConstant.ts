import { createConstant } from './Constant'
const RaSoatStatusConstant = createConstant(
  {
    MoiTao: 'Mới tạo',
    DangXuLy: 'Đang xử lý',
    DaXuLyXong: 'Đã xử lý xong',
  },
  {
    'Mới tạo': { displayName: 'Mới tạo' },
    'Đang xử lý': { displayName: 'Đang xử lý' },
    'Đã xử lý xong': { displayName: 'Đã xử lý xong' },
  }
)
export default RaSoatStatusConstant
