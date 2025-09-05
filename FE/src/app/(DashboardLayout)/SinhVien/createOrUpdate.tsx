import {
  Form,
  FormProps,
  Input,
  Modal,
  Radio,
  Select,
  DatePicker,
} from "antd";
import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import { toast } from "react-toastify";
import {
  SinhVien,
  createEditType,
} from "@/types/sinhVien/sinhVien";
import { sinhVienService } from "@/services/sinhVien/sinhVien.service";
import { DropdownOption } from "@/types/general";

interface Props {
  isOpen: boolean;
  sinhVien?: SinhVien | null;
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
      if (props.sinhVien) {
        const response = await sinhVienService.Update(props.sinhVien.id!, formData);
        if (response.status) {
          toast.success("Chỉnh sửa sinh viên thành công");
          form.resetFields();
          props.onSuccess();
          props.onClose();
        } else {
          toast.error(response.message);
        }
      } else {
        const response = await sinhVienService.Create(formData);
        if (response.status) {
          toast.success("Tạo mới sinh viên thành công");
          form.resetFields();
          props.onSuccess();
          props.onClose();
        } else {
          toast.error(response.message);
        }
      }
    } catch (error) {
      toast.error("Có lỗi xảy ra");
    }
  };

  useEffect(() => {
    setIsOpen(props.isOpen);
    if (props.isOpen) {
      if (props.sinhVien) {
        form.setFieldsValue({
          ...props.sinhVien,
          ngaySinh: props.sinhVien.ngaySinh ? dayjs(props.sinhVien.ngaySinh) : null,
        });
      } else {
        form.resetFields();
      }
    }
  }, [props.isOpen, props.sinhVien, form]);

  const handleCancel = () => {
    form.resetFields();
    props.onClose();
  };

  return (
    <Modal
      title={props.sinhVien ? "Chỉnh sửa sinh viên" : "Thêm mới sinh viên"}
      open={isOpen}
      onOk={() => form.submit()}
      onCancel={handleCancel}
      okText={props.sinhVien ? "Cập nhật" : "Tạo mới"}
      cancelText="Hủy"
      destroyOnClose
      width={600}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleOnFinish}
      >
        <Form.Item
          label="Mã sinh viên"
          name="maSV"
          rules={[
            { required: true, message: "Vui lòng nhập mã sinh viên!" },
          ]}
        >
          <Input placeholder="Nhập mã sinh viên" />
        </Form.Item>

        <Form.Item
          label="Họ tên"
          name="hoTen"
          rules={[
            { required: true, message: "Vui lòng nhập họ tên!" },
          ]}
        >
          <Input placeholder="Nhập họ tên" />
        </Form.Item>

        <Form.Item
          label="Ngày sinh"
          name="ngaySinh"
          rules={[
            { required: true, message: "Vui lòng chọn ngày sinh!" },
          ]}
        >
          <DatePicker
            placeholder="Chọn ngày sinh"
            style={{ width: "100%" }}
            format="DD/MM/YYYY"
          />
        </Form.Item>

        <Form.Item
          label="Giới tính"
          name="gioiTinh"
          rules={[
            { required: true, message: "Vui lòng chọn giới tính!" },
          ]}
        >
          <Radio.Group>
            <Radio value={true}>Nam</Radio>
            <Radio value={false}>Nữ</Radio>
          </Radio.Group>
        </Form.Item>

        <Form.Item
          label="Email"
          name="email"
          rules={[
            { required: true, message: "Vui lòng nhập email!" },
            { type: "email", message: "Email không hợp lệ!" },
          ]}
        >
          <Input placeholder="Nhập email" />
        </Form.Item>

        <Form.Item
          label="Trạng thái"
          name="trangThai"
          rules={[
            { required: true, message: "Vui lòng chọn trạng thái!" },
          ]}
        >
          <Select placeholder="Chọn trạng thái">
            <Select.Option value="active">Hoạt động</Select.Option>
            <Select.Option value="inactive">Không hoạt động</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item
          label="Khoa ID"
          name="khoaId"
          rules={[
            { required: true, message: "Vui lòng nhập khoa ID!" },
          ]}
        >
          <Input placeholder="Nhập khoa ID" />
        </Form.Item>

        <Form.Item
          label="Lớp ID"
          name="lopId"
          rules={[
            { required: true, message: "Vui lòng nhập lớp ID!" },
          ]}
        >
          <Input placeholder="Nhập lớp ID" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateOrUpdate;
