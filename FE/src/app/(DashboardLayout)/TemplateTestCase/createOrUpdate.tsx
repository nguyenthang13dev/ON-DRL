import React, { useEffect, useState } from "react";
import {
  Modal,
  Form,
  Input,
  Row,
  Col,
} from "antd";
import { toast } from "react-toastify";
import { TemplateTestCase, TemplateTestCaseCreate, TemplateTestCaseEdit } from "@/types/templateTestCase/templateTestCase";
import templateTestCaseService from "@/services/templateTestCase/templateTestCaseService";

const { TextArea } = Input;

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  data?: TemplateTestCase | null;
}

const TemplateTestCaseCreateOrUpdate: React.FC<Props> = ({
  isOpen,
  onClose,
  onSuccess,
  data,
}) => {
  const [form] = Form.useForm<TemplateTestCaseCreate | TemplateTestCaseEdit>();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (data) {
        form.setFieldsValue({
          templateName: data.templateName,
          keyWord: data.keyWord,
          templateContent: data.templateContent,
        });
      } else {
        form.resetFields();
      }
    }
  }, [isOpen, data, form]);

  const handleFinish = async (values: TemplateTestCaseCreate | TemplateTestCaseEdit) => {
    setLoading(true);
    try {
      let response;
              if (data) {
          response = await templateTestCaseService.update({
            ...values,
            id: data.id,
          } as TemplateTestCaseEdit);
      } else {
        response = await templateTestCaseService.create(values as TemplateTestCaseCreate);
      }

      if (response.status) {
        toast.success(
          data ? "Cập nhật template test case thành công" : "Thêm mới template test case thành công"
        );
        form.resetFields();
        onSuccess();
        onClose();
      } else {
        toast.error(response.message || "Có lỗi xảy ra");
      }
    } catch (error) {
      toast.error("Có lỗi xảy ra: " + error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    onClose();
  };

  return (
    <Modal
      title={data ? "Chỉnh sửa Template Test Case" : "Thêm mới Template Test Case"}
      open={isOpen}
      onCancel={handleCancel}
      onOk={() => form.submit()}
      confirmLoading={loading}
      width={800}
      okText={data ? "Cập nhật" : "Thêm mới"}
      cancelText="Hủy"
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
        autoComplete="off"
      >
        <Row gutter={16}>
          <Col span={24}>
            <Form.Item
              label="Tên Template"
              name="templateName"
              rules={[
                { required: true, message: "Vui lòng nhập tên template!" },
                { max: 200, message: "Tên template không được quá 200 ký tự!" },
              ]}
            >
              <Input placeholder="Nhập tên template" />
            </Form.Item>
          </Col>
          
          <Col span={24}>
            <Form.Item
              label="Từ khóa"
              name="keyWord"
              rules={[
                { required: true, message: "Vui lòng nhập từ khóa!" },
              ]}
              extra="Các từ khóa cách nhau bằng dấu phẩy (,). Ví dụ: thêm, tạo, thêm mới"
            >
              <Input placeholder="Nhập từ khóa, các từ khóa cách nhau bằng dấu phẩy" />
            </Form.Item>
          </Col>
          
          <Col span={24}>
            <Form.Item
              label="Nội dung Template"
                name="templateContent"
              rules={[
                { required: true, message: "Vui lòng nhập nội dung template!" },
              ]}
              extra="Một số key cho trước: {TenUseCase}, {TenChucNang}, {TacNhan}, {HanhDong}"
            >
              <TextArea 
                rows={8} 
                placeholder="Nhập nội dung template. Có thể sử dụng các key: {TenUseCase}, {TenChucNang}, {TacNhan}, {HanhDong}"
              />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default TemplateTestCaseCreateOrUpdate; 