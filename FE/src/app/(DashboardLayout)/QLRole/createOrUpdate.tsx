import { Form, FormProps, Input, Modal } from "antd";
import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import { toast } from "react-toastify";
import { tableRoleType, createEditType } from "@/types/role/role";
import { roleService } from "@/services/role/role.service";
dayjs.locale("vi");
import { rules } from "@/validators/validationFormRules";
import { highlightWhitespace } from "@uiw/react-codemirror";
import { relativeToValue } from "@amcharts/amcharts5/.internal/core/util/Utils";

interface Props {
  isOpen: boolean;
  role?: tableRoleType | null;
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
      if (props.role) {
        const response = await roleService.Update(formData);
        if (response.status) {
          toast.success("Chỉnh sửa nhóm quyền thành công");
          form.resetFields();
          props.onSuccess();
          props.onClose();
        } else {
          toast.error(response.message);
        }
      } else {
        const response = await roleService.Create(formData);
        if (response.status) {
          toast.success("Tạo nhóm quyền thành công");
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
    form.setFieldsValue(props.role);
  };

  const handleCancel = () => {
    setIsOpen(false);
    form.resetFields();
    props.onClose();
  };

  useEffect(() => {
    setIsOpen(props.isOpen);
    if (props.role) {
      handleMapEdit();
    }
  }, [props.isOpen]);

  return (
    <Modal
      title={props.role != null ? "Chỉnh sửa nhóm quyền" : "Thêm mới nhóm quyền"}
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
        {props.role && (
          <Form.Item<createEditType> name="id" hidden>
            <Input />
          </Form.Item>
        )}
        <Form.Item<createEditType>
          label="Mã nhóm quyền"
          name="code"
          rules={[
            rules.required,
            rules.htmlJs,
            rules.onlySpaces,
            rules.specialCharacter,
            rules.betweenSpaces,
            rules.vietnamese,
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item<createEditType>
          label="Tên nhóm quyền"
          name="name"
          rules={[rules.required, rules.onlySpaces, rules.htmlJs, rules.specialCharacter,
          ]}

        >
          <Input />
        </Form.Item>
      </Form>
    </Modal >
  );
};
export default CreateOrUpdate;
