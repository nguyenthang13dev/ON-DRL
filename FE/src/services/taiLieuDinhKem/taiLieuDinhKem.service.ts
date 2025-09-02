import { Response, ResponsePageList } from "@/types/general";
import { apiService } from "..";
import {
  TaiLieuDinhKem,
  TaiLieuDinhKemSearch,
} from "@/types/taiLieuDinhKem/taiLieuDinhKem";

class TaiLieuDinhKemService {
  public static async AddPdfPath(AttachId: string): Promise<Response> {
    try {
      const response = await apiService.get<Response>(
        `TaiLieuDinhKem/AddPathPdf?AttachId=${AttachId}`
      );
      return response.data;
    } catch (err) {
      return {
        data: null,
        status: false,
        message: "failed",
      } as Response;
    }
  }
  public static async GetByIdsAsync(Ids: string): Promise<Response> {
    try {
      const response = await apiService.get<Response>(
        `TaiLieuDinhKem/GetByIds/${Ids}`
      );
      return response.data;
    } catch (err) {
      return {
        data: null,
        status: false,
        message: "failed",
      } as Response;
    }
  }
  public static async delete(id: string): Promise<Response> {
    const response = await apiService.delete<Response>(
      "/TaiLieuDinhKem/delete/" + id
    );
    return response.data;
  }

  public static async getData(
    searchData: TaiLieuDinhKemSearch
  ): Promise<Response<ResponsePageList<TaiLieuDinhKem[]>>> {
    const response = await apiService.post<
      Response<ResponsePageList<TaiLieuDinhKem[]>>
    >("/TaiLieuDinhKem/getData", searchData);
    console.log("Danh sách tài liệu = ", response);
    return response.data;
  }

  /**
   * Upload nhiều file đính kèm, truyền kèm extraData (ví dụ: LoaiTaiLieu, ItemId...)
   * @param files Danh sách file upload
   * @param extraData Thông tin bổ sung gửi kèm (nếu có)
   */
  public static async uploadMulti(
    files: File[],
    extraData?: Record<string, any>
  ): Promise<Response> {
    const formData = new FormData();
    files.forEach((file) => formData.append("files", file));
    if (extraData) {
      Object.entries(extraData).forEach(([key, value]) => {
        formData.append(key, value);
      });
    }
    // Gọi API upload (ví dụ: /TaiLieuDinhKem/upload-multi)
    const response = await apiService.post<Response>(
      "/TaiLieuDinhKem/upload-multi",
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );
    return response.data;
  }

  /**
   * Lấy danh sách file đính kèm theo ItemId và LoaiTaiLieu
   */
  public static async getByItemIdAndLoaiTaiLieu(
    itemId: string | number,
    loaiTaiLieu: string | number
  ): Promise<Response<TaiLieuDinhKem[]>> {
    const response = await apiService.get<Response<TaiLieuDinhKem[]>>(
      `/TaiLieuDinhKem/getByItemAndLoai?itemId=${itemId}&loaiTaiLieu=${loaiTaiLieu}`
    );
    return response.data;
  }
}
export default TaiLieuDinhKemService;
