import { Response, ResponsePageList } from "@/types/general";
import
  {
    HoatDongNgoaiKhoaCreateEditType,
    HoatDongNgoaiKhoaType,
    SearchHoatDongNgoaiKhoaData,
    TableHoatDongNgoaiKhoaDataType,
  } from "@/types/hoatDongNgoaiKhoa/hoatDongNgoaiKhoa";
import { apiService } from "../index";

class HoatDongNgoaiKhoaService {
  private static _instance: HoatDongNgoaiKhoaService;

  public static get instance(): HoatDongNgoaiKhoaService {
    if (!HoatDongNgoaiKhoaService._instance) {
      HoatDongNgoaiKhoaService._instance = new HoatDongNgoaiKhoaService();
    }
    return HoatDongNgoaiKhoaService._instance;
  }

  public async getDataByPage(
    searchData: SearchHoatDongNgoaiKhoaData
  ): Promise<Response<ResponsePageList<TableHoatDongNgoaiKhoaDataType[]>>> {
    try {
      const response = await apiService.post<
        Response<ResponsePageList<TableHoatDongNgoaiKhoaDataType[]>>
      >("/HoatDongNgoaiKhoa/GetData", searchData);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  public async getById(id: string): Promise<Response<HoatDongNgoaiKhoaType>> {
    try {
      const response = await apiService.get<Response<HoatDongNgoaiKhoaType>>(
        `/HoatDongNgoaiKhoa/GetById/${id}`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  public async create(
    formData: HoatDongNgoaiKhoaCreateEditType
  ): Promise<Response<HoatDongNgoaiKhoaType>> {
    try {
      const response = await apiService.post<Response<HoatDongNgoaiKhoaType>>(
        "/HoatDongNgoaiKhoa/Create",
        formData
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  public async update(
    formData: HoatDongNgoaiKhoaCreateEditType
  ): Promise<Response<HoatDongNgoaiKhoaType>> {
    try {
      const response = await apiService.put<Response<HoatDongNgoaiKhoaType>>(
        "/HoatDongNgoaiKhoa/Update",
        formData
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  public async delete(id: string): Promise<Response> {
    try {
      const response = await apiService.delete<Response>(
        "/HoatDongNgoaiKhoa/Delete/" + id
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  public async export(
    searchData: SearchHoatDongNgoaiKhoaData
  ): Promise<Response> {
    try {
      const response = await apiService.post<Response>(
        "/HoatDongNgoaiKhoa/Export",
        searchData
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Đăng ký tham gia hoạt động
  public async dangKyThamGia(
    hoatDongId: string,
    userId: string
  ): Promise<Response> {
    try {
      const response = await apiService.post<Response>(
        "/HoatDongNgoaiKhoa/DangKyThamGia",
        { hoatDongId, userId }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Hủy đăng ký tham gia hoạt động
  public async huyDangKy(
    hoatDongId: string,
    userId: string
  ): Promise<Response> {
    try {
      const response = await apiService.post<Response>(
        "/HoatDongNgoaiKhoa/HuyDangKy",
        { hoatDongId, userId }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Lấy danh sách đã đăng ký của một hoạt động
  public async getDanhSachDangKy(
    hoatDongId: string
  ): Promise<Response> {
    try {
      const response = await apiService.get<Response>(
        `/HoatDongNgoaiKhoa/GetDanhSachDangKy/${hoatDongId}`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Lấy danh sách hoạt động để đăng ký (cho user)
  public async getHoatDongDeDangKy(
    searchData: any
  ): Promise<Response> {
    try {
      const response = await apiService.post<Response>(
        "/HoatDongNgoaiKhoa/GetData",
        searchData
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Lấy danh sách hoạt động đã đăng ký của user hiện tại
  public async getHoatDongDaDangKy(
    searchData: any
  ): Promise<Response> {
    try {
      const response = await apiService.post<Response>(
        "/HoatDongNgoaiKhoa/GetHoatDongDaDangKy",
        searchData
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Kiểm tra trạng thái đăng ký của user với hoạt động
  public async checkDangKyStatus(
    hoatDongId: string
  ): Promise<Response> {
    try {
      const response = await apiService.get<Response>(
        `/HoatDongNgoaiKhoa/CheckDangKyStatus/${hoatDongId}`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}

export const hoatDongNgoaiKhoaService = HoatDongNgoaiKhoaService.instance;