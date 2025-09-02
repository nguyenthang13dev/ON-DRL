import { ResponsePageList, Response } from "@/types/general";

import { apiService } from "..";
import {
  tableOperationType,
  searchOperation,
  createEditType,
} from "@/types/opearation/operation";

class OperationService {
  public async getDataByPage(
    searchData: searchOperation
  ): Promise<Response<ResponsePageList<tableOperationType[]>>> {
    try {
      const response = await apiService.post<
        Response<ResponsePageList<tableOperationType[]>>
      >("/Operation/GetData", searchData);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  public async Create(formData: createEditType): Promise<Response> {
    try {
      const response = await apiService.post<Response>(
        "/Operation/Create",
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
        "/Operation/Update",
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
        "/Operation/Delete/" + id
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }
  public async GetBreadcrumb(url: string): Promise<Response> {
    try {
      const response = await apiService.get<Response>(
          `/Operation/GetBreadcrumb?url=${encodeURIComponent(url)}`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

}

export const operationService = new OperationService();
