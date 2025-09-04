import { GroupUserService } from "@/services/groupUser/groupUser.service";
import { createEditType, tableGroupUserDataType } from "@/types/groupUser/groupUser";
import { Form, FormProps, Input, Modal } from "antd";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
dayjs.locale("vi");

interface Props {
  isOpen: boolean;
  GroupUser?: tableGroupUserDataType | null;
  onClose: () => void; //function callback
  onSuccess: () => void;
}

const CreateOrUpdate: React.FC<Props> = (props: Props) => {
  const [form] = Form.useForm();
  const [isOpen, setIsOpen] = useState<boolean>(props.isOpen);

  const handleOnFinish: FormProps<createEditType>["onFinish"] = async (
    formData: createEditType
  ) => {
    try {
      if (props.GroupUser) {
        const response = await GroupUserService.Update(formData);
        if (response.status) {
          toast.success("Chỉnh sửa vai trò thành công");
          form.resetFields();
          props.onSuccess();
          props.onClose();
        } else {
          toast.error(response.message);
        }
      } else {
        const response = await GroupUserService.Create(formData);
        if (response.status) {
          toast.success("Tạo vai trò thành công");
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
    form.setFieldsValue(props.GroupUser);
  };

  const handleCancel = () => {
    setIsOpen(false);
    form.resetFields();
    props.onClose();
  };

  useEffect(() => {
    setIsOpen(props.isOpen);
    if (props.GroupUser) {
      handleMapEdit();
    }
  }, [props.isOpen]);

  return (
    <Modal
      title={props.GroupUser != null ? "Chỉnh sửa nhóm người sử dụng" : "Thêm mới nhóm người sử dụng"}
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
        {props.GroupUser && (
          <Form.Item<createEditType> name="id" hidden>
            <Input />
          </Form.Item>
        )}
        <Form.Item<createEditType>
          label="Mã nhóm người sử dụng"
          name="code"
          rules={[{ required: true, message: "Vui lòng nhập thông tin này!" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item<createEditType>
          label="Tên nhóm người sử dụng"
          name="name"
          rules={[{ required: true, message: "Vui lòng nhập thông tin này!" }]}
        >
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
};
export default CreateOrUpdate;
