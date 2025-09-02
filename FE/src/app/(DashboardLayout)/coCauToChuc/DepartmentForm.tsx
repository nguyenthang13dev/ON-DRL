import { Form, Input, message, Modal, Select } from "antd";
import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import { TreeItem } from "@nosferatu500/react-sortable-tree";
import { DropdownOption } from "@/types/general";
import { tinhService } from "@/services/tinh/tinh.service";
import { departmentService } from "@/services/department/department.service";
dayjs.locale("vi");

interface Props {
  isOpen: boolean;
  data: TreeItem;
  onClose: () => void;
  onSuccess: (treeNode: TreeItem) => void;
}

const DepartmentForm: React.FC<Props> = ({
  isOpen,
  data,
  onClose,
  onSuccess,
}: Props) => {
  const [dropdownTinh, setDropdownTinh] = useState<DropdownOption[]>([]);
  const [dropdownLoai, setDropdownLoai] = useState<DropdownOption[]>([]);
  const [dropdownCapBac, setDropdownCapBac] = useState<DropdownOption[]>([]);
  const [form] = Form.useForm<TreeItem>();
  const isCreate = !data.title;
  const handleFinish = async () => {
    const values = await form.validateFields();
    const result: TreeItem = { ...data, ...values };
    form.resetFields();
    onSuccess(result);
    onClose();
  };

  const handleCancel = () => {
    form.resetFields();
    onClose();
  };

  const getDropdownTinh = async () => {
    const rs = await tinhService.GetDropdown();
    setDropdownTinh(rs.data);
  };

  const getDropdownLoai = async () => {
    const rs = await departmentService.getDropdownTypeDepartment();
    setDropdownLoai(rs.data);
  };

  const getDropdownCapBac = async () => {
    const rs = await departmentService.getDropdownCapBac();
    setDropdownCapBac(rs.data);
  };

  useEffect(() => {
    getDropdownTinh();
    getDropdownLoai();
    getDropdownCapBac();
    if (isCreate) {
      form.setFieldsValue({
        ...data,
        title: "",
        code: "",
        shortName: "",
        diaDanh: "",
        loai: "",
        capBac: "",
        soNgayTiepTrenThang: 1,
      });
    } else {
      form.setFieldsValue(data);
    }
  }, [isOpen]);

  return (
    <Modal
      title={
        <div style={{ textAlign: "center" }}>
          {isCreate ? "Thêm mới" : "Chỉnh sửa"} thông tin
        </div>
      }
      open={isOpen}
      onOk={() => handleFinish()}
      onCancel={handleCancel}
      okText="Lưu"
      cancelText="Đóng"
      width={600}
    >
      <Form<TreeItem>
        layout="vertical"
        form={form}
        style={{ maxWidth: 1000 }}
        autoComplete="off"
      >
        <Form.Item
          label="Mã"
          name="code"
          rules={[{ required: true, message: "Vui lòng nhập thông tin này!" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Tên"
          name="title"
          rules={[{ required: true, message: "Vui lòng nhập thông tin này!" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Loại"
          name="loai"
          rules={[{ required: true, message: "Vui lòng nhập thông tin này!" }]}
        >
          <Select
            showSearch
            style={{ width: "100%" }}
            options={dropdownLoai}
            dropdownStyle={{ maxHeight: 400, overflow: "auto" }}
            placeholder="Chọn loại"
            allowClear
          />
        </Form.Item>
        <Form.Item
          label="Cấp bậc"
          name="capBac"
          rules={[{ required: true, message: "Vui lòng nhập thông tin này!" }]}
        >
          <Select
            showSearch
            style={{ width: "100%" }}
            options={dropdownCapBac}
            dropdownStyle={{ maxHeight: 400, overflow: "auto" }}
            placeholder="Chọn cấp bậc"
            allowClear
          />
        </Form.Item>
        <Form.Item
          label="Số ngày tiếp công dân trên tháng"
          name="soNgayTiepTrenThang"
          rules={[{ required: true, message: "Vui lòng nhập thông tin này!" }]}
          initialValue={1}
        >
          <Input type="number" />
        </Form.Item>
        <Form.Item label="Tên viết tắt" name="shortName">
          <Input />
        </Form.Item>
        <Form.Item label="Địa danh" name="diaDanh">
          <Select
            showSearch
            style={{ width: "100%" }}
            options={dropdownTinh}
            dropdownStyle={{ maxHeight: 400, overflow: "auto" }}
            placeholder="Chọn địa danh"
            allowClear
            filterOption={(input, option) =>
              (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
            }
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};
export default DepartmentForm;
