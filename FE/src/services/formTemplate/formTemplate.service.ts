import {
  searchDuLieuDanhMucData,
  createEditType,
} from '@/types/duLieuDanhMuc/duLieuDanhMuc'
import { apiService } from '../index'
import { DropdownTreeOptionAntd, Response } from '@/types/general'
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

  // public async Export(searchData: searchDuLieuDanhMucData): Promise<Response> {
  //   try {
  //     const response = await apiService.post<Response>(
  //       '/DM_DuLieuDanhMuc/Export',
  //       searchData
  //     )
  //     return response.data
  //   } catch (error) {
  //     throw error
  //   }
  // }

  // public async GetHierarchicalDropdownList(
  //   id?: string,
  //   disabledParent?: boolean
  // ): Promise<Response<DropdownTreeOptionAntd>> {
  //   try {
  //     const response = await apiService.get<Response<DropdownTreeOptionAntd>>(
  //       `/DM_DuLieuDanhMuc/GetHierarchicalDropdownList?id=${id}&disabledParent=${disabledParent}`
  //     )
  //     return response.data
  //   } catch (error) {
  //     throw error
  //   }
  // }
  // public async GetDropdown(groupCode: string): Promise<Response> {
  //   try {
  //     const response = await apiService.get<Response>(
  //       `/DM_DuLieuDanhMuc/GetDropdownByGroupCode/${groupCode}`
  //     )
  //     return response.data
  //   } catch (error) {
  //     throw error
  //   }
  // }
  // public async GetDropDownByDonViId(id: string): Promise<Response> {
  //   try {
  //     const response = await apiService.get<Response>(
  //       `/DM_DuLieuDanhMuc/GetDropDownByDonViId/${id}`
  //     )
  //     return response.data
  //   } catch (error) {
  //     throw error
  //   }
  // }

  // public async GetByCode(code: string): Promise<Response> {
  //   try {
  //     const response = await apiService.get<Response>(
  //       `/DM_DuLieuDanhMuc/GetByCode/${code}`
  //     )
  //     return response.data
  //   } catch (error) {
  //     throw error
  //   }
  // }
  // public async GetDropdownCode(groupCode: string): Promise<Response> {
  //   try {
  //     const response = await apiService.get<Response>(
  //       `/DM_DuLieuDanhMuc/GetDropdownCode/${groupCode}`
  //     )
  //     return response.data
  //   } catch (error) {
  //     throw error
  //   }
  // }

  // public async GetDropdownByGroupCode(groupCode: string): Promise<Response> {
  //   try {
  //     const response = await apiService.get<Response>(
  //       `/DM_DuLieuDanhMuc/GetDropdownByGroupCode/${groupCode}`
  //     )
  //     return response.data
  //   } catch (error) {
  //     throw error
  //   }
  // }

  // public async GetListDataByGroupCode(groupCode: string): Promise<Response> {
  //   try {
  //     const response = await apiService.get<Response>(
  //       `/DM_DuLieuDanhMuc/GetListDataByGroupCode/${groupCode}`
  //     )
  //     return response.data
  //   } catch (error) {
  //     throw error
  //   }
  // }
  // public async GetDropdownTreeOption(groupCode: string): Promise<Response> {
  //   try {
  //     const response = await apiService.get<Response>(
  //       `/DM_DuLieuDanhMuc/GetDropdownTreeOption/${groupCode}`
  //     )
  //     return response.data
  //   } catch (error) {
  //     throw error
  //   }
  // }
  // public async GetDropdownCodeAndNote(
  //   groupCode: string,
  //   note: string
  // ): Promise<Response> {
  //   try {
  //     const response = await apiService.get<Response>(
  //       `/DM_DuLieuDanhMuc/GetDropdownCodeAndNote/${groupCode}/${note}`
  //     )
  //     return response.data
  //   } catch (error) {
  //     throw error
  //   }
  // }
}

export const formTemplateService = new FormTemplateService()
