import { Response } from "@/types/general";

import { apiService } from "..";
import { createEditType } from "@/types/roleOperation/roleOperation";

class RoleOperationService {
  public async Create(formData: createEditType): Promise<Response> {
    try {
      const response = await apiService.post<Response>(
        "/RoleOperation/Create",
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
        "/RoleOperation/Update",
        formData
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}

export const roleOperationService = new RoleOperationService();
