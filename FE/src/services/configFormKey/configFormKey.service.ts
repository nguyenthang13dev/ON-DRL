import { Response } from "@/types/general";
import { apiService } from "../index";
import { tableConfigFormKeyEditVMData } from "@/types/ConfigFormKey/ConfigFormKey";


class ConfigFormKeyService {
  private static _instance: ConfigFormKeyService;
  public static get instance(): ConfigFormKeyService {
    if (!ConfigFormKeyService._instance) {
      ConfigFormKeyService._instance = new ConfigFormKeyService();
    }
    return ConfigFormKeyService._instance;
  }

  public async editByForm(model: tableConfigFormKeyEditVMData): Promise<Response> {
    const response = await apiService.post<Response>(
      "/ConfigFormKey/EditByForm",
      model
    );
    return response.data;
  }
}

export const configFormKeyService = ConfigFormKeyService.instance;


