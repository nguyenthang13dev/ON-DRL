'use client'
import { useEffect, useState } from 'react'
import { Modal, Form } from 'antd'
import { formTemplateService } from '@/services/formTemplate/formTemplate.service'
import { FormTemplate } from '@/types/formTemplate/formTemplate'
import Loader from '@/components/fileManager-components/Loader/Loader'
import './formTemplateConfig.css'
import { FieldDefinition } from '@/types/fieldDefinition/fieldDefinition'
import FieldConfig from './fieldConfig'
import { toast } from 'react-toastify'
interface Props {
  isOpen: boolean
  formTemplate?: FormTemplate | null
  handleAfterUpdateTemplateFields: (formTemplate: FormTemplate) => void
  onClose: () => void
}
const FormTemplateConfig: React.FC<Props> = ({
  isOpen,
  formTemplate,
  handleAfterUpdateTemplateFields,
  onClose,
}: Props) => {
  const [editingField, setEditingField] = useState<
    FieldDefinition | undefined
  >()
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
    }

    container.addEventListener('click', handler)
    return () => container.removeEventListener('click', handler)
  }, [formTemplate])

  const handleSave = async (field: any) => {
    console.log('field', field)
    if (!formTemplate) return
    const updatedFields = formTemplate.fields.map((f) =>
      f.label === field.label ? field : f
    )
    // const updatedFormTemplate = { ...formTemplate, fields: updatedFields }
    try {
      field.options = field.options ? field.options.split(',') : []
      const template = await formTemplateService.UpdateFormTemplateField(
        formTemplate.id,
        field
      )
      handleAfterUpdateTemplateFields(template.data)
      setEditingField(undefined)
      toast.success('Cấu hình thành công')
    } catch (error) {
      toast.error('Cập nhật thất bại')
      console.error(error)
    }
  }

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
          onSuccess={handleSave}
          onClose={() => setEditingField(undefined)}
        />
      </div>
    </Modal>
  )
}
export default FormTemplateConfig
