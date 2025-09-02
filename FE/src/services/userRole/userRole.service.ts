import { tableUserDataType } from "@/types/auth/User";
import { apiService } from "../index";
import { Response, ResponsePageList } from "@/types/general";
import { createEditType, searchUserRole } from "@/types/userRole/userRole";

class UserRoleService {
  public async getDataByPage(
    searchData: searchUserRole
  ): Promise<Response<ResponsePageList<tableUserDataType[]>>> {
    try {
      const response = await apiService.post<
        Response<ResponsePageList<tableUserDataType[]>>
      >("/UserRole/GetData", searchData);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  public async Create(formData: createEditType): Promise<Response> {
    try {
      const response = await apiService.post<Response>(
        "/UserRole/Create",
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
        "/UserRole/Update",
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
        "/UserRole/Delete/" + id
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  public async SetupRole(id: string): Promise<Response> {
    try {
      const response = await apiService.post<
        Response<ResponsePageList<tableUserDataType[]>>
      >(`/UserRole/SetupRole?id=${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}

export const userRoleService = new UserRoleService();
