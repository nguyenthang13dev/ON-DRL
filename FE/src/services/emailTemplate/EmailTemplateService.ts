import { apiService } from "@/services";
import { Response, ResponsePageList } from "@/types/general";
import {
  EmailTemplateType,
  EmailTemplateCreateOrUpdateType,
  EmailTemplateSearchType,
} from "@/types/emailTemplate/EmailTemplate";

class EmailTemplateService {
  private static _instance: EmailTemplateService;
  public static get instance(): EmailTemplateService {
    if (!EmailTemplateService._instance) {
      EmailTemplateService._instance = new EmailTemplateService();
    }
    return EmailTemplateService._instance;
  }

  public async getData(
    searchData: EmailTemplateSearchType
  ): Promise<Response<ResponsePageList<EmailTemplateType[]>>> {
    const response = await apiService.post<
      Response<ResponsePageList<EmailTemplateType[]>>
    >("/EmailTemplate/GetAll", searchData);
    return response.data;
  }

  public async get(id: string): Promise<Response<EmailTemplateType>> {
    const response = await apiService.get<Response<EmailTemplateType>>(
      `/EmailTemplate/Get/${id}`
    );
    return response.data;
  }

  public async create(
    formData: EmailTemplateCreateOrUpdateType
  ): Promise<Response> {
    const response = await apiService.post<Response>(
      "/EmailTemplate/Create",
      formData
    );
    return response.data;
  }

  public async update(
    formData: EmailTemplateCreateOrUpdateType
  ): Promise<Response> {
    const response = await apiService.put<Response>(
      "/EmailTemplate/Edit",
      formData
    );
    return response.data;
  }

  public async delete(id: string): Promise<Response> {
    const response = await apiService.delete<Response>(
      `/EmailTemplate/Delete/${id}`
    );
    return response.data;
  }
  public async getAllLoaiTemplate(): Promise<Response<any[]>> {
    const response = await apiService.get<Response<any[]>>(
      "/EmailTemplate/GetAlLoaiTemplate"
    );
    return response.data;
  }

  public async setActive(id: string, isActive: boolean): Promise<Response> {
    const response = await apiService.post<Response>(
      "/EmailTemplate/SetActive",
      { id, isActive }
    );
    return response.data;
  }
}

const emailTemplateService = EmailTemplateService.instance;
export default emailTemplateService; 