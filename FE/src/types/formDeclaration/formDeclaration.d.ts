export interface FormDeclaration {
  id: string
  formTemplateId: string
  userId: string
  status: string
  declaration: { [key: string]: any }
}

export interface FormDeclarationSearch extends SearchBase {
  formTemplateId: string
  status: string
  declaringUser: string
  fromDate: Date
  endDate: Date
}


