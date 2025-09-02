import { apiService } from "@/services";
import { Response, ResponsePageList } from "@/types/general";
import { TD_UngVienDto, TD_UngVienSearch, TD_UngVienCreate, TD_UngVienEdit, TD_UngVienAndDonUngTuyenCreate, TD_UngVienAndDonUngTuyenResultDto,TD_UngVienTongQuanVM } from "@/types/TD_UngVien/TD_UngVien";

class TD_UngVienService {
  private static _instance: TD_UngVienService;
  public static get instance(): TD_UngVienService {
    if (!TD_UngVienService._instance) {
      TD_UngVienService._instance = new TD_UngVienService();
    }
    return TD_UngVienService._instance;
  }

  public async getData(
    search: TD_UngVienSearch
  ): Promise<Response<ResponsePageList<TD_UngVienDto[]>>> {
    const response = await apiService.post<
      Response<ResponsePageList<TD_UngVienDto[]>>
    >("/TD_UngVien/GetData", search);
    return response.data;
  }

  public async get(id: string): Promise<Response<TD_UngVienDto>> {
    const response = await apiService.get<Response<TD_UngVienDto>>(
      `/TD_UngVien/Get/${id}`
    );
    return response.data;
  }

  public async create(data: TD_UngVienCreate): Promise<Response<TD_UngVienDto>> {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(key, value as any);
      }
    });
    const response = await apiService.post<Response<TD_UngVienDto>>(
      "/TD_UngVien/Create",
      formData,
      { headers: { "Content-Type": "multipart/form-data" } }
    );
    return response.data;
  }


  public async update(data: TD_UngVienEdit): Promise<Response> {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(key, value as any);
      }
    });
    const response = await apiService.post<Response>(
      "/TD_UngVien/Update",
      formData,
      { headers: { "Content-Type": "multipart/form-data" } }
    );
    return response.data;
  }

  public async delete(id: string): Promise<Response> {
    const response = await apiService.delete<Response>(
      `/TD_UngVien/Delete/${id}`
    );
    return response.data;
  }

  public async downloadCV(idUngVien: string): Promise<Blob> {
    const response = await apiService.get(`/TD_UngVien/downloadCV/${idUngVien}`, {
      responseType: "blob",
    });
    if (!response || !response.data) throw new Error("Tải file thất bại");
    return response.data as Blob;
  }

  public async updateStatus(data: { Ids: string[], TrangThai: number, GhiChu?: string }): Promise<Response> {
    const response = await apiService.post<Response>(
      "/TD_UngVien/UpdateStatus",
      data
    );
    return response.data;
  }

  public async updateInterviewTime(data: { Id: string; ThoiGianPhongVan: string | null }): Promise<Response> {
    const response = await apiService.post<Response>(
      "/TD_UngVien/UpdateInterviewTime",
      data
    );
    return response.data;
  }

public async uploadCV(data: { tuyenDungId: string; files: File[] }): Promise<Response> {
  const formData = new FormData();
  formData.append("tuyenDungId", data.tuyenDungId);
  data.files.forEach((file) => {
    formData.append("files", file); // giữ nguyên key "files" cho nhiều file
  });

  const response = await apiService.post<Response>(
    "/UploadCV/analyze",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return response.data;
}

  public async getInterviewList(vitriTuyenDungId?: string, interviewFrom?: string, interviewTo?: string) {
    const params: any = {};
    if (vitriTuyenDungId) params.vitriTuyenDungId = vitriTuyenDungId;
    if (interviewFrom) params.interviewFrom = interviewFrom;
    if (interviewTo) params.interviewTo = interviewTo;
    const response = await apiService.get<Response<TD_UngVienDto[]>>(
      "/TD_UngVien/GetInterviewList",
      { params }
    );
    return response.data;
  }

  public async sendMailToUngViens(payload: { UngVienIds: string[]; EmailTemplateId: string }): Promise<Response> {
    const response = await apiService.post<Response>(
      "/TD_UngVien/SendMailToUngViens",
      payload
    );
    return response.data;
  }

  // Xem trực tiếp CV (PDF, DOCX, ...)
  public async viewCV(idUngVien: string): Promise<Blob> {
    const response = await apiService.get(`/TD_UngVien/viewCV/${idUngVien}`, {
      responseType: "blob",
    });
    if (!response || !response.data) throw new Error("Không xem được file");
    return response.data as Blob;
  }

  public async getOverview(): Promise<Response<TD_UngVienTongQuanVM>> {
    const response = await apiService.get<Response<TD_UngVienTongQuanVM>>(
      "/TD_UngVien/GetOverview"
    );
    return response.data;
  }
}

const tD_UngVienService = TD_UngVienService.instance;
export default tD_UngVienService; 