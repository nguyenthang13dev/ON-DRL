import React from "react";
import { Modal, Form, Input, Switch, Typography } from "antd";
import { Department } from "@/types/department/department";

const { Item: FormItem } = Form;

interface DepartmentModalProps {
  visible: boolean;
  onClose: () => void;
  department: Department;
}

const Detail: React.FC<DepartmentModalProps> = ({
  visible,
  onClose,
  department,
}) => {
  return (
    <Modal
      open={visible}
      title={
        <div style={{ textAlign: "center" }}>Chi tiết thông tin tổ chức</div>
      }
      onCancel={onClose}
      footer={null}
      width={600}
    >
      <Form layout="vertical" initialValues={department}>
        <FormItem label="Tên tổ chức" name="name">
          <Input readOnly />
        </FormItem>

        <FormItem label="Mã tổ chức" name="code">
          <Input readOnly />
        </FormItem>

        {/* <FormItem label="Parent ID" name="parentId">
          <Input readOnly />
        </FormItem>

        <FormItem label="Priority" name="priority">
          <Input readOnly />
        </FormItem>

        <FormItem label="Level" name="level">
          <Input readOnly />
        </FormItem>

        <FormItem label="Type" name="loai">
          <Input readOnly />
        </FormItem> */}

        <FormItem
          label="Trạng thái hoạt động"
          name="isActive"
          valuePropName="checked"
        >
          <Switch disabled />
        </FormItem>
      </Form>
    </Modal>
  );
};

export default Detail;
