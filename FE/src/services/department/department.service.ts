import {
  Department,
  DepartmentDetail,
  DepartmentSearch,
} from "../../types/department/department";

import { apiService } from "../index";
import {
  DropdownOption,
  DropdownTreeOptionAntd,
  Response,
  ResponsePageList,
} from "@/types/general";
import { TreeItem } from "@nosferatu500/react-sortable-tree";

class DepartmentService {
  public async getDataByPage(
    searchData: DepartmentSearch
  ): Promise<Response<ResponsePageList<Department[]>>> {
    try {
      const response = await apiService.post<
        Response<ResponsePageList<Department[]>>
      >("/department/GetData", searchData);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  public async Create(params: Department): Promise<Response> {
    try {
      const response = await apiService.post<Response>(
        "/department/Create",
        params
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  public async Update(params: Department): Promise<Response> {
    try {
      const response = await apiService.put<Response>(
        "/department/Update",
        params
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  public async Deactive(id: string): Promise<Response<Department>> {
    try {
      const response = await apiService.put<Response<Department>>(
        `department/deactive/${id}`,
        {}
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  public async Delete(id: string): Promise<Response> {
    try {
      const response = await apiService.delete<Response>(
        `/department/Delete/${id}`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  public async GetHierarchy(): Promise<Response<TreeItem[]>> {
    try {
      const response = await apiService.get<Response<TreeItem[]>>(
        `/department/GetDepartmentsWithHierarchy`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async getDropDown(selected: string): Promise<Response> {
    try {
      const response = await apiService.post<Response>(
        `/department/GetDropDepartment`,
        selected
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async getDropDepartmentByShortName(shortName: string): Promise<Response> {
    try {
      const response = await apiService.get<Response>(
        `/department/GetDropDepartmentByShortName`,
        { params: { shortName } }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async getDropRolesInDepartment(
    departmentId: string,
    userId: string
  ): Promise<Response> {
    try {
      const response = await apiService.post<Response>(
        `/department/GetDropRolesInDepartment?departmentId=${departmentId}&&userId=${userId}`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  //dùng để lưu thay đổi trong cơ cấu tổ chức
  public async saveDepartmentChanges(
    params: Department[]
  ): Promise<Response<Department[]>> {
    try {
      const response = await apiService.post<Response<Department[]>>(
        `/department/SaveDepartmentChanges`,
        params
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }
  public async getDetail(id: string): Promise<Response<DepartmentDetail>> {
    try {
      const response = await apiService.get<Response<DepartmentDetail>>(
        `/department/Get/${id}`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }
  public async GetByCode(code: string): Promise<Response<DepartmentDetail>> {
    try {
      const response = await apiService.get<Response<DepartmentDetail>>(
        `/department/GetByCode/${code}`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  public async exportExcel(
    type: "Organization" | "Department"
  ): Promise<Response> {
    try {
      const response = await apiService.get<Response>(
        `/department/export?type=${type}`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }
  //lấy dropdown có label theo cấp bậc và disable tổ chức value = Id
  async getHierarchicalDropdownList(
    disabledParent: boolean = true
  ): Promise<Response<DropdownTreeOptionAntd[]>> {
    try {
      const response = await apiService.get<Response<DropdownTreeOptionAntd[]>>(
        `/department/getHierarchicalDropdownList?disabledParent=${disabledParent}`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  //lấy dropdown có label theo cấp bậc và disable tổ chức value = code
  async GetHierarchicalDropdownListCode(
    disabledParent: boolean = true
  ): Promise<Response<DropdownTreeOptionAntd[]>> {
    try {
      const response = await apiService.get<Response<DropdownTreeOptionAntd[]>>(
        `/department/GetHierarchicalDropdownListCode?disabledParent=${disabledParent}`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  //lấy dropdown có label theo cấp bậc và disable tổ chức theo đơn vị id của user
  async getHierarchicalDropdownListByUserDepartment(
    disabledParent: boolean = true
  ): Promise<Response<DropdownTreeOptionAntd[]>> {
    try {
      const response = await apiService.get<Response<DropdownTreeOptionAntd[]>>(
        `/department/GetDropdownListByUserDepartment?disabledParent=${disabledParent}`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  //lấy dropdown có label theo cấp bậc và disable tổ chức theo đơn vị id của user
  async GetSubAndCurrentUnitDropdown(
    disabledParent: boolean = false
  ): Promise<Response<DropdownTreeOptionAntd[]>> {
    try {
      const response = await apiService.get<Response<DropdownTreeOptionAntd[]>>(
        `/department/GetSubAndCurrentUnitDropdown?disabledParent=${disabledParent}`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  //lấy cán bộ kèm phòng ban dropdown có label theo cấp bậc
  async getHierarchicalCanBoDropdownList(): Promise<
    Response<DropdownTreeOptionAntd[]>
  > {
    try {
      const response = await apiService.get<Response<DropdownTreeOptionAntd[]>>(
        `/department/GetHierarchicalCanBoDropdownList`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async getDropdownTypeDepartment(): Promise<Response<DropdownOption[]>> {
    try {
      const response = await apiService.get<Response<DropdownOption[]>>(
        `/department/GetDropdownTypeDepartment`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async getDropdownCapBac(): Promise<Response<DropdownOption[]>> {
    try {
      const response = await apiService.get<Response<DropdownOption[]>>(
        `/department/GetDropdownCapBac`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}

export const departmentService = new DepartmentService();
