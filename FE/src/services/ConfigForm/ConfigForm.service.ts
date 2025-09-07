import
  {
    ConfigFormCreateVM,
    SearchConfigFormData,
  } from "@/types/ConfigForm/ConfigForm";
import { Response } from "@/types/general";
import { apiService } from "../index";

class ConfigFormService {
  /**
   * Lấy nội dung HTML từ file Word theo fileId (GUID)
   */
  public async getHtmlContentFromWord(fileId: string): Promise<Response<{ htmlContent: string }>> {
    try {
      const response = await apiService.get<Response<{ htmlContent: string }>>(
        `/ConfigForm/GetHtmlContentFromWord/${fileId}`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }
  private static _instance: ConfigFormService;
  public static get instance(): ConfigFormService {
    if (!ConfigFormService._instance) {
      ConfigFormService._instance = new ConfigFormService();
    }
    return ConfigFormService._instance;
  }

  public async getDataByPage(
    searchData: SearchConfigFormData
  ): Promise<Response> {
    try {
      const response = await apiService.post<Response>(
        "/ConfigForm/GetData",
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
        `/ConfigForm/GetById/${id}`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  public async getByName(name: string): Promise<Response> {
    try {
      const response = await apiService.get<Response>(
        `/ConfigForm/GetByName/${name}`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  public async PrerviewConfigSetting(Id: string): Promise<Response>
  {
    try {
      const response = await apiService.get<Response>(
        `/ConfigForm/Config-preview?Id=${Id}`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }


  public async create(formData: ConfigFormCreateVM): Promise<Response> {
    try {
      const response = await apiService.post<Response>(
        "/ConfigForm/Create",
        formData
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  public async update(formData: ConfigFormCreateVM): Promise<Response> {
    try {
      const response = await apiService.put<Response>(
        "/ConfigForm/Update",
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
        "/ConfigForm/Delete/" + id
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  public async export(searchData: SearchConfigFormData): Promise<Response> {
    try {
      const response = await apiService.post<Response>(
        "/ConfigForm/Export",
        searchData
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}

export const configFormService = ConfigFormService.instance;
