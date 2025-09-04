export interface FieldDefinition extends AuditableEntity {
  id: string
  label: string
  type: string
  placeholder?: string
  required: boolean
  options?: string[]
  cssClass?: string
  config?: { [key: string]: any }
}
