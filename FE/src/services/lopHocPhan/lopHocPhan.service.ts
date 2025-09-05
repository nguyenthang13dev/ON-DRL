import { apiService } from '../index'
import { Response } from '@/types/general'
import { createEditType, searchLopHocPhan } from '@/types/lopHocPhan/lopHocPhan'

class LopHocPhanService {
  public async getDataByPage(searchData: searchLopHocPhan): Promise<Response> {
    try {
      const response = await apiService.post<Response>(
        '/LopHocPhan/GetData',
        searchData
      )
      return response.data
    } catch (error) {
      throw error
    }
  }

  public async GetById(id: string): Promise<Response> {
    try {
      const response = await apiService.get<Response>(
        `/LopHocPhan/${id}`
      )
      return response.data
    } catch (error) {
      throw error
    }
  }

  public async Create(data: createEditType): Promise<Response> {
    try {
      const response = await apiService.post<Response>(
        '/LopHocPhan/Create',
        data
      )
      return response.data
    } catch (error) {
      throw error
    }
  }

  public async Update(id: string, data: createEditType): Promise<Response> {
    try {
      const response = await apiService.put<Response>(
        `/LopHocPhan/Update/${id}`,
        data
      )
      return response.data
    } catch (error) {
      throw error
    }
  }

  public async Delete(id: string): Promise<Response> {
    try {
      const response = await apiService.delete<Response>(
        `/LopHocPhan/Delete/${id}`
      )
      return response.data
    } catch (error) {
      throw error
    }
  }
}

export const lopHocPhanService = new LopHocPhanService()
