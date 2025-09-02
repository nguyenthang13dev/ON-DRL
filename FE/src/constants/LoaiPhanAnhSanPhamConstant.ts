import { createConstant } from './Constant'
const LoaiPhanAnhSanPhamConstant = createConstant(
  {
    BanQuyen: 'Vi phạm bản quyền',
    HangGia: 'Hàng giả, hàng nhái',
    NoiDungSo: 'Sử dụng trái phép nội dung số',
    LoiSP: 'Lỗi sản phẩm',
    ChatLuong: 'Kém chất lượng',
    SaiMoTa: 'Không đúng mô tả',
    TangGia: 'Tăng giá không rõ ràng',
    Khac: 'Khác',
  },
  {
    'Vi phạm bản quyền': {
      displayName: 'Vi phạm bản quyền',
    },
    'Hàng giả, hàng nhái': { displayName: 'Hàng giả, hàng nhái' },
    'Sử dụng trái phép nội dung số': {
      displayName: 'Sử dụng trái phép nội dung số',
    },
    'Lỗi sản phẩm': {
      displayName: 'Lỗi sản phẩm',
    },
    'Kém chất lượng': {
      displayName: 'Kém chất lượng',
    },
    'Không đúng mô tả': {
      displayName: 'Không đúng mô tả',
    },
    'Tăng giá không rõ ràng': {
      displayName: 'Tăng giá không rõ ràng',
    },
    Khác: {
      displayName: 'Khác',
    },
  }
)
export default LoaiPhanAnhSanPhamConstant
