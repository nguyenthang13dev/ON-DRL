import { apiService } from '../index'
import { Response } from '@/types/general'

class FieldDefinitionService {
  public async GetByLabelAndTemplateId(
    label: string,
    templateId: string
  ): Promise<Response> {
    try {
      const response = await apiService.get<Response>(
        `/FieldDefinition/GetByLabelAndTemplateId?label=${label}&templateId=${templateId}`
      )
      return response.data
    } catch (error) {
      throw error
    }
  }
}

export const fieldDefinitionService = new FieldDefinitionService()
