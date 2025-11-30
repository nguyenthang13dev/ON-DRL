"use client";
import { giaoVienService } from "@/services/giaoVien/giaoVien.service";
import { khoaService } from "@/services/khoa/khoa.service";
import { DropdownOption } from "@/types/general";
import { GiaoVien, createEditType } from "@/types/giaoVien/giaoVien";
import { DatePicker, Form, FormProps, Input, Modal, Radio, Select } from "antd";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

interface Props {
  isOpen: boolean;
  giaoVien?: GiaoVien | null;
  onClose: () => void;
  onSuccess: () => void;
}

const CreateOrUpdate: React.FC<Props> = (props: Props) => {
  const [form] = Form.useForm();
  const [isOpen, setIsOpen] = useState<boolean>(props.isOpen);
  const [khoaOptions, setKhoaOptions] = useState<DropdownOption[]>([]);

  const handleOnFinish: FormProps<createEditType>["onFinish"] = async (
    formData: createEditType
  ) => {
    try {
      if (props.giaoVien) {
        const response = await giaoVienService.Update(
          props.giaoVien.id!,
          formData
        );
        if (response.status) {
          toast.success("Chỉnh sửa giáo viên thành công");
          form.resetFields();
          props.onSuccess();
          props.onClose();
        } else {
          toast.error(response.message);
        }
      } else {
        const response = await giaoVienService.Create(formData);
        if (response.status) {
          toast.success("Tạo mới giáo viên thành công");
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
      loadKhoaOptions();
      if (props.giaoVien) {
        form.setFieldsValue({
          ...props.giaoVien,
        });
      } else {
        form.resetFields();
      }
    }
  }, [props.isOpen, props.giaoVien, form]);

  const loadKhoaOptions = async () => {
    try {
      const response = await khoaService.GetDropKhoa();
      if (response.status && response.data) {
        setKhoaOptions(response.data);
      }
    } catch (error) {
      toast.error("Không thể tải danh sách khoa");
    }
  };

  const handleCancel = () => {
    form.resetFields();
    props.onClose();
  };

  return (
    <Modal
      title={props.giaoVien ? "Chỉnh sửa giáo viên" : "Thêm mới giáo viên"}
      open={isOpen}
      onOk={() => form.submit()}
      onCancel={handleCancel}
      okText={props.giaoVien ? "Cập nhật" : "Tạo mới"}
      cancelText="Hủy"
      destroyOnClose
      width={600}
    >
      <Form form={form} layout="vertical" onFinish={handleOnFinish}>
        <Form.Item
          label="Mã giáo viên"
          name="maGiaoVien"
          rules={[{ required: true, message: "Vui lòng nhập mã giáo viên!" }]}
        >
          <Input placeholder="Nhập mã giáo viên" />
        </Form.Item>

       <Form.Item
          label="Giới tính"
          name="gioiTinh"
          rules={[{ required: true, message: "Vui lòng chọn giới tính!" }]}
        >
          <Radio.Group>
            <Radio value={true}>Nam</Radio>
            <Radio value={false}>Nữ</Radio>
          </Radio.Group>
        </Form.Item>

        
        <Form.Item
          name="NgaySinh"
          label="Ngày sinh"
        >
          <DatePicker
            placeholder="Chọn ngày sinh"
            style={{ width: "100%" }}
            format="DD/MM/YYYY"
          />
        </Form.Item>
          

        <Form.Item
          label="Họ tên"
          name="hoTen"
          rules={[{ required: true, message: "Vui lòng nhập họ tên!" }]}
        >
          <Input placeholder="Nhập họ tên" />
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
          label="Số điện thoại"
          name="soDienThoai"
        >
          <Input placeholder="Nhập số điện thoại" />
        </Form.Item>

        <Form.Item
          label="Khoa"
          name="khoaId"
          rules={[{ required: true, message: "Vui lòng chọn khoa!" }]}
        >
          <Select placeholder="Chọn khoa" showSearch optionFilterProp="children">
            {khoaOptions.map((option) => (
              <Select.Option key={option.value} value={option.value}>
                {option.label}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          label="Trạng thái"
          name="trangThai"
          rules={[{ required: true, message: "Vui lòng chọn trạng thái!" }]}
        >
          <Select placeholder="Chọn trạng thái">
            <Select.Option value="DangLam">Đang làm</Select.Option>
            <Select.Option value="NghiViec">Nghỉ việc</Select.Option>
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateOrUpdate;
