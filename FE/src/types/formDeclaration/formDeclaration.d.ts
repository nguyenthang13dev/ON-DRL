import { Upload } from 'antd';
export interface FormDeclaration {
  id: string
  formTemplateId: string
  name: string
  declarant: string
  userId: string
  status: string
  declaration: { [key: string]: any }
  createdDate: Date,
  updatedDate: Date
}

export interface FormDeclarationSearch extends SearchBase {
  formTemplateId: string
  status: string
  declarant: string
  fromDate: Date
  endDate: Date
}


