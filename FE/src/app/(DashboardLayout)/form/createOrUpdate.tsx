import {
  createEditType,
  tableNhomDanhMucDataType,
} from "@/types/nhomDanhMuc/nhomDanhMuc";
import { Form, FormProps, Input, Modal } from "antd";
import React, { useEffect, useState } from "react";
import { nhomDanhMucService } from "@/services/nhomDanhMuc/nhomDanhMuc.service";
import { toast } from "react-toastify";

interface Props {
  isOpen: boolean;
  NhomDanhMuc?: tableNhomDanhMucDataType | null;
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
      if (props.NhomDanhMuc) {
        const response = await nhomDanhMucService.Update(formData);
        if (response.status) {
          toast.success("Chỉnh sửa nhóm danh mục thành công");
          form.resetFields();
          props.onSuccess();
          props.onClose();
        } else {
          toast.error(response.message);
        }
      } else {
        const response = await nhomDanhMucService.Create(formData);
        if (response.status) {
          toast.success("Thêm mới nhóm danh mục thành công");
          form.resetFields();
          props.onSuccess();
          props.onClose();
        } else {
          toast.error(response.message);
        }
      }
    } catch (error) {
      toast.error("Có lỗi xảy ra: " + error);
    }
  };

  const handleMapEdit = () => {
    form.setFieldsValue({
      id: props.NhomDanhMuc?.id,
      groupCode: props.NhomDanhMuc?.groupCode,
      groupName: props.NhomDanhMuc?.groupName,
    });
  };

  const handleCancel = () => {
    setIsOpen(false);
    form.resetFields();
    props.onClose();
  };

  useEffect(() => {
    setIsOpen(props.isOpen);
    if (props.NhomDanhMuc) {
      handleMapEdit();
    }
  }, [props.isOpen]);

  return (
    <Modal
      title={
        props.NhomDanhMuc != null
          ? "Chỉnh sửa nhóm danh mục"
          : "Thêm mới nhóm danh mục"
      }
      open={isOpen}
      onOk={() => form.submit()}
      onCancel={handleCancel}
      okText="Xác nhận"
      cancelText="Đóng"
      width={600}
    >
      <Form
        layout="vertical"
        form={form}
        name="formCreateUpdate"
        style={{ maxWidth: 1000 }}
        onFinish={handleOnFinish}
        autoComplete="off"
      >
        {props.NhomDanhMuc && (
          <Form.Item<createEditType> name="id" hidden>
            <Input />
          </Form.Item>
        )}
        {
          <>
            <Form.Item<createEditType>
              label="Tên biểu mẫu"
              name="groupCode"
              rules={[
                { required: true, message: "Vui lòng nhập thông tin này!" },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item<createEditType>
              label="Tên nhóm danh mục"
              name="groupName"
              rules={[
                { required: true, message: "Vui lòng nhập thông tin này!" },
              ]}
            >
              <Input />
            </Form.Item>
          </>
        }
      </Form>
    </Modal>
  );
};
export default CreateOrUpdate;
