import { createConstant } from './Constant'
const LoaiPhanAnhWebsiteConstant = createConstant(
  {
    HangGia: 'Kinh doanh hàng giả, hàng cấm',
    HuyDongVon: 'Huy động vốn trái phép',
    GiaMaoWebsite: 'Giả mạo thông tin đăng ký trên website TMĐT',
    GiaMaoNhanHieu:
      'Giả mạo nhãn hiệu đăng ký các chương trình đánh giá tín nhiệm',
    MaoDanhLienHe:
      'Mạo danh mối liên hệ để gây nhầm lẫn với thương nhân, tổ chức, cá nhân khác',
    GiaMaoDuongDan: 'Giả mạo đường dẫn cung cấp thông tin sai lệch',
    MaoDanhWebsite: 'Mạo danh, giả mạo website hoặc thương nhân, tổ chức khác',
    ViPhamQuyDinh: 'Vi phạm các quy định về giao kết hợp đồng',
    LuaDaoThanhToan: 'Lừa đảo trong thanh toán',
    ChuaDangKy: 'Phản ánh chưa đăng ký, thông báo',
    Khac: 'Các hành vi khác',
  },
  {
    'Kinh doanh hàng giả, hàng cấm': {
      displayName: 'Kinh doanh hàng giả, hàng cấm',
    },
    'Huy động vốn trái phép': { displayName: 'Huy động vốn trái phép' },
    'Giả mạo thông tin đăng ký trên website TMĐT': {
      displayName: 'Giả mạo thông tin đăng ký trên website TMĐT',
    },
    'Giả mạo nhãn hiệu đăng ký các chương trình đánh giá tín nhiệm': {
      displayName:
        'Giả mạo nhãn hiệu đăng ký các chương trình đánh giá tín nhiệm',
    },
    'Mạo danh mối liên hệ để gây nhầm lẫn với thương nhân, tổ chức, cá nhân khác':
      {
        displayName:
          'Mạo danh mối liên hệ để gây nhầm lẫn với thương nhân, tổ chức, cá nhân khác',
      },
    'Giả mạo đường dẫn cung cấp thông tin sai lệch': {
      displayName: 'Giả mạo đường dẫn cung cấp thông tin sai lệch',
    },
    'Mạo danh, giả mạo website hoặc thương nhân, tổ chức khác': {
      displayName: 'Mạo danh, giả mạo website hoặc thương nhân, tổ chức khác',
    },
    'Vi phạm các quy định về giao kết hợp đồng': {
      displayName: 'Vi phạm các quy định về giao kết hợp đồng',
    },
    'Lừa đảo trong thanh toán': {
      displayName: 'Lừa đảo trong thanh toán',
    },
    'Phản ánh chưa đăng ký, thông báo': {
      displayName: 'Phản ánh chưa đăng ký, thông báo',
    },
    'Các hành vi khác': {
      displayName: 'Các hành vi khác',
    },
  }
)
export default LoaiPhanAnhWebsiteConstant
