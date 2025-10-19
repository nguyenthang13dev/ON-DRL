import { apiService } from "../index";
import { Response, DropdownOption } from "@/types/general";
import { createEditType, searchKhoa } from "@/types/khoa/khoa";

class KhoaService {
  public async getDataByPage(searchData: searchKhoa): Promise<Response> {
    try {
      const response = await apiService.post<Response>(
        "/Khoa/GetData",
        searchData
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }






  public async GetById(id: string): Promise<Response> {
    try {
      const response = await apiService.get<Response>(`/Khoa/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  public async Create(data: createEditType): Promise<Response> {
    try {
      const response = await apiService.post<Response>("/Khoa/Create", data);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  public async Update(id: string, data: createEditType): Promise<Response> {
    try {
      const response = await apiService.put<Response>(
        `/Khoa/Update/${id}`,
        data
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  public async Delete(id: string): Promise<Response> {
    try {
      const response = await apiService.delete<Response>(`/Khoa/Delete/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  public async GetDropKhoa(selected?: string): Promise<Response> {
    try {
      const response = await apiService.get<Response>(
        `/Khoa/GetDropKhoa?selected=${selected ?? ""}`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}

export const khoaService = new KhoaService();
