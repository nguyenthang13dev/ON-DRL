import { apiService } from '../index';
import { DropdownOption, Response } from '@/types/general';
import Notification, {
  NotificationCreate,
  NotificationSearch,
} from '@/types/notification/notification';

class NotificationService {
  public async getDataByPage(
    searchData: NotificationSearch
  ): Promise<Response> {
    try {
      const response = await apiService.post<Response>(
        '/Notification/GetData',
        searchData
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  public async Create(form: NotificationCreate): Promise<Response> {
    try {
      const response = await apiService.post<Response>(
        '/Notification/Create',
        form
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  public async Update(form: NotificationCreate): Promise<Response> {
    try {
      const response = await apiService.put<Response>(
        '/Notification/Update',
        form
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  public async Delete(id: string): Promise<Response> {
    try {
      const response = await apiService.delete<Response>(
        '/Notification/Delete/' + id
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  public async exportExcel(): Promise<Response> {
    try {
      const response = await apiService.get<Response>('/Notification/export');
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  public async getDataDoanhNghiep(
    searchData: NotificationSearch
  ): Promise<Response> {
    try {
      const response = await apiService.post<Response>(
        '/Notification/GetDataDoanhNghiep',
        searchData
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  public async getDataSanPham(
    searchData: NotificationSearch
  ): Promise<Response> {
    try {
      const response = await apiService.post<Response>(
        '/Notification/GetDataSanPham',
        searchData
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  public async getNotification(): Promise<Response> {
    try {
      const response = await apiService.post<Response>(
        '/Notification/GetNotification'
      );
      console.log(response.data);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  public async SendEmail(
    subject: string,
    body: string,
    toAddress: string,
    iditem: string
  ): Promise<Response> {
    try {
      const formData = new FormData();
      formData.append('subject', subject);
      formData.append('body', body);
      formData.append('toAddress', toAddress);
      formData.append('iditem', iditem);
      const response = await apiService.post<Response>(
        '/Notification/SendEmail',
        formData
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  public async ToggleLock(id: string): Promise<Response> {
    try {
      const response = await apiService.get<Response>(
        '/Notification/ToggleLock/' + id
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  public async markAsRead(id: string): Promise<Response> {
    try {
      const response = await apiService.get<Response>(
        '/Notification/markAsRead/' + id
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  public async getDataByUser(
    searchData: NotificationSearch
  ): Promise<Response> {
    try {
      const response = await apiService.post<Response>(
        '/Notification/GetDataByUser',
        searchData
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}

export const notificationService = new NotificationService();
