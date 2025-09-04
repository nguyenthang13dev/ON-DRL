import { apiService } from "../index";
import { DropdownOption, Response } from "@/types/general";

class TinhService {
  public async GetDropdown(): Promise<Response<DropdownOption[]>> {
    try {
      const response = await apiService.get<Response<DropdownOption[]>>(
        "/Tinh/GetDropdown"
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}

export const tinhService = new TinhService();
