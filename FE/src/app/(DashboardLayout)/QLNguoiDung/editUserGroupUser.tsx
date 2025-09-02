import { tableUserDataType } from "@/types/auth/User";
import { Form, FormProps, Input, Modal, Select, Typography } from "antd";
import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import { DropdownOption } from "@/types/general";
import { toast } from "react-toastify";
import classes from "./page.module.css";
import { userGroupUserService } from "@/services/userGroupUser/userGroupUser.service";
import { createEditType } from "@/types/userGroupUser/userGroupUser";
import { GroupUserService } from "@/services/groupUser/groupUser.service";
dayjs.locale("vi");

interface Props {
  isOpen: boolean;
  user?: tableUserDataType | null;
  onClose: () => void;
  onSuccess: () => void;
}

const EditUserGroupUser: React.FC<Props> = (props: Props) => {
  const [form] = Form.useForm();
  const [isOpen, setIsOpen] = useState<boolean>(props.isOpen);
  const [groupUser, setGroupUser] = useState<DropdownOption[]>();

  const handleOnFinish: FormProps<createEditType>["onFinish"] = async (
    formData: createEditType
  ) => {
    try {
      if (props.user) {
        formData.userId = props.user?.id ?? "";
        const response = await userGroupUserService.Create(formData);
        if (response.status) {
          toast.success("Phân nhóm người sử dụng thành công");
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

  const handleMapEdit = async () => {
    if (props.user && props.user.nhomNguoi) {
      form.setFieldsValue({
        groupUserId: props.user.nhomNguoi,
      });
    }
  };

  const getDropdownGroupUser = async () => {
    const dropdown = await GroupUserService.getDropdown();
    if (dropdown && dropdown.data) {
      setGroupUser(dropdown.data);
    }
  };

  const handleCancel = () => {
    setIsOpen(false);
    form.resetFields();
    props.onClose();
  };

  useEffect(() => {
    setIsOpen(props.isOpen);
  }, [props.isOpen]);

  useEffect(() => {
    getDropdownGroupUser();
    if (props.user) {
      handleMapEdit();
    }
  }, [props.user]);

  return (
    <Modal
      title={"Phân nhóm người sử dụng"}
      open={isOpen}
      onOk={() => form.submit()}
      onCancel={handleCancel}
      okText="Xác nhận"
      cancelText="Đóng"
      // width={600}
    >
      <Form
        layout="vertical"
        form={form}
        name="formCreateUpdate"
        onFinish={handleOnFinish}
        autoComplete="off"
      >
        {props.user && (
          <Form.Item<createEditType>
            name="userId"
            initialValue={props.user?.id}
            hidden
          >
            <Input />
          </Form.Item>
        )}
        <Form.Item>
          <Typography.Text className={classes.userNameText}>
            Người dùng: <strong>{props.user?.name}</strong>
          </Typography.Text>
        </Form.Item>

        <Form.Item<createEditType>
          label="Chọn nhóm người sử dụng"
          name="groupUserId"
        >
          <Select
            mode="multiple"
            placeholder="Chọn nhóm người sử dụng"
            options={groupUser}
            fieldNames={{ label: "label", value: "value" }}
            value={props.user?.nhomNguoi}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};
export default EditUserGroupUser;
