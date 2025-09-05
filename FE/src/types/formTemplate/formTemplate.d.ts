import { FieldDefinition } from '../fieldDefinition/fieldDefinition'

export interface FormTemplate {
  id: string
  name: string
  description?: string
  originalFilePath: string
  htmlPreview: string
  fields: FieldDefinition[]
  isClassMonitorHandled: boolean
}

export interface FormTemplateCreateUpdate {
  id: string
  name: string
  description: string
  isClassMonitorHandled: boolean
  originalFile: File
}

export interface FormTemplateSearch extends SearchBase {
  name?: string
}
