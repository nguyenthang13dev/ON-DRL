import { createEditType, searchRole, tableRoleType } from "@/types/role/role";
import { apiService } from "../index";
import { ResponsePageList, Response } from "@/types/general";

class RoleService {
  async getDropDown(selected: string): Promise<Response> {
    try {
      const response = await apiService.post<Response>(
        "/Role/GetDropVaiTro",
        selected
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }






  async getDropDownAnt(selected: string): Promise<Response> {
    try {
      const response = await apiService.post<Response>(
        "/Role/GetDropVaiTroAnt",
        selected
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  public async getDataByPage(
    searchData: searchRole
  ): Promise<Response<ResponsePageList<tableRoleType[]>>> {
    try {
      const response = await apiService.post<
        Response<ResponsePageList<tableRoleType[]>>
      >("/Role/GetData", searchData);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  public async Create(formData: createEditType): Promise<Response> {
    try {
      const response = await apiService.post<Response>(
        "/Role/Create",
        formData
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  public async Update(formData: createEditType): Promise<Response> {
    try {
      const response = await apiService.put<Response>("/Role/Update", formData);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  public async Delete(id: string): Promise<Response> {
    try {
      const response = await apiService.delete<Response>("/Role/Delete/" + id);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  public async SwitchActiveRole(id: string): Promise<Response> {
    try {
      const response = await apiService.put<Response>(
        "/Role/SwitchActiveRole/" + id
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async getDropDownVaiTroIds(selected: string): Promise<Response> {
    try {
      const response = await apiService.post<Response>(
        "/Role/GetDropDownVaiTroIds",
        selected
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async GetDropdownId(): Promise<Response> {
    try {
      const response = await apiService.get<Response>(
        "/Role/GetDropdownId",
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }


}

export const roleService = new RoleService();
