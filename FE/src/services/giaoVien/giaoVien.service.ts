import { apiService } from "../index";
import { Response, DropdownOption } from "@/types/general";
import { createEditType, searchGiaoVien } from "@/types/giaoVien/giaoVien";

class GiaoVienService {
  public async getDataByPage(searchData: searchGiaoVien): Promise<Response> {
    try {
      const response = await apiService.post<Response>(
        "/GiaoVien/GetData",
        searchData
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  public async GetById(id: string): Promise<Response> {
    try {
      const response = await apiService.get<Response>(`/GiaoVien/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  public async Create(data: createEditType): Promise<Response> {
    try {
      const response = await apiService.post<Response>(
        "/GiaoVien/Create",
        data
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  public async Update(id: string, data: createEditType): Promise<Response> {
    try {
      const response = await apiService.put<Response>(
        `/GiaoVien/Update/${id}`,
        data
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  public async Delete(id: string): Promise<Response> {
    try {
      const response = await apiService.delete<Response>(
        `/GiaoVien/Delete/${id}`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  public async GetDropGiaoVien(khoaId?: string): Promise<Response> {
    try {
      const response = await apiService.get<Response>(
        `/GiaoVien/DropdownByKhoa?khoaId=${khoaId ?? ""}`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}

export const giaoVienService = new GiaoVienService();
