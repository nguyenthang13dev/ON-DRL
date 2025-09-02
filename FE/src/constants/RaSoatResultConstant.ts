import { createConstant } from './Constant'
const RaSoatResultConstant = createConstant(
  {
    DangCapNhat: 'Đang cập nhật',
    PhanAnhHopLe: 'Phản ánh hợp lệ',
    PhanAnhKhongHopLe: 'Phản ánh không hợp lệ',
  },
  {
    'Đang cập nhật': { displayName: 'Đang cập nhật' },
    'Phản ánh hợp lệ': { displayName: 'Phản ánh hợp lệ' },
    'Phản ánh không hợp lệ': { displayName: 'Phản ánh không hợp lệ' },
  }
)
export default RaSoatResultConstant
