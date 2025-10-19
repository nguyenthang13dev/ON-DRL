import { SearchConfigFormDataByUser } from "@/types/ConfigForm/ConfigForm";
import { tableConfigFormKeyEditVMData } from "@/types/ConfigFormKey/ConfigFormKey";
import { Response } from "@/types/general";
import { apiService } from "../index";


class ConfigFormKeyService {
  private static _instance: ConfigFormKeyService;
  public static get instance(): ConfigFormKeyService {
    if (!ConfigFormKeyService._instance) {
      ConfigFormKeyService._instance = new ConfigFormKeyService();
    }
    return ConfigFormKeyService._instance;
  }

  public async GetAllConfigByForm(UserId: string) : Promise<Response> {
    const response = await apiService.get<Response>(`/ConfigFormKey/GetAllConfigFields?Id=${UserId}`);
    return response.data;
  }


  public async editByForm(model: tableConfigFormKeyEditVMData): Promise<Response> {
    const response = await apiService.post<Response>(
      "/ConfigFormKey/EditByForm",
      model
    );
    return response.data;
  }


  public async GetFormByUser(model: SearchConfigFormDataByUser): Promise<Response> {
    const response = await apiService.post<Response>(
      "/ConfigFormKey/GetFormByUser",
      model
    );
    return response.data;
  }

  

  public async GetFormByKey(FormId: string, Key: string): Promise<Response<tableConfigFormKeyEditVMData>>
  {
    const response = await apiService.get<Response<tableConfigFormKeyEditVMData>>( `/ConfigFormKey/GetDetailKey?FormId=${FormId}&Key=${Key}` );
    return response.data; 
  }
}

export const configFormKeyService = ConfigFormKeyService.instance;


