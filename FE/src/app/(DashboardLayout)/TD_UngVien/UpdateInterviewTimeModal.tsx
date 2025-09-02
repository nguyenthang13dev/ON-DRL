import React, { useEffect } from "react";
import { Modal, Form, Input, DatePicker, Button } from "antd";
import dayjs, { Dayjs } from "dayjs";
import tD_UngVienService from "@/services/TD_UngVien/TD_UngVienService";
import { TD_UngVienDto } from "@/types/TD_UngVien/TD_UngVien";
import { toast } from "react-toastify";

interface UpdateInterviewTimeModalProps {
  open: boolean;
  onCancel: () => void;
  onSuccess: () => void;
  ungVien: TD_UngVienDto | null;
}

const UpdateInterviewTimeModal: React.FC<UpdateInterviewTimeModalProps> = ({
  open,
  onCancel,
  onSuccess,
  ungVien,
}) => {
  const [form] = Form.useForm<{ ThoiGianPhongVan: Dayjs | null }>();
  const [loading, setLoading] = React.useState(false);

  useEffect(() => {
    if (open && ungVien) {
      form.setFieldsValue({
        ThoiGianPhongVan: ungVien.thoiGianPhongVan ? dayjs(ungVien.thoiGianPhongVan) : null,
      });
    } else {
      form.resetFields();
    }
  }, [open, ungVien, form]);

  const handleFinish = async (values: { ThoiGianPhongVan: Dayjs | null }) => {
    if (!ungVien) return;
    setLoading(true);
    try {
      const res = await tD_UngVienService.updateInterviewTime({
        Id: ungVien.id,
        ThoiGianPhongVan: values.ThoiGianPhongVan ? values.ThoiGianPhongVan.format("YYYY-MM-DDTHH:mm") : null,
      });
      if (res.status) {
        toast.success("Cập nhật thời gian phỏng vấn thành công");
        onSuccess();
        onCancel();
      } else {
        toast.error(res.message || "Cập nhật thất bại");
      }
    } catch (e) {
      toast.error("Cập nhật thất bại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      open={open}
      onCancel={onCancel}
      title="Cập nhật thời gian phỏng vấn"
      footer={null}
      destroyOnClose
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
        initialValues={{ ThoiGianPhongVan: ungVien?.thoiGianPhongVan ? dayjs(ungVien.thoiGianPhongVan) : null }}
      >
        <Form.Item label="Tên ứng viên">
          <Input value={ungVien?.hoTen} disabled />
        </Form.Item>
        <Form.Item label="Email">
          <Input value={ungVien?.email} disabled />
        </Form.Item>
        <Form.Item label="Số điện thoại">
          <Input value={ungVien?.soDienThoai} disabled />
        </Form.Item>
        <Form.Item
          label="Thời gian phỏng vấn mới"
          name="ThoiGianPhongVan"
          rules={[{ required: true, message: "Vui lòng chọn thời gian phỏng vấn!" }]}
        >
          <DatePicker
            showTime
            format="DD/MM/YYYY HH:mm"
            style={{ width: "100%" }}
            placeholder="Chọn thời gian phỏng vấn"
          />
        </Form.Item>
        <div style={{ textAlign: "right" }}>
          <Button onClick={onCancel} style={{ marginRight: 8 }}>Hủy</Button>
          <Button type="primary" htmlType="submit" loading={loading}>Cập nhật</Button>
        </div>
      </Form>
    </Modal>
  );
};

export default UpdateInterviewTimeModal; 