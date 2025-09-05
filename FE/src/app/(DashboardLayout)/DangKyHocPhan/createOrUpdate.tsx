"use client";
import { createEditType, DangKyHocPhan } from "@/types/dangKyHocPhan/dangKyHocPhan";
import { dangKyHocPhanService } from "@/services/dangKyHocPhan/dangKyHocPhan.service";
import { Form, FormProps, Input, Modal, InputNumber } from "antd";
import React, { useEffect } from "react";
import { toast } from "react-toastify";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  dangKyHocPhan?: DangKyHocPhan | null;
}

const CreateOrUpdate: React.FC<Props> = (props: Props) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (props.isOpen) {
      if (props.dangKyHocPhan) {
        form.setFieldsValue({
          id: props.dangKyHocPhan.id,
          sinhVienId: props.dangKyHocPhan.sinhVienId,
          lopHocPhanId: props.dangKyHocPhan.lopHocPhanId,
          diemQuaTrinh: props.dangKyHocPhan.diemQuaTrinh,
          diemThi: props.dangKyHocPhan.diemThi,
          diemTongKet: props.dangKyHocPhan.diemTongKet,
          ketQua: props.dangKyHocPhan.ketQua,
        });
      } else {
        form.resetFields();
      }
    }
  }, [props.isOpen, props.dangKyHocPhan, form]);

  const handleOk = () => {
    form.submit();
  };

  const handleCancel = () => {
    form.resetFields();
    props.onClose();
  };

  const onFinish: FormProps<createEditType>["onFinish"] = async (values) => {
    try {
      const request: createEditType = {
        sinhVienId: values.sinhVienId,
        lopHocPhanId: values.lopHocPhanId,
        diemQuaTrinh: values.diemQuaTrinh,
        diemThi: values.diemThi,
        diemTongKet: values.diemTongKet,
        ketQua: values.ketQua,
      };

      let response;
      if (props.dangKyHocPhan?.id) {
        response = await dangKyHocPhanService.Update(props.dangKyHocPhan.id, request);
      } else {
        response = await dangKyHocPhanService.Create(request);
      }

      if (response.status) {
        toast.success(
          props.dangKyHocPhan?.id
            ? "Cập nhật đăng ký học phần thành công"
            : "Thêm mới đăng ký học phần thành công"
        );
        props.onSuccess();
        props.onClose();
        form.resetFields();
      } else {
        toast.error(response.message || "Có lỗi xảy ra");
      }
    } catch (error) {
      toast.error("Có lỗi xảy ra khi lưu dữ liệu");
    }
  };

  return (
    <Modal
      title={props.dangKyHocPhan ? "Chỉnh sửa đăng ký học phần" : "Thêm mới đăng ký học phần"}
      open={props.isOpen}
      onOk={handleOk}
      onCancel={handleCancel}
      okText="Lưu"
      cancelText="Hủy"
      destroyOnClose
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
      >
        <Form.Item name="id" hidden>
          <Input />
        </Form.Item>

        <Form.Item
          label="Sinh viên ID"
          name="sinhVienId"
          rules={[
            { required: true, message: "Vui lòng nhập ID sinh viên!" },
          ]}
        >
          <Input placeholder="Nhập ID sinh viên" />
        </Form.Item>

        <Form.Item
          label="Lớp học phần ID"
          name="lopHocPhanId"
          rules={[
            { required: true, message: "Vui lòng nhập ID lớp học phần!" },
          ]}
        >
          <Input placeholder="Nhập ID lớp học phần" />
        </Form.Item>

        <Form.Item
          label="Điểm quá trình"
          name="diemQuaTrinh"
          rules={[
            { required: true, message: "Vui lòng nhập điểm quá trình!" },
          ]}
        >
          <InputNumber placeholder="Nhập điểm quá trình" min={0} max={10} />
        </Form.Item>

        <Form.Item
          label="Điểm thi"
          name="diemThi"
          rules={[
            { required: true, message: "Vui lòng nhập điểm thi!" },
          ]}
        >
          <InputNumber placeholder="Nhập điểm thi" min={0} max={10} />
        </Form.Item>

        <Form.Item
          label="Điểm tổng kết"
          name="diemTongKet"
          rules={[
            { required: true, message: "Vui lòng nhập điểm tổng kết!" },
          ]}
        >
          <InputNumber placeholder="Nhập điểm tổng kết" min={0} max={10} />
        </Form.Item>

        <Form.Item
          label="Kết quả"
          name="ketQua"
          rules={[
            { required: true, message: "Vui lòng nhập kết quả!" },
          ]}
        >
          <Input placeholder="Nhập kết quả" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateOrUpdate;
