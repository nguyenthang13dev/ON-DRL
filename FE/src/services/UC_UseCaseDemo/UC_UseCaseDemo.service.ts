import { 
  UC_UseCaseDemoType, 
  UC_UseCaseDemoCreateType, 
  UC_UseCaseDemoEditType, 
  UC_UseCaseDemoSearchType 
} from "@/types/UC_UseCaseDemo/UC_UseCaseDemo";
import { apiService } from "../index";
import { Response } from "@/types/general";

class UC_UseCaseDemoService {
  public async create(data: UC_UseCaseDemoCreateType): Promise<Response<UC_UseCaseDemoType>> {
    try {
      const response = await apiService.post<Response<UC_UseCaseDemoType>>("/UC_UseCaseDemo/Create", data);
      console.log("API Response:", response.data);
      return response.data;
    } catch (error) {
      console.error("Service create error:", error);
      throw error;
    }
  }
  public async createMany(data: UC_UseCaseDemoCreateType[]): Promise<Response<UC_UseCaseDemoType[]>> {
    try {
      const response = await apiService.post<Response<UC_UseCaseDemoType[]>>("/UC_UseCaseDemo/CreateMany", data);
      return response.data;
    } catch (error) {
      console.error("Service createMany error:", error);
      throw error;
    }
  }

  public async update(data: UC_UseCaseDemoEditType): Promise<Response<UC_UseCaseDemoType>> {
    try {
      
      const response = await apiService.put<Response<UC_UseCaseDemoType>>("/UC_UseCaseDemo/Update", data);
      return response.data;
    } catch (error) {
      console.error("Service update error:", error);
      throw error;
    }
  }
  public async updateMany(data: UC_UseCaseDemoEditType[]): Promise<Response<UC_UseCaseDemoType[]>> {
    try {
      const response = await apiService.put<Response<UC_UseCaseDemoType[]>>("/UC_UseCaseDemo/UpdateMany", data);
      return response.data;
    } catch (error) {
      console.error("Service updateMany error:", error);
      throw error;
    }
  }

  public async getById(id: string): Promise<Response<UC_UseCaseDemoType>> {
    try {
      const response = await apiService.get<Response<UC_UseCaseDemoType>>(`/UC_UseCaseDemo/Get/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  public async getData(search: UC_UseCaseDemoSearchType): Promise<Response<UC_UseCaseDemoType[]>> {
    try {
      const response = await apiService.post<Response<UC_UseCaseDemoType[]>>("/UC_UseCaseDemo/GetData", search);
      return response.data;
    } catch (error) {
      console.error("Service getData error:", error);
      throw error;
    }
  }

  public async delete(id: string): Promise<Response<void>> {
    try {
      const response = await apiService.delete<Response<void>>(`/UC_UseCaseDemo/Delete/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}

export const uC_UseCaseDemoService = new UC_UseCaseDemoService(); 