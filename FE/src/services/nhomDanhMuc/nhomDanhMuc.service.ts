import {
  searchNhomDanhMucData,
  createEditType,
} from "@/types/nhomDanhMuc/nhomDanhMuc";
import { apiService } from "../index";
import { Response } from "@/types/general";

class NhomDanhMucService {
  public async getDataByPage(
    searchData: searchNhomDanhMucData
  ): Promise<Response> {
    try {
      const response = await apiService.post<Response>(
        "/DM_NhomDanhMuc/GetData",
        searchData
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }
  public async GetDataByGroupCode(groupCode: string): Promise<Response> {
    try {
      const response = await apiService.get<Response>(
        `/DM_NhomDanhMuc/GetDataByGroupCode/${groupCode}`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }
  public async Create(formData: createEditType): Promise<Response> {
    try {
      const response = await apiService.post<Response>(
        "/DM_NhomDanhMuc/Create",
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
        "/DM_NhomDanhMuc/Update",
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
        "/DM_NhomDanhMuc/Delete/" + id
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  public async Export(searchData: searchNhomDanhMucData): Promise<Response> {
    try {
      const response = await apiService.post<Response>(
        "/DM_NhomDanhMuc/Export",
        searchData
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}

export const nhomDanhMucService = new NhomDanhMucService();
