import { Button, Form, FormProps, Input, Modal, Switch, Upload } from 'antd'
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import {
  FormTemplate,
  FormTemplateCreateUpdate,
} from '@/types/formTemplate/formTemplate'
import { formTemplateService } from '@/services/formTemplate/formTemplate.service'
import TextArea from 'antd/es/input/TextArea'
import { UploadOutlined } from '@ant-design/icons'
import {
  FormDeclaration,
  FormDeclarationSearch,
} from '@/types/formDeclaration/formDeclaration'
import { formDeclarationService } from '@/services/formDeclaration/formDeclaration.service'

interface Props {
  isOpen: boolean
  templateId: string
  currentDeclaration?: FormDeclaration | null
  onClose: () => void
  onSuccess: () => void
}

const CreateOrUpdate: React.FC<Props> = ({
  isOpen,
  templateId,
  currentDeclaration,
  onClose,
  onSuccess,
}: Props) => {
  const [template, setTemplate] = useState<any>(null)

  // const handleAfterSuccess = () => {
  //     toast.success(
  //         props.currentDeclaration != null
  //             ? "Chỉnh sửa biểu mẫu thành công"
  //             : "Thêm mới biểu mẫu thành công",
  //     );
  //     form.resetFields();
  //     props.onSuccess();
  //     props.onClose();
  // };

  // const handleOnFinish: FormProps<FormTemplateCreateUpdate>["onFinish"] =
  //     async (formValues: FormTemplateCreateUpdate) => {
  //         console.log("formData:", formValues);
  //         const formData = ConvertToFormData(formValues);
  //         try {
  //             const response = await formTemplateService.CreatOrUpdate(
  //                 formData,
  //             );
  //             if (response.status) {
  //                 handleAfterSuccess();
  //             } else {
  //                 toast.error(response.message);
  //             }
  //         } catch (error) {
  //             toast.error("Có lỗi xảy ra: " + error);
  //         }
  //     };

  // const onSwitchChange = (checked: boolean) => {
  //     form.setFieldsValue({ isClassMonitorHandled: checked });
  // }
  // const handleMapEdit = () => {
  //   form.setFieldsValue({
  //     id: props.currentFormTemplate?.id,
  //     name: props.currentFormTemplate?.name,
  //     description: props.currentFormTemplate?.description,
  //     isClassMonitorHandled: !!props.currentFormTemplate?.isClassMonitorHandled,
  //     originalFile: props.currentFormTemplate?.originalFilePath
  //       ? [
  //           {
  //             uid: '-1', // unique id
  //             name: props.currentFormTemplate.originalFilePath.split('\\').pop(),
  //             status: 'done',
  //             url: `${
  //               process.env.NEXT_PUBLIC_API_URL
  //             }/${props.currentFormTemplate.originalFilePath.replace('\\', '/')}`,
  //           },
  //         ]
  //       : [],
  //   })
  // }
  const handleGetForm = async () => {
    try {
      const template = await formTemplateService.GenerateFormHtml(templateId)
      setTemplate(template.data)
    } catch (error) {
      console.log('error', error)
    }
  }
  //   const handleCancel = () => {
  //     setIsOpen(false)
  //     form.resetFields()
  //     props.onClose()
  //   }

  const handleOnFinish = async () => {
    const form = document.getElementById('dynamicForm') as HTMLFormElement
    const formData = new FormData(form)

    // Tạo object JSON để gửi
    const dto: any = {
      formTemplateId: templateId, // input hidden guid
      name: '',
      declaration: {},
    }
    // Map các field còn lại vào declaration
    for (const [key, value] of formData.entries()) {
      if (key !== 'FormTemplateId' && key !== 'Name') {
        dto.declaration[key] = value
      }
    }
    const response = await formDeclarationService.Create(dto)
    if (response != null && response.data) {
      toast.success('Thêm mới kê khai thành công')
      onSuccess()
    } else {
      toast.error('Có lỗi xảy ra: ' + response.message)
    }
  }

  useEffect(() => {
    handleGetForm()
    // setIsOpen(props.isOpen)
    //   if (props.currentFormTemplate) {
    //     handleMapEdit()
    //   }
  }, [templateId, isOpen])

  return (
    <Modal
      open={isOpen}
      title={!!currentDeclaration ? 'Chỉnh sửa kê khai' : 'Thêm mới kê khai'}
      onCancel={onClose}
      width={1200}
      footer={[
        <Button key="back" onClick={onClose}>
          Đóng
        </Button>,
        <Button key="submit" type="primary" onClick={() => handleOnFinish()}>
          Lưu
        </Button>,
      ]}
    >
      <div
        id="dynamic-form"
        dangerouslySetInnerHTML={{ __html: template?.htmlPreview }}
      />
    </Modal>
  )
}

export default CreateOrUpdate
