'use client'
import { useCallback, useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { Modal, Form, Input, Select, Switch, Button, Spin } from 'antd'
import { formTemplateService } from '@/services/formTemplate/formTemplate.service'

export default function TemplatePreviewPage() {
  const params = useParams()
  const templateId = params.id as string
  const [template, setTemplate] = useState<any>(null)
  const [editingField, setEditingField] = useState<any>(null)
  const [form] = Form.useForm()

  const handleGetTemplateById = async () => {
    try {
      const response = await formTemplateService.GetById('')
      if (response != null && response.data != null) {
        console.log('response', response)
        setTemplate(response.data)
      }
    } catch (error) {}
  }

  // Fetch template từ backend
  useEffect(() => {
    handleGetTemplateById()
  }, [templateId])

  // attach click event vào ⚙️
  useEffect(() => {
    if (!template) return
    const handlers: any[] = []
    document.querySelectorAll('.field-config').forEach((el) => {
      const handler = () => {
        const fieldId = el.getAttribute('data-id')
        const field = template.fields.find((f: any) => f.fieldId === fieldId)
        setEditingField(field)
        form.setFieldsValue({
          label: field.label,
          type: field.type,
          required: field.required,
          options: field.options?.join(', '),
        })
      }
      el.addEventListener('click', handler)
      handlers.push({ el, handler })
    })
    return () => {
      handlers.forEach(({ el, handler }) =>
        el.removeEventListener('click', handler)
      )
    }
  }, [template])

  const handleSave = async () => {
    const values = await form.validateFields()
    await fetch(
      `https://localhost:7130/api/FormTemplate/${templateId}/fields/${editingField.fieldId}`,
      {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      }
    )
    // update UI
    setTemplate({
      ...template,
      fields: template.fields.map((f: any) =>
        f.fieldId === editingField.fieldId
          ? { ...f, ...values, options: values.options.split(',') }
          : f
      ),
    })
    setEditingField(null)
  }

  if (!template) return <Spin />

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-2">{template.name}</h2>

      {/* render preview từ Word */}
      <div
        className="border p-4 rounded bg-white"
        dangerouslySetInnerHTML={{ __html: template.htmlPreview }}
      />

      {/* modal cấu hình */}
      <Modal
        title={`Cấu hình: ${editingField?.fieldId}`}
        open={!!editingField}
        onCancel={() => setEditingField(null)}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleSave}>
          <Form.Item name="label" label="Label">
            <Input />
          </Form.Item>
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
          <Button type="primary" htmlType="submit">
            Lưu
          </Button>
        </Form>
      </Modal>
    </div>
  )
}
