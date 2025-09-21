import {
  searchDuLieuDanhMucData,
  createEditType,
} from '@/types/duLieuDanhMuc/duLieuDanhMuc'
import { apiService } from '../index'
import { DropdownOption, DropdownTreeOptionAntd, Response } from '@/types/general'
import { FormTemplateSearch } from '@/types/formTemplate/formTemplate'
import { FieldDefinition } from '@/types/fieldDefinition/fieldDefinition'

class FormTemplateService {
  public async getDataByPage(
    searchData: FormTemplateSearch
  ): Promise<Response> {
    try {
      const response = await apiService.post<Response>(
        '/FormTemplate/GetData',
        searchData
      )
      return response.data
    } catch (error) {
      throw error
    }
  }
  public async GetById(id: string): Promise<Response> {
    try {
      const response = await apiService.get<Response>(`/FormTemplate/${id}`)
      return response.data
    } catch (error) {
      throw error
    }
  }

  public async GenerateFormHtml(id: string): Promise<Response> {
    try {
      const response = await apiService.get<Response>(
        `/FormTemplate/GenerateFormHtml/${id}`
      )
      return response.data
    } catch (error) {
      throw error
    }
  }

  public async CreatOrUpdate(formData: FormData): Promise<Response> {
    try {
      const response = await apiService.post<Response>(
        '/FormTemplate/CreateOrUpdate',
        formData
      )
      return response.data
    } catch (error) {
      throw error
    }
  }
  public async UpdateFormTemplateField(
    formTemplateId: string,
    updatedFields: FieldDefinition
  ): Promise<Response> {
    const response = await apiService.post<Response>(
      `/FormTemplate/${formTemplateId}/field/update`,
      updatedFields
    )
    return response.data
  }
  public async Delete(id: string): Promise<Response> {
    try {
      const response = await apiService.delete<Response>(
        `/FormTemplate/Delete/${id}`
      )
      return response.data
    } catch (error) {
      throw error
    }
  }

  public async GetDropdown(): Promise<Response> {
    try {
      const response = await apiService.get<Response>(
        `/FormTemplate/GetDropdown`
      )
      return response.data
    } catch (error) {
      throw error
    }
  }
}

export const formTemplateService = new FormTemplateService()
