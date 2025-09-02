import LienHe, { 
  CreateLienHeType,
    searchLienHe
}from "@/types/LienHe/LienHe";

import { apiService } from "../index";
import { Response, ResponsePageList } from "@/types/general";
import LienHeView from "@/types/LienHe/LienHe";

class LienHeService {
  public async getDataByPage(
    searchData: searchLienHe
  ): Promise<Response<ResponsePageList<LienHeView[]>>> {
    try {
      const response = await apiService.post<
        Response<ResponsePageList<LienHeView[]>>
      >("/LienHe/GetData", searchData);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
public async Create(formData: CreateLienHeType): Promise<Response> {
        try {
            const response = await apiService.post<Response>(
                "/LienHe/Create",
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
                "/LienHe/Delete/" + id
            );
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    public async Detail(id: string): Promise<Response> {
        try {
            const response = await apiService.delete<Response>(
                "/LienHe/Get/" + id
            );
            return response.data;
        } catch (error) {
            throw error;
        }
    }
}




export const lienHeService = new LienHeService();