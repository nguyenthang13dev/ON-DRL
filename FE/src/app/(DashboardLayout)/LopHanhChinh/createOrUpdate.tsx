"use client";
import { Form, FormProps, Input, Modal, Select } from "antd";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  LopHanhChinh,
  createEditType,
} from "@/types/lopHanhChinh/lopHanhChinh";
import { lopHanhChinhService } from "@/services/lopHanhChinh/lopHanhChinh.service";
import { khoaService } from "@/services/khoa/khoa.service";
import { giaoVienService } from "@/services/giaoVien/giaoVien.service";
import { DropdownOption } from "@/types/general";

interface Props {
  isOpen: boolean;
  lopHanhChinh?: LopHanhChinh | null;
  onClose: () => void;
  onSuccess: () => void;
}

const CreateOrUpdate: React.FC<Props> = (props: Props) => {
  const [form] = Form.useForm();
  const [isOpen, setIsOpen] = useState<boolean>(props.isOpen);
  const [khoaOptions, setKhoaOptions] = useState<DropdownOption[]>([]);
  const [giaoVienOptions, setGiaoVienOptions] = useState<DropdownOption[]>([]);

  const handleOnFinish: FormProps<createEditType>["onFinish"] = async (
    formData: createEditType
  ) => {
    try {
      if (props.lopHanhChinh) {
        const response = await lopHanhChinhService.Update(
          props.lopHanhChinh.id!,
          formData
        );
        if (response.status) {
          toast.success("Chỉnh sửa lớp hành chính thành công");
          form.resetFields();
          props.onSuccess();
          props.onClose();
        } else {
          toast.error(response.message);
        }
      } else {
        const response = await lopHanhChinhService.Create(formData);
        if (response.status) {
          toast.success("Tạo mới lớp hành chính thành công");
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
      if (props.lopHanhChinh) {
        form.setFieldsValue({
          ...props.lopHanhChinh,
        });
        // Load giáo viên theo khoa khi edit
        if (props.lopHanhChinh.khoaId) {
          loadGiaoVienOptions(props.lopHanhChinh.khoaId);
        }
      } else {
        form.resetFields();
        setGiaoVienOptions([]); // Reset danh sách giáo viên khi thêm mới
      }
    }
  }, [props.isOpen, props.lopHanhChinh, form]);

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

  const loadGiaoVienOptions = async (khoaId?: string) => {
    try {
      const response = await giaoVienService.GetDropGiaoVien(khoaId);
      if (response.status && response.data) {
        setGiaoVienOptions(response.data);
      }
    } catch (error) {
      toast.error("Không thể tải danh sách giáo viên");
    }
  };

  const handleKhoaChange = (khoaId: string) => {
    // Reset giáo viên cố vấn khi thay đổi khoa
    form.setFieldValue("giaoVienCoVanId", undefined);
    setGiaoVienOptions([]);

    // Load danh sách giáo viên theo khoa mới
    if (khoaId) {
      loadGiaoVienOptions(khoaId);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    props.onClose();
  };

  return (
    <Modal
      title={
        props.lopHanhChinh
          ? "Chỉnh sửa lớp hành chính"
          : "Thêm mới lớp hành chính"
      }
      open={isOpen}
      onOk={() => form.submit()}
      onCancel={handleCancel}
      okText={props.lopHanhChinh ? "Cập nhật" : "Tạo mới"}
      cancelText="Hủy"
      destroyOnClose
      width={600}
    >
      <Form form={form} layout="vertical" onFinish={handleOnFinish}>
        <Form.Item
          label="Tên lớp"
          name="tenLop"
          rules={[{ required: true, message: "Vui lòng nhập tên lớp!" }]}
        >
          <Input placeholder="Nhập tên lớp" />
        </Form.Item>

        <Form.Item
          label="Khoa"
          name="khoaId"
          rules={[{ required: true, message: "Vui lòng chọn khoa!" }]}
        >
          <Select
            placeholder="Chọn khoa"
            showSearch
            optionFilterProp="children"
            onChange={handleKhoaChange}
          >
            {khoaOptions.map((option) => (
              <Select.Option key={option.value} value={option.value}>
                {option.label}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item label="Giáo viên cố vấn" name="giaoVienCoVanId">
          <Select
            placeholder="Chọn giáo viên cố vấn"
            showSearch
            optionFilterProp="children"
            allowClear
          >
            {giaoVienOptions.map((option) => (
              <Select.Option key={option.value} value={option.value}>
                {option.label}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateOrUpdate;
