import React, { useEffect, useState } from "react";
import { Form, FormProps, Input, DatePicker, Modal, InputNumber } from "antd";
import { toast } from "react-toastify";
import {
  NS_KNLamViecCreateOrUpdateType,
  NS_KNLamViecType,
} from "@/types/QLNhanSu/nS_KinhNghiemLamViec/nS_KNLamViec";
import nS_KNLamViecService from "@/services/QLNhanSu/nS_KinhNghiemLamViec/nS_KNLamViecService";
import dayjs from "dayjs";

const { TextArea } = Input;

interface Props {
  item?: NS_KNLamViecType | null;
  onClose: () => void;
  onSuccess: () => void;
  nhanSuId: string;
  maNV?: string;
}

const NS_KNLMCreateOrUpdateForNhanSu: React.FC<Props> = (props: Props) => {
  const [form] = Form.useForm<NS_KNLamViecCreateOrUpdateType>();

  // If item exists, it updates the item, otherwise it creates a new one
  const handleOnFinish: FormProps<NS_KNLamViecCreateOrUpdateType>["onFinish"] =
    async (formData: NS_KNLamViecCreateOrUpdateType) => {
      const payload = {
        ...formData,
        nhanSuId: props.nhanSuId,
        maNV: props.maNV,
        // Convert dayjs objects to YYYY-MM-DD format (local date, no timezone conversion)
        tuNgay: formData.tuNgay
          ? dayjs(formData.tuNgay).format("YYYY-MM-DD")
          : null,
        denNgay: formData.denNgay
          ? dayjs(formData.denNgay).format("YYYY-MM-DD")
          : null,
      };
      console.log("Payload to send:", payload);
      if (props.item) {
        const response = await nS_KNLamViecService.update(payload);
        if (response.status) {
          toast.success("Chỉnh sửa kinh nghiệm làm việc thành công");
          form.resetFields();
          props.onSuccess();
          props.onClose();
        } else {
          toast.error(response.message);
        }
      } else {
        const response = await nS_KNLamViecService.create(payload);
        if (response.status) {
          toast.success("Thêm mới kinh nghiệm làm việc thành công");
          form.resetFields();
          props.onSuccess();
          props.onClose();
        } else {
          toast.error(response.message);
        }
      }
    };

  const handleCancel = () => {
    form.resetFields();
    props.onClose();
  };

  useEffect(() => {
    form.resetFields();
    if (props.item) {
      form.setFieldsValue({
        ...props.item,
        tuNgay: props.item.tuNgay ? dayjs(props.item.tuNgay) : null,
        denNgay: props.item.denNgay ? dayjs(props.item.denNgay) : null,
      });
    }
  }, [form, props.item]);

  return (
    <Modal
      title={
        props.item != null
          ? "Chỉnh sửa kinh nghiệm làm việc"
          : "Thêm mới kinh nghiệm làm việc"
      }
      open={true}
      onOk={() => form.submit()}
      onCancel={handleCancel}
      okText="Xác nhận"
      cancelText="Đóng"
      width={700}
    >
      <Form
        layout="vertical"
        form={form}
        name="formCreateUpdateKinhNghiem"
        style={{ maxWidth: 1000 }}
        onFinish={handleOnFinish}
        autoComplete="off"
      >
        {props.item && (
          <Form.Item<NS_KNLamViecCreateOrUpdateType> name="id" hidden>
            <Input />
          </Form.Item>
        )}

        <Form.Item<NS_KNLamViecCreateOrUpdateType>
          label="Tên công ty"
          name="tenCongTy"
          rules={[{ required: true, message: "Vui lòng nhập tên công ty!" }]}
        >
          <Input placeholder="Nhập tên công ty" />
        </Form.Item>

        <Form.Item<NS_KNLamViecCreateOrUpdateType>
          label="Chức vụ"
          name="chucVu"
          //   rules={[{ required: true, message: "Vui lòng nhập chức vụ!" }]}
        >
          <Input placeholder="Nhập chức vụ" />
        </Form.Item>

        <div style={{ display: "flex", gap: "16px" }}>
          <Form.Item<NS_KNLamViecCreateOrUpdateType>
            label="Từ ngày"
            name="tuNgay"
            style={{ flex: 1 }}
            rules={[{ required: true, message: "Vui lòng chọn ngày bắt đầu!" }]}
          >
            <DatePicker
              format="DD/MM/YYYY"
              className="w-100"
              placeholder="Chọn ngày bắt đầu"
            />
          </Form.Item>

          <Form.Item<NS_KNLamViecCreateOrUpdateType>
            label="Đến ngày"
            name="denNgay"
            style={{ flex: 1 }}
            rules={[
              { required: true, message: "Vui lòng chọn ngày kết thúc!" },
            ]}
          >
            <DatePicker
              format="DD/MM/YYYY"
              className="w-100"
              placeholder="Chọn ngày kết thúc"
            />
          </Form.Item>
        </div>

        <Form.Item<NS_KNLamViecCreateOrUpdateType>
          label="Mô tả công việc"
          name="moTa"
        >
          <TextArea
            placeholder="Mô tả chi tiết về công việc, trách nhiệm..."
            rows={4}
            showCount
            maxLength={500}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default NS_KNLMCreateOrUpdateForNhanSu;
