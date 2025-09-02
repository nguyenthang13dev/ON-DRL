import { ResponsePageList, Response } from "@/types/general";
import { searchModule, tableModuleType } from "@/types/menu/menu";
import { apiService } from "..";

class ModuleService {
  public async getDataByPage(
    searchData: searchModule
  ): Promise<Response<ResponsePageList<tableModuleType[]>>> {
    try {
      const response = await apiService.post<
        Response<ResponsePageList<tableModuleType[]>>
      >("/Module/GetData", searchData);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  public async Create(formData: FormData): Promise<Response> {
    try {
      const response = await apiService.post<Response>(
        "/Module/Create",
        formData
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  public async Update(formData: FormData): Promise<Response> {
    try {
      const response = await apiService.put<Response>(
        "/Module/Update",
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
        "/Module/Delete/" + id
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async getDropDown(selected: string): Promise<Response> {
    try {
      const response = await apiService.post<Response>(
        "/Module/GetDropModule",
        selected
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  public async getModuleGroupData(roleId: string): Promise<Response> {
    try {
      const response = await apiService.get<Response>(
        `/Module/GetModuleGroupData?roleId=${roleId}`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}

export const moduleService = new ModuleService();
