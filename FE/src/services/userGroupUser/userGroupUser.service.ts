import { tableUserDataType } from "@/types/auth/User";
import { apiService } from "../index";
import { Response, ResponsePageList } from "@/types/general";
import { createEditType } from "@/types/userGroupUser/userGroupUser";

class UserGroupUserService {
  public async Create(formData: createEditType): Promise<Response> {
    try {
      const response = await apiService.post<Response>(
        "/User_GroupUser/Create",
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
        "/User_GroupUser/Delete/" + id
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

}

export const userGroupUserService = new UserGroupUserService();
