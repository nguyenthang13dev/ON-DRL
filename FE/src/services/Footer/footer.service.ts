import { apiService } from "../index";
import { Response, ResponsePageList, SearchBase } from "@/types/general";
import { Footer } from "@/types/footer/footer";

class FooterService {
  public async getDataByPage(
    searchData: SearchBase
  ): Promise<Response<ResponsePageList<Footer[]>>> {
    try {
      const response = await apiService.post<
        Response<ResponsePageList<Footer[]>>
      >("/footer/getData", searchData);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  public async Create(formData: Footer): Promise<Response> {
    try {
      const response = await apiService.post<Response>(
        "/footer/Create",
        formData
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  public async Update(formData: Footer): Promise<Response> {
    try {
      const response = await apiService.put<Response>(
        "/footer/Update",
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
        "/footer/Delete/" + id
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}

export const footerService = new FooterService();
