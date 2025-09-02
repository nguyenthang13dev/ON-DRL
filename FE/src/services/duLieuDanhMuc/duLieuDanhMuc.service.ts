import {
  searchDuLieuDanhMucData,
  createEditType,
} from "@/types/duLieuDanhMuc/duLieuDanhMuc";
import { apiService } from "../index";
import { DropdownTreeOptionAntd, Response } from "@/types/general";

class DuLieuDanhMucService {
  public async getDataByPage(
    searchData: searchDuLieuDanhMucData
  ): Promise<Response> {
    try {
      const response = await apiService.post<Response>(
        "/DM_DuLieuDanhMuc/GetData",
        searchData
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  public async Create(formData: createEditType): Promise<Response> {
    try {
      const response = await apiService.post<Response>(
        "/DM_DuLieuDanhMuc/Create",
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
        "/DM_DuLieuDanhMuc/Update",
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
        "/DM_DuLieuDanhMuc/Delete/" + id
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  public async Export(searchData: searchDuLieuDanhMucData): Promise<Response> {
    try {
      const response = await apiService.post<Response>(
        "/DM_DuLieuDanhMuc/Export",
        searchData
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  public async GetHierarchicalDropdownList(
    id?: string,
    disabledParent?: boolean
  ): Promise<Response<DropdownTreeOptionAntd>> {
    try {
      const response = await apiService.get<Response<DropdownTreeOptionAntd>>(
        `/DM_DuLieuDanhMuc/GetHierarchicalDropdownList?id=${id}&disabledParent=${disabledParent}`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }
  public async GetDropdown(groupCode: string): Promise<Response> {
    try {
      const response = await apiService.get<Response>(
        `/DM_DuLieuDanhMuc/GetDropdownByGroupCode/${groupCode}`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }
  public async GetDropDownByDonViId(id: string): Promise<Response> {
    try {
      const response = await apiService.get<Response>(
        `/DM_DuLieuDanhMuc/GetDropDownByDonViId/${id}`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }
  public async GetById(id: string): Promise<Response> {
    try {
      const response = await apiService.get<Response>(
        `/DM_DuLieuDanhMuc/Get/${id}`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }
  public async GetByCode(code: string): Promise<Response> {
    try {
      const response = await apiService.get<Response>(
        `/DM_DuLieuDanhMuc/GetByCode/${code}`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }
  public async GetDropdownCode(groupCode: string): Promise<Response> {
    try {
      const response = await apiService.get<Response>(
        `/DM_DuLieuDanhMuc/GetDropdownCode/${groupCode}`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  public async GetDropdownByGroupCode(groupCode: string): Promise<Response> {
    try {
      const response = await apiService.get<Response>(
        `/DM_DuLieuDanhMuc/GetDropdownByGroupCode/${groupCode}`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  public async GetListDataByGroupCode(groupCode: string): Promise<Response> {
    try {
      const response = await apiService.get<Response>(
        `/DM_DuLieuDanhMuc/GetListDataByGroupCode/${groupCode}`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }
  public async GetDropdownTreeOption(groupCode: string): Promise<Response> {
    try {
      const response = await apiService.get<Response>(
        `/DM_DuLieuDanhMuc/GetDropdownTreeOption/${groupCode}`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }
  public async GetDropdownCodeAndNote(
    groupCode: string,
    note: string
  ): Promise<Response> {
    try {
      const response = await apiService.get<Response>(
        `/DM_DuLieuDanhMuc/GetDropdownCodeAndNote/${groupCode}/${note}`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}

export const duLieuDanhMucService = new DuLieuDanhMucService();
