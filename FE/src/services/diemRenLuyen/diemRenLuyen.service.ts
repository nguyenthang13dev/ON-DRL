import { apiService } from '../index'
import { Response } from '@/types/general'
import { createEditType, searchDiemRenLuyen } from '@/types/diemRenLuyen/diemRenLuyen'

class DiemRenLuyenService {
  public async getDataByPage(searchData: searchDiemRenLuyen): Promise<Response> {
    try {
      const response = await apiService.post<Response>(
        '/DiemRenLuyen/GetData',
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
        `/DiemRenLuyen/${id}`
      )
      return response.data
    } catch (error) {
      throw error
    }
  }

  public async Create(data: createEditType): Promise<Response> {
    try {
      const response = await apiService.post<Response>(
        '/DiemRenLuyen/Create',
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
        `/DiemRenLuyen/Update/${id}`,
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
        `/DiemRenLuyen/Delete/${id}`
      )
      return response.data
    } catch (error) {
      throw error
    }
  }
}

export const diemRenLuyenService = new DiemRenLuyenService()
