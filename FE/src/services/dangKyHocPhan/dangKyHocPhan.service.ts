import { apiService } from '../index'
import { Response } from '@/types/general'
import { createEditType, searchDangKyHocPhan } from '@/types/dangKyHocPhan/dangKyHocPhan'

class DangKyHocPhanService {
  public async getDataByPage(searchData: searchDangKyHocPhan): Promise<Response> {
    try {
      const response = await apiService.post<Response>(
        '/DangKyHocPhan/GetData',
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
        `/DangKyHocPhan/${id}`
      )
      return response.data
    } catch (error) {
      throw error
    }
  }

  public async Create(data: createEditType): Promise<Response> {
    try {
      const response = await apiService.post<Response>(
        '/DangKyHocPhan/Create',
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
        `/DangKyHocPhan/Update/${id}`,
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
        `/DangKyHocPhan/Delete/${id}`
      )
      return response.data
    } catch (error) {
      throw error
    }
  }
}

export const dangKyHocPhanService = new DangKyHocPhanService()
