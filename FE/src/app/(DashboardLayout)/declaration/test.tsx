'use client'
import { useEffect, useState } from 'react'
import {
  Form,
  Input,
  Select,
  DatePicker,
  Checkbox,
  Radio,
  Button,
  Spin,
} from 'antd'
import { formTemplateService } from '@/services/formTemplate/formTemplate.service'
import Loader from '@/components/fileManager-components/Loader/Loader'
import './declaration.css'
export default function DynamicForm() {
  const [template, setTemplate] = useState<any>(null)
  const [form] = Form.useForm()

  const getForm = async (templateId: string) => {
    try {
      const template = await formTemplateService.GenerateFormHtml(templateId)
      setTemplate(template.data)
    } catch (error) {
      console.log('error', error)
    }
  }

  useEffect(() => {
    getForm('b18f06eb-4b64-4474-b38c-15ae950ed558')
  }, [])

  if (!template) return <Loader />

  const handleFinish = async (values: any) => {
    // await fetch(`http://localhost:5000/api/forms/${templateId}/responses`, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(values),
    // })
    alert('Gửi thành công ✅')
  }

  return (
    <div
      id="dynamic-form"
      dangerouslySetInnerHTML={{ __html: template.htmlPreview }}
    />
    // <Form form={form} layout="vertical" onFinish={handleFinish}>

    //   {template.fields.map((field: any) => (
    //     <Form.Item
    //       key={field.fieldId}
    //       name={field.fieldId}
    //       label={field.label}
    //       rules={
    //         field.required ? [{ required: true, message: 'Bắt buộc nhập' }] : []
    //       }
    //     >

    //     </Form.Item>
    //   ))}

    //   <Button type="primary" htmlType="submit">
    //     Nộp
    //   </Button>
    // </Form>
  )
}
