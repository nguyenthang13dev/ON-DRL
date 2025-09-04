import { apiService } from '@/services';
import {
  DataToSend,
  Dictionary,
  DropdownOption,
  Response,
  ResponsePageList,
} from '@/types/general';
import {
  KySoCauHinhCreateOrUpdateType,
  KySoCauHinhSearchType,
  KySoCauHinhType,
} from '@/types/kySoCauHinh/kySoCauHinh';

class KySoCauHinhService {
  private static _instance: KySoCauHinhService;
  public static get instance(): KySoCauHinhService {
    if (!KySoCauHinhService._instance) {
      KySoCauHinhService._instance = new KySoCauHinhService();
    }
    return KySoCauHinhService._instance;
  }

  public async getData(
    searchData: KySoCauHinhSearchType
  ): Promise<Response<ResponsePageList<KySoCauHinhType[]>>> {
    const response = await apiService.post<
      Response<ResponsePageList<KySoCauHinhType[]>>
    >('/kySoCauHinh/getData', searchData);
    return response.data;
  }

  public async create(
    formData: KySoCauHinhCreateOrUpdateType
  ): Promise<Response> {
    const response = await apiService.post<Response>(
      '/kySoCauHinh/create',
      formData
    );
    return response.data;
  }

  public async update(
    formData: KySoCauHinhCreateOrUpdateType
  ): Promise<Response> {
    const response = await apiService.put<Response>(
      '/kySoCauHinh/update',
      formData
    );
    return response.data;
  }

  public async delete(id: string): Promise<Response> {
    const response = await apiService.delete<Response>(
      '/kySoCauHinh/delete/' + id
    );
    return response.data;
  }

  public async getDropdowns(): Promise<Response<Dictionary<DropdownOption[]>>> {
    const response = await apiService.get<
      Response<Dictionary<DropdownOption[]>>
    >('/kySoCauHinh/getDropDowns');
    return response.data;
  }

  public async exportExcel(
    search: KySoCauHinhSearchType
  ): Promise<Response<string>> {
    const response = await apiService.post<Response>(
      '/kySoCauHinh/exportExcel',
      search
    );
    return response.data;
  }

  public async exportTemplateImport(): Promise<Response> {
    const response = await apiService.get<Response>(
      '/kySoCauHinh/exportTemplateImport'
    );
    return response.data;
  }

  public async getDataImportView(): Promise<Response> {
    const response = await apiService.get<Response>('/KySoCauHinh/import');
    return response.data;
  }

  public async saveImport(form: DataToSend): Promise<Response> {
    const response = await apiService.post<Response>(
      '/kySoCauHinh/importExcel',
      form
    );
    return response.data;
  }

  public async upload(form: FormData): Promise<Response> {
    try {
      const response = await apiService.post<Response>(
        '/kySoCauHinh/upload',
        form
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  //Lưu hoặc tạo mới
  public async save(formData: FormData): Promise<Response> {
    const response = await apiService.post<Response>(
      '/kySoCauHinh/save',
      formData
    );
    return response.data;
  }

  public async getByThongTin(
    idBieuMau: string,
    idDTTienTrinhXuLy: string
  ): Promise<Response> {
    try {
      const response = await apiService.get<Response>(
        '/kySoCauHinh/getByThongTin/',
        {
          params: {
            idBieuMau,
            idDTTienTrinhXuLy,
          },
        }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  public async image(path: string): Promise<Response> {
    const response = await apiService.get<Response>(
      '/kySoCauHinh/image?path=' + path
    );
    return response.data;
  }
}

const kySoCauHinhService = KySoCauHinhService.instance;
export default kySoCauHinhService;
