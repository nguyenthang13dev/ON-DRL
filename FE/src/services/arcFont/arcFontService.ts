import { apiService } from "@/services";
import {
  DataToSend,
  Dictionary,
  DropdownOption,
  Response,
  ResponsePageList,
} from "@/types/general";
import {
  ArcFontCreateOrUpdateType,
  ArcFontSearchType,
  ArcFontType,
} from "@/types/arcFont/arcFont";
import { debug } from "console";
import { isUndefined } from "lodash";

class ArcFontService {
  private static _instance: ArcFontService;
  public static get instance(): ArcFontService {
    if (!ArcFontService._instance) {
      ArcFontService._instance = new ArcFontService();
    }
    return ArcFontService._instance;
  }

  public async getData(
    searchData: ArcFontSearchType
  ): Promise<Response<ResponsePageList<ArcFontType[]>>> {
    const response = await apiService.post<
      Response<ResponsePageList<ArcFontType[]>>
    >("/arcFont/getData", searchData);
    return response.data;
  }

  public async create(
    formData: ArcFontCreateOrUpdateType
  ): Promise<Response> {
    const response = await apiService.post<Response>(
      "/arcFont/create",
      formData
    );
    return response.data;
  }

  public async update(
    formData: ArcFontCreateOrUpdateType
  ): Promise<Response> {
    const response = await apiService.put<Response>(
      "/arcFont/update",
      formData
    );
    return response.data;
  }

  public async delete(id: string): Promise<Response> {
    const response = await apiService.delete<Response>(
      "/arcFont/delete/" + id
    );
    return response.data;
  }
  public async getDropdowns(): Promise<Response<Dictionary<DropdownOption[]>>> {
    const response = await apiService.get<Response<Dictionary<DropdownOption[]>>>(
      "/arcFont/getDropDowns"
    );
    return response.data;
  }

public async checkOrganIdExists(value: string, id?: string): Promise<{ exists: boolean }> {
    id = isUndefined(id)?"":id;
  const response = await apiService.post<{ exists: boolean }>(
    `/arcFont/checkOrganId?value=${value}&id=${id}`,
  );
  return response.data;
}

  public async exportExcel(
    search: ArcFontSearchType
  ): Promise<Response<string>> {
    const response = await apiService.post<Response>(
      "/arcFont/exportExcel",
      search
    );
    return response.data;
  }

  public async exportTemplateImport(): Promise<Response> {
    const response = await apiService.get<Response>(
      "/arcFont/exportTemplateImport"
    );
    return response.data;
  }

  public async getDataImportView(): Promise<Response> {
    const response = await apiService.get<Response>("/ArcFont/import");
    return response.data;
  }

  public async saveImport(form: DataToSend): Promise<Response> {
    const response = await apiService.post<Response>(
      "/arcFont/importExcel",
      form
    );
    return response.data;
  }


}

const arcFontService = ArcFontService.instance;
export default arcFontService;
