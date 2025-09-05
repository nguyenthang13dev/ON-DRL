import {
  Form,
  FormProps,
  Input,
  Modal,
} from "antd";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  Khoa,
  createEditType,
} from "@/types/khoa/khoa";
import { khoaService } from "@/services/khoa/khoa.service";

interface Props {
  isOpen: boolean;
  khoa?: Khoa | null;
  onClose: () => void;
  onSuccess: () => void;
}

const CreateOrUpdate: React.FC<Props> = (props: Props) => {
  const [form] = Form.useForm();
  const [isOpen, setIsOpen] = useState<boolean>(props.isOpen);

  const handleOnFinish: FormProps<createEditType>["onFinish"] = async (
    formData: createEditType
  ) => {
    try {
      if (props.khoa) {
        const response = await khoaService.Update(props.khoa.id!, formData);
        if (response.status) {
          toast.success("Chỉnh sửa khoa thành công");
          form.resetFields();
          props.onSuccess();
          props.onClose();
        } else {
          toast.error(response.message);
        }
      } else {
        const response = await khoaService.Create(formData);
        if (response.status) {
          toast.success("Tạo mới khoa thành công");
          form.resetFields();
          props.onSuccess();
          props.onClose();
        } else {
          toast.error(response.message);
        }
      }
    } catch (error) {
      toast.error("Có lỗi xảy ra");
    }
  };

  useEffect(() => {
    setIsOpen(props.isOpen);
    if (props.isOpen) {
      if (props.khoa) {
        form.setFieldsValue(props.khoa);
      } else {
        form.resetFields();
      }
    }
  }, [props.isOpen, props.khoa, form]);

  const handleCancel = () => {
    form.resetFields();
    props.onClose();
  };

  return (
    <Modal
      title={props.khoa ? "Chỉnh sửa khoa" : "Thêm mới khoa"}
      open={isOpen}
      onOk={() => form.submit()}
      onCancel={handleCancel}
      okText={props.khoa ? "Cập nhật" : "Tạo mới"}
      cancelText="Hủy"
      destroyOnClose
      width={500}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleOnFinish}
      >
        <Form.Item
          label="Mã khoa"
          name="maKhoa"
          rules={[
            { required: true, message: "Vui lòng nhập mã khoa!" },
          ]}
        >
          <Input placeholder="Nhập mã khoa" />
        </Form.Item>

        <Form.Item
          label="Tên khoa"
          name="tenKhoa"
          rules={[
            { required: true, message: "Vui lòng nhập tên khoa!" },
          ]}
        >
          <Input placeholder="Nhập tên khoa" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateOrUpdate;
