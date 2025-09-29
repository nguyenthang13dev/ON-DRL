import { apiService } from '../index'
import { Response, DropdownOption } from '@/types/general'
import { createEditType, searchLopHanhChinh } from '@/types/lopHanhChinh/lopHanhChinh'

class LopHanhChinhService {
  public async getDataByPage(searchData: searchLopHanhChinh): Promise<Response> {
    try {
      const response = await apiService.post<Response>(
        '/LopHanhChinh/GetData',
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
        `/LopHanhChinh/${id}`
      )
      return response.data
    } catch (error) {
      throw error
    }
  }

  public async Create(data: createEditType): Promise<Response> {
    try {
      const response = await apiService.post<Response>(
        '/LopHanhChinh/Create',
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
        `/LopHanhChinh/Update/${id}`,
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
        `/LopHanhChinh/Delete/${id}`
      )
      return response.data
    } catch (error) {
      throw error
    }
  }
}

export const lopHanhChinhService = new LopHanhChinhService()
