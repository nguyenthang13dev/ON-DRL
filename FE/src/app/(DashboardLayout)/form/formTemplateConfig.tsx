'use client'
import { useCallback, useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { Modal, Form, Input, Select, Switch, Button, Spin } from 'antd'
import { formTemplateService } from '@/services/formTemplate/formTemplate.service'
import { FormTemplate } from '@/types/formTemplate/formTemplate'
import Loader from '@/components/fileManager-components/Loader/Loader'
import './formTemplateConfig.css'
import { FieldDefinition } from '@/types/fieldDefinition/fieldDefinition'
import FieldConfig from './fieldConfig'
interface Props {
  isOpen: boolean
  formTemplate?: FormTemplate | null
  onClose: () => void
}
const FormTemplateConfig: React.FC<Props> = ({
  isOpen,
  formTemplate,
  onClose,
}: Props) => {
  const [editingField, setEditingField] = useState<
    FieldDefinition | undefined
  >()
  const [form] = Form.useForm()
  const [isOpenModal, setIsOpenModal] = useState<boolean>(isOpen)

  const handleCancel = () => {
    setIsOpenModal(false)
    onClose()
  }
  // attach click event vào ⚙️
  useEffect(() => {
    const container = document.getElementById('form-preview')
    if (!container) return

    const handler = (e: any) => {
      if (!formTemplate) return
      const target = e.target.closest('.field-config')
      if (!target) return
      const label = target.getAttribute('data-id')
      const field = formTemplate.fields.find((f: any) => f.label === label)
      if (!field) return

      setEditingField(field)
      form.setFieldsValue({
        label: field.label,
        type: field.type,
        required: field.required,
        options: field.options?.join(', '),
      })
    }

    container.addEventListener('click', handler)
    return () => container.removeEventListener('click', handler)
  }, [formTemplate])

  const handleSave = async () => {}

  if (!formTemplate) return <Loader />

  return (
    <Modal
      title={'Cấu hình biểu mẫu'}
      open={isOpen}
      onCancel={handleCancel}
      cancelText="Đóng"
      width={1200}
    >
      {/* render preview từ Word */}
      <div>
        <div
          id="form-preview"
          className="border p-2 rounded bg-white"
          dangerouslySetInnerHTML={{ __html: formTemplate.htmlPreview }}
        />
        {/* Modal cấu hình field */}
        <FieldConfig
          isOpen={!!editingField}
          editingField={editingField}
          onSuccess={(formValues: FieldDefinition) => {
            console.log('formValues:', formValues)
          }}
          onClose={() => setEditingField(undefined)}
        />
        {/* <Modal
          title={`Cấu hình: ${editingField?.label}`}
          open={!!editingField}
          onCancel={() => setEditingField(null)}
          footer={null}
        >
          <Form form={form} layout="vertical" onFinish={handleSave}>
            <Form.Item name="type" label="Loại field">
              <Select>
                <Select.Option value="text">Text</Select.Option>
                <Select.Option value="textarea">Textarea</Select.Option>
                <Select.Option value="date">Date</Select.Option>
                <Select.Option value="select">Select</Select.Option>
                <Select.Option value="checkbox">Checkbox</Select.Option>
                <Select.Option value="radio">Radio</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item name="required" label="Bắt buộc" valuePropName="checked">
              <Switch />
            </Form.Item>
            <Form.Item name="options" label="Options (cách nhau bằng ,)">
              <Input />
            </Form.Item>
            <Form.Item name="placeholder" label="Placeholder">
              <Input />
            </Form.Item>
            <Form.Item name="formTemplateId" >
              <Input type='hidden' />
            </Form.Item>
            <Button type="primary" htmlType="submit">
              Lưu
            </Button>
          </Form>
        </Modal> */}
      </div>
    </Modal>
  )
}
export default FormTemplateConfig
