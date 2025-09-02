import { Form, Input, Modal } from "antd";
import React, { useEffect } from "react";
import dayjs from "dayjs";
import { toast } from "react-toastify";
import { Department } from "@/types/department/department";
import { departmentService } from "@/services/department/department.service";
import DepartmentConstant from "@/constants/DepartmentTypeConstant";
dayjs.locale("vi");

const defaultData: Department = {
  id: "",
  name: "",
  code: "",
  //parentId: undefined,
  level: 1,
  loai: DepartmentConstant.Organization,
  isActive: true,
};

interface Props {
  isOpen: boolean;
  data?: Department;
  onClose: () => void;
  onSuccess: () => void;
}

const CreateUpdateForm: React.FC<Props> = ({
  isOpen,
  data,
  onClose,
  onSuccess,
}: Props) => {
  const [form] = Form.useForm<Department>();

  const handleFinish = async () => {
    let param = await form.validateFields();
    try {
      if (data) {
        param = { ...data, ...param };
        const response = await departmentService.Update(param);
        if (response.status) {
          toast.success("Cập nhật tổ chức thành công");
        } else {
          toast.error(response.message);
        }
      } else {
        param = { ...defaultData, ...param };
        const response = await departmentService.Create(param);
        if (response.status) {
          toast.success("Thêm mới tổ chức thành công");
        } else {
          toast.error(response.message);
        }
      }
      form.resetFields();
      onSuccess();
      onClose();
    } catch (error) {
      toast.error("Có lỗi xảy ra: " + error);
    }
  };

  const handleCancel = () => {
    onClose();
  };

  useEffect(() => {
    if (data) {
      form.setFieldsValue(data);
    } else {
      form.setFieldsValue(defaultData);
    }
  }, [data]);

  return (
    <Modal
      title={
        <div style={{ textAlign: "center" }}>
          {data ? "Chỉnh sửa tổ chức" : "Thêm mới tổ chức"}
        </div>
      }
      open={isOpen}
      onOk={() => handleFinish()}
      onCancel={handleCancel}
      okText="Lưu"
      cancelText="Đóng"
      width={600}
    >
      <Form<Department>
        layout="vertical"
        form={form}
        style={{ maxWidth: 1000 }}
        autoComplete="off"
      >
        <Form.Item
          label="Tên tổ chức"
          name="name"
          rules={[{ required: true, message: "Vui lòng nhập thông tin này!" }]}
        >
          <Input placeholder="Nhập mã tổ chức" />
        </Form.Item>

        <Form.Item
          label="Tên mã tổ chức"
          name="code"
          rules={[{ required: true, message: "Vui lòng nhập thông tin này!" }]}
        >
          <Input placeholder="Nhập mã tổ chức" />
        </Form.Item>
      </Form>
    </Modal>
  );
};
export default CreateUpdateForm;
