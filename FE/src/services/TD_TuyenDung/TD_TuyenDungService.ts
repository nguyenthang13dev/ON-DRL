import { apiService } from "@/services";
import {
  Dictionary,
  DropdownOption,
  Response,
  ResponsePageList,
} from "@/types/general";
import {
  TD_TuyenDungType,
  TD_TuyenDungSearchType,
  TD_TuyenDungCreateType,
  TD_TuyenDungEditType,
} from "@/types/TD_TuyenDung/TD_TuyenDung";
import dayjs from "dayjs";

class TD_TuyenDungService {
  private static _instance: TD_TuyenDungService;
  public static get instance(): TD_TuyenDungService {
    if (!TD_TuyenDungService._instance) {
      TD_TuyenDungService._instance = new TD_TuyenDungService();
    }
    return TD_TuyenDungService._instance;
  }

  public async getData(
    searchData: TD_TuyenDungSearchType
  ): Promise<Response<ResponsePageList<TD_TuyenDungType[]>>> {
    // Chuyển đổi các trường trước khi gửi
    const payload = {
      ...searchData,
      ngayBatDau: searchData.ngayBatDau ? dayjs(searchData.ngayBatDau).format("YYYY-MM-DD") : undefined,
      ngayKetThuc: searchData.ngayKetThuc ? dayjs(searchData.ngayKetThuc).format("YYYY-MM-DD") : undefined,
    };
    const response = await apiService.post<
      Response<ResponsePageList<TD_TuyenDungType[]>>
    >("/TD_TuyenDung/GetData", payload);
    return response.data;
  }

  public async get(id: string): Promise<Response<TD_TuyenDungType>> {
    const response = await apiService.get<Response<TD_TuyenDungType>>(
      `/TD_TuyenDung/Get/${id}`
    );
    return response.data;
  }

  public async create(
    formData: TD_TuyenDungCreateType
  ): Promise<Response> {
    // Chuyển đổi các trường trước khi gửi
    const payload = {
      ...formData,
      ngayBatDau: formData.ngayBatDau ? dayjs(formData.ngayBatDau).format("YYYY-MM-DD") : undefined,
      ngayKetThuc: formData.ngayKetThuc ? dayjs(formData.ngayKetThuc).format("YYYY-MM-DD") : undefined,
      soLuongCanTuyen: formData.soLuongCanTuyen ? Number(formData.soLuongCanTuyen) : undefined,
    };
    const response = await apiService.post<Response>(
      "/TD_TuyenDung/Create",
      payload
    );
    return response.data;
  }

  public async update(
    formData: TD_TuyenDungEditType
  ): Promise<Response> {
    // Chuyển đổi các trường trước khi gửi
    const payload = {
      ...formData,
      ngayBatDau: formData.ngayBatDau ? dayjs(formData.ngayBatDau).format("YYYY-MM-DD") : undefined,
      ngayKetThuc: formData.ngayKetThuc ? dayjs(formData.ngayKetThuc).format("YYYY-MM-DD") : undefined,
      soLuongCanTuyen: formData.soLuongCanTuyen ? Number(formData.soLuongCanTuyen) : undefined,
    };
    const response = await apiService.post<Response>(
      "/TD_TuyenDung/Update",
      payload
    );
    return response.data;
  }

  public async delete(id: string): Promise<Response> {
    const response = await apiService.delete<Response>(
      `/TD_TuyenDung/Delete/${id}`
    );
    return response.data;
  }

  // Lấy dropdown options cho các trường cần thiết
  public async getDropdowns(): Promise<Response<Dictionary<DropdownOption[]>>> {
    const response = await apiService.get<
      Response<Dictionary<DropdownOption[]>>
    >("/TD_TuyenDung/getDropDowns");
    return response.data;
  }

  // Export Excel
  public async exportExcel(
    search: TD_TuyenDungSearchType
  ): Promise<Response<string>> {
    const response = await apiService.post<Response>(
      "/TD_TuyenDung/exportExcel",
      search
    );
    return response.data;
  }

  // Cập nhật trạng thái vị trí tuyển dụng
  public async updateStatus({ id, trangThai }: { id: string, trangThai: number }) {
    const response = await apiService.post<Response>(
      "/TD_TuyenDung/UpdateStatus",
      { Id: id, TrangThai: trangThai }
    );
    return response.data;
  }
}

const tdTuyenDungService = TD_TuyenDungService.instance;
export default tdTuyenDungService;