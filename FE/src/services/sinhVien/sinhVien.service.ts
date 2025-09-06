import { apiService } from '../index'
import { Response } from '@/types/general'
import { createEditType, searchSinhVien } from '@/types/sinhVien/sinhVien'

class SinhVienService {
  public async getDataByPage(searchData: searchSinhVien): Promise<Response> {
    try {
      const response = await apiService.post<Response>(
        '/SinhVien/GetData',
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
        `/SinhVien/${id}`
      )
      return response.data
    } catch (error) {
      throw error
    }
  }

  public async Create(data: createEditType): Promise<Response> {
    try {
      const response = await apiService.post<Response>(
        '/SinhVien/Create',
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
        `/SinhVien/Update/${id}`,
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
        `/SinhVien/Delete/${id}`
      )
      return response.data
    } catch (error) {
      throw error
    }
  }
}

export const sinhVienService = new SinhVienService()
