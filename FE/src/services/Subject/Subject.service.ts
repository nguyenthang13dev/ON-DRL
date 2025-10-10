import { DropdownOption, Response } from "@/types/general";
import
  {
    SearchSubjectData,
    SubjectCreateVM,
  } from "@/types/Subject/Subject";
import { ApiResponse, apiService } from "../index";

class SubjectService {
  private static _instance: SubjectService;
  public static get instance(): SubjectService {
    if (!SubjectService._instance) {
      SubjectService._instance = new SubjectService();
    }
    return SubjectService._instance;
  }

  public async getDataByPage(
    searchData: SearchSubjectData
  ): Promise<Response> {
    try {
      const response = await apiService.post<Response>(
        "/Subject/GetData",
        searchData
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  public async getById(id: string): Promise<Response> {
    try {
      const response = await apiService.get<Response>(
        `/Subject/GetById/${id}`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  public async getByCode(code: string): Promise<Response> {
    try {
      const response = await apiService.get<Response>(
        `/Subject/GetByCode/${code}`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  public async getByDepartment(department: string): Promise<Response> {
    try {
      const response = await apiService.get<Response>(
        `/Subject/GetByDepartment/${department}`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  public async create(formData: SubjectCreateVM): Promise<Response> {
    try {
      const response = await apiService.post<Response>(
        "/Subject/Create",
        formData
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  public async update(formData: SubjectCreateVM): Promise<Response> {
    try {
      const response = await apiService.put<Response>(
        "/Subject/Update",
        formData
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  public async delete(id: string): Promise<Response> {
    try {
      const response = await apiService.delete<Response>(
        "/Subject/Delete/" + id
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }


  public async GetDropDownSubject( selected?: string ): Promise<ApiResponse<DropdownOption[]>>
  {
    try {
      const response = await apiService.get<ApiResponse<DropdownOption[]>>( `/Subject/GetDropDownSubject?selected=${ selected ?? "" }` );      
      return response.data;
    } catch (error) {
      throw error;
    }  

  }


  public async export(searchData: SearchSubjectData): Promise<Response> {
    try {
      const response = await apiService.post<Response>(
        "/Subject/Export",
        searchData
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}

export const subjectService = SubjectService.instance;
