import { apiService } from "@/services";
import {
  DataToSend,
  Dictionary,
  DropdownOption,
  Response,
  ResponsePageList,
} from "@/types/general";
import {
  EmailThongBaoCreateOrUpdateType,
  EmailThongBaoSearchType,
  EmailThongBaoType,
} from "@/types/emailThongBao/emailThongBao";

class EmailThongBaoService {
  private static _instance: EmailThongBaoService;
  public static get instance(): EmailThongBaoService {
    if (!EmailThongBaoService._instance) {
      EmailThongBaoService._instance = new EmailThongBaoService();
    }
    return EmailThongBaoService._instance;
  }

  public async getData(
    searchData: EmailThongBaoSearchType
  ): Promise<Response<ResponsePageList<EmailThongBaoType[]>>> {
    const response = await apiService.post<
      Response<ResponsePageList<EmailThongBaoType[]>>
    >("/emailThongBao/getData", searchData);
    return response.data;
  }

  public async create(
    formData: EmailThongBaoCreateOrUpdateType
  ): Promise<Response> {
    const response = await apiService.post<Response>(
      "/emailThongBao/create",
      formData
    );
    return response.data;
  }

  public async update(
    formData: EmailThongBaoCreateOrUpdateType
  ): Promise<Response> {
    const response = await apiService.put<Response>(
      "/emailThongBao/update",
      formData
    );
    return response.data;
  }

  public async delete(id: string): Promise<Response> {
    const response = await apiService.delete<Response>(
      "/emailThongBao/delete/" + id
    );
    return response.data;
  }
  public async getDropdowns(): Promise<Response<Dictionary<DropdownOption[]>>> {
    const response = await apiService.get<
      Response<Dictionary<DropdownOption[]>>
    >("/emailThongBao/getDropDowns");
    return response.data;
  }

  public async exportExcel(
    search: EmailThongBaoSearchType
  ): Promise<Response<string>> {
    const response = await apiService.post<Response>(
      "/emailThongBao/exportExcel",
      search
    );
    return response.data;
  }

  public async exportTemplateImport(): Promise<Response> {
    const response = await apiService.get<Response>(
      "/emailThongBao/exportTemplateImport"
    );
    return response.data;
  }

  public async getDataImportView(): Promise<Response> {
    const response = await apiService.get<Response>("/EmailThongBao/import");
    return response.data;
  }

  public async saveImport(form: DataToSend): Promise<Response> {
    const response = await apiService.post<Response>(
      "/emailThongBao/importExcel",
      form
    );
    return response.data;
  }

  public async SendEmail(
    subject: string,
    body: string,
    toAddress: string
    // iditem: string
  ): Promise<Response> {
    try {
      const formData = new FormData();
      formData.append("subject", subject);
      formData.append("body", body);
      formData.append("toAddress", toAddress);
      // formData.append("iditem", iditem);
      const response = await apiService.post<Response>(
        "/emailThongBao/SendEmail",
        formData
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}

const emailThongBaoService = EmailThongBaoService.instance;
export default emailThongBaoService;
