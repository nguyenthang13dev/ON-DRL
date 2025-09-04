import { typeDanhMucService } from "@/services/TypeDanhMuc/TypeDanhMuc.service";
import
    {
        TableTypeDanhMucDataType,
        TypeDanhMucCreateVM,
    } from "@/types/TypeDanhMuc/TypeDanhMuc";
import { Form, FormProps, Input, InputNumber, Modal } from "antd";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

interface Props {
  isOpen: boolean;
  TypeDanhMuc?: TableTypeDanhMucDataType | null;
  onClose: () => void;
  onSuccess: () => void;
}

const CreateOrUpdate: React.FC<Props> = (props: Props) => {
  const [form] = Form.useForm();
  const [isOpen, setIsOpen] = useState<boolean>(props.isOpen);
  const handleOnFinish: FormProps<TypeDanhMucCreateVM>["onFinish"] = async (
    formData: TypeDanhMucCreateVM
  ) => {
    try {
      if (props.TypeDanhMuc) {
        const response = await typeDanhMucService.update(formData);
        if (response.status) {
          toast.success("Chỉnh sửa type danh mục thành công");
          form.resetFields();
          props.onSuccess();
          props.onClose();
        } else {
          toast.error(response.message);
        }
      } else {
        const response = await typeDanhMucService.create(formData);
        if (response.status) {
          toast.success("Thêm mới type danh mục thành công");
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
      id: props.TypeDanhMuc?.id,
      name: props.TypeDanhMuc?.name,
      type: props.TypeDanhMuc?.type,
      codeDm: props.TypeDanhMuc?.codeDm,
      min: props.TypeDanhMuc?.min,
      max: props.TypeDanhMuc?.max,
    });
  };

  useEffect(() => {
    setIsOpen(props.isOpen);
    if (props.TypeDanhMuc) {
      handleMapEdit();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.isOpen, props.TypeDanhMuc]);

  const handleCancel = () => {
    setIsOpen(false);
    form.resetFields();
    props.onClose();
  };

  return (
    <Modal
      title={
        props.TypeDanhMuc != null
          ? "Chỉnh sửa type danh mục"
          : "Thêm mới type danh mục"
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
        {props.TypeDanhMuc && (
          <Form.Item<TypeDanhMucCreateVM> name="id" hidden>
            <Input />
          </Form.Item>
        )}
        <>
          <Form.Item<TypeDanhMucCreateVM>
            label="Tên"
            name="name"
            rules={[
              { required: true, message: "Vui lòng nhập thông tin này!" },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item<TypeDanhMucCreateVM>
            label="Loại"
            name="type"
            rules={[
              { required: true, message: "Vui lòng nhập thông tin này!" },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item<TypeDanhMucCreateVM>
            label="Mã DM"
            name="codeDm"
          >
            <Input />
          </Form.Item>

          <Form.Item<TypeDanhMucCreateVM>
            label="Min"
            name="min"
          >
            <InputNumber style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item<TypeDanhMucCreateVM>
            label="Max"
            name="max"
          >
            <InputNumber style={{ width: "100%" }} />
          </Form.Item>
        </>
      </Form>
    </Modal>
  );
};
export default CreateOrUpdate;
