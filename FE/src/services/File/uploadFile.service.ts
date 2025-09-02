import { TaiLieuDinhKem } from '@/types/taiLieuDinhKem/taiLieuDinhKem';
import { apiService } from '../index';
import { Response } from '@/types/general';
const baseUrl = process.env.NEXT_PUBLIC_API_URL;
class UploadFileService {
  public async deleteFile(
    fileId: string[]
  ): Promise<Response<TaiLieuDinhKem[]>> {
    try {
      const response = await apiService.post<Response<TaiLieuDinhKem[]>>(
        '/Common/removeFile',
        fileId
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  public async upload(form: FormData): Promise<Response<TaiLieuDinhKem[]>> {
    try {
      const response = await apiService.post<Response<TaiLieuDinhKem[]>>(
        '/common/upload',
        form
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  public async deleteTemp(
    uploadedUrl: string
  ): Promise<Response<TaiLieuDinhKem[]>> {
    try {
      const response = await apiService.post<Response<TaiLieuDinhKem[]>>(
        '/common/deleteTempFile',
        {
          uploadedUrl,
        }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  public async getImage(filePath: string) {
    try {
      const response = await fetch(`${baseUrl}/common/${filePath}`);
      return response;
    } catch (error) {
      throw error;
    }
  }
}

export const uploadFileService = new UploadFileService();
