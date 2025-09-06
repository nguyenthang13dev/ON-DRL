'use client'
import { useEffect } from 'react'
import { Modal, Form, Input, Select, Switch, Button, FormProps } from 'antd'
import './formTemplateConfig.css'
import { FieldDefinition } from '@/types/fieldDefinition/fieldDefinition'
interface Props {
  isOpen: boolean
  editingField: FieldDefinition | undefined
  onSuccess: (formValues: FieldDefinition) => void
  onClose: () => void
}
const FieldConfig: React.FC<Props> = ({
  isOpen,
  editingField,
  onSuccess,
  onClose,
}: Props) => {
  const [form] = Form.useForm()

  const onSave: FormProps<FieldDefinition>['onFinish'] = async (
    formValues: FieldDefinition
  ) => {
    onSuccess(formValues)
  }
  const handleMapEdit = () => {
    form.setFieldsValue({
      ...editingField,
      options: editingField?.options?.join(',') || '',
    })
  }
  useEffect(() => {
    console.log('editingField', editingField)
    handleMapEdit()
  }, [isOpen])

  return (
    <Modal
      title={`Cấu hình: ${editingField?.label}`}
      open={isOpen}
      onCancel={() => onClose()}
      footer={null}
    >
      <Form form={form} layout="vertical" onFinish={onSave}>
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
          <Input.TextArea />
        </Form.Item>
        <Form.Item name="placeholder" label="Placeholder">
          <Input />
        </Form.Item>
        <Form.Item name="cssClass" label="CSS Class">
          <Input.TextArea />
        </Form.Item>
        <Form.Item name="label" label="Label" hidden>
          <Input type="hidden" />
        </Form.Item>
        <Button type="primary" htmlType="submit">
          Lưu
        </Button>
      </Form>
    </Modal>
  )
}
export default FieldConfig
