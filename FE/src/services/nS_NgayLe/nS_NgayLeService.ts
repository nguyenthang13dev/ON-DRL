import { apiService } from "@/services";
import {
  NS_NgayLeDto,
  NS_NgayLeSearchType,
  NS_NgayLeCreateUpdateType,
  PagedList,
  KeThuaDuLieuNamCuType,
} from "@/types/nS_NgayLe/NS_NgayLe";

const API_URL = "/NS_NgayLe";

const nS_NgayLeService = {
  // Lấy danh sách phân trang, tìm kiếm
  getData: (search: NS_NgayLeSearchType) =>
    apiService.post<DataResponse<PagedList<NS_NgayLeDto>>>(`${API_URL}/GetData`, search),

  // Lấy chi tiết
  get: (id: string) =>
    apiService.get<DataResponse<NS_NgayLeDto>>(`${API_URL}/Get/${id}`),

  // Tạo nhiều ngày lễ hoặc cập nhật (dùng chung VM)
  createMany: (data: NS_NgayLeCreateUpdateType[]) =>
    apiService.post<DataResponse<NS_NgayLeDto[]>>(`${API_URL}/CreateManyNgayLe`, data),

 keThuaDuLieuNamCu: (data: KeThuaDuLieuNamCuType) =>
    apiService.post<DataResponse<NS_NgayLeDto[]>>(`${API_URL}/KeThuaDuLieuNamCu`, data),
 
  // Lấy danh sách loại ngày lễ
  getLoaiNgayLe: () =>
    apiService.post<DataResponse<any[]>>(`${API_URL}/GetLoaiNgayLe`),

  importAllSundays: (year: number, loaiNLCode: string) =>
    apiService.post<DataResponse<NS_NgayLeDto[]>>(
      `${API_URL}/ImportAllSundays?year=${year}&loaiNLCode=${encodeURIComponent(loaiNLCode)}`
    ),

  // Xóa ngày lễ
  delete: (id: string) =>
    apiService.delete<DataResponse<any>>(`${API_URL}/Delete/${id}`),
};


export default nS_NgayLeService;

// Định nghĩa DataResponse cho đúng chuẩn backend
export interface DataResponse<T = any> {
  status: boolean;
  message?: string;
  data?: T;
} 