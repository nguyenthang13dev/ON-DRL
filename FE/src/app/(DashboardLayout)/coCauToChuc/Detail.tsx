import React from "react";
import { Form, Input, Button, Tag, Modal, Drawer } from "antd";
import DepartmentConstant from "@/constants/DepartmentTypeConstant";
import { TreeItem } from "@nosferatu500/react-sortable-tree";
import Styles from "./page.module.css";
import { CheckCircleOutlined, LockOutlined } from "@ant-design/icons";

const { Item: FormItem } = Form;

interface DepartmentModalProps {
  isOpen: boolean;
  department: TreeItem;
  onClose: () => void;
}

const Detail: React.FC<DepartmentModalProps> = ({
  isOpen,
  department,
  onClose,
}) => {
  const type =
    department?.loai == DepartmentConstant.Organization
      ? "tổ chức"
      : "phòng ban";

  return (
    <Modal
      open={isOpen}
      title={
        <div style={{ textAlign: "center" }}>
          Thông tin chi tiết {department.title}
        </div>
      }
      onCancel={onClose}
      footer={[
        <Button key="cancel" onClick={onClose}>
          Đóng
        </Button>,
      ]}
      width={800}
    >
      <Form layout="vertical">
        <FormItem label={<strong>Tên {type}</strong>}>
          <Input
            value={department.title as string}
            readOnly
            className={Styles.borderLess}
          />
        </FormItem>

        <FormItem label={<strong>Mã {type}</strong>}>
          <Input
            value={department.code}
            readOnly
            className={Styles.borderLess}
          />
        </FormItem>

        <FormItem label={<strong>Thứ tự</strong>}>
          <Input
            value={department.priority}
            readOnly
            className={Styles.borderLess}
          />
        </FormItem>

        <FormItem label={<strong>Cấp</strong>}>
          <Input
            value={department.level}
            readOnly
            className={Styles.borderLess}
          />
        </FormItem>
        {department.loai === DepartmentConstant.Organization && (
          <>
            <FormItem label={<strong>Trạng thái </strong>}>
              {department.isActive ? (
                <Tag icon={<CheckCircleOutlined />} color="success">
                  Hoạt động
                </Tag>
              ) : (
                <Tag icon={<LockOutlined />} color="error">
                  Khoá
                </Tag>
              )}
            </FormItem>
          </>
        )}
      </Form>
    </Modal>

    // <Drawer
    //   title={
    //     <div style={{ textAlign: 'center' }}>
    //       Thông tin chi tiết {department.title}
    //     </div>
    //   }
    //   open={isOpen}
    //   onClose={onClose}
    //   width="40%"
    //   getContainer={false}
    //   mask={false}
    // >

    // </Drawer>
  );
};

export default Detail;
