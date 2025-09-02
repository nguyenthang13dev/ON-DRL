import { createConstant } from './Constant'
const PhanAnhStatusConstant = createConstant(
  {
    MoiTao: 'Mới tạo',
    TuChoi: 'Từ chối',
    GhiNhan: 'Ghi nhận',
    DangRaSoat: 'Đang rà soát',
    DaRaSoat: 'Đã rà soát',
    
  },
  {
    'Mới tạo': { displayName: 'Mới tạo' },
    'Từ chối': { displayName: 'Từ chối' },
    'Ghi nhận': { displayName: 'Ghi nhận' },
    'Đang rà soát': { displayName: 'Đang rà soát' },
    'Đã rà soát': { displayName: 'Đã rà soát' },
  }
)
export default PhanAnhStatusConstant
