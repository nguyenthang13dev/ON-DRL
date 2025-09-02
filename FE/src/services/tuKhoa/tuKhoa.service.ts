import { searchTuKhoaData, createEditType } from "@/types/tuKhoa/tuKhoa";
import { apiService } from "../index";
import { Response } from "@/types/general";

class TuKhoaService {
  public async getDataByPage(searchData: searchTuKhoaData): Promise<Response> {
    try {
      const response = await apiService.post<Response>(
        "/TuKhoa/GetDataMongo",
        searchData
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  public async Create(formData: createEditType): Promise<Response> {
    try {
      const response = await apiService.post<Response>(
        "/TuKhoa/CreateMongo",
        formData
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  public async Update(formData: createEditType): Promise<Response> {
    try {
      const response = await apiService.put<Response>(
        "/TuKhoa/UpdateMongo",
        formData
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  public async Delete(id: string): Promise<Response> {
    try {
      const response = await apiService.delete<Response>(
        "/TuKhoa/DeleteMongo/" + id
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  public async GetDropDownTuKhoa(): Promise<Response> {
    try {
      const response = await apiService.get<Response>(
        "/TuKhoa/GetDropDownTuKhoa"
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}

export const tuKhoaService = new TuKhoaService();
