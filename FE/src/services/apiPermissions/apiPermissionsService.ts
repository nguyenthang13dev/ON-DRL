import { apiService } from "@/services";
import {
  DataToSend,
  Dictionary,
  DropdownOption,
  Response,
  ResponsePageList,
} from "@/types/general";
import {
  ApiPermissionGroupDataType,
  ApiPermissionsSaveType,
  ApiPermissionsSearchType,
  ApiPermissionsType,
} from "@/types/apiPermissions/apiPermissions";

class ApiPermissionsService {
  private static _instance: ApiPermissionsService;
  public static get instance(): ApiPermissionsService {
    if (!ApiPermissionsService._instance) {
      ApiPermissionsService._instance = new ApiPermissionsService();
    }
    return ApiPermissionsService._instance;
  }

  public async getByRoleId(
    roleId: string
  ): Promise<Response<ApiPermissionGroupDataType[]>> {
    const response = await apiService.get<
      Response<ApiPermissionGroupDataType[]>
    >(`/apiPermissions/getByRoleId/${roleId}`);
    return response.data;
  }

  public async save(formData: ApiPermissionsSaveType): Promise<Response> {
    const response = await apiService.post<Response>(
      "/apiPermissions/save",
      formData
    );
    return response.data;
  }

  public async delete(id: string): Promise<Response> {
    const response = await apiService.delete<Response>(
      "/apiPermissions/delete/" + id
    );
    return response.data;
  }
  public async getDropdowns(): Promise<Response<Dictionary<DropdownOption[]>>> {
    const response = await apiService.get<
      Response<Dictionary<DropdownOption[]>>
    >("/apiPermissions/getDropDowns");
    return response.data;
  }

  public async exportExcel(
    search: ApiPermissionsSearchType
  ): Promise<Response<string>> {
    const response = await apiService.post<Response>(
      "/apiPermissions/exportExcel",
      search
    );
    return response.data;
  }

  public async exportTemplateImport(): Promise<Response> {
    const response = await apiService.get<Response>(
      "/apiPermissions/exportTemplateImport"
    );
    return response.data;
  }

  public async getDataImportView(): Promise<Response> {
    const response = await apiService.get<Response>("/ApiPermissions/import");
    return response.data;
  }

  public async saveImport(form: DataToSend): Promise<Response> {
    const response = await apiService.post<Response>(
      "/apiPermissions/importExcel",
      form
    );
    return response.data;
  }
}

const apiPermissionsService = ApiPermissionsService.instance;
export default apiPermissionsService;
