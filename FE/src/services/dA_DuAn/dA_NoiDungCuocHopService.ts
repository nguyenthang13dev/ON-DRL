import { apiService } from "@/services";
import {
  DataToSend,
  Dictionary,
  DropdownOption,
  Response,
  ResponsePageList,
} from "@/types/general";
import {
  DA_NoiDungCuocHopCreateOrUpdateType,
  DA_NoiDungCuocHopSearchType,
  DA_NoiDungCuocHopType,
  UploadMeetingDocsResponse,
} from "@/types/dA_DuAn/dA_NoiDungCuocHop";

class DA_NoiDungCuocHopService {
  private static _instance: DA_NoiDungCuocHopService;
  public static get instance(): DA_NoiDungCuocHopService {
    if (!DA_NoiDungCuocHopService._instance) {
      DA_NoiDungCuocHopService._instance = new DA_NoiDungCuocHopService();
    }
    return DA_NoiDungCuocHopService._instance;
  }

  public async getData(
    searchData: DA_NoiDungCuocHopSearchType
  ): Promise<Response<ResponsePageList<DA_NoiDungCuocHopType[]>>> {
    const response = await apiService.post<
      Response<ResponsePageList<DA_NoiDungCuocHopType[]>>
    >("/dA_NoiDungCuocHop/getData", searchData);
    console.log("Data nội dung họp = ", response);
    return response.data;
  }

  // public async create(
  //   formData: DA_NoiDungCuocHopCreateOrUpdateType
  // ): Promise<Response> {
  //   const response = await apiService.post<Response>(
  //     "/dA_NoiDungCuocHop/create",
  //     formData
  //   );
  //   return response.data;
  // }

  public async create(
    formData: DA_NoiDungCuocHopCreateOrUpdateType
  ): Promise<Response> {
    console.log("Data being sent:", JSON.stringify(formData, null, 2)); // Log toàn bộ dữ liệu

    // Debug bằng breakpoint
    debugger;

    try {
      const response = await apiService.post<Response>(
        "/dA_NoiDungCuocHop/create",
        formData
      );
      return response.data;
    } catch (error) {
      console.error("API Error:", error); // Log chi tiết lỗi
      throw error;
    }
  }

  public async get(id: string): Promise<Response> {
    const response = await apiService.get<Response>(
      "/dA_NoiDungCuocHop/Get" + id
    );
    return response.data;
  }
  public async update(
    formData: DA_NoiDungCuocHopCreateOrUpdateType
  ): Promise<Response> {
    const response = await apiService.put<Response>(
      "/dA_NoiDungCuocHop/update",
      formData
    );
    return response.data;
  }

  public async delete(id: string): Promise<Response> {
    const response = await apiService.delete<Response>(
      "/dA_NoiDungCuocHop/delete/" + id
    );
    return response.data;
  }
  public async getDropdowns(): Promise<Response<Dictionary<DropdownOption[]>>> {
    const response = await apiService.get<
      Response<Dictionary<DropdownOption[]>>
    >("/dA_NoiDungCuocHop/getDropDowns");
    return response.data;
  }

  public async exportExcel(
    search: DA_NoiDungCuocHopSearchType
  ): Promise<Response<string>> {
    const response = await apiService.post<Response>(
      "/dA_NoiDungCuocHop/exportExcel",
      search
    );
    return response.data;
  }

  public async exportTemplateImport(): Promise<Response> {
    const response = await apiService.get<Response>(
      "/dA_NoiDungCuocHop/exportTemplateImport"
    );
    return response.data;
  }

  public async getDataImportView(): Promise<Response> {
    const response = await apiService.get<Response>(
      "/DA_NoiDungCuocHop/import"
    );
    return response.data;
  }

  public async getDropDownUser(): Promise<Response> {
    const response = await apiService.get<Response>("/Account/GetDropDownUser");
    return response.data;
  }

  public async saveImport(form: DataToSend): Promise<Response> {
    const response = await apiService.post<Response>(
      "/dA_NoiDungCuocHop/importExcel",
      form
    );
    return response.data;
  }

  public async uploadMeetingDocuments(
    meetingId: string,
    files: File[]
  ): Promise<UploadMeetingDocsResponse> {
    const formData = new FormData();
    formData.append("meetingId", meetingId);

    // Cách append file tối ưu
    files.forEach((file) => {
      formData.append("files", file, file.name); // Thêm filename thứ 3
    });

    try {
      // Debug FormData (chỉ dùng khi test)
      for (const [key, value] of formData.entries()) {
        console.log(key, value);
      }

      const response = await apiService.post(
        "/dA_NoiDungCuocHop/upload-meeting-docs",
        formData,
        {
          timeout: 30000,
        }
      );

      // Assuming the API returns the correct UploadMeetingDocsResponse shape
      return response.data as UploadMeetingDocsResponse;
    } catch (error: any) {
      console.error("Upload error:", {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
      });

      return {
        success: false,
        message: error.response?.data?.message || "Upload failed",
        documents: [],
      };
    }
  }
}

const dA_NoiDungCuocHopService = DA_NoiDungCuocHopService.instance;
export default dA_NoiDungCuocHopService;
