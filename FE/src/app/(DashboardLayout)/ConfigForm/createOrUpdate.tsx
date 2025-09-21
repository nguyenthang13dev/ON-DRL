'use client';

import UploadFiler, { CustomUploadFile } from "@/libs/UploadFilter";
import { configFormService } from "@/services/ConfigForm/ConfigForm.service";
import { ConfigFormCreateVM, TableConfigFormDataType } from "@/types/ConfigForm/ConfigForm";
import { CloseOutlined, SaveOutlined } from "@ant-design/icons";
import
  {
    Button,
    Col,
    Form,
    FormProps,
    Input,
    Modal,
    Row,
    Switch,
  } from "antd";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

interface CreateOrUpdateProps {
  isOpen: boolean;
  onSuccess: () => void;
  onClose: () => void;
  ConfigForm: TableConfigFormDataType | null;
}
const { TextArea } = Input;
const CreateOrUpdate: React.FC<CreateOrUpdateProps> = ({
  isOpen,
  onSuccess,
  onClose,
  ConfigForm,
}) => {
  const [form] = Form.useForm<ConfigFormCreateVM>();
  const [fileList, setFileList] = useState<CustomUploadFile[]>([]);
  const [uploadedFileIds, setUploadedFileIds] = useState<string[]>([]);

    
 console.log(fileList, uploadedFileIds);
 
    
  useEffect(() => {
    if (isOpen) {
      if (ConfigForm) {
        // Convert null values to undefined for form compatibility
        const formValues = {
          ...ConfigForm,
          name: ConfigForm.name || undefined,
          description: ConfigForm.description || undefined,
          isActive: ConfigForm.isActive ?? true,
        };
        form.setFieldsValue(formValues);

        // Set existing files if any
        if (ConfigForm.fileDinhKems) {
          const existingFile: CustomUploadFile = {
            uid: ConfigForm.fileDinhKems,
            name: `File đính kèm`,
            status: 'done',
            isExisting: true,
          };
          setFileList([existingFile]);
          setUploadedFileIds([ConfigForm.fileDinhKems]);
        } else {
          setFileList([]);
          setUploadedFileIds([]);
        }
      } else {
        form.resetFields();
        form.setFieldsValue({
          isActive: true,
        });
        setFileList([]);
        setUploadedFileIds([]);
      }
    }
  }, [isOpen, ConfigForm, form]);

  const onFinish: FormProps<ConfigFormCreateVM>["onFinish"] = async (values) => {
    try {
      // Get the first uploaded file ID if any
      const fileDinhKems = uploadedFileIds.length > 0 ? uploadedFileIds[0] : null;
      
      const formData = {
        ...values,
        fileDinhKems,
      };

      let response;
      if (ConfigForm) {
        response = await configFormService.update({ ...formData, id: ConfigForm.id });
      } else {
        response = await configFormService.create(formData);
      }

      if (response.status) {
        toast.success(
          ConfigForm ? "Cập nhật cấu hình biểu mẫu thành công" : "Thêm cấu hình biểu mẫu thành công"
        );
        onSuccess();
        onClose();
      } else {
        toast.error(response.message || "Có lỗi xảy ra");
      }
    } catch (error) {
      toast.error("Có lỗi xảy ra khi lưu dữ liệu");
    }
  };

  return (
    <Modal
      title={ConfigForm ? "Chỉnh sửa cấu hình biểu mẫu" : "Thêm cấu hình biểu mẫu mới"}
      width={800}
      onCancel={onClose}
      open={isOpen}
      footer={
        <div>
          <Button onClick={onClose} style={{ marginRight: 8 }}>
            <CloseOutlined /> Hủy
          </Button>
          <Button
            onClick={() => form.submit()}
            type="primary"
            icon={<SaveOutlined />}
          >
            Lưu
          </Button>
        </div>
      }
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        initialValues={{
          isActive: true,
        }}
      >
        <Row gutter={16}>
          <Col span={24}>
            <Form.Item
              label="Tên cấu hình"
              name="name"
              rules={[
                { required: true, message: "Vui lòng nhập tên cấu hình!" },
                { min: 3, message: "Tên cấu hình phải có ít nhất 3 ký tự!" },
                { max: 255, message: "Tên cấu hình không được quá 255 ký tự!" }
              ]}
            >
              <Input placeholder="Nhập tên cấu hình biểu mẫu" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={24}>
            <Form.Item
              label="Mô tả"
              name="description"
              rules={[
                { required: true, message: "Vui lòng nhập mô tả!" },
                { min: 10, message: "Mô tả phải có ít nhất 10 ký tự!" },
                { max: 1000, message: "Mô tả không được quá 1000 ký tự!" }
              ]}
            >
              <TextArea
                rows={4}
                placeholder="Nhập mô tả chi tiết về cấu hình biểu mẫu này..."
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="Trạng thái"
              name="isActive"
              valuePropName="checked"
            >
              <Switch 
                checkedChildren="Hoạt động" 
                unCheckedChildren="Không hoạt động"
                style={{ width: 120 }}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="File đính kèm">
              <UploadFiler
                maxFiles={1}
                fileList={fileList}
                setFileList={setFileList}
                setUploadedData={setUploadedFileIds}
                type="ConfigForm"
                uploadType="select"
                listType="text"
                allowedFileTypes={[
                  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                  "application/msword"
                ]}
              />
              <div style={{ marginTop: 8, fontSize: 12, color: '#666' }}>
                Hỗ trợ: .doc, .docx (tối đa 10MB)
              </div>
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={24}>
            <div style={{ 
              padding: 12, 
              backgroundColor: '#f0f2f5', 
              borderRadius: 6,
              fontSize: 13,
              color: '#666'
            }}>
              <strong>Lưu ý:</strong>
              <ul style={{ margin: '8px 0 0 16px', paddingLeft: 0 }}>
                <li>Tên cấu hình phải là duy nhất trong hệ thống</li>
                <li>File đính kèm sẽ được sử dụng làm mẫu biểu mẫu</li>
                <li>Chỉ chấp nhận file Word (.doc, .docx)</li>
                <li>Trạng thái &quot;Không hoạt động&quot; sẽ ẩn cấu hình khỏi danh sách sử dụng</li>
              </ul>
            </div>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default CreateOrUpdate;
