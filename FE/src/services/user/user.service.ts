import
  {
    anhChuKySoType,
    ChangePasswordType,
    createEditType,
    DataToSend,
    searchUserData,
    tableUserDataType,
  } from "@/types/auth/User";
import { DropdownOption, Response, ResponsePageList } from "@/types/general";
import { apiService } from "../index";

class UserService {
  public async getDataByPage(
    searchData: searchUserData
  ): Promise<Response<ResponsePageList<tableUserDataType[]>>> {
    try {
      const response = await apiService.post<
        Response<ResponsePageList<tableUserDataType[]>>
      >("/User/GetData", searchData);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  public async Create(formData: createEditType): Promise<Response> {
    try {
      const response = await apiService.post<Response>(
        "/User/Create",
        formData
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  public async Update(formData: createEditType): Promise<Response> {
    try {
      const response = await apiService.put<Response>("/User/Update", formData);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  public async Delete(id: string): Promise<Response> {
    try {
      const response = await apiService.delete<Response>("/User/Delete/" + id);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  public async Lock(id: string): Promise<Response> {
    try {
      const response = await apiService.delete<Response>("/User/Lock/" + id);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  public async exportExcel(): Promise<Response> {
    try {
      const response = await apiService.get<Response>("/User/export");
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  public async exportTemplateImport(): Promise<Response> {
    try {
      const response = await apiService.get<Response>(
        "/User/exportTemplateImport"
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  public async getDataImportView(): Promise<Response> {
    try {
      const response = await apiService.get<Response>("/User/import");
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  public async saveImport(form: DataToSend): Promise<Response> {
    try {
      const response = await apiService.post<Response>(
        "/User/importExcel",
        form
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  public async getDropdown(): Promise<Response<DropdownOption[]>> {
    try {
      const response = await apiService.get<Response<DropdownOption[]>>(
        "/User/GetDropDown"
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  public async ganChuKySo(form: anhChuKySoType): Promise<Response> {
    try {
      const response = await apiService.post<Response>("/User/GanChuKySo", form);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  public async getChuKySo(id: string): Promise<Response> {
    try {
      const response = await apiService.get<Response>("/User/GetChuKySo/" + id);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
  public async ChangePassword(formData: ChangePasswordType): Promise<Response> {
    try {
      const response = await apiService.post<Response>("/Account/ChangePassword", formData);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
  public async getDropdownByIdDonVi(id: string): Promise<Response<DropdownOption[]>> {
    try {
      const response = await apiService.get<Response<DropdownOption[]>>(
        "/User/GetDropDownByIdDonVi?IdDonVi="+id
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }
  public async GetProfile(): Promise<Response> {
    try {
      const response = await apiService.get<Response>("/User/GetProfile");
      return response.data;
    } catch (error) {
      throw error;
    }
  }
  public async UploadAvatar(file: File): Promise<Response> {
    try {
      const formData = new FormData();
      formData.append("file", file);
      const response = await apiService.post<Response>("/User/UploadAvatar", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }
  public async resetDefaultPassword(id: string): Promise<Response> {
    try {
      const response = await apiService.post<Response>(
        `/Account/ResetDefaultPassword/${id}`
      );
      return response.data;
    }
    catch (error) {
      throw error;
    }
  }


  public async UpdateQRCCD( file: File ): Promise<Response>
  {
    try {
      const formData = new FormData();
      formData.append("file", file);
      const response = await apiService.post<Response>("/User/UploadQRCCCD", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  public async CheckQRCCCD( file: File ): Promise<Response>
  {
    try {
      const formData = new FormData();
      formData.append("file", file);
      const response = await apiService.post<Response>("/User/CheckQRCCCD", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}

export const userService = new UserService();
