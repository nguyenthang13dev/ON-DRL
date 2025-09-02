import { tableGroupUserDataType } from "@/types/groupUser/groupUser";
import {
  Form,
  FormProps,
  Input,
  Modal,
  Select,
  Typography,
} from "antd";
import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import { DropdownOption } from "@/types/general";
import { toast } from "react-toastify";
import classes from "./page.module.css";
import { groupUserRoleService } from "@/services/groupUserRole/groupUserRole.service";
import { createEditType } from "@/types/groupUserRole/groupUserRole";
import { roleService } from "@/services/role/role.service";
dayjs.locale("vi");

interface Props {
  isOpen: boolean;
  groupUser?: tableGroupUserDataType | null;
  onClose: () => void;
  onSuccess: () => void;
}

const EditUserGroupRole: React.FC<Props> = (props: Props) => {
  const [form] = Form.useForm();
  const [isOpen, setIsOpen] = useState<boolean>(props.isOpen);
  const [role, setRole] = useState<DropdownOption[]>();

  const handleOnFinish: FormProps<createEditType>["onFinish"] = async (
    formData: createEditType
  ) => {
    try {
      if (props.groupUser) {
        formData.groupUserId = props.groupUser?.id ?? "";
        const response = await groupUserRoleService.Create(formData);
        if (response.status) {
          toast.success("Phân nhóm quyền thành công");
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
    if (props.groupUser && props.groupUser.roleIds) {
      form.setFieldsValue({
        roleId: props.groupUser.roleIds,
      });
    }
  };

  const getDropdownRole = async () => {
    const dropdown = await roleService.GetDropdownId();
    if (dropdown && dropdown.data) {
      setRole(dropdown.data);
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
    getDropdownRole();
    if (props.groupUser) {
      handleMapEdit();
    }
  }, [props.groupUser]);

  return (
    <Modal
      title={"Phân nhóm quyền"}
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
        {props.groupUser && (
          <Form.Item<createEditType>
            name="groupUserId"
            initialValue={props.groupUser?.id}
            hidden
          >
            <Input />
          </Form.Item>
        )}
        <Form.Item>
          <Typography.Text className={classes.userNameText}>
            Nhóm người sử dụng: <strong>{props.groupUser?.name}</strong>
          </Typography.Text>
        </Form.Item>

        <Form.Item<createEditType>
          label="Chọn nhóm quyền"
          name="roleId"
        >
          <Select
            mode="multiple"
            placeholder="Chọn nhóm quyền"
            options={role}
            fieldNames={{ label: "label", value: "value" }}
            value={props.groupUser?.roleIds}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};
export default EditUserGroupRole;
