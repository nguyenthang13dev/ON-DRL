import { FieldDefinition } from '../fieldDefinition/fieldDefinition'

export interface FormTemplate {
  id: string
  name: string
  description?: string
  originalFilePath: string
  htmlPreview: string
  fields: FieldDefinition[]
}
export interface FormTemplateSearch extends SearchBase {
  name?: string
}
